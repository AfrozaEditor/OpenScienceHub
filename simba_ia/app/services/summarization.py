from sqlalchemy.orm import Session

from app.db import repositories
from app.providers.base import ProviderError
from app.providers.factory import get_llm_provider
from app.schemas.summarize import SummarizeRequest, SummarizeResponse, SummarySource
from app.services.prompts import SUMMARIZE_SYSTEM


def _gather_chunks(db: Session, req: SummarizeRequest) -> list[object]:
    try:
        if req.version_id:
            return repositories.get_version_chunks(db, req.version_id)
        if req.work_id:
            return repositories.get_work_chunks(db, req.work_id, limit=40)
        return []
    except Exception:  # noqa: BLE001
        return []


def summarize(db: Session, req: SummarizeRequest) -> SummarizeResponse:
    chunks = _gather_chunks(db, req)
    if not chunks:
        return SummarizeResponse(generated_by_ai=True)

    context = "\n\n".join(f"(p.{c.page_start}) {c.chunk_text}" for c in chunks[:20])
    sources = [SummarySource(page=c.page_start, excerpt=c.chunk_text[:200]) for c in chunks[:5]]

    prompt = (
        f"Extraits du document :\n{context}\n\n"
        "Rédige une fiche de lecture : résumé court, résumé long, problématique, "
        "méthodologie, résultats, limites, mots-clés suggérés."
    )
    try:
        text = get_llm_provider().generate(system=SUMMARIZE_SYSTEM, prompt=prompt, temperature=0.2)
    except ProviderError:
        return SummarizeResponse(sources=sources, generated_by_ai=True)

    return SummarizeResponse(
        summary_short=text[:400], summary_long=text, sources=sources, generated_by_ai=True
    )
