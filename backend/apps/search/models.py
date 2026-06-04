"""Recherche à facettes (indexation des notices archivées)."""
from django.db import models

from apps.common.models import TimeStampedModel


class IndexStatus(models.TextChoices):
    PENDING = "PENDING", "En attente"
    INDEXED = "INDEXED", "Indexé"
    FAILED = "FAILED", "Échec"


class FacetDataType(models.TextChoices):
    TEXT = "TEXT", "Texte"
    NUMBER = "NUMBER", "Nombre"
    DATE = "DATE", "Date"
    ENUM = "ENUM", "Énumération"


class SearchIndexEntry(TimeStampedModel):
    archive_record = models.OneToOneField("archive.ArchiveRecord", on_delete=models.CASCADE, related_name="index_entry")
    normalized_title = models.CharField(max_length=500)
    full_text_ref = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=IndexStatus.choices, default=IndexStatus.PENDING)
    indexed_at = models.DateTimeField(null=True, blank=True)


class FacetDefinition(TimeStampedModel):
    code = models.CharField(max_length=60, unique=True)
    label = models.CharField(max_length=120)
    source_field = models.CharField(max_length=120)
    data_type = models.CharField(max_length=20, choices=FacetDataType.choices, default=FacetDataType.TEXT)
    is_enabled = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.code


class SearchFacetValue(TimeStampedModel):
    index_entry = models.ForeignKey(SearchIndexEntry, on_delete=models.CASCADE, related_name="facet_values")
    facet = models.ForeignKey(FacetDefinition, on_delete=models.CASCADE, related_name="values")
    value = models.CharField(max_length=255)
    normalized_value = models.CharField(max_length=255)
    count_hint = models.PositiveIntegerField(null=True, blank=True)
