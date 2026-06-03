from rest_framework import serializers

from .models import AuditEvent


class AuditEventSerializer(serializers.ModelSerializer):
    actor_email = serializers.CharField(source="actor.email", read_only=True, default="")

    class Meta:
        model = AuditEvent
        fields = [
            "id", "created_at", "actor", "actor_email", "actor_role", "institution",
            "action_type", "module", "severity", "object_status", "comment",
            "old_value", "new_value", "ip_address",
        ]
