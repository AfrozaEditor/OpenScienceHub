from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Permission, Role, UserRoleAssignment
from .serializers import (
    AssignRoleSerializer,
    PermissionSerializer,
    RegisterSerializer,
    RoleAssignmentSerializer,
    RoleSerializer,
    UserSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("full_name")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["status", "institution"]
    search_fields = ["full_name", "email", "academic_identifier"]

    @action(detail=True, methods=["get", "post"], url_path="roles")
    def roles(self, request, pk=None):
        user = self.get_object()
        if request.method == "GET":
            return Response(RoleAssignmentSerializer(user.role_assignments.all(), many=True).data)
        payload = AssignRoleSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        assignment, _ = UserRoleAssignment.objects.get_or_create(
            user=user, role_id=payload.validated_data["role"],
            scope_type=payload.validated_data.get("scope_type", "INSTITUTION"),
            scope_id=payload.validated_data.get("scope_id"),
        )
        try:
            from apps.audit.services import log_event

            log_event("ROLE_CHANGED", actor=request.user, module="accounts",
                      severity="SENSITIVE", comment=f"Role attribue a {user.email}")
        except Exception:
            pass
        return Response(RoleAssignmentSerializer(assignment).data, status=201)


class RoleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAuthenticated]


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
