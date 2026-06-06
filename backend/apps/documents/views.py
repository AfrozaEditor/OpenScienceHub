from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, views
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import RetrieveAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from apps.accounts.models import RoleCode
from apps.accounts.services import get_user_capabilities, user_can_access_work, user_has_role
from apps.works.models import ScientificWork, WorkStatus

from .models import DocumentVersion, VersionStatus, VersionType
from .serializers import DocumentUploadSerializer, DocumentVersionSerializer, compute_sha256


class DocumentUploadView(views.APIView):
    """POST /works/{work_id}/documents — upload PDF + calcul SHA-256 + versionnage."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        if not user_can_access_work(request.user, work):
            raise PermissionDenied("Accès refusé.")
        versions = work.documents.all()
        return Response(DocumentVersionSerializer(versions, many=True).data)

    def post(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        if not user_can_access_work(request.user, work):
            raise PermissionDenied("Accès refusé.")
        if work.status == WorkStatus.ARCHIVE:
            return Response({"detail": "Dossier archivé : document verrouillé."}, status=status.HTTP_409_CONFLICT)
        if not request.user.is_superuser and work.created_by_id != request.user.id:
            return Response({"detail": "Accès refusé."}, status=status.HTTP_403_FORBIDDEN)

        serializer = DocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        f = serializer.validated_data["file"]

        version_number = work.documents.count() + 1
        version = DocumentVersion.objects.create(
            work=work,
            version_number=version_number,
            version_type=(
                VersionType.INITIAL_SUBMISSION if version_number == 1 else VersionType.CORRECTED_VERSION
            ),
            file=f,
            file_name=getattr(f, "name", ""),
            mime_type=getattr(f, "content_type", "application/pdf"),
            sha256_hash=compute_sha256(f),
            change_note=serializer.validated_data.get("change_note", ""),
            uploaded_by=request.user,
        )
        try:
            from apps.audit.services import log_event

            log_event("PDF_UPLOADED", actor=request.user, module="documents",
                      institution=work.institution, comment=f"v{version.version_number} · {work.reference_code or work.id}")
        except Exception:
            pass
        try:
            from apps.ai.indexing import index_work_for_assistant

            index_work_for_assistant(work, request=request)
        except Exception:
            pass
        return Response(DocumentVersionSerializer(version).data, status=status.HTTP_201_CREATED)


class DocumentDetailView(RetrieveAPIView):
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        if not user_can_access_work(self.request.user, obj.work):
            raise PermissionDenied("Accès refusé.")
        return obj


class SetFinalVersionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        version = get_object_or_404(DocumentVersion, pk=pk)
        if not user_can_access_work(request.user, version.work, for_validation=True):
            raise PermissionDenied("Ce dossier est hors de votre périmètre.")
        capabilities = get_user_capabilities(request.user)
        can_set_final = (
            capabilities["is_platform_admin"]
            or user_has_role(
                request.user,
                [RoleCode.VALIDATOR, RoleCode.ARCHIVIST, RoleCode.INSTITUTION_ADMIN],
                scope_id=version.work.institution_id,
            )
        )
        if not can_set_final:
            raise PermissionDenied("Votre rôle ne permet pas de choisir la version finale.")
        if version.work.status == WorkStatus.ARCHIVE:
            return Response({"detail": "Dossier archivé : version finale verrouillée."}, status=status.HTTP_409_CONFLICT)
        # une seule version finale par dossier
        DocumentVersion.objects.filter(work=version.work, is_final=True).update(
            is_final=False,
            status=VersionStatus.REPLACED,
        )
        version.is_final = True
        version.version_type = VersionType.FINAL_ARCHIVE
        version.status = VersionStatus.FINAL
        version.save(update_fields=["is_final", "version_type", "status", "updated_at"])
        return Response(DocumentVersionSerializer(version).data)
