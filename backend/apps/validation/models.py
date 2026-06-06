"""Workflow de validation académique."""
from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class AssignmentType(models.TextChoices):
    SUPERVISOR_REVIEW = "SUPERVISOR_REVIEW", "Encadrement"
    THESIS_DIRECTOR_REVIEW = "THESIS_DIRECTOR_REVIEW", "Direction de thèse"
    RAPPORTEUR_REVIEW = "RAPPORTEUR_REVIEW", "Rapporteur / expert"
    SCIENTIFIC_COMMITTEE = "SCIENTIFIC_COMMITTEE", "Comité scientifique"
    PEER_REVIEW = "PEER_REVIEW", "Peer review"
    DEPARTMENT_DECISION = "DEPARTMENT_DECISION", "Décision département"
    DOCTORAL_SCHOOL_REVIEW = "DOCTORAL_SCHOOL_REVIEW", "École doctorale"
    ARCHIVE_CONTROL = "ARCHIVE_CONTROL", "Contrôle archive"


class AssignmentStatus(models.TextChoices):
    PENDING = "PENDING", "En attente"
    IN_PROGRESS = "IN_PROGRESS", "En cours"
    COMPLETED = "COMPLETED", "Terminé"
    CANCELLED = "CANCELLED", "Annulé"


class Recommendation(models.TextChoices):
    FAVORABLE = "FAVORABLE", "Favorable"
    FAVORABLE_WITH_CORRECTIONS = "FAVORABLE_WITH_CORRECTIONS", "Favorable avec corrections"
    UNFAVORABLE = "UNFAVORABLE", "Défavorable"
    REVISE = "REVISE", "À réviser"
    ACCEPT = "ACCEPT", "Accepter"
    MINOR_CORRECTION = "MINOR_CORRECTION", "Correction mineure"
    MAJOR_CORRECTION = "MAJOR_CORRECTION", "Correction majeure"
    REJECT = "REJECT", "Rejeter"


class CorrectionType(models.TextChoices):
    ADMINISTRATIVE = "ADMINISTRATIVE", "Administrative"
    SCIENTIFIC = "SCIENTIFIC", "Scientifique"
    METADATA = "METADATA", "Métadonnées"
    PDF_FILE = "PDF_FILE", "Fichier PDF"
    ABSTRACT = "ABSTRACT", "Résumé"
    KEYWORDS = "KEYWORDS", "Mots-clés"
    BIBLIOGRAPHY = "BIBLIOGRAPHY", "Bibliographie"
    VISIBILITY = "VISIBILITY", "Visibilité"
    FINAL_VERSION = "FINAL_VERSION", "Version finale"
    INSTITUTIONAL_COMPLIANCE = "INSTITUTIONAL_COMPLIANCE", "Conformité institutionnelle"


class CorrectionPriority(models.TextChoices):
    LOW = "LOW", "Faible"
    NORMAL = "NORMAL", "Normale"
    HIGH = "HIGH", "Élevée"
    BLOCKING = "BLOCKING", "Bloquante"


class CorrectionStatus(models.TextChoices):
    OPEN = "OPEN", "Ouverte"
    IN_PROGRESS = "IN_PROGRESS", "En traitement"
    ANSWERED = "ANSWERED", "Traitée"
    VALIDATED = "VALIDATED", "Validée"
    REJECTED = "REJECTED", "Rejetée"
    CANCELLED = "CANCELLED", "Annulée"


class DecisionType(models.TextChoices):
    AUTHORIZE_DEFENSE = "AUTHORIZE_DEFENSE", "Autoriser soutenance"
    RECORD_DEFENSE_PASSED = "RECORD_DEFENSE_PASSED", "Soutenance réussie"
    VALIDATE_AFTER_DEFENSE = "VALIDATE_AFTER_DEFENSE", "Validé après soutenance"
    REQUEST_CORRECTION = "REQUEST_CORRECTION", "Demander correction"
    REQUEST_MINOR_REVISION = "REQUEST_MINOR_REVISION", "Révision mineure"
    REQUEST_MAJOR_REVISION = "REQUEST_MAJOR_REVISION", "Révision majeure"
    ACCEPT_ARTICLE = "ACCEPT_ARTICLE", "Accepter article"
    PUBLISH_ARTICLE = "PUBLISH_ARTICLE", "Publier article"
    ACCEPT_FINAL_DEPOSIT = "ACCEPT_FINAL_DEPOSIT", "Accepter dépôt final"
    MARK_ARCHIVABLE = "MARK_ARCHIVABLE", "Rendre archivable"
    REJECT = "REJECT", "Rejeter"
    ARCHIVE = "ARCHIVE", "Archiver"


