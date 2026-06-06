from django.contrib import admin

from .models import Permission, Role, RolePermission, User, UserRoleAssignment


class UserRoleAssignmentInline(admin.TabularInline):
    model = UserRoleAssignment
    extra = 0
    fields = ("role", "scope_type", "scope_id", "valid_from", "valid_until")


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "status", "institution", "is_staff")
    list_filter = ("status", "is_staff", "is_superuser")
    search_fields = ("email", "full_name")
    inlines = [UserRoleAssignmentInline]


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("code", "label", "scope", "is_system_role")


admin.site.register(Permission)
admin.site.register(RolePermission)
admin.site.register(UserRoleAssignment)
