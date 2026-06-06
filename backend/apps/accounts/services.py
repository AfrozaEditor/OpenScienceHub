"""Services RBAC par mission et périmètre."""

from __future__ import annotations

from collections.abc import Iterable

from .models import Role, RoleCode, RoleScope, ScopeType, UserRoleAssignment


SYSTEM_ROLES: dict[str, tuple[str, str]] = {
    RoleCode.DEPOSANT: ("Déposant", RoleScope.INSTITUTION),
    RoleCode.SUPERVISOR: ("Encadreur", RoleScope.WORK),
    RoleCode.THESIS_DIRECTOR: ("Directeur de thèse", RoleScope.WORK),
    RoleCode.RAPPORTEUR: ("Rapporteur / Expert", RoleScope.WORK),
    RoleCode.REVIEWER: ("Reviewer", RoleScope.WORK),
    RoleCode.DEPARTMENT_HEAD: ("Chef de département", RoleScope.DEPARTMENT),
    RoleCode.SCIENTIFIC_COMMITTEE: ("Comité scientifique", RoleScope.INSTITUTION),
    RoleCode.DOCTORAL_SCHOOL: ("École doctorale", RoleScope.INSTITUTION),
    RoleCode.VALIDATOR: ("Validateur académique", RoleScope.INSTITUTION),
    RoleCode.ARCHIVIST: ("Archiviste / Bibliothécaire", RoleScope.INSTITUTION),
    RoleCode.INSTITUTION_ADMIN: ("Administrateur institutionnel", RoleScope.INSTITUTION),
    RoleCode.SUPER_ADMIN: ("Super administrateur", RoleScope.GLOBAL),
    RoleCode.TECHNICAL_ADMIN: ("Responsable SI / technique", RoleScope.GLOBAL),
    RoleCode.AUDIT_MANAGER: ("Responsable audit / qualité", RoleScope.GLOBAL),
    RoleCode.SCIENTIFIC_EDITOR: ("Éditeur scientifique", RoleScope.INSTITUTION),
    RoleCode.PUBLIC: ("Lecteur public", RoleScope.GLOBAL),
}

VALIDATION_ROLES = {
    RoleCode.SUPERVISOR,
    RoleCode.THESIS_DIRECTOR,
    RoleCode.RAPPORTEUR,
    RoleCode.REVIEWER,
    RoleCode.DEPARTMENT_HEAD,
    RoleCode.SCIENTIFIC_COMMITTEE,
    RoleCode.DOCTORAL_SCHOOL,
    RoleCode.VALIDATOR,
    RoleCode.ARCHIVIST,
    RoleCode.SCIENTIFIC_EDITOR,
}

ADMIN_ROLES = {
    RoleCode.INSTITUTION_ADMIN,
    RoleCode.SUPER_ADMIN,
    RoleCode.TECHNICAL_ADMIN,
    RoleCode.AUDIT_MANAGER,
}

DECISION_ROLES = {
    RoleCode.DEPARTMENT_HEAD,
    RoleCode.SCIENTIFIC_COMMITTEE,
    RoleCode.DOCTORAL_SCHOOL,
    RoleCode.VALIDATOR,
    RoleCode.SCIENTIFIC_EDITOR,
}

ARCHIVE_ROLES = {
    RoleCode.ARCHIVIST,
    RoleCode.INSTITUTION_ADMIN,
    RoleCode.SUPER_ADMIN,
}


def ensure_system_roles() -> None:
    """Crée/met à jour les rôles système de manière idempotente."""
    for code, (label, scope) in SYSTEM_ROLES.items():
        Role.objects.update_or_create(
            code=code,
            defaults={"label": label, "scope": scope, "is_system_role": True},
        )


def role_codes_for(user) -> set[str]:
    if not user or not getattr(user, "is_authenticated", False):
        return set()
    codes = set(user.role_assignments.values_list("role__code", flat=True))
    if user.is_superuser:
        codes.add(RoleCode.SUPER_ADMIN)
    return codes


def user_has_role(user, roles: str | Iterable[str], *, scope_id=None) -> bool:
    if isinstance(roles, str):
        roles = [roles]
    wanted = set(roles)
    if user.is_superuser:
        return bool(wanted & (ADMIN_ROLES | {RoleCode.SUPER_ADMIN}))
    qs = UserRoleAssignment.objects.filter(user=user, role__code__in=wanted)
    if scope_id is not None:
        qs = qs.filter(scope_id=scope_id)
    return qs.exists()


def get_user_capabilities(user) -> dict:
    codes = role_codes_for(user)
    is_platform_admin = bool(
        user.is_superuser or RoleCode.SUPER_ADMIN in codes
    )
    is_institution_admin = RoleCode.INSTITUTION_ADMIN in codes
    portals: list[str] = []
    if is_platform_admin or is_institution_admin or codes & ADMIN_ROLES:
        portals.append("admin")
    if codes & VALIDATION_ROLES:
        portals.append("validation")
    if RoleCode.DEPOSANT in codes and not is_platform_admin:
        portals.append("deposant")
    if not portals:
        portals.append("deposant")

    assignments = list(user.role_assignments.select_related("role"))
    institution_scope_ids = {
        str(a.scope_id)
        for a in assignments
        if a.scope_type == ScopeType.INSTITUTION and a.scope_id
    }
    department_scope_ids = {
        str(a.scope_id)
        for a in assignments
        if a.scope_type == ScopeType.DEPARTMENT and a.scope_id
    }
    work_scope_ids = {
        str(a.scope_id)
        for a in assignments
        if a.scope_type == ScopeType.SCIENTIFIC_WORK and a.scope_id
    }

    default_portal = (
        "admin" if "admin" in portals else "validation" if "validation" in portals else "deposant"
    )
    return {
        "roles": sorted(codes),
        "portals": portals,
        "default_portal": default_portal,
        "is_platform_admin": is_platform_admin,
        "is_institution_admin": is_institution_admin,
        "institution_scope_ids": sorted(institution_scope_ids),
        "department_scope_ids": sorted(department_scope_ids),
        "work_scope_ids": sorted(work_scope_ids),
        "can_archive": bool(is_platform_admin or codes & ARCHIVE_ROLES),
        "can_decide": bool(is_platform_admin or codes & DECISION_ROLES),
        "can_validate": bool(is_platform_admin or codes & VALIDATION_ROLES),
    }


def user_can_access_work(user, work, *, for_validation: bool = False) -> bool:
    if user.is_superuser:
        return True
    if work.created_by_id == user.id and not for_validation:
        return True
    codes = role_codes_for(user)
    assignments = UserRoleAssignment.objects.filter(user=user).select_related("role")
    for assignment in assignments:
        if assignment.role.code == RoleCode.DEPOSANT and not for_validation:
            continue
        if assignment.scope_type == ScopeType.SCIENTIFIC_WORK and assignment.scope_id == work.id:
            return True
        if assignment.scope_type == ScopeType.DEPARTMENT and assignment.scope_id == work.department_id:
            return True
        if assignment.scope_type == ScopeType.INSTITUTION and assignment.scope_id == work.institution_id:
            return True
    if for_validation and codes & VALIDATION_ROLES and work.assignments.filter(assignee=user).exists():
        return True
    return False
