from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Permission, Role, RoleCode, UserRoleAssignment
from .permissions import IsInstitutionAdminOrPlatformAdmin
from .services import ensure_system_roles, get_user_capabilities, user_has_role
from .serializers import (
    AdminUserSerializer,
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


class MeCapabilitiesView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(get_user_capabilities(request.user))


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().prefetch_related("role_assignments__role").order_by("full_name")
    serializer_class = AdminUserSerializer
    permission_classes = [IsInstitutionAdminOrPlatformAdmin]
    filterset_fields = ["status", "institution"]
    search_fields = ["full_name", "email", "academic_identifier"]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN):
            return qs
        if user_has_role(user, RoleCode.INSTITUTION_ADMIN) and user.institution_id:
            return qs.filter(institution_id=user.institution_id)
        return qs.none()

    @action(detail=False, methods=["get"], url_path="without-institution")
    def without_institution(self, request):
        if not get_user_capabilities(request.user)["is_platform_admin"]:
            return Response({"detail": "Accès réservé aux administrateurs plateforme."}, status=status.HTTP_403_FORBIDDEN)
        qs = self.filter_queryset(
            User.objects.filter(institution__isnull=True, is_active=True)
            .exclude(is_superuser=True)
            .prefetch_related("role_assignments__role")
            .order_by("email")
        )
        page = self.paginate_queryset(qs)
        if page is not None:
            return self.get_paginated_response(AdminUserSerializer(page, many=True, context=self.get_serializer_context()).data)
        return Response(AdminUserSerializer(qs, many=True, context=self.get_serializer_context()).data)

    @action(detail=True, methods=["get", "post"], url_path="roles")
    def roles(self, request, pk=None):
        user = self.get_object()
        if request.method == "GET":
            return Response(RoleAssignmentSerializer(user.role_assignments.all(), many=True).data)
        payload = AssignRoleSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        role = get_object_or_404(Role, pk=payload.validated_data["role"])
        guard = AdminUserSerializer(
            user,
            data={
                "role_code": role.code,
                "scope_type": payload.validated_data.get("scope_type", "INSTITUTION"),
                "scope_id": payload.validated_data.get("scope_id"),
            },
            partial=True,
            context=self.get_serializer_context(),
        )
        guard.is_valid(raise_exception=True)
        assignment, _ = UserRoleAssignment.objects.get_or_create(
            user=user,
            role=role,
            scope_type=guard.validated_data.get("scope_type", "INSTITUTION"),
            scope_id=guard.validated_data.get("scope_id"),
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
    permission_classes = [IsInstitutionAdminOrPlatformAdmin]

    def list(self, request, *args, **kwargs):
        ensure_system_roles()
        return super().list(request, *args, **kwargs)


class PermissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsInstitutionAdminOrPlatformAdmin]
