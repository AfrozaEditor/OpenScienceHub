"""Transitions métier du cycle scientifique."""

from __future__ import annotations

from datetime import datetime

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.documents.models import VersionStatus
from apps.validation.models import (
    AssignmentStatus,
    CorrectionRequest,
    CorrectionStatus,
    Decision,
    DecisionType,
    ValidationAssignment,
    WorkflowEvent,
    WorkflowEventType,
)
from apps.works.models import ScientificWork, WorkStatus, WorkType

from .policies import ensure_can_assign, ensure_can_archive, ensure_can_decide

SUBMITTABLE = {WorkStatus.BROUILLON, WorkStatus.CORRECTION_DEMANDEE, WorkStatus.RE_SOUMIS}
VALIDATED_FOR_ARCHIVABLE = {
    WorkStatus.VALIDE,
    WorkStatus.VALIDE_APRES_SOUTENANCE,
    WorkStatus.ACCEPTED,
    WorkStatus.PUBLISHED,
    WorkStatus.DEPOT_FINAL_ACCEPTE,
}


def generate_reference_code(work: ScientificWork) -> str:
    inst = (work.institution.short_name or work.institution.name)[:6].upper().replace(" ", "")
    dept = (work.department.code or work.department.name)[:4].upper().replace(" ", "") if work.department else "GEN"
    year = (work.academic_year or str(datetime.now().year))[:4]
    seq = ScientificWork.objects.filter(institution=work.institution).count() + 1
    return f"OSH-{inst}-{dept}-{year}-{seq:04d}"


def _event(work, previous, current, event_type, actor, comment="") -> None:
    WorkflowEvent.objects.create(
        work=work,
        from_status=previous or "",
        to_status=current,
        event_type=event_type,
        actor=actor,
        comment=comment,
    )
    try:
        from apps.audit.services import log_event

        log_event(
            "WORKFLOW_CHANGED",
            actor=actor,
            module="workflow",
            institution=work.institution,
            object_status=current,
            severity="IMPORTANT",
            comment=f"{work.reference_code or work.id} · {event_type} · {comment}",
        )
    except Exception:
        pass


def _transition(work: ScientificWork, status: str, event_type: str, actor, comment="") -> ScientificWork:
    previous = work.status
    if previous == status:
        _event(work, previous, status, event_type, actor, comment)
        return work
    work.status = status
    if status == WorkStatus.SOUMIS:
        work.submitted_at = timezone.now()
    work.save(update_fields=["status", "submitted_at", "updated_at"])
    _event(work, previous, status, event_type, actor, comment)
    return work


@transaction.atomic
def submit_work(work: ScientificWork, actor) -> ScientificWork:
    if work.status not in SUBMITTABLE:
        raise ValidationError(f"Le dossier ne peut pas être soumis depuis le statut {work.status}.")
    if not work.contributors.exists():
        raise ValidationError("Le dossier doit avoir au moins un contributeur (auteur).")
    if not work.documents.exists():
        raise ValidationError("Le dossier doit avoir au moins une version de document (PDF).")
    if not work.reference_code:
        work.reference_code = generate_reference_code(work)
        work.save(update_fields=["reference_code", "updated_at"])
    _transition(work, WorkStatus.SOUMIS, WorkflowEventType.SUBMISSION, actor, "Soumission officielle")
    try:
        from apps.ai.indexing import index_work_for_assistant

        index_work_for_assistant(work)
    except Exception:
        pass
    return work


@transaction.atomic
def assign_reviewer(work: ScientificWork, actor, *, assignee, assignment_type: str, due_at=None) -> ValidationAssignment:
    ensure_can_assign(work, actor)
    assignment = ValidationAssignment.objects.create(
        work=work,
        assignment_type=assignment_type,
        assignee=assignee,
        due_at=due_at,
        status=AssignmentStatus.PENDING,
    )
    next_status = WorkStatus.EN_EXPERTISE if work.type == WorkType.THESE else WorkStatus.EN_INSTRUCTION
    if work.type == WorkType.ARTICLE:
        next_status = WorkStatus.UNDER_REVIEW
    if work.status == WorkStatus.SOUMIS:
        _transition(work, next_status, WorkflowEventType.ASSIGNMENT, actor, "Affectation")
    else:
        _event(work, work.status, work.status, WorkflowEventType.ASSIGNMENT, actor, "Affectation")
    return assignment


@transaction.atomic
def request_correction(work: ScientificWork, actor, *, message: str, type: str = "METADATA", priority: str = "NORMAL") -> CorrectionRequest:
    ensure_can_decide(work, actor)
    correction = CorrectionRequest.objects.create(
        work=work,
        type=type,
        message=message,
        priority=priority,
        requested_by=actor,
    )
    _transition(work, WorkStatus.CORRECTION_DEMANDEE, WorkflowEventType.CORRECTION, actor, message)
    return correction


