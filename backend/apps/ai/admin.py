from django.contrib import admin

from .models import AIAnswerCitation, AIModelConfig, AIQueryLog, MetadataExtraction


@admin.register(MetadataExtraction)
class MetadataExtractionAdmin(admin.ModelAdmin):
    list_display = ("document_version", "status", "confidence_score", "model_name", "created_at")
    list_filter = ("status",)


@admin.register(AIQueryLog)
class AIQueryLogAdmin(admin.ModelAdmin):
    list_display = ("question", "answer_status", "created_at")
    list_filter = ("answer_status",)


admin.site.register(AIModelConfig)
admin.site.register(AIAnswerCitation)
