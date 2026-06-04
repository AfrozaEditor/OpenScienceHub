from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ScientificWork, WorkContributor, WorkStatus
from .serializers import ScientificWorkSerializer, WorkContributorSerializer
from .services import submit_work


class ScientificWorkViewSet(viewsets.ModelViewSet):
    serializer_class = ScientificWorkSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["type", "status", "institution", "department", "academic_year", "visibility"]
    search_fields = ["title", "abstract_text", "reference_code", "supervisor_name"]
    ordering_fields = ["created_at", "updated_at", "submitted_at", "title"]

    def get_queryset(self):
        qs = ScientificWork.objects.select_related("institution", "department").prefetch_related("contributors")
        user = self.request.user
        if user.is_staff:
            return qs
        return qs.filter(created_by=user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        work = self.get_object()
        submit_work(work, request.user)
        return Response(self.get_serializer(work).data)

    @action(detail=True, methods=["get"])
    def history(self, request, pk=None):
        work = self.get_object()
        from apps.validation.models import WorkflowEvent

        events = WorkflowEvent.objects.filter(work=work).values(
            "created_at", "from_status", "to_status", "event_type", "comment"
        )
        return Response(list(events))

    @action(detail=True, methods=["post"], url_path="contributors")
    def add_contributor(self, request, pk=None):
        work = self.get_object()
        serializer = WorkContributorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(work=work)
        return Response(serializer.data, status=201)
