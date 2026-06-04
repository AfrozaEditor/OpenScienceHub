from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Permission, Role, UserRoleAssignment

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "password", "institution", "preferred_language"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class RoleAssignmentSerializer(serializers.ModelSerializer):
    role_code = serializers.CharField(source="role.code", read_only=True)

    class Meta:
        model = UserRoleAssignment
        fields = ["id", "role", "role_code", "scope_type", "scope_id", "assigned_at"]


class UserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "email", "full_name", "phone", "status", "institution",
            "academic_identifier", "orcid", "preferred_language",
            "is_staff", "is_superuser", "roles", "created_at",
        ]
        read_only_fields = ["status", "is_staff", "is_superuser", "created_at"]

    def get_roles(self, obj):
        return RoleAssignmentSerializer(obj.role_assignments.all(), many=True).data


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
