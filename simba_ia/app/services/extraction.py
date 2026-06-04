import json
from typing import Any

from app.core.logging import get_logger
from app.providers.base import ProviderError
from app.providers.factory import get_llm_provider
from app.schemas.common import ExtractStatus
from app.schemas.extract import ExtractedMetadata, ExtractRequest, ExtractResponse
from app.services import grobid, ocr, pdf
from app.services.prompts import EXTRACTION_SYSTEM

logger = get_logger(__name__)


def _get_text_and_hints(req: ExtractRequest) -> tuple[str, dict[str, Any]]:
    if req.text:
        return req.text, {}
    if not req.file_url:
        return "", {}
    data = pdf.fetch_pdf(req.file_url)
    pages = pdf.extract_pages_from_bytes(data)
    if not pdf.has_text(pages):
        ocred = ocr.ocr_pdf_bytes(data)
        if ocred:
            data = ocred
            pages = pdf.extract_pages_from_bytes(ocred)
    text = "\n".join(t for _, t in pages)
    hints = grobid.process_header(data) if grobid.is_enabled() else {}
    return text, hints


def _merge_grobid(meta: ExtractedMetadata, hints: dict[str, Any]) -> ExtractedMetadata:
    if not hints:
        return meta
    if not meta.title and hints.get("title"):
        meta.title = hints["title"]
    if not meta.authors and hints.get("authors"):
        meta.authors = hints["authors"]
    if not meta.abstract and hints.get("abstract"):
        meta.abstract = hints["abstract"]
    if not meta.keywords and hints.get("keywords"):
        meta.keywords = hints["keywords"]
    return meta


def _confidence(meta: ExtractedMetadata) -> float:
    scalar = [
        meta.title,
        meta.abstract,
        meta.scientific_domain,
        meta.methodology,
        meta.main_results,
        meta.language,
    ]
    filled = sum(1 for f in scalar if f) + (1 if meta.authors else 0) + (1 if meta.keywords else 0)
    return round(min(1.0, filled / 8), 2)


def _parse_json(raw: str) -> dict[str, Any]:
    start, end = raw.find("{"), raw.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("aucun objet JSON détecté dans la réponse du LLM")
    return json.loads(raw[start : end + 1])


def _build_prompt(text: str, hints: dict[str, Any], language_hint: str | None) -> str:
    grobid_hint = json.dumps(hints, ensure_ascii=False) if hints else "{}"
    return (
        f"Langue probable : {language_hint or 'inconnue'}.\n"
        f"Indices structurés (GROBID, peuvent aider) : {grobid_hint}\n\n"
        f"Texte du document (début) :\n{text[:6000]}\n\n"
        "Donne uniquement le JSON de métadonnées."
    )


def extract_metadata(req: ExtractRequest) -> ExtractResponse:
    text, hints = _get_text_and_hints(req)

    if not text.strip():
        return ExtractResponse(status=ExtractStatus.FAILED, raw_json={"reason": "texte vide"})

    llm = get_llm_provider()
    prompt = _build_prompt(text, hints, req.language_hint)
    raw: str | None = None
    for attempt in range(2):
        try:
            raw = llm.generate(system=EXTRACTION_SYSTEM, prompt=prompt, temperature=0.0)
            meta = _merge_grobid(ExtractedMetadata(**_parse_json(raw)), hints)
            return ExtractResponse(
                status=ExtractStatus.EXTRACTED,
                confidence_score=_confidence(meta),
                metadata=meta,
                raw_json={"llm_raw": raw, "grobid": hints},
            )
        except (ProviderError, ValueError, TypeError) as exc:
            logger.warning("Extraction tentative %s échouée: %s", attempt + 1, exc)
    return ExtractResponse(status=ExtractStatus.FAILED, raw_json={"llm_raw": raw})
