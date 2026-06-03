from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from sqlalchemy import Integer, cast, delete, func, select
from sqlalchemy.orm import Session

from app.db.models import AiChunk, AiDocument, AiQueryCitation, AiQueryLog


def delete_version_chunks(db: Session, version_id: UUID) -> int:
    result = db.execute(delete(AiChunk).where(AiChunk.version_id == version_id))
    db.commit()
    return result.rowcount or 0


def replace_version_chunks(db: Session, version_id: UUID, chunks: list[dict[str, Any]]) -> int:
    db.execute(delete(AiChunk).where(AiChunk.version_id == version_id))
    db.add_all([AiChunk(**c) for c in chunks])
    db.commit()
    return len(chunks)


def upsert_document(
    db: Session,
    *,
    work_id: UUID,
    version_id: UUID,
    status: str,
    chunk_count: int = 0,
    error: str | None = None,
) -> None:
    doc = db.execute(
        select(AiDocument).where(AiDocument.version_id == version_id)
    ).scalar_one_or_none()
    if doc is None:
        doc = AiDocument(work_id=work_id, version_id=version_id)
        db.add(doc)
    doc.status = status
    doc.chunk_count = chunk_count
    doc.error = error
    doc.indexed_at = datetime.now(UTC) if status == "INDEXED" else None
    db.commit()


def search_chunks(
    db: Session,
    q_embedding: list[float],
    allowed_visibilities: list[str],
    *,
    work_id: UUID | None = None,
    type: str | None = None,
    institution: str | None = None,
    department: str | None = None,
    year_min: int | None = None,
    year_max: int | None = None,
    top_k: int = 6,
) -> list[tuple[AiChunk, float]]:
    distance = AiChunk.embedding.cosine_distance(q_embedding)
    conds = [AiChunk.visibility.in_(allowed_visibilities)]
    meta = AiChunk.chunk_metadata
    if work_id:
        conds.append(AiChunk.work_id == work_id)
    if type:
        conds.append(meta["type"].astext == type)
    if institution:
        conds.append(meta["institution"].astext == institution)
    if department:
        conds.append(meta["department"].astext == department)
    if year_min is not None:
        conds.append(cast(meta["year"].astext, Integer) >= year_min)
    if year_max is not None:
        conds.append(cast(meta["year"].astext, Integer) <= year_max)

    stmt = (
        select(AiChunk, (1 - distance).label("similarity"))
        .where(*conds)
        .order_by(distance.asc())
        .limit(top_k)
    )
    return [(row[0], float(row[1])) for row in db.execute(stmt).all()]


def get_version_chunks(db: Session, version_id: UUID) -> list[AiChunk]:
    stmt = select(AiChunk).where(AiChunk.version_id == version_id).order_by(AiChunk.chunk_index)
    return list(db.execute(stmt).scalars().all())


def get_work_chunks(db: Session, work_id: UUID, limit: int = 200) -> list[AiChunk]:
    stmt = select(AiChunk).where(AiChunk.work_id == work_id).limit(limit)
    return list(db.execute(stmt).scalars().all())


def count_chunks(db: Session) -> int:
    return int(db.execute(select(func.count()).select_from(AiChunk)).scalar_one())


def log_query(
    db: Session,
    *,
    question: str,
    answer: str | None,
    answer_status: str,
    filters: dict[str, Any],
    model_name: str | None,
    latency_ms: int | None,
    citations: list[dict[str, Any]] | None = None,
) -> None:
    log = AiQueryLog(
        question=question,
        answer=answer,
        answer_status=answer_status,
        filters=filters,
        model_name=model_name,
        latency_ms=latency_ms,
    )
    db.add(log)
    db.flush()
    for c in citations or []:
        db.add(AiQueryCitation(query_id=log.id, **c))
    db.commit()
