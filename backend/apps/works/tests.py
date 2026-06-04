from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.institutions.models import Department, Faculty, Institution

from .models import ScientificWork


class ScientificWorkReferenceCodeTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(
            name="Universite Test", short_name="UT"
        )
        self.faculty = Faculty.objects.create(
            institution=self.institution, name="Faculte Test", code="FT"
        )
        self.department = Department.objects.create(
            faculty=self.faculty, name="Departement Test", code="DT"
        )
        self.user = get_user_model().objects.create_user(
            email="drafts@example.com", password="pass12345"
        )

    def test_multiple_drafts_can_exist_without_reference_code(self):
        first = ScientificWork.objects.create(
            type="MEMOIRE",
            title="Premier brouillon",
            institution=self.institution,
            department=self.department,
            created_by=self.user,
        )
        second = ScientificWork.objects.create(
            type="MEMOIRE",
            title="Deuxieme brouillon",
            institution=self.institution,
            department=self.department,
            created_by=self.user,
        )

        self.assertIsNone(first.reference_code)
        self.assertIsNone(second.reference_code)
