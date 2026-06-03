from django.shortcuts import get_object_or_404
from rest_framework import permissions, status, views
from rest_framework.generics import RetrieveAPIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from apps.works.models import ScientificWork

from .models import DocumentVersion, VersionType
from .serializers import DocumentUploadSerializer, DocumentVersionSerializer, compute_sha256


class DocumentUploadView(views.APIView):
    """POST /works/{work_id}/documents — upload PDF + calcul SHA-256 + versionnage."""

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        versions = work.documents.all()
        return Response(DocumentVersionSerializer(versions, many=True).data)

    def post(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        if not request.user.is_staff and work.created_by_id != request.user.id:
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
        return Response(DocumentVersionSerializer(version).data, status=status.HTTP_201_CREATED)


class DocumentDetailView(RetrieveAPIView):
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = [permissions.IsAuthenticated]


class SetFinalVersionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        version = get_object_or_404(DocumentVersion, pk=pk)
        # une seule version finale par dossier
        DocumentVersion.objects.filter(work=version.work, is_final=True).update(is_final=False)
        version.is_final = True
        version.version_type = VersionType.FINAL_ARCHIVE
        version.save(update_fields=["is_final", "version_type", "updated_at"])
        return Response(DocumentVersionSerializer(version).data)
