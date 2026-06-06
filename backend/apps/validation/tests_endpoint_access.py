from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import Role, RoleCode, ScopeType, UserRoleAssignment
from apps.accounts.services import ensure_system_roles
from apps.documents.models import DocumentVersion, VersionStatus
from apps.institutions.models import Faculty, Institution
from apps.works.models import ScientificWork, WorkStatus, WorkType


class ValidationAndDocumentEndpointAccessTests(TestCase):
    def setUp(self):
        ensure_system_roles()
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.other_institution = Institution.objects.create(name="Université Autre", short_name="UA")
        self.faculty = Faculty.objects.create(institution=self.institution, name="Sciences")
        self.other_faculty = Faculty.objects.create(institution=self.other_institution, name="Sciences")
        self.deposant = get_user_model().objects.create_user(
            email="deposant@example.com",
            password="pass12345",
            full_name="Déposant",
            institution=self.institution,
        )
        self.outsider = get_user_model().objects.create_user(
            email="outsider@example.com",
            password="pass12345",
            full_name="Hors périmètre",
            institution=self.other_institution,
        )
        self.validator = get_user_model().objects.create_user(
            email="validator@example.com",
            password="pass12345",
            full_name="Validateur",
            institution=self.institution,
        )
        self.other_validator = get_user_model().objects.create_user(
            email="other-validator@example.com",
            password="pass12345",
            full_name="Autre validateur",
            institution=self.other_institution,
        )
        self._assign(self.validator, RoleCode.VALIDATOR, self.institution.id)
        self._assign(self.other_validator, RoleCode.VALIDATOR, self.other_institution.id)
        self.work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Dossier périmètre",
            institution=self.institution,
            faculty=self.faculty,
            created_by=self.deposant,
            status=WorkStatus.SOUMIS,
        )
        self.version = DocumentVersion.objects.create(
            work=self.work,
            version_number=1,
            file=ContentFile(b"PDF", name="memoire.pdf"),
            file_name="memoire.pdf",
            sha256_hash="a" * 64,
            uploaded_by=self.deposant,
        )
        self.client = APIClient()

    def _assign(self, user, role_code, scope_id):
        UserRoleAssignment.objects.create(
            user=user,
            role=Role.objects.get(code=role_code),
            scope_type=ScopeType.INSTITUTION,
            scope_id=scope_id,
        )

    def test_document_list_and_detail_are_scoped_to_accessible_work(self):
        self.client.force_authenticate(self.outsider)

        list_response = self.client.get(f"/api/v1/works/{self.work.id}/documents")
        detail_response = self.client.get(f"/api/v1/documents/{self.version.id}")

        self.assertEqual(list_response.status_code, 403)
        self.assertEqual(detail_response.status_code, 403)

    def test_set_final_requires_validation_role_in_matching_scope(self):
        self.client.force_authenticate(self.deposant)
        deposant_response = self.client.post(f"/api/v1/documents/{self.version.id}/set-final")

        self.client.force_authenticate(self.validator)
        validator_response = self.client.post(f"/api/v1/documents/{self.version.id}/set-final")

        self.assertEqual(deposant_response.status_code, 403)
        self.assertEqual(validator_response.status_code, 200)
        self.version.refresh_from_db()
        self.assertTrue(self.version.is_final)
        self.assertEqual(self.version.status, VersionStatus.FINAL)

    def test_validation_endpoints_reject_out_of_scope_validator(self):
        self.client.force_authenticate(self.other_validator)

        checks = [
            ("get", f"/api/v1/works/{self.work.id}/reviews", None),
            ("post", f"/api/v1/works/{self.work.id}/reviews", {"comment": "Avis", "recommendation": "ACCEPT"}),
            ("get", f"/api/v1/works/{self.work.id}/corrections", None),
            ("post", f"/api/v1/works/{self.work.id}/corrections", {"message": "Corriger", "type": "METADATA"}),
            ("get", f"/api/v1/works/{self.work.id}/defense", None),
            ("post", f"/api/v1/works/{self.work.id}/metadata/validate", {}),
        ]

        for method, url, payload in checks:
            with self.subTest(method=method, url=url):
                response = getattr(self.client, method)(url, payload or {}, format="json")
                self.assertEqual(response.status_code, 403)
