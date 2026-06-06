"""Politiques de workflow : rôles, périmètres et invariants."""

from __future__ import annotations

from rest_framework.exceptions import PermissionDenied

from apps.accounts.models import RoleCode
from apps.accounts.services import ARCHIVE_ROLES, DECISION_ROLES, user_can_access_work, user_has_role


def ensure_not_own_decision(work, actor) -> None:
    if work.created_by_id == actor.id:
        raise PermissionDenied("Un déposant ne peut pas valider, rejeter ou archiver son propre dossier.")


def ensure_can_decide(work, actor) -> None:
    ensure_not_own_decision(work, actor)
    if actor.is_superuser or user_has_role(actor, RoleCode.SUPER_ADMIN):
        return
    if not user_can_access_work(actor, work, for_validation=True):
        raise PermissionDenied("Ce dossier est hors de votre périmètre de validation.")
    if not any(user_has_role(actor, role) for role in DECISION_ROLES):
        raise PermissionDenied("Votre rôle ne permet pas d'enregistrer cette décision.")


def ensure_can_archive(work, actor) -> None:
    ensure_not_own_decision(work, actor)
    if actor.is_superuser or user_has_role(actor, RoleCode.SUPER_ADMIN):
        return
    if not user_can_access_work(actor, work, for_validation=True):
        raise PermissionDenied("Ce dossier est hors de votre périmètre d'archivage.")
    if not any(user_has_role(actor, role) for role in ARCHIVE_ROLES):
        raise PermissionDenied("Votre rôle ne permet pas d'archiver ce dossier.")


def ensure_can_assign(work, actor) -> None:
    if actor.is_superuser or user_has_role(actor, RoleCode.SUPER_ADMIN):
        return
    if user_has_role(actor, RoleCode.INSTITUTION_ADMIN, scope_id=work.institution_id):
        return
    if user_has_role(actor, RoleCode.DEPARTMENT_HEAD, scope_id=work.department_id):
        return
    raise PermissionDenied("Votre rôle ne permet pas d'affecter ce dossier.")
