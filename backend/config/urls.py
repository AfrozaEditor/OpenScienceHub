"""Routage racine de l'API OpenScience Hub."""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

api_v1 = [
    path("auth/", include("apps.accounts.urls_auth")),
    path("", include("apps.accounts.urls")),
    path("", include("apps.institutions.urls")),
    path("", include("apps.works.urls")),
    path("", include("apps.documents.urls")),
    path("", include("apps.validation.urls")),
    path("", include("apps.archive.urls")),
    path("", include("apps.ssi.urls")),
    path("", include("apps.ai.urls")),
    path("", include("apps.audit.urls")),
    path("", include("apps.administration.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include((api_v1, "api"), namespace="v1")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
