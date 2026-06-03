from django.urls import path

from .views import (
    ArchiveWorkView,
    CatalogDetailView,
    CatalogListView,
    FacetsView,
)

urlpatterns = [
    path("works/<uuid:work_id>/archive", ArchiveWorkView.as_view(), name="work-archive"),
    path("catalog", CatalogListView.as_view(), name="catalog"),
    path("catalog/search", CatalogListView.as_view(), name="catalog-search"),
    path("catalog/facets", FacetsView.as_view(), name="catalog-facets"),
    path("catalog/<slug:slug>", CatalogDetailView.as_view(), name="catalog-detail"),
]
