from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.institutions.models import Department, Faculty, Institution

from .models import Role, RoleCode, ScopeType, UserRoleAssignment
from .services import ensure_system_roles, get_user_capabilities, user_has_role


class RoleCapabilityTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.other_institution = Institution.objects.create(name="Université Autre", short_name="UA")
        self.faculty = Faculty.objects.create(institution=self.institution, name="Sciences")
        self.department = Department.objects.create(faculty=self.faculty, name="Informatique")
        ensure_system_roles()
        self.user = get_user_model().objects.create_user(
            email="mission@example.com",
            password="pass12345",
            full_name="Mission User",
            institution=self.institution,
        )

    def assign(self, code, scope_type=ScopeType.INSTITUTION, scope_id=None):
        return UserRoleAssignment.objects.create(
            user=self.user,
            role=Role.objects.get(code=code),
            scope_type=scope_type,
            scope_id=scope_id or self.institution.id,
        )

    def test_system_roles_include_production_missions(self):
        expected = {
            RoleCode.DEPOSANT,
            RoleCode.SUPERVISOR,
            RoleCode.THESIS_DIRECTOR,
            RoleCode.RAPPORTEUR,
            RoleCode.REVIEWER,
            RoleCode.DEPARTMENT_HEAD,
            RoleCode.SCIENTIFIC_COMMITTEE,
            RoleCode.DOCTORAL_SCHOOL,
            RoleCode.ARCHIVIST,
            RoleCode.INSTITUTION_ADMIN,
            RoleCode.SUPER_ADMIN,
            RoleCode.TECHNICAL_ADMIN,
            RoleCode.AUDIT_MANAGER,
        }
        self.assertTrue(expected.issubset(set(Role.objects.values_list("code", flat=True))))

    def test_user_can_have_multiple_scoped_missions(self):
        self.assign(RoleCode.DEPOSANT)
        self.assign(RoleCode.REVIEWER, ScopeType.DEPARTMENT, self.department.id)

        capabilities = get_user_capabilities(self.user)

        self.assertTrue(user_has_role(self.user, RoleCode.DEPOSANT))
        self.assertTrue(user_has_role(self.user, RoleCode.REVIEWER, scope_id=self.department.id))
        self.assertIn("deposant", capabilities["portals"])
        self.assertIn("validation", capabilities["portals"])
        self.assertEqual(capabilities["default_portal"], "validation")

    def test_institution_admin_is_limited_to_own_institution(self):
        self.assign(RoleCode.INSTITUTION_ADMIN, ScopeType.INSTITUTION, self.institution.id)

        capabilities = get_user_capabilities(self.user)

        self.assertIn("admin", capabilities["portals"])
        self.assertFalse(capabilities["is_platform_admin"])
        self.assertIn(str(self.institution.id), capabilities["institution_scope_ids"])
        self.assertNotIn(str(self.other_institution.id), capabilities["institution_scope_ids"])

    def test_django_superuser_is_platform_admin(self):
        admin = get_user_model().objects.create_superuser(
            email="platform@example.com",
            password="pass12345",
            full_name="Platform Admin",
        )

        capabilities = get_user_capabilities(admin)

        self.assertTrue(capabilities["is_platform_admin"])
        self.assertEqual(capabilities["default_portal"], "admin")

    def test_staff_flag_alone_is_not_platform_admin(self):
        staff_user = get_user_model().objects.create_user(
            email="staff-only@example.com",
            password="pass12345",
            full_name="Staff Only",
            is_staff=True,
        )

        capabilities = get_user_capabilities(staff_user)

        self.assertFalse(capabilities["is_platform_admin"])
        self.assertNotIn(RoleCode.SUPER_ADMIN, capabilities["roles"])


