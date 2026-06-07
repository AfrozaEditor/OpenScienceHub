from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import Role, RoleCode, ScopeType, UserRoleAssignment
from apps.accounts.services import ensure_system_roles

from .models import Institution, StructureStatus


class InstitutionGovernanceTests(TestCase):
    def setUp(self):
        ensure_system_roles()
        self.client = APIClient()
        self.institution = Institution.objects.create(
            name="Université Test",
            short_name="UT",
        )
        self.platform_admin = get_user_model().objects.create_superuser(
            email="platform@example.com",
            password="pass12345",
            full_name="Platform Admin",
        )
        self.institution_admin = get_user_model().objects.create_user(
            email="inst-admin@example.com",
            password="pass12345",
            full_name="Institution Admin",
            institution=self.institution,
        )
        UserRoleAssignment.objects.create(
            user=self.institution_admin,
            role=Role.objects.get(code=RoleCode.INSTITUTION_ADMIN),
            scope_type=ScopeType.INSTITUTION,
            scope_id=self.institution.id,
        )

    def test_public_can_list_institutions_but_not_create(self):
        list_response = self.client.get("/api/v1/institutions")
        create_response = self.client.post(
            "/api/v1/institutions",
            {"name": "Blocked University", "short_name": "BU"},
            format="json",
        )

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(create_response.status_code, 401)

    def test_platform_admin_can_create_update_and_disable_institution(self):
        self.client.force_authenticate(self.platform_admin)

        create_response = self.client.post(
            "/api/v1/institutions",
            {
                "name": "Université Nouvelle",
                "short_name": "UN",
                "type": "PUBLIC_UNIVERSITY",
                "status": StructureStatus.ACTIVE,
            },
            format="json",
        )
        institution_id = create_response.data["id"]
        update_response = self.client.patch(
            f"/api/v1/institutions/{institution_id}",
            {"status": StructureStatus.DISABLED},
            format="json",
        )

        self.assertEqual(create_response.status_code, 201)
        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.data["status"], StructureStatus.DISABLED)

    def test_institution_admin_cannot_write_institutions(self):
        self.client.force_authenticate(self.institution_admin)

        create_response = self.client.post(
            "/api/v1/institutions",
            {"name": "Forbidden", "short_name": "FB"},
            format="json",
        )
        update_response = self.client.patch(
            f"/api/v1/institutions/{self.institution.id}",
            {"name": "Forbidden Rename"},
            format="json",
        )
        delete_response = self.client.delete(f"/api/v1/institutions/{self.institution.id}")

        self.assertEqual(create_response.status_code, 403)
        self.assertEqual(update_response.status_code, 403)
        self.assertEqual(delete_response.status_code, 403)
        self.institution.refresh_from_db()
        self.assertEqual(self.institution.name, "Université Test")
