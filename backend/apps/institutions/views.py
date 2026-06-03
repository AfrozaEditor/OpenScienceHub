from rest_framework import permissions, viewsets

from .models import AcademicProgram, Department, Faculty, Institution
from .serializers import (
    AcademicProgramSerializer,
    DepartmentSerializer,
    FacultySerializer,
    InstitutionSerializer,
)


class ReadOnlyOrAdmin(permissions.BasePermission):
    """Lecture publique, écriture réservée au staff."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class InstitutionViewSet(viewsets.ModelViewSet):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["type", "country", "status"]
    search_fields = ["name", "short_name", "city"]


class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["institution", "status"]


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["faculty", "status"]


class AcademicProgramViewSet(viewsets.ModelViewSet):
    queryset = AcademicProgram.objects.all()
    serializer_class = AcademicProgramSerializer
    permission_classes = [ReadOnlyOrAdmin]
    filterset_fields = ["department", "level", "status"]