@transaction.atomic
def answer_correction(correction: CorrectionRequest, actor) -> CorrectionRequest:
    if correction.work.created_by_id != actor.id and not actor.is_superuser:
        raise ValidationError("Seul le déposant peut répondre à cette correction.")
    correction.status = CorrectionStatus.ANSWERED
    correction.resolved_at = timezone.now()
    correction.save(update_fields=["status", "resolved_at", "updated_at"])
    _transition(correction.work, WorkStatus.RE_SOUMIS, WorkflowEventType.CORRECTION, actor, "Correction traitée")
    return correction


def _decision_target(work: ScientificWork, decision_type: str) -> str | None:
    if decision_type == DecisionType.REQUEST_CORRECTION:
        return WorkStatus.CORRECTION_DEMANDEE
    if decision_type in (DecisionType.REQUEST_MINOR_REVISION, DecisionType.REQUEST_MAJOR_REVISION):
        return WorkStatus.REVISION_REQUESTED if work.type == WorkType.ARTICLE else WorkStatus.CORRECTION_DEMANDEE
    if decision_type == DecisionType.AUTHORIZE_DEFENSE:
        return WorkStatus.SOUTENANCE_AUTORISEE if work.type == WorkType.THESE else WorkStatus.AUTORISE_SOUTENANCE
    if decision_type == DecisionType.RECORD_DEFENSE_PASSED:
        return WorkStatus.SOUTENU
    if decision_type == DecisionType.VALIDATE_AFTER_DEFENSE:
        return WorkStatus.VALIDE_APRES_SOUTENANCE
    if decision_type == DecisionType.ACCEPT_ARTICLE:
        return WorkStatus.ACCEPTED
    if decision_type == DecisionType.PUBLISH_ARTICLE:
        return WorkStatus.PUBLISHED
    if decision_type == DecisionType.ACCEPT_FINAL_DEPOSIT:
        return WorkStatus.DEPOT_FINAL_ACCEPTE
    if decision_type == DecisionType.MARK_ARCHIVABLE:
        return WorkStatus.ARCHIVABLE
    if decision_type == DecisionType.ARCHIVE:
        return WorkStatus.ARCHIVABLE
    if decision_type == DecisionType.REJECT:
        return WorkStatus.REJETE
    return None


@transaction.atomic
def record_workflow_decision(
    work: ScientificWork,
    decision_type: str,
    actor,
    comment: str = "",
    document_version=None,
) -> Decision:
    ensure_can_decide(work, actor)
    decision = Decision.objects.create(
        work=work,
        decision_type=decision_type,
        comment=comment,
        decided_by=actor,
        document_version=document_version,
    )
    target = _decision_target(work, decision_type)
    if target:
        _transition(work, target, WorkflowEventType.DECISION, actor, comment)
    return decision


@transaction.atomic
def accept_final_deposit(work: ScientificWork, actor, document_version) -> ScientificWork:
    ensure_can_decide(work, actor)
    work.documents.exclude(pk=document_version.pk).filter(is_final=True).update(
        is_final=False,
        status=VersionStatus.REPLACED,
    )
    document_version.is_final = True
    document_version.status = VersionStatus.FINAL
    document_version.version_type = "FINAL_ARCHIVE"
    document_version.save(update_fields=["is_final", "status", "version_type", "updated_at"])
    return _transition(
        work,
        WorkStatus.DEPOT_FINAL_ACCEPTE,
        WorkflowEventType.DECISION,
        actor,
        "Dépôt final accepté",
    )


@transaction.atomic
def mark_archivable(work: ScientificWork, actor, comment: str = "") -> ScientificWork:
    ensure_can_decide(work, actor)
    if work.status not in VALIDATED_FOR_ARCHIVABLE:
        raise ValidationError(f"Le dossier ne peut pas devenir archivable depuis {work.status}.")
    return _transition(work, WorkStatus.ARCHIVABLE, WorkflowEventType.DECISION, actor, comment)


def ensure_archive_allowed(work: ScientificWork, actor) -> None:
    ensure_can_archive(work, actor)
    if work.status not in (WorkStatus.ARCHIVABLE, WorkStatus.DEPOT_FINAL_ACCEPTE):
        raise ValidationError(f"Le dossier doit être archivable avant archivage (statut actuel : {work.status}).")
    final = work.documents.filter(is_final=True, status=VersionStatus.FINAL).first()
    if not final:
        raise ValidationError("Sélectionnez une version finale avant archivage.")
    if not final.sha256_hash:
        raise ValidationError("La version finale doit avoir un hash SHA-256.")
