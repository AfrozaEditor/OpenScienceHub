from django.contrib import admin

from .models import (
    CorrectionRequest,
    Decision,
    DefenseSession,
    Review,
    ValidationAssignment,
    WorkflowEvent,
)

admin.site.register(ValidationAssignment)
admin.site.register(Review)
admin.site.register(CorrectionRequest)
admin.site.register(DefenseSession)
admin.site.register(Decision)


@admin.register(WorkflowEvent)
class WorkflowEventAdmin(admin.ModelAdmin):
    list_display = ("work", "event_type", "from_status", "to_status", "actor", "created_at")
    list_filter = ("event_type",)
