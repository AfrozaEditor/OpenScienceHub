from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status, views
from rest_framework.response import Response

from apps.works.models import ScientificWork

from .client import SimbaClient, SimbaError
from .models import AIQueryLog, ExtractionStatus, MetadataExtraction


class ExtractMetadataView(views.APIView):
    """POST /works/{work_id}/extract-metadata — déclenche l'extraction (simba_ia)."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        version = work.documents.order_by("-version_number").first()
        if not version:
            return Response({"detail": "Aucun document à analyser."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            result = SimbaClient().extract(document_id=work.id, version_id=version.id)
        except SimbaError as exc:
            MetadataExtraction.objects.create(document_version=version, status=ExtractionStatus.FAILED, raw_json={"error": str(exc)})
            return Response({"detail": "Service IA indisponible.", "status": "FAILED"}, status=502)

        meta = result.get("metadata", {})
        extraction = MetadataExtraction.objects.create(
            document_version=version,
            model_name=result.get("model_name", "simba_ia"),
            extracted_title=meta.get("title", ""),
            extracted_abstract=meta.get("abstract", ""),
            extracted_keywords=meta.get("keywords", []),
            suggested_domain=meta.get("scientific_domain", ""),
            detected_language=meta.get("language", ""),
            confidence_score=result.get("confidence_score", 0) or 0,
            raw_json=result.get("raw_json", {}),
            status=ExtractionStatus.EXTRACTED,
        )
        return Response({
            "id": str(extraction.id),
            "status": extraction.status,
            "confidence_score": float(extraction.confidence_score),
            "metadata": meta,
        })


class MetadataAcceptView(views.APIView):
    """POST /works/{work_id}/metadata/accept — l'humain valide/corrige les métadonnées."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        data = request.data
        for field in ("title", "abstract_text", "scientific_domain"):
            if field in data:
                setattr(work, field, data[field])
        if "keywords" in data and isinstance(data["keywords"], list):
            work.keywords = data["keywords"]
        work.save()
        version = work.documents.order_by("-version_number").first()
        if version:
            MetadataExtraction.objects.filter(document_version=version).update(
                status=ExtractionStatus.REVIEWED, reviewed_at=timezone.now()
            )
        return Response({"detail": "Métadonnées validées.", "work_id": str(work.id)})


class AssistantQueryView(views.APIView):
    """POST /ai/assistant/query — Assistant IA public, réponse sourcée."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        question = request.data.get("question", "").strip()
        if not question:
            return Response({"detail": "Question requise."}, status=status.HTTP_400_BAD_REQUEST)
        filters = request.data.get("filters", {})
        # Public : seuls les documents publics sont interrogeables
        allowed = ["PUBLIC"]
        try:
            result = SimbaClient().assistant_query(question=question, allowed_visibilities=allowed, filters=filters)
        except SimbaError:
            return Response({"answer_status": "FAILED", "answer": None, "sources": []}, status=502)

        AIQueryLog.objects.create(
            question=question,
            answer=result.get("answer") or "",
            answer_status=result.get("answer_status", "ANSWERED"),
            filters={"allowed_visibilities": allowed, **(filters or {})},
            user=request.user if request.user.is_authenticated else None,
        )
        return Response(result)


class SimilarWorksView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        try:
            result = SimbaClient().similar(work_id=work.id, allowed_visibilities=["PUBLIC"])
        except SimbaError:
            return Response({"results": []}, status=502)
        return Response(result)


class MetadataExtractionView(views.APIView):
    """GET /works/{work_id}/metadata-extraction — dernière proposition IA."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        version = work.documents.order_by("-version_number").first()
        extraction = MetadataExtraction.objects.filter(document_version=version).order_by("-created_at").first() if version else None
        if not extraction:
            return Response({"detail": "Aucune extraction disponible.", "status": "PENDING"})
        return Response({
            "id": str(extraction.id),
            "status": extraction.status,
            "confidence_score": float(extraction.confidence_score),
            "extracted_title": extraction.extracted_title,
            "extracted_abstract": extraction.extracted_abstract,
            "extracted_keywords": extraction.extracted_keywords,
            "suggested_domain": extraction.suggested_domain,
            "detected_language": extraction.detected_language,
        })


class SummaryView(views.APIView):
    """GET /works/{work_id}/summary — résumé / fiche de lecture via simba_ia."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        version = work.documents.order_by("-version_number").first()
        try:
            result = SimbaClient().summarize(work_id=work.id, version_id=version.id if version else None)
        except SimbaError:
            return Response({"detail": "Service IA indisponible.", "generated_by_ai": True}, status=502)
        return Response(result)
