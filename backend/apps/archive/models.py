"""Archivage institutionnel d'un dossier validé."""
from django.db import models

from apps.common.models import TimeStampedModel


class AccessLevel(models.TextChoices):
    OPEN_ACCESS = "OPEN_ACCESS", "Accès libre"
    METADATA_ONLY = "METADATA_ONLY", "Métadonnées seulement"
    RESTRICTED_ACCESS = "RESTRICTED_ACCESS", "Accès restreint"


class ArchiveRecord(TimeStampedModel):
    work = models.OneToOneField("works.ScientificWork", on_delete=models.CASCADE, related_name="archive_record")
    document_version = models.ForeignKey("documents.DocumentVersion", on_delete=models.PROTECT, related_name="archive_records")
    document_hash = models.CharField(max_length=64, blank=True)
    public_slug = models.SlugField(max_length=80, unique=True)
    access_level = models.CharField(max_length=30, choices=AccessLevel.choices, default=AccessLevel.OPEN_ACCESS)
    is_download_allowed = models.BooleanField(default=True)
    archived_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.public_slug
