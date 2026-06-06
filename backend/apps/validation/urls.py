from django.urls import path

from .views import (
    AssignmentCreateView,
    CorrectionCreateView,
    CorrectionDetailView,
    DecisionView,
    DefenseView,
    InboxView,
    MetadataValidateView,
    MyAssignmentsView,
    ReviewListCreateView,
)

urlpatterns = [
    path("validation/inbox", InboxView.as_view(), name="validation-inbox"),
    path("validation/my-assignments", MyAssignmentsView.as_view(), name="validation-my-assignments"),
    path("works/<uuid:work_id>/assignments", AssignmentCreateView.as_view(), name="work-assignments"),
    path("works/<uuid:work_id>/reviews", ReviewListCreateView.as_view(), name="work-reviews"),
    path("works/<uuid:work_id>/corrections", CorrectionCreateView.as_view(), name="work-corrections"),
    path("corrections/<uuid:pk>", CorrectionDetailView.as_view(), name="correction-detail"),
    path("works/<uuid:work_id>/metadata/validate", MetadataValidateView.as_view(), name="work-metadata-validate"),
    path("works/<uuid:work_id>/decision", DecisionView.as_view(), name="work-decision"),
    path("works/<uuid:work_id>/defense", DefenseView.as_view(), name="work-defense"),
]
