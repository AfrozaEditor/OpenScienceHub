from django.conf import settings
from django.db.models import Count
from rest_framework import permissions, views, viewsets
from rest_framework.response import Response

from apps.ai.models import AIModelConfig, AIQueryLog
from apps.archive.models import ArchiveRecord
from apps.search.models import FacetDefinition
from apps.ssi.models import VerificationCheck, VerificationProof
from apps.works.models import ScientificWork, WorkStatus

from .models import DocumentType, Workflow, WorkflowStep, WorkflowTransition
from .serializers import (
    DocumentTypeSerializer,
    WorkflowSerializer,
    WorkflowStepSerializer,
    WorkflowTransitionSerializer,
)


class DashboardView(views.APIView):
    """GET /admin/dashboard — KPIs + état des services."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        works = ScientificWork.objects
        proofs = VerificationProof.objects
        kpis = {
            "total_works": works.count(),
            "archived_works": works.filter(status=WorkStatus.ARCHIVED).count(),
            "verifiable_documents": proofs.filter(status="ACTIVE").count(),
            "pending_works": works.filter(status__in=[WorkStatus.SUBMITTED, WorkStatus.UNDER_REVIEW]).count(),
            "validated_works": works.filter(status=WorkStatus.VALIDATED).count(),
            "rejected_works": works.filter(status=WorkStatus.REJECTED).count(),
            "verification_checks": VerificationCheck.objects.count(),
            "ai_queries": AIQueryLog.objects.count(),
        }
        services = {
            "api": "OPERATIONAL",
            "database": "OPERATIONAL",
            "search": "OPERATIONAL",
            "ai_simba": "OPERATIONAL" if settings.SIMBA_MODE == "live" else "MAINTENANCE",
            "eidstack": "OPERATIONAL" if settings.SSI_MODE == "live" else "MAINTENANCE",
        }
        return Response({"kpis": kpis, "services": services,
                         "modes": {"simba": settings.SIMBA_MODE, "ssi": settings.SSI_MODE}})


class StatsView(views.APIView):
    """GET /admin/stats — répartitions analytiques."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        by_type = dict(ScientificWork.objects.values_list("type").annotate(n=Count("id")))
        by_status = dict(ScientificWork.objects.values_list("status").annotate(n=Count("id")))
        by_year = dict(ScientificWork.objects.exclude(academic_year="").values_list("academic_year").annotate(n=Count("id")))
        by_institution = dict(
            ArchiveRecord.objects.values_list("work__institution__name").annotate(n=Count("id"))
        )
        return Response({
            "by_type": by_type, "by_status": by_status,
            "by_year": by_year, "by_institution": by_institution,
        })


class AISettingsView(views.APIView):
    """GET/PUT /admin/ai-settings — config des modèles IA."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        configs = AIModelConfig.objects.values("id", "provider", "model_name", "purpose", "is_active")
        return Response({"mode": settings.SIMBA_MODE, "models": list(configs)})


class SearchSettingsView(views.APIView):
    """GET/PUT /admin/search-settings — facettes activables."""

    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        facets = FacetDefinition.objects.values("id", "code", "label", "source_field", "data_type", "is_enabled")
        return Response({"facets": list(facets)})


class DocumentTypeViewSet(viewsets.ModelViewSet):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentTypeSerializer
    permission_classes = [permissions.IsAdminUser]


class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all().prefetch_related("steps", "transitions")
    serializer_class = WorkflowSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["document_type", "institution", "is_active"]


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
