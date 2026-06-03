from rest_framework import serializers

from .models import ScientificWork, WorkContributor


class WorkContributorSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkContributor
        fields = ["id", "work", "contributor_type", "display_name", "email", "orcid", "order_index", "user"]
        read_only_fields = ["work"]


class ScientificWorkSerializer(serializers.ModelSerializer):
    contributors = WorkContributorSerializer(many=True, read_only=True)

    class Meta:
        model = ScientificWork
        fields = [
            "id", "reference_code", "type", "title", "abstract_text", "language",
            "academic_year", "keywords", "status", "visibility",
            "institution", "faculty", "department", "program",
            "supervisor_name", "scientific_domain", "submitted_at",
            "created_by", "contributors", "created_at", "updated_at",
        ]
        read_only_fields = ["reference_code", "status", "submitted_at", "created_by"]
