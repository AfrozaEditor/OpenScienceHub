import time

from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.db import repositories
from app.providers.factory import get_embedding_provider, get_llm_provider
from app.schemas.assistant import AssistantQueryRequest, AssistantQueryResponse, Source
from app.schemas.common import AnswerStatus
from app.services.prompts import ASSISTANT_SYSTEM
from app.services.retrieval import retrieve

logger = get_logger(__name__)


def _format_context(chunks: list[tuple[object, float]]) -> str:
    parts = []
    for i, (chunk, _score) in enumerate(chunks, start=1):
        meta = chunk.chunk_metadata or {}
        title = meta.get("title", "document")
        parts.append(f"[{i}] ({title}, p.{chunk.page_start}) {chunk.chunk_text}")
    return "\n\n".join(parts)


def _to_sources(chunks: list[tuple[object, float]]) -> list[Source]:
    sources = []
    for chunk, score in chunks:
        meta = chunk.chunk_metadata or {}
        sources.append(
            Source(
                work_id=chunk.work_id,
                title=meta.get("title"),
                author=meta.get("author"),
                page=chunk.page_start,
                score=_public_score(score),
                excerpt=chunk.chunk_text[:300],
            )
        )
    return sources


def _public_score(score: float) -> float:
    return round(max(0.0, min(1.0, score)), 4)


def answer_query(db: Session, req: AssistantQueryRequest) -> AssistantQueryResponse:
    started = time.perf_counter()

    embedder = get_embedding_provider()
    try:
        chunks = retrieve(db, embedder, req.question, req.filters, req.top_k)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Retrieval indisponible: %s", exc)
        return AssistantQueryResponse(answer_status=AnswerStatus.NO_CONTEXT_FOUND, sources=[])

    if not chunks:
        _safe_log(db, req, None, AnswerStatus.NO_CONTEXT_FOUND, None, started, [])
        return AssistantQueryResponse(answer_status=AnswerStatus.NO_CONTEXT_FOUND, sources=[])

    context = _format_context(chunks)
    prompt = (
        f"Question: {req.question}\n\n"
        f"Contexte:\n{context}\n\n"
        "Réponds en citant (document, page)."
    )
    llm = get_llm_provider()
    try:
        answer = llm.generate(system=ASSISTANT_SYSTEM, prompt=prompt, temperature=0.1)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Génération échouée: %s", exc)
        _safe_log(db, req, None, AnswerStatus.FAILED, getattr(llm, "name", None), started, [])
        return AssistantQueryResponse(answer_status=AnswerStatus.FAILED, sources=[])

    sources = _to_sources(chunks)
    _safe_log(db, req, answer, AnswerStatus.ANSWERED, getattr(llm, "name", None), started, sources)
    return AssistantQueryResponse(
        answer_status=AnswerStatus.ANSWERED, answer=answer, sources=sources
    )


def _safe_log(db, req, answer, status, model_name, started, sources):
    try:
        citations = [
            {"work_id": s.work_id, "excerpt": s.excerpt, "score": s.score, "page_number": s.page}
            for s in sources
        ]
        repositories.log_query(
            db,
            question=req.question,
            answer=answer,
            answer_status=status.value,
            filters=req.filters.model_dump(mode="json"),
            model_name=model_name,
            latency_ms=int((time.perf_counter() - started) * 1000),
            citations=citations,
        )
    except Exception as exc:  # noqa: BLE001
        logger.debug("log_query ignoré: %s", exc)
