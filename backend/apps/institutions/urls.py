from rest_framework.routers import DefaultRouter

from .views import (
    AcademicProgramViewSet,
    DepartmentViewSet,
    FacultyViewSet,
    InstitutionViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register("institutions", InstitutionViewSet, basename="institution")
router.register("faculties", FacultyViewSet, basename="faculty")
router.register("departments", DepartmentViewSet, basename="department")
router.register("programs", AcademicProgramViewSet, basename="program")

urlpatterns = router.urls
