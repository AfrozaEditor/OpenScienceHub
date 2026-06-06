"""Dossier scientifique (ScientificWork) et contributeurs."""
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models

from apps.common.models import TimeStampedModel


class WorkType(models.TextChoices):
    MEMOIRE = "MEMOIRE", "Mémoire"
    THESE = "THESE", "Thèse"
    ARTICLE = "ARTICLE", "Article"


class WorkStatus(models.TextChoices):
    BROUILLON = "BROUILLON", "Brouillon"
    SOUMIS = "SOUMIS", "Soumis"
    EN_INSTRUCTION = "EN_INSTRUCTION", "En instruction"
    EN_PRE_INSTRUCTION = "EN_PRE_INSTRUCTION", "En pré-instruction"
    EN_EXPERTISE = "EN_EXPERTISE", "En expertise"
    CORRECTION_DEMANDEE = "CORRECTION_DEMANDEE", "Correction demandée"
    RE_SOUMIS = "RE_SOUMIS", "Re-soumis"
    AVIS_EN_ATTENTE = "AVIS_EN_ATTENTE", "Avis en attente"
    DECISION_REQUISE = "DECISION_REQUISE", "Décision requise"
    AUTORISE_SOUTENANCE = "AUTORISE_SOUTENANCE", "Autorisé soutenance"
    SOUTENANCE_AUTORISEE = "SOUTENANCE_AUTORISEE", "Soutenance autorisée"
    SOUTENU = "SOUTENU", "Soutenu"
    CORRECTION_POST_SOUTENANCE = "CORRECTION_POST_SOUTENANCE", "Correction post-soutenance"
    VALIDE = "VALIDE", "Validé"
    VALIDE_APRES_SOUTENANCE = "VALIDE_APRES_SOUTENANCE", "Validé après soutenance"
    DEPOT_FINAL_ACCEPTE = "DEPOT_FINAL_ACCEPTE", "Dépôt final accepté"
    SCREENING = "SCREENING", "Screening éditorial"
    UNDER_REVIEW = "UNDER_REVIEW", "Peer review"
    REVISION_REQUESTED = "REVISION_REQUESTED", "Révision demandée"
    RESUBMITTED = "RESUBMITTED", "Article re-soumis"
    ACCEPTED = "ACCEPTED", "Accepté"
    PUBLISHED = "PUBLISHED", "Publié"
    ARCHIVABLE = "ARCHIVABLE", "Archivable"
    ARCHIVE = "ARCHIVE", "Archivé"
    REJETE = "REJETE", "Rejeté"


class Visibility(models.TextChoices):
    PRIVATE = "PRIVATE", "Privé"
    INSTITUTION_ONLY = "INSTITUTION_ONLY", "Institution"
    PUBLIC = "PUBLIC", "Public"
    RESTRICTED = "RESTRICTED", "Restreint"


class Language(models.TextChoices):
    FR = "FR", "Français"
    EN = "EN", "Anglais"
    OTHER = "OTHER", "Autre"


class ContributorType(models.TextChoices):
    AUTHOR = "AUTHOR", "Auteur"
    SUPERVISOR = "SUPERVISOR", "Encadreur"
    CO_SUPERVISOR = "CO_SUPERVISOR", "Co-encadreur"
    REVIEWER = "REVIEWER", "Reviewer"
    RAPPORTEUR = "RAPPORTEUR", "Rapporteur"
    JURY_MEMBER = "JURY_MEMBER", "Membre du jury"


class ScientificWork(TimeStampedModel):
    reference_code = models.CharField(max_length=60, unique=True, blank=True, null=True)
    type = models.CharField(max_length=20, choices=WorkType.choices)
    title = models.CharField(max_length=500)
    abstract_text = models.TextField(blank=True)
    language = models.CharField(max_length=10, choices=Language.choices, default=Language.FR)
    academic_year = models.CharField(max_length=20, blank=True)
    keywords = ArrayField(models.CharField(max_length=80), default=list, blank=True)
    status = models.CharField(max_length=40, choices=WorkStatus.choices, default=WorkStatus.BROUILLON)
    visibility = models.CharField(max_length=20, choices=Visibility.choices, default=Visibility.PRIVATE)

    institution = models.ForeignKey("institutions.Institution", on_delete=models.PROTECT, related_name="works")
    faculty = models.ForeignKey("institutions.Faculty", null=True, blank=True, on_delete=models.SET_NULL, related_name="works")
    department = models.ForeignKey("institutions.Department", null=True, blank=True, on_delete=models.SET_NULL, related_name="works")
    program = models.ForeignKey("institutions.AcademicProgram", null=True, blank=True, on_delete=models.SET_NULL, related_name="works")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="created_works")

    supervisor_name = models.CharField(max_length=255, blank=True)
    scientific_domain = models.CharField(max_length=255, blank=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"[{self.type}] {self.title}"


class WorkContributor(TimeStampedModel):
    work = models.ForeignKey(ScientificWork, on_delete=models.CASCADE, related_name="contributors")
    contributor_type = models.CharField(max_length=20, choices=ContributorType.choices, default=ContributorType.AUTHOR)
    display_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    orcid = models.CharField(max_length=40, blank=True)
    order_index = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="contributions")

    class Meta:
        ordering = ["order_index"]

    def __str__(self) -> str:
        return f"{self.display_name} ({self.contributor_type})"
