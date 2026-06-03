"""Helper d'audit : journalise les actions sensibles (jamais bloquant)."""
from __future__ import annotations

from .models import AuditEvent, AuditSeverity


def log_event(
    action_type: str,
    *,
    actor=None,
    module: str = "",
    institution=None,
    old_value=None,
    new_value=None,
    severity: str = AuditSeverity.INFO,
    object_status: str = "",
    comment: str = "",
    ip_address=None,
) -> AuditEvent | None:
    try:
        actor_role = ""
        if actor is not None and getattr(actor, "is_authenticated", False):
            actor_role = "SUPER_ADMIN" if actor.is_superuser else ("STAFF" if actor.is_staff else "USER")
        return AuditEvent.objects.create(
            actor=actor if (actor and getattr(actor, "is_authenticated", False)) else None,
            actor_role=actor_role,
            institution=institution,
            action_type=action_type,
            module=module,
            old_value=old_value,
            new_value=new_value,
            severity=severity,
            object_status=object_status,
            comment=comment,
            ip_address=ip_address,
        )
    except Exception:
        # L'audit ne doit jamais casser une opération métier.
        return None
