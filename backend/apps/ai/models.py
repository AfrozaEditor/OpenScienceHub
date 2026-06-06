"""IA : extraction de métadonnées (proposition) et journal de l'Assistant IA."""
from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class ExtractionStatus(models.TextChoices):
    PENDING = "PENDING", "En attente"
    EXTRACTED = "EXTRACTED", "Extrait"
    REVIEWED = "REVIEWED", "Revu"
    FAILED = "FAILED", "Échec"


class AIPurpose(models.TextChoices):
    METADATA_EXTRACTION = "METADATA_EXTRACTION", "Extraction métadonnées"
    SCIENTIFIC_SEARCH = "SCIENTIFIC_SEARCH", "Recherche scientifique"
    SUMMARY = "SUMMARY", "Résumé"
    VALIDATION_ASSISTANCE = "VALIDATION_ASSISTANCE", "Aide à la validation"


class AIAnswerStatus(models.TextChoices):
    ANSWERED = "ANSWERED", "Répondu"
    NO_CONTEXT_FOUND = "NO_CONTEXT_FOUND", "Aucun contexte"
    FAILED = "FAILED", "Échec"
    FLAGGED = "FLAGGED", "Signalé"


class MetadataExtraction(TimeStampedModel):
    document_version = models.ForeignKey("documents.DocumentVersion", on_delete=models.CASCADE, related_name="extractions")
    model_name = models.CharField(max_length=120, blank=True)
    extracted_title = models.CharField(max_length=500, blank=True)
    extracted_abstract = models.TextField(blank=True)
    extracted_keywords = models.JSONField(default=list)
    suggested_domain = models.CharField(max_length=255, blank=True)
    detected_language = models.CharField(max_length=10, blank=True)
    confidence_score = models.DecimalField(max_digits=4, decimal_places=3, default=0)
    raw_json = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=ExtractionStatus.choices, default=ExtractionStatus.PENDING)
    reviewed_at = models.DateTimeField(null=True, blank=True)


class AIModelConfig(TimeStampedModel):
    provider = models.CharField(max_length=60)
    model_name = models.CharField(max_length=120)
    purpose = models.CharField(max_length=30, choices=AIPurpose.choices)
    is_active = models.BooleanField(default=True)


class AIQueryLog(TimeStampedModel):
    question = models.TextField()
    answer = models.TextField(blank=True)
    answer_status = models.CharField(max_length=20, choices=AIAnswerStatus.choices, default=AIAnswerStatus.ANSWERED)
    filters = models.JSONField(default=dict)
    model_name = models.CharField(max_length=120, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="ai_queries")


class AIAnswerCitation(TimeStampedModel):
    query = models.ForeignKey(AIQueryLog, on_delete=models.CASCADE, related_name="citations")
    work = models.ForeignKey("works.ScientificWork", null=True, blank=True, on_delete=models.SET_NULL, related_name="ai_citations")
    excerpt = models.TextField(blank=True)
    score = models.DecimalField(max_digits=4, decimal_places=3, default=0)
    page_number = models.PositiveIntegerField(null=True, blank=True)


class AIPlatformSettings(TimeStampedModel):
    """Configuration pilotage IA — plateforme (institution nulle) ou par institution."""

    institution = models.OneToOneField(
        "institutions.Institution",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="ai_platform_settings",
    )
    config = models.JSONField(default=dict)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="ai_settings_updates",
    )

    class Meta:
        verbose_name_plural = "AI platform settings"
