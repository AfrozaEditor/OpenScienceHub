from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Count, F, Prefetch, Q
from rest_framework import permissions, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.accounts.models import RoleCode
from apps.accounts.permissions import IsInstitutionAdminOrPlatformAdmin
from apps.accounts.services import get_user_capabilities, user_has_role
from apps.ai.models import AIModelConfig, AIQueryLog
from apps.ai.services import get_platform_settings, list_ai_logs, update_platform_settings
from apps.archive.models import ArchiveRecord
from apps.institutions.models import Department, Faculty, StructureStatus
from apps.search.models import FacetDefinition
from apps.ssi.models import ProofStatus, VerificationCheck, VerificationProof, VerificationResult
from apps.works.models import ScientificWork, WorkStatus

from .models import DocumentType, Workflow, WorkflowStep, WorkflowTransition
from .serializers import (
    DocumentTypeSerializer,
    WorkflowSerializer,
    WorkflowStepSerializer,
    WorkflowTransitionSerializer,
)
from .services import TEMPLATES, apply_workflow_template


def _scoped_works(user):
    qs = ScientificWork.objects.all()
    if user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN):
        return qs
    if user_has_role(user, RoleCode.INSTITUTION_ADMIN) and user.institution_id:
        return qs.filter(institution_id=user.institution_id)
    return qs.none()


def _scoped_faculties(user):
    qs = Faculty.objects.filter(status=StructureStatus.ACTIVE)
    if user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN):
        return qs
    if user_has_role(user, RoleCode.INSTITUTION_ADMIN) and user.institution_id:
        return qs.filter(institution_id=user.institution_id)
    return qs.none()


def _scoped_departments(user):
    qs = Department.objects.filter(status=StructureStatus.ACTIVE)
    if user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN):
        return qs
    if user_has_role(user, RoleCode.INSTITUTION_ADMIN) and user.institution_id:
        return qs.filter(faculty__institution_id=user.institution_id)
    return qs.none()


def _scoped_users(user):
    qs = get_user_model().objects.filter(is_active=True)
    if user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN):
        return qs
    if user_has_role(user, RoleCode.INSTITUTION_ADMIN) and user.institution_id:
        return qs.filter(institution_id=user.institution_id)
    return qs.none()


class DashboardView(views.APIView):
    """GET /admin/dashboard — KPIs + état des services."""

    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def get(self, request):
        works = _scoped_works(request.user)
        proofs = VerificationProof.objects.filter(archive_record__work__in=works)
        proof_hash_mismatches = proofs.exclude(
            Q(document_hash=F("archive_record__document_hash"))
            & Q(document_hash=F("archive_record__document_version__sha256_hash"))
        ).count()
        kpis = {
            "total_works": works.count(),
            "archived_works": works.filter(status=WorkStatus.ARCHIVE).count(),
            "verifiable_documents": proofs.filter(status="ACTIVE").count(),
            "proofs_total": proofs.count(),
            "proofs_active": proofs.filter(status=ProofStatus.ACTIVE).count(),
            "proofs_pending": proofs.filter(status=ProofStatus.PENDING).count(),
            "proofs_revoked": proofs.filter(status=ProofStatus.REVOKED).count(),
            "proof_hash_mismatches": proof_hash_mismatches,
            "pending_works": works.filter(
                status__in=[
                    WorkStatus.SOUMIS,
                    WorkStatus.EN_INSTRUCTION,
                    WorkStatus.EN_EXPERTISE,
                    WorkStatus.UNDER_REVIEW,
                ]
            ).count(),
            "validated_works": works.filter(
                status__in=[
                    WorkStatus.VALIDE,
                    WorkStatus.VALIDE_APRES_SOUTENANCE,
                    WorkStatus.ACCEPTED,
                    WorkStatus.PUBLISHED,
                    WorkStatus.ARCHIVABLE,
                ]
            ).count(),
            "rejected_works": works.filter(status=WorkStatus.REJETE).count(),
            "verification_checks": VerificationCheck.objects.filter(proof__archive_record__work__in=works).count(),
            "verification_valid_checks": VerificationCheck.objects.filter(
                proof__archive_record__work__in=works,
                result=VerificationResult.VALID,
            ).count(),
            "verification_failed_checks": VerificationCheck.objects.filter(
                proof__archive_record__work__in=works,
                result__in=[
                    VerificationResult.INVALID_HASH,
                    VerificationResult.REVOKED,
                    VerificationResult.EXPIRED,
                    VerificationResult.TECHNICAL_ERROR,
                ],
            ).count(),
            "ai_queries": AIQueryLog.objects.filter(citations__work__in=works).distinct().count(),
            "faculties_count": _scoped_faculties(request.user).count(),
            "departments_count": _scoped_departments(request.user).count(),
            "active_users_count": _scoped_users(request.user).count(),
        }
        modes = {"simba": settings.SIMBA_MODE, "ssi": settings.SSI_MODE}
        services = {
            "api": {"status": "OPERATIONAL", "detail": "API principale"},
            "database": {"status": "OPERATIONAL", "detail": "PostgreSQL"},
            "search": {"status": "OPERATIONAL", "detail": "Index de recherche"},
            "ai_simba": {
                "status": "OPERATIONAL" if settings.SIMBA_MODE == "live" else "MAINTENANCE",
                "detail": f"Mode {settings.SIMBA_MODE}",
            },
            "eidstack": {
                "status": "OPERATIONAL" if settings.SSI_MODE == "live" else "MAINTENANCE",
                "detail": f"Mode {settings.SSI_MODE}",
            },
        }
        return Response({
            "kpis": kpis,
            "services": services,
            "scope": get_user_capabilities(request.user),
            "modes": modes,
        })


