from django.contrib import admin

from .models import AcademicProgram, Department, Faculty, Institution


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ("name", "short_name", "type", "city", "status")
    search_fields = ("name", "short_name")


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ("name", "institution", "code", "status")


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "faculty", "code", "status")


@admin.register(AcademicProgram)
class AcademicProgramAdmin(admin.ModelAdmin):
    list_display = ("name", "department", "level", "status")
