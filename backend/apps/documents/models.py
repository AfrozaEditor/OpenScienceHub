"""Versions documentaires (PDF) d'un dossier scientifique."""
from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class VersionType(models.TextChoices):
    INITIAL_SUBMISSION = "INITIAL_SUBMISSION", "Soumission initiale"
    CORRECTED_VERSION = "CORRECTED_VERSION", "Version corrigée"
    FINAL_ARCHIVE = "FINAL_ARCHIVE", "Version finale archivée"


class VersionStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    REPLACED = "REPLACED", "Remplacée"
    UNDER_CORRECTION = "UNDER_CORRECTION", "En correction"
    FINAL = "FINAL", "Finale"
    ARCHIVED = "ARCHIVED", "Archivée"
    REJECTED = "REJECTED", "Rejetée"


def upload_to(instance, filename):
    return f"works/{instance.work_id}/v{instance.version_number}_{filename}"


class DocumentVersion(TimeStampedModel):
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="documents")
    version_number = models.PositiveIntegerField(default=1)
    version_type = models.CharField(max_length=30, choices=VersionType.choices, default=VersionType.INITIAL_SUBMISSION)
    file = models.FileField(upload_to=upload_to)
    file_name = models.CharField(max_length=255, blank=True)
    mime_type = models.CharField(max_length=100, default="application/pdf")
    page_count = models.PositiveIntegerField(null=True, blank=True)
    sha256_hash = models.CharField(max_length=64, db_index=True)
    change_note = models.TextField(blank=True)
    is_final = models.BooleanField(default=False)
    status = models.CharField(max_length=30, choices=VersionStatus.choices, default=VersionStatus.ACTIVE)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="uploaded_versions")

    class Meta:
        ordering = ["version_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["work"], condition=models.Q(is_final=True),
                name="unique_final_version_per_work",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.work_id} v{self.version_number}"
