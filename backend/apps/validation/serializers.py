from rest_framework import serializers

from .models import CorrectionRequest, Decision, DefenseSession, Review, ValidationAssignment


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationAssignment
        fields = ["id", "work", "assignment_type", "status", "assignee", "assigned_at", "due_at"]
        read_only_fields = ["work", "assigned_at"]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "work", "assignment", "author", "document_version", "comment", "recommendation", "conformity_score", "created_at"]
        read_only_fields = ["work", "author", "created_at"]


class CorrectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CorrectionRequest
        fields = ["id", "work", "type", "message", "priority", "status", "requested_by", "related_page", "resolved_at", "created_at"]
        read_only_fields = ["work", "requested_by", "created_at"]


class DecisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Decision
        fields = ["id", "work", "decision_type", "comment", "decided_by", "document_version", "decided_at"]
        read_only_fields = ["work", "decided_by", "decided_at"]


class DecisionInputSerializer(serializers.Serializer):
    decision_type = serializers.ChoiceField(choices=[c[0] for c in Decision._meta.get_field("decision_type").choices])
    comment = serializers.CharField(required=False, allow_blank=True)
    document_version = serializers.UUIDField(required=False, allow_null=True)


class DefenseSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefenseSession
        fields = ["id", "work", "session_type", "scheduled_at", "location", "result", "jury_members", "created_at"]
        read_only_fields = ["work", "created_at"]


class InboxItemSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    reference_code = serializers.CharField()
    title = serializers.CharField()
    type = serializers.CharField()
    status = serializers.CharField()
    institution = serializers.CharField(source="institution.name", default="")
    department = serializers.CharField(source="department.name", default="")
    submitted_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
