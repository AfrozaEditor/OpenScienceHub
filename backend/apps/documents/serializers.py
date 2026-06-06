import hashlib

from rest_framework import serializers

from .models import DocumentVersion


class DocumentVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentVersion
        fields = [
            "id", "work", "version_number", "version_type", "file", "file_name",
            "mime_type", "page_count", "sha256_hash", "change_note", "is_final",
            "status", "uploaded_by", "created_at",
        ]
        read_only_fields = ["work", "version_number", "sha256_hash", "uploaded_by", "is_final"]


class DocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    change_note = serializers.CharField(required=False, allow_blank=True)

    def validate_file(self, f):
        if f.content_type not in ("application/pdf", "application/octet-stream"):
            raise serializers.ValidationError("Seuls les fichiers PDF sont acceptés.")
        return f


def compute_sha256(django_file) -> str:
    sha = hashlib.sha256()
    for chunk in django_file.chunks():
        sha.update(chunk)
    django_file.seek(0)
    return sha.hexdigest()
