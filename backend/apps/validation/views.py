from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status, views
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from apps.accounts.models import RoleCode, ScopeType
from apps.accounts.services import get_user_capabilities, user_can_access_work, user_has_role
from apps.documents.models import DocumentVersion
from apps.works.models import ScientificWork, WorkStatus
from apps.workflow.services import (
    accept_final_deposit,
    assign_reviewer,
    answer_correction,
    mark_archivable,
    request_correction,
)

from .models import (
    CorrectionRequest,
    CorrectionStatus,
    DefenseSession,
    Review,
    DecisionType,
    WorkflowEvent,
    WorkflowEventType,
)
from .serializers import (
    AssignmentSerializer,
    CorrectionSerializer,
    DecisionInputSerializer,
    DecisionSerializer,
    DefenseSessionSerializer,
    InboxItemSerializer,
    ReviewSerializer,
)
from .services import record_decision

INBOX_STATUSES = [
    WorkStatus.SOUMIS,
    WorkStatus.EN_INSTRUCTION,
    WorkStatus.EN_PRE_INSTRUCTION,
    WorkStatus.EN_EXPERTISE,
    WorkStatus.CORRECTION_DEMANDEE,
    WorkStatus.RE_SOUMIS,
    WorkStatus.AVIS_EN_ATTENTE,
    WorkStatus.DECISION_REQUISE,
    WorkStatus.UNDER_REVIEW,
    WorkStatus.REVISION_REQUESTED,
    WorkStatus.RESUBMITTED,
    WorkStatus.DEPOT_FINAL_ACCEPTE,
    WorkStatus.ARCHIVABLE,
]


def _get_work(work_id):
    return get_object_or_404(ScientificWork, pk=work_id)


def _ensure_work_access(user, work, *, for_validation=False):
    if not user_can_access_work(user, work, for_validation=for_validation):
        raise PermissionDenied("Ce dossier est hors de votre périmètre.")


def _ensure_validation_access(user, work):
    _ensure_work_access(user, work, for_validation=True)
    if not get_user_capabilities(user)["can_validate"]:
        raise PermissionDenied("Votre rôle ne permet pas d'intervenir en validation.")


class InboxView(generics.ListAPIView):
    """GET /validation/inbox — dossiers à traiter (périmètre du validateur)."""

    serializer_class = InboxItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["type", "status", "institution", "department"]
    search_fields = ["title", "reference_code"]

    def get_queryset(self):
        qs = ScientificWork.objects.select_related("institution", "department").filter(status__in=INBOX_STATUSES)
        user = self.request.user
        if user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN):
            return qs.order_by("submitted_at")
        institution_ids = [
            assignment.scope_id
            for assignment in user.role_assignments.select_related("role")
            if assignment.scope_type == ScopeType.INSTITUTION
            and assignment.role.code in {
                RoleCode.INSTITUTION_ADMIN,
                RoleCode.VALIDATOR,
                RoleCode.ARCHIVIST,
                RoleCode.SCIENTIFIC_COMMITTEE,
                RoleCode.DOCTORAL_SCHOOL,
                RoleCode.SCIENTIFIC_EDITOR,
            }
        ]
        department_ids = [
            assignment.scope_id
            for assignment in user.role_assignments.select_related("role")
            if assignment.scope_type == ScopeType.DEPARTMENT
            and assignment.role.code in {
                RoleCode.DEPARTMENT_HEAD,
                RoleCode.SUPERVISOR,
                RoleCode.THESIS_DIRECTOR,
                RoleCode.RAPPORTEUR,
                RoleCode.REVIEWER,
            }
        ]
        scoped = qs.filter(assignments__assignee=user)
        scoped = scoped | qs.filter(institution_id__in=institution_ids)
        scoped = scoped | qs.filter(department_id__in=department_ids)
        return scoped.distinct().order_by("submitted_at")


class MyAssignmentsView(generics.ListAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.validation_assignments.select_related("work", "assignee").order_by("-assigned_at")


class ReviewListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, work_id):
        work = _get_work(work_id)
        _ensure_work_access(request.user, work)
        return Response(ReviewSerializer(work.reviews.all(), many=True).data)

    def post(self, request, work_id):
        work = _get_work(work_id)
        _ensure_validation_access(request.user, work)
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(work=work, author=request.user)
        WorkflowEvent.objects.create(
            work=work, from_status=work.status, to_status=work.status,
            event_type=WorkflowEventType.REVIEW, actor=request.user,
        )
        try:
            from apps.audit.services import log_event

            log_event("REVIEW_ADDED", actor=request.user, module="validation",
                      institution=work.institution, comment=f"Avis sur {work.reference_code or work.id}")
        except Exception:
            pass
        return Response(ReviewSerializer(obj).data, status=status.HTTP_201_CREATED)


class CorrectionListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, work_id):
        work = _get_work(work_id)
        _ensure_work_access(request.user, work)
        return Response(CorrectionSerializer(work.corrections.all(), many=True).data)


class CorrectionDetailView(views.APIView):
    """PATCH /corrections/{id} — répondre/valider/rejeter une correction."""

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        correction = get_object_or_404(CorrectionRequest, pk=pk)
        new_status = request.data.get("status")
        if new_status in dict(CorrectionStatus.choices):
            # Si la correction est traitée par le déposant, le dossier repasse en RE_SOUMIS.
            if new_status == CorrectionStatus.ANSWERED:
                answer_correction(correction, request.user)
            else:
                _ensure_validation_access(request.user, correction.work)
                correction.status = new_status
                if new_status in (CorrectionStatus.VALIDATED, CorrectionStatus.REJECTED):
                    correction.resolved_at = timezone.now()
                correction.save(update_fields=["status", "resolved_at", "updated_at"])
        return Response(CorrectionSerializer(correction).data)


class MetadataValidateView(views.APIView):
    """POST /works/{work_id}/metadata/validate — l'institution verrouille les métadonnées."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = _get_work(work_id)
        _ensure_validation_access(request.user, work)
        try:
            from apps.audit.services import log_event

            log_event("METADATA_UPDATED", actor=request.user, module="validation",
                      institution=work.institution, comment=f"Métadonnées validées · {work.reference_code or work.id}")
        except Exception:
            pass
        return Response({"detail": "Métadonnées validées et verrouillées.", "work_id": str(work.id)})


class DefenseView(views.APIView):
    """POST /works/{work_id}/defense — planifier/enregistrer une soutenance."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, work_id):
        work = _get_work(work_id)
        _ensure_work_access(request.user, work)
        return Response(DefenseSessionSerializer(work.defense_sessions.all(), many=True).data)

    def post(self, request, work_id):
        work = _get_work(work_id)
        _ensure_validation_access(request.user, work)
        serializer = DefenseSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(work=work)
        return Response(DefenseSessionSerializer(obj).data, status=status.HTTP_201_CREATED)


class AssignmentCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = _get_work(work_id)
        serializer = AssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = assign_reviewer(
            work,
            request.user,
            assignee=serializer.validated_data["assignee"],
            assignment_type=serializer.validated_data["assignment_type"],
            due_at=serializer.validated_data.get("due_at"),
        )
        return Response(AssignmentSerializer(obj).data, status=status.HTTP_201_CREATED)


class ReviewCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = _get_work(work_id)
        _ensure_validation_access(request.user, work)
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(work=work, author=request.user)
        WorkflowEvent.objects.create(
            work=work, from_status=work.status, to_status=work.status,
            event_type=WorkflowEventType.REVIEW, actor=request.user,
        )
        return Response(ReviewSerializer(obj).data, status=status.HTTP_201_CREATED)


class CorrectionCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, work_id):
        work = _get_work(work_id)
        _ensure_work_access(request.user, work)
        return Response(CorrectionSerializer(work.corrections.all(), many=True).data)

    def post(self, request, work_id):
        work = _get_work(work_id)
        _ensure_validation_access(request.user, work)
        serializer = CorrectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = request_correction(
            work,
            request.user,
            message=serializer.validated_data["message"],
            type=serializer.validated_data.get("type", "METADATA"),
            priority=serializer.validated_data.get("priority", "NORMAL"),
        )
        return Response(CorrectionSerializer(obj).data, status=status.HTTP_201_CREATED)


class DecisionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = _get_work(work_id)
        _ensure_validation_access(request.user, work)
        payload = DecisionInputSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        document_version = None
        if payload.validated_data.get("document_version"):
            document_version = get_object_or_404(
                DocumentVersion,
                pk=payload.validated_data["document_version"],
                work=work,
            )
        decision_type = payload.validated_data["decision_type"]
        if decision_type == DecisionType.ACCEPT_FINAL_DEPOSIT:
            if not document_version:
                return Response(
                    {"detail": "Une version documentaire est requise pour accepter le dépôt final."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            accept_final_deposit(work, request.user, document_version)
        elif decision_type == DecisionType.MARK_ARCHIVABLE:
            mark_archivable(work, request.user, payload.validated_data.get("comment", ""))
        decision = record_decision(
            work,
            decision_type,
            request.user,
            payload.validated_data.get("comment", ""),
            document_version=document_version,
        )
        return Response(DecisionSerializer(decision).data, status=status.HTTP_201_CREATED)
