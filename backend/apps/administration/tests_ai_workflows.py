from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import RoleCode, ScopeType, UserRoleAssignment
from apps.accounts.services import ensure_system_roles
from apps.administration.models import Workflow
from apps.administration.services import apply_workflow_template
from apps.ai.models import AIPlatformSettings
from apps.ai.services import get_platform_settings, update_platform_settings
from apps.archive.models import ArchiveRecord
from apps.documents.models import DocumentVersion, VersionStatus, VersionType
from apps.institutions.models import Institution
from apps.ssi.models import ProofStatus, VerificationProof
from apps.works.models import ScientificWork, WorkStatus, WorkType


class AIPlatformSettingsTests(TestCase):
    def setUp(self):
        ensure_system_roles()
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.admin = get_user_model().objects.create_superuser(
            email="admin@example.com",
            password="pass12345",
            full_name="Admin",
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_default_settings_return_full_config(self):
        payload = get_platform_settings(self.admin, None)
        self.assertIn("config", payload)
        self.assertTrue(payload["config"]["services"]["metadata_extraction"])
        self.assertEqual(payload["config"]["extraction"]["confidence_threshold"], 75)

    def test_update_settings_persists_config(self):
        updated = update_platform_settings(
            self.admin,
            {"config": {"extraction": {"confidence_threshold": 82}}},
            None,
        )
        self.assertEqual(updated["config"]["extraction"]["confidence_threshold"], 82)
        row = AIPlatformSettings.objects.get(institution=None)
        self.assertEqual(row.config["extraction"]["confidence_threshold"], 82)

    def test_ai_settings_api_get_and_put(self):
        get_response = self.client.get("/api/v1/admin/ai-settings")
        self.assertEqual(get_response.status_code, 200)
        self.assertIn("config", get_response.data)
        self.assertIn("principle", get_response.data)

        put_response = self.client.put(
            "/api/v1/admin/ai-settings",
            {"config": {"services": {"public_assistant": False}}},
            format="json",
        )
        self.assertEqual(put_response.status_code, 200)
        self.assertFalse(put_response.data["config"]["services"]["public_assistant"])


class WorkflowTemplateTests(TestCase):
    def setUp(self):
        ensure_system_roles()
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.admin = get_user_model().objects.create_user(
            email="inst-admin@example.com",
            password="pass12345",
            full_name="Institution Admin",
            institution=self.institution,
        )
        from apps.accounts.models import Role

        UserRoleAssignment.objects.create(
            user=self.admin,
            role=Role.objects.get(code=RoleCode.INSTITUTION_ADMIN),
            scope_type=ScopeType.INSTITUTION,
            scope_id=self.institution.id,
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_apply_memoire_template_creates_steps_with_ai(self):
        workflow = apply_workflow_template("MEMOIRE", str(self.institution.id))
        self.assertEqual(workflow.document_type, "MEMOIRE")
        self.assertTrue(workflow.is_active)
        steps = list(workflow.steps.order_by("order"))
        self.assertGreaterEqual(len(steps), 10)
        ai_steps = [step for step in steps if step.responsible_role == "SYSTEM"]
        self.assertGreaterEqual(len(ai_steps), 2)

    def test_apply_template_api(self):
        response = self.client.post(
            "/api/v1/admin/workflows/apply-template",
            {"template": "ARTICLE"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["document_type"], "ARTICLE")
        self.assertTrue(
            Workflow.objects.filter(document_type="ARTICLE", institution_id=self.institution.id).exists()
        )

    def test_templates_list_api(self):
        response = self.client.get("/api/v1/admin/workflows/templates")
        self.assertEqual(response.status_code, 200)
        self.assertIn("MEMOIRE", response.data)
        self.assertIn("THESE", response.data)
        self.assertIn("ARTICLE", response.data)


class AdminProofListTests(TestCase):
    def setUp(self):
        ensure_system_roles()
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.admin = get_user_model().objects.create_superuser(
            email="admin-proofs@example.com",
            password="pass12345",
            full_name="Admin preuves",
        )
        self.deposant = get_user_model().objects.create_user(
            email="deposant-proof@example.com",
            password="pass12345",
            full_name="Déposant preuve",
            institution=self.institution,
        )
        self.work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Archive prouvée",
            institution=self.institution,
            created_by=self.deposant,
            status=WorkStatus.ARCHIVE,
        )
        self.version = DocumentVersion.objects.create(
            work=self.work,
            version_number=1,
            version_type=VersionType.FINAL_ARCHIVE,
            file="works/test/final.pdf",
            file_name="final.pdf",
            sha256_hash="c" * 64,
            is_final=True,
            status=VersionStatus.ARCHIVED,
            uploaded_by=self.deposant,
        )
        self.archive = ArchiveRecord.objects.create(
            work=self.work,
            document_version=self.version,
            document_hash=self.version.sha256_hash,
            public_slug="archive-prouvee",
        )
        self.proof = VerificationProof.objects.create(
            archive_record=self.archive,
            proof_code="OSH-VC-2026-ADMIN",
            document_hash=self.version.sha256_hash,
            verification_url="https://verify.example/OSH-VC-2026-ADMIN",
            status=ProofStatus.ACTIVE,
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_admin_proofs_returns_real_proof_rows_and_kpis(self):
        list_response = self.client.get("/api/v1/admin/proofs")
        dashboard_response = self.client.get("/api/v1/admin/dashboard")

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_response.data["count"], 1)
        row = list_response.data["results"][0]
        self.assertEqual(row["proof_code"], self.proof.proof_code)
        self.assertTrue(row["hashes_match"])
        self.assertEqual(row["work"]["title"], self.work.title)
        self.assertEqual(dashboard_response.status_code, 200)
        self.assertEqual(dashboard_response.data["kpis"]["proofs_total"], 1)
        self.assertEqual(dashboard_response.data["kpis"]["proof_hash_mismatches"], 0)
