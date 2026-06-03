from django.contrib import admin

from .models import ScientificWork, WorkContributor


class ContributorInline(admin.TabularInline):
    model = WorkContributor
    extra = 0


@admin.register(ScientificWork)
class ScientificWorkAdmin(admin.ModelAdmin):
    list_display = ("reference_code", "title", "type", "status", "institution", "created_by")
    list_filter = ("type", "status", "visibility", "institution")
    search_fields = ("title", "reference_code")
    inlines = [ContributorInline]
