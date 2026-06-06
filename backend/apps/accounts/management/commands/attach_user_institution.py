from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.accounts.models import Role, RoleCode, ScopeType, UserRoleAssignment
from apps.accounts.services import ensure_system_roles
from apps.institutions.models import Institution, StructureStatus


class Command(BaseCommand):
    help = "Liste ou rattache manuellement des comptes sans institution."

    def add_arguments(self, parser):
        parser.add_argument("--email", help="Email du compte à rattacher.")
        parser.add_argument("--institution-id", help="UUID de l'institution cible.")
        parser.add_argument(
            "--role-code",
            choices=RoleCode.values,
            help="Rôle institutionnel à attribuer explicitement pendant le rattachement.",
        )
        parser.add_argument(
            "--grant-deposant-if-empty",
            action="store_true",
            help="Attribue DEPOSANT si le compte n'a aucun rôle existant.",
        )
        parser.add_argument("--commit", action="store_true", help="Applique les changements. Sans ce flag: dry-run.")

    def handle(self, *args, **options):
        email = options.get("email")
        institution_id = options.get("institution_id")
        if not email and not institution_id:
            self._list_orphans()
            return
        if not email or not institution_id:
            raise CommandError("--email et --institution-id doivent être fournis ensemble.")

        User = get_user_model()
        try:
            user = User.objects.prefetch_related("role_assignments__role").get(email=email)
        except User.DoesNotExist as exc:
            raise CommandError(f"Compte introuvable: {email}") from exc
        try:
            institution = Institution.objects.get(id=institution_id, status=StructureStatus.ACTIVE)
        except Institution.DoesNotExist as exc:
            raise CommandError(f"Institution active introuvable: {institution_id}") from exc

        role_code = options.get("role_code")
        if options["grant_deposant_if_empty"] and not user.role_assignments.exists() and not role_code:
            role_code = RoleCode.DEPOSANT

        self._preview(user, institution, role_code, commit=options["commit"])
        if not options["commit"]:
            self.stdout.write(self.style.WARNING("Dry-run uniquement. Ajoutez --commit pour appliquer."))
            return

        with transaction.atomic():
            user.institution = institution
            user.save(update_fields=["institution", "updated_at"])
            if role_code:
                ensure_system_roles()
                role = Role.objects.get(code=role_code)
                if role.code in {RoleCode.SUPER_ADMIN, RoleCode.TECHNICAL_ADMIN, RoleCode.AUDIT_MANAGER}:
                    raise CommandError("Cette commande ne crée pas de rôle global.")
                UserRoleAssignment.objects.get_or_create(
                    user=user,
                    role=role,
                    scope_type=ScopeType.INSTITUTION,
                    scope_id=institution.id,
                )
        self.stdout.write(self.style.SUCCESS(f"Compte rattaché: {user.email} -> {institution.name}"))

    def _list_orphans(self):
        User = get_user_model()
        qs = (
            User.objects.filter(institution__isnull=True, is_active=True)
            .exclude(is_superuser=True)
            .prefetch_related("role_assignments__role")
            .order_by("email")
        )
        if not qs.exists():
            self.stdout.write(self.style.SUCCESS("Aucun compte actif sans institution."))
            return
        self.stdout.write("Comptes actifs sans institution:")
        for user in qs:
            roles = ", ".join(a.role.code for a in user.role_assignments.all()) or "-"
            self.stdout.write(f"- {user.email} | {user.full_name} | staff={user.is_staff} super={user.is_superuser} | rôles={roles}")

    def _preview(self, user, institution, role_code, *, commit):
        mode = "COMMIT" if commit else "DRY-RUN"
        roles = ", ".join(a.role.code for a in user.role_assignments.all()) or "-"
        self.stdout.write(f"[{mode}] {user.email}")
        self.stdout.write(f"  institution actuelle: {user.institution_id or '-'}")
        self.stdout.write(f"  institution cible: {institution.id} · {institution.name}")
        self.stdout.write(f"  rôles actuels: {roles}")
        self.stdout.write(f"  rôle ajouté: {role_code or '-'}")
