from django.urls import path

from .views import DocumentDetailView, DocumentUploadView, SetFinalVersionView

urlpatterns = [
    path("works/<uuid:work_id>/documents", DocumentUploadView.as_view(), name="work-documents"),
    path("documents/<uuid:pk>", DocumentDetailView.as_view(), name="document-detail"),
    path("documents/<uuid:pk>/set-final", SetFinalVersionView.as_view(), name="document-set-final"),
]