class DefenseSessionType(models.TextChoices):
    MASTER_DEFENSE = "MASTER_DEFENSE", "Soutenance Master"
    PHD_DEFENSE = "PHD_DEFENSE", "Soutenance Doctorat"


class DefenseResult(models.TextChoices):
    PASSED = "PASSED", "Réussie"
    PASSED_WITH_CORRECTIONS = "PASSED_WITH_CORRECTIONS", "Réussie avec corrections"
    FAILED = "FAILED", "Échouée"
    POSTPONED = "POSTPONED", "Reportée"


class WorkflowEventType(models.TextChoices):
    SUBMISSION = "SUBMISSION", "Soumission"
    ASSIGNMENT = "ASSIGNMENT", "Affectation"
    REVIEW = "REVIEW", "Avis"
    CORRECTION = "CORRECTION", "Correction"
    DECISION = "DECISION", "Décision"
    ARCHIVE = "ARCHIVE", "Archivage"
    CREDENTIAL_ISSUED = "CREDENTIAL_ISSUED", "Preuve émise"


class ValidationAssignment(TimeStampedModel):
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="assignments")
    assignment_type = models.CharField(max_length=30, choices=AssignmentType.choices)
    status = models.CharField(max_length=20, choices=AssignmentStatus.choices, default=AssignmentStatus.PENDING)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="assignments")
    assigned_at = models.DateTimeField(auto_now_add=True)
    due_at = models.DateTimeField(null=True, blank=True)


class Review(TimeStampedModel):
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="reviews")
    assignment = models.ForeignKey(ValidationAssignment, null=True, blank=True, on_delete=models.SET_NULL, related_name="reviews")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="reviews")
    document_version = models.ForeignKey("documents.DocumentVersion", null=True, blank=True, on_delete=models.SET_NULL, related_name="reviews")
    comment = models.TextField()
    public_comment = models.TextField(blank=True)
    internal_comment = models.TextField(blank=True)
    attachment = models.FileField(upload_to="reviews/", blank=True)
    recommendation = models.CharField(max_length=40, choices=Recommendation.choices)
    conformity_score = models.PositiveSmallIntegerField(null=True, blank=True)


class CorrectionRequest(TimeStampedModel):
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="corrections")
    type = models.CharField(max_length=30, choices=CorrectionType.choices, default=CorrectionType.METADATA)
    message = models.TextField()
    priority = models.CharField(max_length=20, choices=CorrectionPriority.choices, default=CorrectionPriority.NORMAL)
    status = models.CharField(max_length=20, choices=CorrectionStatus.choices, default=CorrectionStatus.OPEN)
    requested_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="correction_requests")
    related_page = models.PositiveIntegerField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)


class DefenseSession(TimeStampedModel):
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="defense_sessions")
    session_type = models.CharField(max_length=20, choices=DefenseSessionType.choices)
    scheduled_at = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    result = models.CharField(max_length=30, choices=DefenseResult.choices, null=True, blank=True)
    jury_members = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="jury_sessions")


class Decision(TimeStampedModel):
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="decisions")
    decision_type = models.CharField(max_length=30, choices=DecisionType.choices)
    comment = models.TextField(blank=True)
    decided_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="decisions")
    document_version = models.ForeignKey("documents.DocumentVersion", null=True, blank=True, on_delete=models.SET_NULL, related_name="decisions")
    decided_at = models.DateTimeField(auto_now_add=True)


class WorkflowEvent(TimeStampedModel):
    work = models.ForeignKey("works.ScientificWork", on_delete=models.CASCADE, related_name="events")
    from_status = models.CharField(max_length=30, blank=True)
    to_status = models.CharField(max_length=30)
    event_type = models.CharField(max_length=30, choices=WorkflowEventType.choices)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="workflow_events")
    comment = models.TextField(blank=True)
