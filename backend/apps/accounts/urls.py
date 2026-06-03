from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MeView, PermissionViewSet, RoleViewSet, UserViewSet

router = DefaultRouter(trailing_slash=False)
router.register("accounts/users", UserViewSet, basename="user")
router.register("accounts/roles", RoleViewSet, basename="role")
router.register("accounts/permissions", PermissionViewSet, basename="permission")

urlpatterns = [
    path("accounts/me", MeView.as_view(), name="me"),
]
urlpatterns += router.urls
