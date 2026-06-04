import io

import httpx

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

MIN_TEXT_CHARS = 50


def fetch_pdf(file_url: str) -> bytes:
    resp = httpx.get(file_url, timeout=settings.http_timeout, follow_redirects=True)
    resp.raise_for_status()
    return resp.content


def extract_pages_from_bytes(data: bytes) -> list[tuple[int, str]]:
    import pdfplumber

    pages: list[tuple[int, str]] = []
    with pdfplumber.open(io.BytesIO(data)) as doc:
        for i, page in enumerate(doc.pages, start=1):
            pages.append((i, page.extract_text() or ""))
    return pages


def has_text(pages: list[tuple[int, str]]) -> bool:
    total = sum(len((t or "").strip()) for _, t in pages)
    return total >= MIN_TEXT_CHARS
