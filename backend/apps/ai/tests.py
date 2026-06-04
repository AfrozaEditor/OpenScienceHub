from django.test import RequestFactory, SimpleTestCase, override_settings

from apps.ai.files import build_document_file_url


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
