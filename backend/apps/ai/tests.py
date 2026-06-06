from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.test import RequestFactory, SimpleTestCase, TestCase, override_settings
from rest_framework.test import APIClient

from apps.ai.client import SimbaClient, SimbaError
from apps.ai.files import build_document_file_url
from apps.ai.models import ExtractionStatus, MetadataExtraction
from apps.documents.models import DocumentVersion
from apps.institutions.models import Faculty, Institution
from apps.works.models import ScientificWork, Visibility, WorkType


class DummyFile:
    url = "/media/works/document.pdf"


class DummyVersion:
    file = DummyFile()


class BuildDocumentFileUrlTests(SimpleTestCase):
    @override_settings(BACKEND_PUBLIC_BASE_URL="http://backend.local")
    def test_uses_backend_public_base_without_request(self):
        self.assertEqual(
            build_document_file_url(DummyVersion()),
            "http://backend.local/media/works/document.pdf",
        )

    @override_settings(BACKEND_PUBLIC_BASE_URL="")
    def test_uses_request_when_no_backend_public_base_is_configured(self):
        request = RequestFactory().get("/", HTTP_HOST="127.0.0.1:8000")

        self.assertEqual(
            build_document_file_url(DummyVersion(), request=request),
            "http://127.0.0.1:8000/media/works/document.pdf",
        )

    @override_settings(BACKEND_PUBLIC_BASE_URL="http://backend:8000")
    def test_backend_public_base_takes_precedence_over_request_for_container_fetches(self):
        request = RequestFactory().get("/", HTTP_HOST="localhost:8000")

        self.assertEqual(
            build_document_file_url(DummyVersion(), request=request),
            "http://backend:8000/media/works/document.pdf",
        )


class SimbaClientLiveOnlyTests(SimpleTestCase):
    @override_settings(SIMBA_MODE="mock")
    def test_non_live_mode_refuses_all_operations_without_http(self):
        client = SimbaClient()

        operations = {
            "extract": lambda: client.extract(document_id="doc", version_id="v1", text="texte"),
            "assistant": lambda: client.assistant_query(question="q", allowed_visibilities=["PUBLIC"]),
            "similar": lambda: client.similar(work_id="work", allowed_visibilities=["PUBLIC"]),
            "index": lambda: client.index(work_id="work", document_id="doc", version_id="v1"),
            "summarize": lambda: client.summarize(work_id="work"),
        }

        with patch("apps.ai.client.requests.post") as post:
            for name, operation in operations.items():
                with self.subTest(name=name):
                    with self.assertRaisesMessage(SimbaError, "SIMBA_MODE doit être 'live'"):
                        operation()

            post.assert_not_called()


class AIMetadataEndpointAccessTests(TestCase):
    def setUp(self):
        self.institution = Institution.objects.create(name="Université Test", short_name="UT")
        self.other_institution = Institution.objects.create(name="Université Autre", short_name="UA")
        self.faculty = Faculty.objects.create(institution=self.institution, name="Sciences")
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
        self.work = ScientificWork.objects.create(
            type=WorkType.MEMOIRE,
            title="Dossier IA privé",
            institution=self.institution,
            faculty=self.faculty,
            created_by=self.deposant,
            visibility=Visibility.PRIVATE,
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

    def test_extract_metadata_rejects_out_of_scope_user_before_simba_call(self):
        self.client.force_authenticate(self.outsider)

        with patch("apps.ai.views.SimbaClient.extract") as extract:
            response = self.client.post(f"/api/v1/works/{self.work.id}/extract-metadata")

        self.assertEqual(response.status_code, 403)
        extract.assert_not_called()

    def test_metadata_accept_rejects_out_of_scope_user_without_mutating_work(self):
        self.client.force_authenticate(self.outsider)

        response = self.client.post(
            f"/api/v1/works/{self.work.id}/metadata/accept",
            {"title": "Titre modifié"},
            format="json",
        )

        self.assertEqual(response.status_code, 403)
        self.work.refresh_from_db()
        self.assertEqual(self.work.title, "Dossier IA privé")

    def test_metadata_extraction_is_scoped_to_accessible_work(self):
        MetadataExtraction.objects.create(
            document_version=self.version,
            status=ExtractionStatus.EXTRACTED,
            extracted_title="Titre proposé",
        )
        self.client.force_authenticate(self.outsider)

        denied_response = self.client.get(f"/api/v1/works/{self.work.id}/metadata-extraction")

        self.client.force_authenticate(self.deposant)
        owner_response = self.client.get(f"/api/v1/works/{self.work.id}/metadata-extraction")

        self.assertEqual(denied_response.status_code, 403)
        self.assertEqual(owner_response.status_code, 200)
        self.assertEqual(owner_response.data["extracted_title"], "Titre proposé")

    def test_private_summary_rejects_anonymous_user_before_simba_call(self):
        with patch("apps.ai.views.SimbaClient.summarize") as summarize:
            response = self.client.get(f"/api/v1/works/{self.work.id}/summary")

        self.assertEqual(response.status_code, 403)
        summarize.assert_not_called()

    def test_public_summary_allows_anonymous_user(self):
        self.work.visibility = Visibility.PUBLIC
        self.work.save(update_fields=["visibility", "updated_at"])

        with patch("apps.ai.views.SimbaClient.summarize", return_value={"summary": "Résumé"}) as summarize:
            response = self.client.get(f"/api/v1/works/{self.work.id}/summary")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["summary"], "Résumé")
        summarize.assert_called_once()

    def test_private_similar_rejects_anonymous_user_before_simba_call(self):
        with patch("apps.ai.views.SimbaClient.similar") as similar:
            response = self.client.get(f"/api/v1/works/{self.work.id}/similar")

        self.assertEqual(response.status_code, 403)
        similar.assert_not_called()
