from sqlalchemy.orm import Session

from app.db import repositories
from app.providers.base import EmbeddingProvider
from app.schemas.assistant import AssistantFilters


def retrieve(
    db: Session,
    embedder: EmbeddingProvider,
    query_text: str,
    filters: AssistantFilters,
    top_k: int,
) -> list[tuple[object, float]]:
    q_emb = embedder.embed_one(query_text)
    allowed = [v.value for v in filters.allowed_visibilities] or ["PUBLIC"]
    return repositories.search_chunks(
        db,
        q_emb,
        allowed,
        type=filters.type,
        institution=filters.institution,
        department=filters.department,
        year_min=filters.year_min,
        year_max=filters.year_max,
        top_k=top_k,
    )
