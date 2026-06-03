from django.contrib import admin

from .models import DocumentType, Workflow, WorkflowStep, WorkflowTransition

admin.site.register(DocumentType)
admin.site.register(Workflow)
admin.site.register(WorkflowStep)
admin.site.register(WorkflowTransition)
