"""Transitions liées à la validation (décisions)."""
from django.db import transaction

from apps.works.models import ScientificWork, WorkStatus

from .models import Decision, DecisionType, WorkflowEvent, WorkflowEventType

_DECISION_TO_STATUS = {
    DecisionType.REQUEST_CORRECTION: WorkStatus.CORRECTION_REQUESTED,
    DecisionType.VALIDATE_AFTER_DEFENSE: WorkStatus.VALIDATED,
    DecisionType.ACCEPT_ARTICLE: WorkStatus.VALIDATED,
    DecisionType.ARCHIVE: WorkStatus.VALIDATED,
    DecisionType.REJECT: WorkStatus.REJECTED,
}


@transaction.atomic
def record_decision(work: ScientificWork, decision_type: str, actor, comment: str = "", document_version=None) -> Decision:
    decision = Decision.objects.create(
        work=work, decision_type=decision_type, comment=comment,
        decided_by=actor, document_version=document_version,
    )
    new_status = _DECISION_TO_STATUS.get(decision_type)
    if new_status and work.status != new_status:
        previous = work.status
        work.status = new_status
        work.save(update_fields=["status", "updated_at"])
        WorkflowEvent.objects.create(
            work=work, from_status=previous, to_status=new_status,
            event_type=WorkflowEventType.DECISION, actor=actor, comment=comment,
        )
    try:
        from apps.audit.services import log_event

        log_event(
            "DECISION_RECORDED", actor=actor, module="validation",
            institution=work.institution, object_status=work.status,
            severity="SENSITIVE", comment=f"{decision_type} sur {work.reference_code or work.id}",
        )
    except Exception:
        pass
    return decision