class ProofListView(views.APIView):
    """GET /admin/proofs — preuves SSI dans le périmètre administrateur."""

    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def get(self, request):
        works = _scoped_works(request.user)
        proofs = (
            VerificationProof.objects.select_related(
                "archive_record__work__institution",
                "archive_record__document_version",
                "credential__schema",
            )
            .prefetch_related(
                Prefetch("checks", queryset=VerificationCheck.objects.order_by("-created_at"), to_attr="ordered_checks")
            )
            .filter(archive_record__work__in=works)
            .order_by("-issued_at", "-created_at")
        )
        if request.query_params.get("status"):
            proofs = proofs.filter(status=request.query_params["status"])
        limit = min(int(request.query_params.get("limit", 100)), 200)
        results = [self._serialize_proof(proof) for proof in proofs[:limit]]
        return Response({"count": proofs.count(), "results": results})

    def _serialize_proof(self, proof):
        work = proof.archive_record.work
        final_version = proof.archive_record.document_version
        schema = proof.credential.schema if proof.credential and proof.credential.schema else None
        checks = getattr(proof, "ordered_checks", [])
        last_check = checks[0] if checks else None
        hashes_match = (
            proof.document_hash == proof.archive_record.document_hash
            == final_version.sha256_hash
        )
        return {
            "id": str(proof.id),
            "proof_code": proof.proof_code,
            "status": proof.status,
            "proof_type": proof.proof_type,
            "issued_at": proof.issued_at,
            "archived_at": proof.archive_record.archived_at,
            "verification_url": proof.verification_url,
            "document_hash": proof.document_hash,
            "archive_hash": proof.archive_record.document_hash,
            "version_hash": final_version.sha256_hash,
            "hashes_match": hashes_match,
            "credential_id": proof.credential.credential_id if proof.credential else "",
            "credential_status": proof.credential.status if proof.credential else "",
            "issuer_did": proof.credential.issuer_did if proof.credential else "",
            "schema": f"{schema.schema_name} v{schema.version}" if schema else "ScientificWorkArchiveCredential",
            "is_mock": bool(proof.credential.is_mock) if proof.credential else False,
            "last_check_result": last_check.result if last_check else "",
            "last_checked_at": last_check.created_at if last_check else None,
            "work": {
                "id": str(work.id),
                "reference_code": work.reference_code,
                "title": work.title,
                "institution": work.institution.name,
                "status": work.status,
            },
        }


class StatsView(views.APIView):
    """GET /admin/stats — répartitions analytiques."""

    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def get(self, request):
        works = _scoped_works(request.user)
        by_type = dict(works.values_list("type").annotate(n=Count("id")))
        by_status = dict(works.values_list("status").annotate(n=Count("id")))
        by_year = dict(works.exclude(academic_year="").values_list("academic_year").annotate(n=Count("id")))
        by_institution = dict(
            ArchiveRecord.objects.filter(work__in=works).values_list("work__institution__name").annotate(n=Count("id"))
        )
        return Response({
            "by_type": by_type, "by_status": by_status,
            "by_year": by_year, "by_institution": by_institution,
        })