class AdminUserApiGovernanceTests(TestCase):
    def setUp(self):
        ensure_system_roles()
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.other_institution = Institution.objects.create(name="Université Autre", short_name="UA")
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
        self.client = APIClient()

    def test_non_admin_cannot_create_user(self):
        deposant = get_user_model().objects.create_user(
            email="deposant@example.com",
            password="pass12345",
            full_name="Deposant",
            institution=self.institution,
        )
        self.client.force_authenticate(deposant)

        response = self.client.post(
            "/api/v1/accounts/users",
            {"email": "new@example.com", "full_name": "New User", "password": "pass12345"},
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_staff_flag_alone_cannot_access_admin_users(self):
        staff_user = get_user_model().objects.create_user(
            email="staff-only@example.com",
            password="pass12345",
            full_name="Staff Only",
            is_staff=True,
        )
        self.client.force_authenticate(staff_user)

        response = self.client.get("/api/v1/accounts/users")

        self.assertEqual(response.status_code, 403)

    def test_platform_admin_requires_institution_for_institutional_role(self):
        self.client.force_authenticate(self.platform_admin)

        response = self.client.post(
            "/api/v1/accounts/users",
            {
                "email": "new@example.com",
                "full_name": "New User",
                "password": "pass12345",
                "role_code": RoleCode.DEPOSANT,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("institution", response.data)

    def test_admin_user_creation_requires_explicit_initial_role(self):
        self.client.force_authenticate(self.platform_admin)

        response = self.client.post(
            "/api/v1/accounts/users",
            {
                "email": "no-role@example.com",
                "full_name": "No Role",
                "password": "pass12345",
                "institution": str(self.institution.id),
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("role_code", response.data)

    def test_institution_admin_cannot_create_outside_institution_or_global_role(self):
        self.client.force_authenticate(self.institution_admin)

        outside = self.client.post(
            "/api/v1/accounts/users",
            {
                "email": "outside@example.com",
                "full_name": "Outside User",
                "password": "pass12345",
                "institution": str(self.other_institution.id),
            },
            format="json",
        )
        global_role = self.client.post(
            "/api/v1/accounts/users",
            {
                "email": "super@example.com",
                "full_name": "Super User",
                "password": "pass12345",
                "role_code": RoleCode.SUPER_ADMIN,
            },
            format="json",
        )

        self.assertEqual(outside.status_code, 400)
        self.assertEqual(global_role.status_code, 400)

    def test_institution_admin_creates_user_in_own_scope_with_hashed_password(self):
        self.client.force_authenticate(self.institution_admin)

        response = self.client.post(
            "/api/v1/accounts/users",
            {
                "email": "scoped@example.com",
                "full_name": "Scoped User",
                "password": "pass12345",
                "role_code": RoleCode.VALIDATOR,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        user = get_user_model().objects.get(email="scoped@example.com")
        self.assertEqual(user.institution_id, self.institution.id)
        self.assertTrue(user.check_password("pass12345"))
        self.assertTrue(
            UserRoleAssignment.objects.filter(
                user=user,
                role__code=RoleCode.VALIDATOR,
                scope_type=ScopeType.INSTITUTION,
                scope_id=self.institution.id,
            ).exists()
        )

    def test_institution_admin_patch_is_scoped_and_cannot_move_user(self):
        own_user = get_user_model().objects.create_user(
            email="own-user@example.com",
            password="pass12345",
            full_name="Own User",
            institution=self.institution,
        )
        outside_user = get_user_model().objects.create_user(
            email="outside-user@example.com",
            password="pass12345",
            full_name="Outside User",
            institution=self.other_institution,
        )
        self.client.force_authenticate(self.institution_admin)

        outside_response = self.client.patch(
            f"/api/v1/accounts/users/{outside_user.id}",
            {"full_name": "Outside Updated"},
            format="json",
        )
        own_response = self.client.patch(
            f"/api/v1/accounts/users/{own_user.id}",
            {"full_name": "Own Updated"},
            format="json",
        )
        move_response = self.client.patch(
            f"/api/v1/accounts/users/{own_user.id}",
            {"institution": str(self.other_institution.id)},
            format="json",
        )

        self.assertEqual(outside_response.status_code, 404)
        self.assertEqual(own_response.status_code, 200)
        self.assertEqual(move_response.status_code, 400)
        own_user.refresh_from_db()
        outside_user.refresh_from_db()
        self.assertEqual(own_user.full_name, "Own Updated")
        self.assertEqual(own_user.institution_id, self.institution.id)
        self.assertEqual(outside_user.full_name, "Outside User")

    def test_institution_admin_delete_is_scoped_to_own_institution(self):
        own_user = get_user_model().objects.create_user(
            email="own-delete@example.com",
            password="pass12345",
            full_name="Own Delete",
            institution=self.institution,
        )
        outside_user = get_user_model().objects.create_user(
            email="outside-delete@example.com",
            password="pass12345",
            full_name="Outside Delete",
            institution=self.other_institution,
        )
        self.client.force_authenticate(self.institution_admin)

        outside_response = self.client.delete(f"/api/v1/accounts/users/{outside_user.id}")
        own_response = self.client.delete(f"/api/v1/accounts/users/{own_user.id}")

        self.assertEqual(outside_response.status_code, 404)
        self.assertEqual(own_response.status_code, 204)
        self.assertTrue(get_user_model().objects.filter(id=outside_user.id).exists())
        self.assertFalse(get_user_model().objects.filter(id=own_user.id).exists())

    def test_without_institution_endpoint_excludes_platform_superusers(self):
        self.client.force_authenticate(self.platform_admin)
        orphan = get_user_model().objects.create_user(
            email="orphan@example.com",
            password="pass12345",
            full_name="Orphan User",
        )
        get_user_model().objects.create_superuser(
            email="super-orphan@example.com",
            password="pass12345",
            full_name="Platform Super",
        )

        response = self.client.get("/api/v1/accounts/users/without-institution")

        self.assertEqual(response.status_code, 200)
        emails = {row["email"] for row in response.data["results"]}
        self.assertIn(orphan.email, emails)
        self.assertNotIn("super-orphan@example.com", emails)
