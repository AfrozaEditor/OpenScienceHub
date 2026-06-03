from django.contrib import admin

from .models import ArchiveRecord


@admin.register(ArchiveRecord)
class ArchiveRecordAdmin(admin.ModelAdmin):
    list_display = ("public_slug", "work", "access_level", "is_download_allowed", "archived_at")
    search_fields = ("public_slug", "work__title")
