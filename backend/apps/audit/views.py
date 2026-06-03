from rest_framework import permissions, viewsets

from .models import AuditEvent
from .serializers import AuditEventSerializer


class AuditEventViewSet(viewsets.ReadOnlyModelViewSet):
    """Journal d'audit en lecture seule (admins)."""

    queryset = AuditEvent.objects.all().order_by("-created_at")
    serializer_class = AuditEventSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ["action_type", "severity", "module", "institution"]
    search_fields = ["comment", "module"]
    ordering_fields = ["created_at", "severity"]
