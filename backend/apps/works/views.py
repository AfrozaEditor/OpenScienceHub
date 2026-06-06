from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.accounts.models import RoleCode, ScopeType
from apps.accounts.services import get_user_capabilities, user_has_role

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
        if user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN):
            return qs
        scoped = qs.filter(created_by=user)
        assignments = user.role_assignments.select_related("role").all()
        institution_ids = [
            assignment.scope_id
            for assignment in assignments
            if assignment.scope_type == ScopeType.INSTITUTION
            and assignment.scope_id
            and assignment.role.code in {
                RoleCode.INSTITUTION_ADMIN,
                RoleCode.ARCHIVIST,
                RoleCode.VALIDATOR,
                RoleCode.SCIENTIFIC_COMMITTEE,
                RoleCode.DOCTORAL_SCHOOL,
                RoleCode.SCIENTIFIC_EDITOR,
            }
        ]
        department_ids = [
            assignment.scope_id
            for assignment in assignments
            if assignment.scope_type == ScopeType.DEPARTMENT
            and assignment.scope_id
            and assignment.role.code in {
                RoleCode.DEPARTMENT_HEAD,
                RoleCode.SUPERVISOR,
                RoleCode.THESIS_DIRECTOR,
                RoleCode.RAPPORTEUR,
                RoleCode.REVIEWER,
            }
        ]
        work_ids = [
            assignment.scope_id
            for assignment in assignments
            if assignment.scope_type == ScopeType.SCIENTIFIC_WORK and assignment.scope_id
        ]
        assigned_work_ids = user.validation_assignments.values_list("work_id", flat=True)
        scoped = scoped | qs.filter(institution_id__in=institution_ids)
        scoped = scoped | qs.filter(department_id__in=department_ids)
        scoped = scoped | qs.filter(id__in=work_ids)
        scoped = scoped | qs.filter(id__in=assigned_work_ids)
        return scoped.distinct()

    def perform_create(self, serializer):
        capabilities = get_user_capabilities(self.request.user)
        if capabilities["is_platform_admin"]:
            serializer.save(created_by=self.request.user)
            return
        if not self.request.user.institution_id:
            raise ValidationError("Votre compte doit être rattaché à une institution avant de créer un dossier.")
        serializer.save(created_by=self.request.user, institution=self.request.user.institution)

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
