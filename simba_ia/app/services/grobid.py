import xml.etree.ElementTree as ET
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)
_TEI = {"tei": "http://www.tei-c.org/ns/1.0"}


def is_enabled() -> bool:
    return bool(settings.grobid_url)


def process_header(data: bytes) -> dict[str, Any]:
    """Appelle GROBID `processHeaderDocument` et parse un sous-ensemble TEI."""
    if not settings.grobid_url:
        return {}
    url = settings.grobid_url.rstrip("/") + "/api/processHeaderDocument"
    try:
        resp = httpx.post(
            url,
            files={"input": ("doc.pdf", data, "application/pdf")},
            data={"consolidateHeader": "1"},
            timeout=settings.http_timeout,
        )
        resp.raise_for_status()
    except httpx.HTTPError as exc:
        logger.warning("GROBID indisponible: %s", exc)
        return {}
    return _parse_tei(resp.text)


def _parse_tei(xml_text: str) -> dict[str, Any]:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return {}

    title_el = root.find(".//tei:titleStmt/tei:title", _TEI)
    title = (title_el.text or "").strip() if title_el is not None and title_el.text else None

    authors: list[str] = []
    for pers in root.findall(".//tei:sourceDesc//tei:author/tei:persName", _TEI):
        fore = pers.find("tei:forename", _TEI)
        sur = pers.find("tei:surname", _TEI)
        name = " ".join(p.text for p in (fore, sur) if p is not None and p.text)
        if name:
            authors.append(name)

    abstract_el = root.find(".//tei:profileDesc//tei:abstract", _TEI)
    abstract = (
        " ".join(t.strip() for t in abstract_el.itertext()).strip()
        if abstract_el is not None
        else None
    )

    keywords = [k.text.strip() for k in root.findall(".//tei:keywords//tei:term", _TEI) if k.text]

    return {"title": title, "authors": authors, "abstract": abstract or None, "keywords": keywords}
