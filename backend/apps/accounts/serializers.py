from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers

from apps.institutions.models import Institution, StructureStatus

from .models import Permission, Role, RoleCode, ScopeType, UserRoleAssignment
from .services import ensure_system_roles, get_user_capabilities

User = get_user_model()

PLATFORM_ROLE_CODES = {
    RoleCode.SUPER_ADMIN,
    RoleCode.TECHNICAL_ADMIN,
    RoleCode.AUDIT_MANAGER,
}


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    institution = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.filter(status=StructureStatus.ACTIVE),
        required=True,
        allow_null=False,
        error_messages={
            "required": "Sélectionnez votre université.",
            "null": "Sélectionnez votre université.",
            "does_not_exist": "Cette université n'est pas disponible.",
        },
    )

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "password", "institution", "preferred_language"]

    def create(self, validated_data):
        ensure_system_roles()
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        deposant_role, _ = Role.objects.get_or_create(
            code=RoleCode.DEPOSANT,
            defaults={"label": RoleCode.DEPOSANT.label},
        )
        UserRoleAssignment.objects.get_or_create(
            user=user,
            role=deposant_role,
            scope_type=ScopeType.INSTITUTION,
            scope_id=user.institution_id,
        )
        return user


class RoleAssignmentSerializer(serializers.ModelSerializer):
    role_code = serializers.CharField(source="role.code", read_only=True)
    role_label = serializers.CharField(source="role.label", read_only=True)

    class Meta:
        model = UserRoleAssignment
        fields = ["id", "role", "role_code", "role_label", "scope_type", "scope_id", "assigned_at"]


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    capabilities = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "phone", "status", "institution",
            "academic_identifier", "orcid", "preferred_language",
            "is_staff", "is_superuser", "roles", "capabilities", "created_at",
        ]
        read_only_fields = ["status", "is_staff", "is_superuser", "created_at"]

    def get_roles(self, obj):
        return RoleAssignmentSerializer(obj.role_assignments.all(), many=True).data

    def get_capabilities(self, obj):
        return get_user_capabilities(obj)


class AdminUserSerializer(UserSerializer):
    password = serializers.CharField(write_only=True, min_length=8, required=False, allow_blank=False)
    role_code = serializers.ChoiceField(choices=RoleCode.choices, write_only=True, required=False)
    scope_type = serializers.ChoiceField(choices=ScopeType.choices, write_only=True, required=False)
    scope_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    institution = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.filter(status=StructureStatus.ACTIVE),
        required=False,
        allow_null=True,
    )

    class Meta(UserSerializer.Meta):
        fields = [
            "id", "email", "full_name", "password", "phone", "status", "institution",
            "academic_identifier", "orcid", "preferred_language",
            "is_staff", "is_superuser", "role_code", "scope_type", "scope_id",
            "roles", "capabilities", "created_at",
        ]
        read_only_fields = ["is_staff", "is_superuser", "created_at"]

    def _actor_capabilities(self):
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            raise PermissionDenied("Authentification requise.")
        capabilities = get_user_capabilities(request.user)
        if not (capabilities["is_platform_admin"] or capabilities["is_institution_admin"]):
            raise PermissionDenied("Accès réservé aux administrateurs.")
        return request.user, capabilities

    def _existing_role_codes(self) -> set[str]:
        if not self.instance:
            return set()
        return set(self.instance.role_assignments.values_list("role__code", flat=True))

    def validate(self, attrs):
        actor, capabilities = self._actor_capabilities()
        role_code = attrs.get("role_code")
        if self.instance is None and not role_code:
            role_code = RoleCode.DEPOSANT
            attrs["role_code"] = role_code

        target_institution = attrs.get(
            "institution",
            self.instance.institution if self.instance else None,
        )

        if not capabilities["is_platform_admin"]:
            if not actor.institution_id:
                raise serializers.ValidationError(
                    {"institution": "Votre compte administrateur n'est rattaché à aucune institution."}
                )
            if target_institution and target_institution.id != actor.institution_id:
                raise serializers.ValidationError(
                    {"institution": "Vous ne pouvez administrer que votre institution."}
                )
            attrs["institution"] = actor.institution
            target_institution = actor.institution

        existing_codes = self._existing_role_codes()
        target_has_platform_role = bool(existing_codes & PLATFORM_ROLE_CODES)

        if role_code:
            role_code = str(role_code)
            is_platform_role = role_code in PLATFORM_ROLE_CODES
            if is_platform_role:
                if not capabilities["is_platform_admin"]:
                    raise serializers.ValidationError(
                        {"role_code": "Seul un administrateur plateforme peut attribuer un rôle global."}
                    )
                attrs["scope_type"] = ScopeType.PLATFORM
                attrs["scope_id"] = None
                target_has_platform_role = True
            else:
                if not target_institution:
                    raise serializers.ValidationError(
                        {"institution": "Une institution est obligatoire pour ce rôle."}
                    )
                scope_type = attrs.get("scope_type") or ScopeType.INSTITUTION
                if scope_type == ScopeType.PLATFORM:
                    raise serializers.ValidationError(
                        {"scope_type": "Un rôle institutionnel ne peut pas être attribué au périmètre plateforme."}
                    )
                if scope_type == ScopeType.INSTITUTION:
                    scope_id = attrs.get("scope_id") or target_institution.id
                    if scope_id != target_institution.id:
                        raise serializers.ValidationError(
                            {"scope_id": "Le périmètre institution doit correspondre à l'institution du compte."}
                        )
                    attrs["scope_id"] = scope_id
                elif not attrs.get("scope_id"):
                    raise serializers.ValidationError(
                        {"scope_id": "Un identifiant de périmètre est requis pour ce rôle."}
                    )
                attrs["scope_type"] = scope_type

        if target_institution is None and not target_has_platform_role:
            raise serializers.ValidationError(
                {"institution": "Une institution est obligatoire sauf pour un rôle plateforme."}
            )
        return attrs

    def _assign_role(self, user, validated_data):
        role_code = validated_data.pop("role_code", None)
        scope_type = validated_data.pop("scope_type", None)
        scope_id = validated_data.pop("scope_id", None)
        if not role_code:
            return None
        ensure_system_roles()
        role = Role.objects.get(code=role_code)
        assignment, _ = UserRoleAssignment.objects.get_or_create(
            user=user,
            role=role,
            scope_type=scope_type or ScopeType.INSTITUTION,
            scope_id=scope_id,
        )
        return assignment

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        role_data = {
            "role_code": validated_data.pop("role_code", None),
            "scope_type": validated_data.pop("scope_type", None),
            "scope_id": validated_data.pop("scope_id", None),
        }
        user = User(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save()
        self._assign_role(user, role_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        role_data = {
            "role_code": validated_data.pop("role_code", None),
            "scope_type": validated_data.pop("scope_type", None),
            "scope_id": validated_data.pop("scope_id", None),
        }
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        self._assign_role(instance, role_data)
        return instance


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "code", "label", "scope", "is_system_role"]


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "code", "description"]


class AssignRoleSerializer(serializers.Serializer):
    role = serializers.UUIDField()
    scope_type = serializers.CharField(required=False, default="INSTITUTION")
    scope_id = serializers.UUIDField(required=False, allow_null=True)
