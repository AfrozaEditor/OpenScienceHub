from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

from apps.works.models import ScientificWork, Visibility

from .models import ArchiveRecord
from .serializers import ArchiveInputSerializer, CatalogItemSerializer
from .services import archive_work

PUBLIC_VISIBILITIES = [Visibility.PUBLIC]


def _public_qs():
    return (
        ArchiveRecord.objects.select_related("work", "work__institution")
        .filter(work__visibility__in=PUBLIC_VISIBILITIES)
        .order_by("-archived_at")
    )


class ArchiveWorkView(views.APIView):
    """POST /works/{work_id}/archive — archive + déclenche la preuve."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, work_id):
        work = get_object_or_404(ScientificWork, pk=work_id)
        payload = ArchiveInputSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        record = archive_work(
            work, request.user,
            access_level=payload.validated_data.get("access_level", "OPEN_ACCESS"),
            is_download_allowed=payload.validated_data.get("is_download_allowed", True),
        )
        return Response(CatalogItemSerializer(record).data, status=status.HTTP_201_CREATED)


class CatalogListView(generics.ListAPIView):
    """GET /catalog & /catalog/search — public, documents publiables uniquement."""

    serializer_class = CatalogItemSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = []  # filtrage manuel ci-dessous

    def get_queryset(self):
        qs = _public_qs()
        p = self.request.query_params
        if p.get("q"):
            term = p["q"]
            qs = qs.filter(Q(work__title__icontains=term) | Q(work__abstract_text__icontains=term) | Q(work__keywords__icontains=term))
        if p.get("type"):
            qs = qs.filter(work__type=p["type"])
        if p.get("institution"):
            qs = qs.filter(work__institution_id=p["institution"])
        if p.get("department"):
            qs = qs.filter(work__department_id=p["department"])
        if p.get("year"):
            qs = qs.filter(work__academic_year=p["year"])
        if p.get("verifiable") in ("1", "true", "True"):
            qs = qs.filter(verification_proof__isnull=False)
        return qs


class CatalogDetailView(generics.RetrieveAPIView):
    serializer_class = CatalogItemSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "public_slug"
    lookup_url_kwarg = "slug"

    def get_queryset(self):
        return _public_qs()


class FacetsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        qs = _public_qs()
        def counts(field):
            out = {}
            for r in qs.values_list(field, flat=True):
                if r:
                    out[str(r)] = out.get(str(r), 0) + 1
            return out
        return Response({
            "type": counts("work__type"),
            "institution": counts("work__institution__name"),
            "academic_year": counts("work__academic_year"),
        })
