from django.contrib import admin

from .models import DocumentVersion


@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ("work", "version_number", "version_type", "is_final", "sha256_hash")
    list_filter = ("version_type", "is_final")
    search_fields = ("work__title", "sha256_hash")
