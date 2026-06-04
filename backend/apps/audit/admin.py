from django.contrib import admin

from .models import AuditEvent


@admin.register(AuditEvent)
class AuditEventAdmin(admin.ModelAdmin):
    list_display = ("action_type", "actor", "module", "severity", "created_at")
    list_filter = ("action_type", "severity")
    search_fields = ("module", "comment")
    readonly_fields = [f.name for f in AuditEvent._meta.fields]
