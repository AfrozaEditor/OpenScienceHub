from rest_framework import serializers

from .models import AcademicProgram, Department, Faculty, Institution


class AcademicProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicProgram
        fields = ["id", "department", "name", "level", "code", "status"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ["id", "faculty", "name", "code", "head_name", "email", "status"]


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ["id", "institution", "name", "code", "dean_name", "email", "status"]


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = [
            "id", "name", "short_name", "type", "country", "city",
            "official_email", "website_url", "logo_url", "status",
        ]
