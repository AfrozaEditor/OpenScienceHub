"""Journal d'audit immuable des actions sensibles."""
from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class AuditActionType(models.TextChoices):
    LOGIN = "LOGIN", "Connexion"
    USER_CREATED = "USER_CREATED", "Utilisateur créé"
    ROLE_CHANGED = "ROLE_CHANGED", "Rôle modifié"
    WORKFLOW_CHANGED = "WORKFLOW_CHANGED", "Workflow modifié"
    PDF_UPLOADED = "PDF_UPLOADED", "PDF déposé"
    METADATA_UPDATED = "METADATA_UPDATED", "Métadonnées modifiées"
    REVIEW_ADDED = "REVIEW_ADDED", "Avis ajouté"
    CORRECTION_CREATED = "CORRECTION_CREATED", "Correction créée"
    DECISION_RECORDED = "DECISION_RECORDED", "Décision enregistrée"
    DOCUMENT_ARCHIVED = "DOCUMENT_ARCHIVED", "Document archivé"
    PROOF_ISSUED = "PROOF_ISSUED", "Preuve émise"
    PROOF_REVOKED = "PROOF_REVOKED", "Preuve révoquée"
    QR_VERIFIED = "QR_VERIFIED", "QR vérifié"
    AI_SETTINGS_CHANGED = "AI_SETTINGS_CHANGED", "Paramètres IA modifiés"
    SSI_SETTINGS_CHANGED = "SSI_SETTINGS_CHANGED", "Paramètres SSI modifiés"


class AuditSeverity(models.TextChoices):
    INFO = "INFO", "Information"
    IMPORTANT = "IMPORTANT", "Important"
    SENSITIVE = "SENSITIVE", "Sensible"
    CRITICAL = "CRITICAL", "Critique"


class AuditEvent(TimeStampedModel):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="audit_events")
    actor_role = models.CharField(max_length=60, blank=True)
    institution = models.ForeignKey("institutions.Institution", null=True, blank=True, on_delete=models.SET_NULL, related_name="audit_events")
    action_type = models.CharField(max_length=40, choices=AuditActionType.choices)
    module = models.CharField(max_length=60, blank=True)
    old_value = models.JSONField(null=True, blank=True)
    new_value = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    severity = models.CharField(max_length=20, choices=AuditSeverity.choices, default=AuditSeverity.INFO)
    object_status = models.CharField(max_length=40, blank=True)
    comment = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.action_type} · {self.created_at:%Y-%m-%d %H:%M}"
