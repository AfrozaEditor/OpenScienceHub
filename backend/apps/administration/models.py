"""Configuration institutionnelle : types de documents et workflows paramétrables."""
from django.db import models

from apps.common.models import TimeStampedModel


class DocumentType(TimeStampedModel):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=40, unique=True)
    description = models.TextField(blank=True)
    required_metadata = models.JSONField(default=list)
    default_visibility = models.CharField(max_length=30, default="PUBLIC")
    requires_academic_validation = models.BooleanField(default=True)
    requires_archiving = models.BooleanField(default=True)
    generates_proof_after_archiving = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.code


class Workflow(TimeStampedModel):
    name = models.CharField(max_length=120)
    document_type = models.CharField(max_length=20)  # MEMOIRE / THESE / ARTICLE
    institution = models.ForeignKey("institutions.Institution", null=True, blank=True, on_delete=models.CASCADE, related_name="workflows")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    version = models.PositiveIntegerField(default=1)

    def __str__(self) -> str:
        return f"{self.name} (v{self.version})"


class WorkflowStep(TimeStampedModel):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="steps")
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    responsible_role = models.CharField(max_length=60, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_required = models.BooleanField(default=True)
    allows_correction = models.BooleanField(default=False)
    allows_decision = models.BooleanField(default=False)
    triggers_notification = models.BooleanField(default=False)
    recommended_delay_days = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["order"]


class WorkflowTransition(TimeStampedModel):
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="transitions")
    source_step = models.ForeignKey(WorkflowStep, on_delete=models.CASCADE, related_name="outgoing")
    target_step = models.ForeignKey(WorkflowStep, on_delete=models.CASCADE, related_name="incoming")
    action_label = models.CharField(max_length=120)
    authorized_roles = models.JSONField(default=list)
    condition_expression = models.CharField(max_length=255, blank=True)