class AISettingsView(views.APIView):
    """GET/PUT /admin/ai-settings — pilotage IA institutionnel."""

    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def get(self, request):
        institution_id = request.query_params.get("institution")
        scope = get_user_capabilities(request.user)
        if not scope.get("is_platform_admin"):
            institution_id = str(request.user.institution_id) if request.user.institution_id else None
        payload = get_platform_settings(request.user, institution_id)
        payload["models"] = list(
            AIModelConfig.objects.values("id", "provider", "model_name", "purpose", "is_active")
        )
        payload["recent_logs"] = list_ai_logs(limit=30)
        payload["principle"] = (
            "L'IA assiste le dépôt, la recherche et la validation, "
            "mais toutes les décisions académiques restent humaines, tracées et institutionnelles."
        )
        return Response(payload)

    def put(self, request):
        scope = get_user_capabilities(request.user)
        institution_id = request.data.get("institution_id") or request.query_params.get("institution")
        if not scope.get("is_platform_admin"):
            institution_id = str(request.user.institution_id) if request.user.institution_id else None
        payload = update_platform_settings(request.user, request.data, institution_id)
        payload["models"] = list(
            AIModelConfig.objects.values("id", "provider", "model_name", "purpose", "is_active")
        )
        return Response(payload)


class SearchSettingsView(views.APIView):
    """GET/PUT /admin/search-settings — facettes activables."""

    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def get(self, request):
        facets = FacetDefinition.objects.values("id", "code", "label", "source_field", "data_type", "is_enabled")
        return Response({"facets": list(facets)})

    def put(self, request):
        updates = request.data.get("facets") or []
        for item in updates:
            facet_id = item.get("id")
            if facet_id and "is_enabled" in item:
                FacetDefinition.objects.filter(id=facet_id).update(is_enabled=bool(item["is_enabled"]))
        facets = FacetDefinition.objects.values("id", "code", "label", "source_field", "data_type", "is_enabled")
        return Response({"facets": list(facets)})


class ScopeSummaryView(views.APIView):
    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def get(self, request):
        works = _scoped_works(request.user)
        return Response({
            "capabilities": get_user_capabilities(request.user),
            "works": {
                "total": works.count(),
                "by_status": dict(works.values_list("status").annotate(n=Count("id"))),
                "by_type": dict(works.values_list("type").annotate(n=Count("id"))),
            },
            "archives": ArchiveRecord.objects.filter(work__in=works).count(),
        })


class DocumentTypeViewSet(viewsets.ModelViewSet):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permission_classes = [permissions.IsAdminUser]


class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all().prefetch_related("steps", "transitions")
    serializer_class = WorkflowSerializer
    permission_classes = [IsInstitutionAdminOrPlatformAdmin]
    filterset_fields = ["document_type", "institution", "is_active"]

    @action(detail=False, methods=["post"], url_path="apply-template")
    def apply_template(self, request):
        template = str(request.data.get("template", "")).upper()
        if template not in TEMPLATES:
            return Response({"detail": "Modèle inconnu."}, status=status.HTTP_400_BAD_REQUEST)
        scope = get_user_capabilities(request.user)
        institution_id = request.data.get("institution")
        if not scope.get("is_platform_admin"):
            institution_id = str(request.user.institution_id) if request.user.institution_id else None
        try:
            workflow = apply_workflow_template(template, institution_id)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(WorkflowSerializer(workflow).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="templates")
    def templates(self, request):
        return Response(
            {
                key: {
                    "name": value["name"],
                    "document_type": value["document_type"],
                    "description": value["description"],
                    "steps_count": len(value["steps"]),
                }
                for key, value in TEMPLATES.items()
            }
        )


class WorkflowStepViewSet(viewsets.ModelViewSet):
    queryset = WorkflowStep.objects.all()
    serializer_class = WorkflowStepSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["workflow"]


class WorkflowTransitionViewSet(viewsets.ModelViewSet):
    queryset = WorkflowTransition.objects.all()
    serializer_class = WorkflowTransitionSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["workflow"]
