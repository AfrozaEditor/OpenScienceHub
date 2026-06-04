from django.urls import path

from .views import (
    AssistantQueryView,
    ExtractMetadataView,
    MetadataAcceptView,
    MetadataExtractionView,
    SimilarWorksView,
    SummaryView,
)

urlpatterns = [
    path("works/<uuid:work_id>/extract-metadata", ExtractMetadataView.as_view(), name="work-extract"),
    path("works/<uuid:work_id>/metadata-extraction", MetadataExtractionView.as_view(), name="work-metadata-extraction"),
    path("works/<uuid:work_id>/metadata/accept", MetadataAcceptView.as_view(), name="work-metadata-accept"),
    path("works/<uuid:work_id>/similar", SimilarWorksView.as_view(), name="work-similar"),
    path("works/<uuid:work_id>/summary", SummaryView.as_view(), name="work-summary"),
    path("ai/assistant/query", AssistantQueryView.as_view(), name="assistant-query"),
]
