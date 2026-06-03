from rest_framework.routers import DefaultRouter

from .views import AuditEventViewSet

router = DefaultRouter(trailing_slash=False)
router.register("admin/audit", AuditEventViewSet, basename="audit")

urlpatterns = router.urls
