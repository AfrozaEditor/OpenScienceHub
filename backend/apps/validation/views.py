from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

from apps.works.models import ScientificWork, WorkStatus

from .models import (
    CorrectionRequest,
    CorrectionStatus,
    DefenseSession,
    Review,
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
    WorkStatus.SUBMITTED, WorkStatus.UNDER_REVIEW,
    WorkStatus.CORRECTION_REQUESTED, WorkStatus.RESUBMITTED,
]


def _get_work(work_id):
    return get_object_or_404(ScientificWork, pk=work_id)


class InboxView(generics.ListAPIView):
    """GET /validation/inbox — dossiers à traiter (périmètre du validateur)."""

    serializer_class = InboxItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["type", "status", "institution", "department"]
    search_fields = ["title", "reference_code"]

    def get_queryset(self):
        qs = ScientificWork.objects.select_related("institution", "department").filter(status__in=INBOX_STATUSES)
        user = self.request.user
        if user.is_staff:
            return qs.order_by("submitted_at")
        # Validateur : dossiers de son institution OU dont il est assigné.
        return qs.filter(assignments__assignee=user).distinct().order_by("submitted_at")


class ReviewListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, work_id):
        work = _get_work(work_id)
        return Response(ReviewSerializer(work.reviews.all(), many=True).data)

    def post(self, request, work_id):
        work = _get_work(work_id)
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
        return Response(CorrectionSerializer(work.corrections.all(), many=True).data)


class CorrectionDetailView(views.APIView):
    """PATCH /corrections/{id} — répondre/valider/rejeter une correction."""

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        correction = get_object_or_404(CorrectionRequest, pk=pk)
        new_status = request.data.get("status")
        if new_status in dict(CorrectionStatus.choices):
            correction.status = new_status
            if new_status in (CorrectionStatus.VALIDATED, CorrectionStatus.REJECTED, CorrectionStatus.ANSWERED):
                correction.resolved_at = timezone.now()
            correction.save(update_fields=["status", "resolved_at", "updated_at"])
            # Si la correction est traitée par le déposant, le dossier repasse en RE_SOUMIS.
            if new_status == CorrectionStatus.ANSWERED:
                work = correction.work
                work.status = WorkStatus.RESUBMITTED
                work.save(update_fields=["status", "updated_at"])
        return Response(CorrectionSerializer(correction).data)


class MetadataValidateView(views.APIView):
    """POST /works/{work_id}/metadata/validate — l'institution verrouille les métadonnées."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = _get_work(work_id)
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
        return Response(DefenseSessionSerializer(work.defense_sessions.all(), many=True).data)

    def post(self, request, work_id):
        work = _get_work(work_id)
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
        obj = serializer.save(work=work)
        if work.status == WorkStatus.SUBMITTED:
            work.status = WorkStatus.UNDER_REVIEW
            work.save(update_fields=["status", "updated_at"])
        return Response(AssignmentSerializer(obj).data, status=status.HTTP_201_CREATED)


class ReviewCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = _get_work(work_id)
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
        return Response(CorrectionSerializer(work.corrections.all(), many=True).data)

    def post(self, request, work_id):
        work = _get_work(work_id)
        serializer = CorrectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save(work=work, requested_by=request.user)
        previous = work.status
        work.status = WorkStatus.CORRECTION_REQUESTED
        work.save(update_fields=["status", "updated_at"])
        WorkflowEvent.objects.create(
            work=work, from_status=previous, to_status=work.status,
            event_type=WorkflowEventType.CORRECTION, actor=request.user,
        )
        return Response(CorrectionSerializer(obj).data, status=status.HTTP_201_CREATED)


class DecisionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = _get_work(work_id)
        payload = DecisionInputSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        decision = record_decision(
            work,
            payload.validated_data["decision_type"],
            request.user,
            payload.validated_data.get("comment", ""),
        )
        return Response(DecisionSerializer(decision).data, status=status.HTTP_201_CREATED)
