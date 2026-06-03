from sqlalchemy.orm import Session

from app.db import repositories
from app.providers.factory import get_embedding_provider
from app.schemas.similar import SimilarRequest, SimilarResponse, SimilarResult


def find_similar(db: Session, req: SimilarRequest) -> SimilarResponse:
    embedder = get_embedding_provider()
    allowed = [v.value for v in req.filters.allowed_visibilities] or ["PUBLIC"]

    query_text = req.text
    if not query_text and req.work_id:
        try:
            chunks = repositories.get_work_chunks(db, req.work_id, limit=20)
        except Exception:  # noqa: BLE001
            return SimilarResponse(results=[])
        query_text = " ".join(c.chunk_text for c in chunks)[:4000]
    if not query_text:
        return SimilarResponse(results=[])

    q_emb = embedder.embed_one(query_text)
    try:
        rows = repositories.search_chunks(db, q_emb, allowed, top_k=req.top_k * 4)
    except Exception:  # noqa: BLE001
        return SimilarResponse(results=[])

    best: dict = {}
    for chunk, score in rows:
        if req.work_id and chunk.work_id == req.work_id:
            continue
        current = best.get(chunk.work_id)
        if current is None or score > current[0]:
            best[chunk.work_id] = (score, chunk)

    ranked = sorted(best.items(), key=lambda kv: kv[1][0], reverse=True)[: req.top_k]
    results = []
    for work_id, (score, chunk) in ranked:
        meta = chunk.chunk_metadata or {}
        results.append(
            SimilarResult(
                work_id=work_id,
                title=meta.get("title"),
                type=meta.get("type"),
                year=meta.get("year"),
                score=round(max(0.0, min(1.0, score)), 4),
                motifs=(meta.get("keywords") or [])[:5],
            )
        )
    return SimilarResponse(results=results)
