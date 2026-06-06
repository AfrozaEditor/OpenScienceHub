from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.institutions.models import Department, Faculty, Institution

from .models import ScientificWork, WorkType


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


class ScientificWorkContributorApiTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(name="Universite Test", short_name="UT")
        self.department = Department.objects.create(
            faculty=Faculty.objects.create(institution=self.institution, name="Faculte Test", code="FT"),
            name="Departement Test",
            code="DT",
        )
        self.user = get_user_model().objects.create_user(
            email="owner@example.com",
            password="pass12345",
            full_name="Owner",
            institution=self.institution,
        )
        self.work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Dossier contributeur",
            institution=self.institution,
            department=self.department,
            created_by=self.user,
        )
        self.client = APIClient()

    def test_owner_can_add_contributor_without_validation_assignment_relation(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            f"/api/v1/works/{self.work.id}/contributors",
            {"contributor_type": "AUTHOR", "display_name": "Auteur", "order_index": 0},
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["display_name"], "Auteur")
