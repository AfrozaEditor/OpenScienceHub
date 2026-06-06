from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AISettingsView,
    DashboardView,
    DocumentTypeViewSet,
    ProofListView,
    SearchSettingsView,
    ScopeSummaryView,
    StatsView,
    WorkflowStepViewSet,
    WorkflowTransitionViewSet,
    WorkflowViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register("admin/document-types", DocumentTypeViewSet, basename="document-type")
router.register("admin/workflows", WorkflowViewSet, basename="workflow")
router.register("admin/workflow-steps", WorkflowStepViewSet, basename="workflow-step")
router.register("admin/workflow-transitions", WorkflowTransitionViewSet, basename="workflow-transition")

urlpatterns = [
    path("admin/dashboard", DashboardView.as_view(), name="admin-dashboard"),
    path("admin/proofs", ProofListView.as_view(), name="admin-proofs"),
    path("admin/stats", StatsView.as_view(), name="admin-stats"),
    path("admin/scope-summary", ScopeSummaryView.as_view(), name="admin-scope-summary"),
    path("admin/ai-settings", AISettingsView.as_view(), name="admin-ai-settings"),
    path("admin/search-settings", SearchSettingsView.as_view(), name="admin-search-settings"),
]
urlpatterns += router.urls
