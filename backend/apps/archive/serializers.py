from rest_framework import serializers

from .models import AccessLevel, ArchiveRecord


class ArchiveInputSerializer(serializers.Serializer):
    access_level = serializers.ChoiceField(choices=[c[0] for c in AccessLevel.choices], required=False)
    is_download_allowed = serializers.BooleanField(required=False, default=True)


class CatalogItemSerializer(serializers.ModelSerializer):
    work_id = serializers.UUIDField(source="work.id", read_only=True)
    title = serializers.CharField(source="work.title", read_only=True)
    type = serializers.CharField(source="work.type", read_only=True)
    abstract = serializers.CharField(source="work.abstract_text", read_only=True)
    keywords = serializers.ListField(source="work.keywords", read_only=True)
    institution = serializers.CharField(source="work.institution.name", read_only=True)
    academic_year = serializers.CharField(source="work.academic_year", read_only=True)
    scientific_domain = serializers.CharField(source="work.scientific_domain", read_only=True)
    is_verifiable = serializers.SerializerMethodField()

    class Meta:
        model = ArchiveRecord
        fields = [
            "public_slug", "work_id", "title", "type", "abstract", "keywords",
            "institution", "academic_year", "scientific_domain",
            "access_level", "is_download_allowed", "archived_at", "is_verifiable",
        ]

    def get_is_verifiable(self, obj) -> bool:
        return hasattr(obj, "verification_proof")
