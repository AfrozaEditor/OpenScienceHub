from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.archive.models import ArchiveRecord
from apps.archive.services import _index_via_simba
from apps.documents.models import DocumentVersion, VersionStatus, VersionType
from apps.institutions.models import Institution
from apps.search.models import IndexStatus
from apps.works.models import ScientificWork, WorkStatus, WorkType


class ArchiveIndexingTests(TestCase):
    def test_marks_index_failed_when_simba_indexing_cannot_run(self):
        institution = Institution.objects.create(name="Université Test", short_name="UT")
        user = get_user_model().objects.create_user(
            email="deposant-index@example.com",
            password="pass12345",
            full_name="Deposant",
            institution=institution,
        )
        work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Mémoire à indexer",
            institution=institution,
            created_by=user,
            status=WorkStatus.ARCHIVE,
            visibility="PUBLIC",
        )
        version = DocumentVersion.objects.create(
            work=work,
            version_number=1,
            version_type=VersionType.FINAL_ARCHIVE,
            file="works/test/final.pdf",
            file_name="final.pdf",
            sha256_hash="a" * 64,
            is_final=True,
            status=VersionStatus.ARCHIVED,
            uploaded_by=user,
        )
        record = ArchiveRecord.objects.create(
            work=work,
            document_version=version,
            document_hash=version.sha256_hash,
            public_slug="memoire-a-indexer",
        )

        with patch("apps.ai.files.build_document_file_url", side_effect=RuntimeError("file url unavailable")):
            _index_via_simba(record)

        record.refresh_from_db()
        self.assertEqual(record.index_entry.status, IndexStatus.FAILED)
        self.assertIsNone(record.index_entry.indexed_at)
