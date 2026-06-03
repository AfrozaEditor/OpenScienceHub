from urllib.parse import urljoin

from django.conf import settings


def build_document_file_url(version, request=None) -> str | None:
    """Return an absolute URL that simba_ia can fetch for a document version."""
    if not version or not getattr(version, "file", None):
        return None
    try:
        file_url = version.file.url
    except ValueError:
        return None

    if file_url.startswith(("http://", "https://")):
        return file_url
    if request is not None:
        return request.build_absolute_uri(file_url)

    base_url = getattr(settings, "BACKEND_PUBLIC_BASE_URL", "").rstrip("/")
    if not base_url:
        return file_url
    return urljoin(f"{base_url}/", file_url.lstrip("/"))
