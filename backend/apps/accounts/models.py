"""Identité, rôles et permissions (RBAC par périmètre)."""
import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

from apps.common.models import TimeStampedModel


class UserStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Actif"
    SUSPENDED = "SUSPENDED", "Suspendu"
    PENDING = "PENDING", "En attente"


class RoleScope(models.TextChoices):
    GLOBAL = "GLOBAL", "Globale"
    INSTITUTION = "INSTITUTION", "Institution"
    DEPARTMENT = "DEPARTMENT", "Département"
    WORK = "WORK", "Dossier"


class ScopeType(models.TextChoices):
    PLATFORM = "PLATFORM", "Plateforme"
    INSTITUTION = "INSTITUTION", "Institution"
    FACULTY = "FACULTY", "Faculté"
    DEPARTMENT = "DEPARTMENT", "Département"
    PROGRAM = "PROGRAM", "Programme"
    WORKFLOW = "WORKFLOW", "Workflow"
    SCIENTIFIC_WORK = "SCIENTIFIC_WORK", "Dossier scientifique"


class RoleCode(models.TextChoices):
    DEPOSANT = "DEPOSANT", "Déposant"
    SUPERVISOR = "SUPERVISOR", "Encadreur"
    THESIS_DIRECTOR = "THESIS_DIRECTOR", "Directeur de thèse"
    RAPPORTEUR = "RAPPORTEUR", "Rapporteur"
    REVIEWER = "REVIEWER", "Reviewer"
    DEPARTMENT_HEAD = "DEPARTMENT_HEAD", "Chef de département"
    SCIENTIFIC_COMMITTEE = "SCIENTIFIC_COMMITTEE", "Comité scientifique"
    DOCTORAL_SCHOOL = "DOCTORAL_SCHOOL", "École doctorale"
    VALIDATOR = "VALIDATOR", "Validateur"
    ARCHIVIST = "ARCHIVIST", "Archiviste"
    INSTITUTION_ADMIN = "INSTITUTION_ADMIN", "Administrateur institutionnel"
    SUPER_ADMIN = "SUPER_ADMIN", "Super administrateur"
    TECHNICAL_ADMIN = "TECHNICAL_ADMIN", "Responsable SI / technique"
    AUDIT_MANAGER = "AUDIT_MANAGER", "Responsable audit / qualité"
    SCIENTIFIC_EDITOR = "SCIENTIFIC_EDITOR", "Éditeur scientifique"
    PUBLIC = "PUBLIC", "Public"


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("L'email est obligatoire.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("status", UserStatus.ACTIVE)
        if extra.get("is_staff") is not True:
            raise ValueError("Un superuser doit avoir is_staff=True.")
        if extra.get("is_superuser") is not True:
            raise ValueError("Un superuser doit avoir is_superuser=True.")
        return self.create_user(email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=40, blank=True)
    status = models.CharField(max_length=20, choices=UserStatus.choices, default=UserStatus.ACTIVE)
    institution = models.ForeignKey(
        "institutions.Institution", null=True, blank=True,
        on_delete=models.SET_NULL, related_name="users",
    )
    academic_identifier = models.CharField(max_length=120, blank=True)
    orcid = models.CharField(max_length=40, blank=True)
    preferred_language = models.CharField(max_length=10, default="fr")

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        ordering = ["full_name"]

    def __str__(self) -> str:
        return f"{self.full_name} <{self.email}>"


class Role(TimeStampedModel):
    code = models.CharField(max_length=50, unique=True, choices=RoleCode.choices)
    label = models.CharField(max_length=120)
    scope = models.CharField(max_length=20, choices=RoleScope.choices, default=RoleScope.INSTITUTION)
    is_system_role = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.code


class Permission(TimeStampedModel):
    code = models.CharField(max_length=80, unique=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self) -> str:
        return self.code


class RolePermission(TimeStampedModel):
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="role_permissions")
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name="permission_roles")
    granted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("role", "permission")


class UserRoleAssignment(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="role_assignments")
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="assignments")
    scope_type = models.CharField(max_length=30, choices=ScopeType.choices, default=ScopeType.INSTITUTION)
    scope_id = models.UUIDField(null=True, blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)
    valid_from = models.DateField(null=True, blank=True)
    valid_until = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "role", "scope_type", "scope_id")

    def __str__(self) -> str:
        return f"{self.user_id} · {self.role_id} · {self.scope_type}"
