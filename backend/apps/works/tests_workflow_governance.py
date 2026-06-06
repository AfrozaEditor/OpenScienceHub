from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.test import TestCase
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.accounts.models import Role, RoleCode, ScopeType, UserRoleAssignment
from apps.accounts.services import ensure_system_roles
from apps.archive.models import ArchiveRecord
from apps.archive.services import archive_work
from apps.documents.models import DocumentVersion, VersionStatus
from apps.institutions.models import Department, Faculty, Institution
from apps.ssi.services import issue_proof_for_archive
from apps.validation.models import DecisionType, WorkflowEvent
from apps.workflow.services import mark_archivable, record_workflow_decision, submit_work

from .models import ScientificWork, WorkStatus, WorkType


class WorkflowGovernanceTests(TestCase):
    def setUp(self):
        ensure_system_roles()
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.faculty = Faculty.objects.create(institution=self.institution, name="Sciences")
        self.department = Department.objects.create(
            faculty=self.faculty,
            name="Informatique",
            code="INFO",
        )
        self.deposant = get_user_model().objects.create_user(
            email="deposant@example.com",
            password="pass12345",
            full_name="Déposant",
            institution=self.institution,
        )
        self.validator = get_user_model().objects.create_user(
            email="validator@example.com",
            password="pass12345",
            full_name="Validateur",
            institution=self.institution,
        )
        UserRoleAssignment.objects.create(
            user=self.validator,
            role=Role.objects.get(code=RoleCode.DEPARTMENT_HEAD),
            scope_type=ScopeType.DEPARTMENT,
            scope_id=self.department.id,
        )
        self.archivist = get_user_model().objects.create_user(
            email="archivist@example.com",
            password="pass12345",
            full_name="Archiviste",
            institution=self.institution,
        )
        UserRoleAssignment.objects.create(
            user=self.archivist,
            role=Role.objects.get(code=RoleCode.ARCHIVIST),
            scope_type=ScopeType.INSTITUTION,
            scope_id=self.institution.id,
        )
        self.work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Mémoire gouvernance",
            institution=self.institution,
            faculty=self.faculty,
            department=self.department,
            created_by=self.deposant,
        )
        self.work.contributors.create(
            contributor_type="AUTHOR",
            display_name="Déposant",
            user=self.deposant,
        )
        self.version = DocumentVersion.objects.create(
            work=self.work,
            version_number=1,
            file=ContentFile(b"PDF final", name="memoire.pdf"),
            file_name="memoire.pdf",
            sha256_hash="a" * 64,
            uploaded_by=self.deposant,
        )

    def test_work_status_contains_production_states(self):
        expected = {
            WorkStatus.BROUILLON,
            WorkStatus.SOUMIS,
            WorkStatus.EN_INSTRUCTION,
            WorkStatus.EN_EXPERTISE,
            WorkStatus.CORRECTION_DEMANDEE,
            WorkStatus.RE_SOUMIS,
            WorkStatus.ARCHIVABLE,
            WorkStatus.ARCHIVE,
            WorkStatus.SCREENING,
            WorkStatus.UNDER_REVIEW,
            WorkStatus.REVISION_REQUESTED,
            WorkStatus.PUBLISHED,
        }
        self.assertTrue(expected.issubset({choice[0] for choice in WorkStatus.choices}))

    def test_submit_work_uses_production_status_and_logs_event(self):
        submit_work(self.work, self.deposant)

        self.work.refresh_from_db()
        self.assertEqual(self.work.status, WorkStatus.SOUMIS)
        self.assertTrue(self.work.reference_code)
        self.assertTrue(
            WorkflowEvent.objects.filter(
                work=self.work,
                from_status=WorkStatus.BROUILLON,
                to_status=WorkStatus.SOUMIS,
            ).exists()
        )

    def test_deposant_cannot_mark_own_work_archivable(self):
        submit_work(self.work, self.deposant)

        with self.assertRaises(PermissionDenied):
            mark_archivable(self.work, self.deposant, comment="Je valide mon propre dossier")

    def test_department_head_can_make_memoire_archivable(self):
        submit_work(self.work, self.deposant)
        record_workflow_decision(
            self.work,
            DecisionType.VALIDATE_AFTER_DEFENSE,
            self.validator,
            comment="Dossier validé",
            document_version=self.version,
        )
        mark_archivable(self.work, self.validator, comment="Prêt pour archivage")

        self.work.refresh_from_db()
        self.assertEqual(self.work.status, WorkStatus.ARCHIVABLE)

    def test_archive_requires_archivable_status_and_final_version(self):
        with self.assertRaises(ValidationError):
            archive_work(self.work, self.archivist)

        submit_work(self.work, self.deposant)
        record_workflow_decision(
            self.work,
            DecisionType.VALIDATE_AFTER_DEFENSE,
            self.validator,
            comment="Dossier validé",
            document_version=self.version,
        )
        mark_archivable(self.work, self.validator, comment="Prêt pour archivage")

        with self.assertRaises(ValidationError):
            archive_work(self.work, self.archivist)

        self.version.status = VersionStatus.FINAL
        self.version.is_final = True
        self.version.save(update_fields=["status", "is_final", "updated_at"])

        archive = archive_work(self.work, self.archivist)
        self.work.refresh_from_db()

        self.assertEqual(self.work.status, WorkStatus.ARCHIVE)
        self.assertEqual(archive.document_version_id, self.version.id)
        self.assertTrue(hasattr(archive, "verification_proof"))

    def test_proof_cannot_be_issued_without_archived_work(self):
        self.version.status = VersionStatus.FINAL
        self.version.is_final = True
        self.version.save(update_fields=["status", "is_final", "updated_at"])
        archive = ArchiveRecord.objects.create(
            work=self.work,
            document_version=self.version,
            document_hash=self.version.sha256_hash,
            public_slug="memoire-non-archive",
        )

        with self.assertRaises(ValidationError):
            issue_proof_for_archive(archive, self.archivist)

    def _make_work_with_version(self, work_type, title):
        work = ScientificWork.objects.create(
            type=work_type,
            title=title,
            institution=self.institution,
            faculty=self.faculty,
            department=self.department,
            created_by=self.deposant,
        )
        work.contributors.create(
            contributor_type="AUTHOR",
            display_name="Déposant",
            user=self.deposant,
        )
        version = DocumentVersion.objects.create(
            work=work,
            version_number=1,
            file=ContentFile(b"PDF final", name=f"{work_type.lower()}.pdf"),
            file_name=f"{work_type.lower()}.pdf",
            sha256_hash="b" * 64,
            uploaded_by=self.deposant,
        )
        return work, version

    def _finalize_and_archive(self, work, version):
        mark_archivable(work, self.validator, comment="Prêt pour archivage")
        version.status = VersionStatus.FINAL
        version.is_final = True
        version.save(update_fields=["status", "is_final", "updated_at"])
        archive = archive_work(work, self.archivist)
        work.refresh_from_db()
        self.assertEqual(work.status, WorkStatus.ARCHIVE)
        self.assertTrue(hasattr(archive, "verification_proof"))
        self.assertEqual(archive.document_hash, version.sha256_hash)

    def test_memoire_flow_reaches_archive_and_proof(self):
        work, version = self._make_work_with_version(WorkType.MEMOIRE, "Flux mémoire")

        submit_work(work, self.deposant)
        record_workflow_decision(
            work,
            DecisionType.VALIDATE_AFTER_DEFENSE,
            self.validator,
            comment="Mémoire validé",
            document_version=version,
        )
        self._finalize_and_archive(work, version)

    def test_thesis_flow_reaches_archive_and_proof(self):
        work, version = self._make_work_with_version(WorkType.THESE, "Flux thèse")

        submit_work(work, self.deposant)
        record_workflow_decision(work, DecisionType.AUTHORIZE_DEFENSE, self.validator, comment="Soutenance autorisée")
        record_workflow_decision(work, DecisionType.RECORD_DEFENSE_PASSED, self.validator, comment="Soutenance passée")
        record_workflow_decision(
            work,
            DecisionType.VALIDATE_AFTER_DEFENSE,
            self.validator,
            comment="Thèse validée après soutenance",
            document_version=version,
        )
        self._finalize_and_archive(work, version)

    def test_article_flow_reaches_archive_and_proof(self):
        work, version = self._make_work_with_version(WorkType.ARTICLE, "Flux article")

        submit_work(work, self.deposant)
        record_workflow_decision(
            work,
            DecisionType.ACCEPT_ARTICLE,
            self.validator,
            comment="Article accepté",
            document_version=version,
        )
        record_workflow_decision(work, DecisionType.PUBLISH_ARTICLE, self.validator, comment="Article publié")
        self._finalize_and_archive(work, version)
