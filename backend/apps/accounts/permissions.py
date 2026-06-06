from rest_framework.permissions import BasePermission

from .models import RoleCode
from .services import get_user_capabilities, user_has_role


class IsPlatformAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or user_has_role(user, RoleCode.SUPER_ADMIN))
        )


class IsInstitutionAdminOrPlatformAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        capabilities = get_user_capabilities(user)
        return capabilities["is_platform_admin"] or capabilities["is_institution_admin"]


class HasValidationMission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return "validation" in get_user_capabilities(user)["portals"]
