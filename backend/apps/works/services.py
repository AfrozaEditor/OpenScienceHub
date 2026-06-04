"""Services métier du dossier scientifique (transitions de workflow)."""
from datetime import datetime

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import ScientificWork, WorkStatus


def generate_reference_code(work: ScientificWork) -> str:
    """Code public lisible, ex. OSH-UY1-INF-2026-0001."""
    inst = (work.institution.short_name or work.institution.name)[:6].upper().replace(" ", "")
    dept = (work.department.code or work.department.name)[:4].upper().replace(" ", "") if work.department else "GEN"
    year = (work.academic_year or str(datetime.now().year))[:4]
    seq = ScientificWork.objects.filter(institution=work.institution).count() + 1
    return f"OSH-{inst}-{dept}-{year}-{seq:04d}"


SUBMITTABLE = {WorkStatus.DRAFT, WorkStatus.CORRECTION_REQUESTED, WorkStatus.RESUBMITTED}


@transaction.atomic
def submit_work(work: ScientificWork, actor) -> ScientificWork:
    """Soumission officielle : passe le dossier en SUBMITTED."""
    if work.status not in SUBMITTABLE:
        raise ValidationError(
            f"Le dossier ne peut pas être soumis depuis le statut {work.status}."
        )
    if not work.contributors.exists():
        raise ValidationError("Le dossier doit avoir au moins un contributeur (auteur).")
    if not work.documents.exists():
        raise ValidationError("Le dossier doit avoir au moins une version de document (PDF).")
    if not work.reference_code:
        work.reference_code = generate_reference_code(work)

    previous = work.status
    work.status = WorkStatus.SUBMITTED
    work.submitted_at = timezone.now()
    work.save(update_fields=["status", "submitted_at", "reference_code", "updated_at"])
    _log_event(work, previous, WorkStatus.SUBMITTED, "SUBMISSION", actor)
    _audit("METADATA_UPDATED", actor, work, comment="Soumission officielle", status=WorkStatus.SUBMITTED)
    try:
        from apps.ai.indexing import index_work_for_assistant

        index_work_for_assistant(work)
    except Exception:
        pass
    return work


def _audit(action, actor, work, comment="", status=""):
    try:
        from apps.audit.services import log_event

        log_event(
            action, actor=actor, module="works", institution=work.institution,
            object_status=status or work.status, comment=f"{work.reference_code or work.id} · {comment}",
        )
    except Exception:
        pass


def _log_event(work, from_status, to_status, event_type, actor, comment=""):
    """Journalise une transition (app validation, import paresseux)."""
    try:
        from apps.validation.models import WorkflowEvent

        WorkflowEvent.objects.create(
            work=work, from_status=from_status, to_status=to_status,
            event_type=event_type, actor=actor, comment=comment,
        )
    except Exception:  # ne bloque jamais la transition pour un souci d'audit
        pass
