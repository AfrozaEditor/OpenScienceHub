from uuid import UUID

from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.db import repositories
from app.providers.factory import get_embedding_provider
from app.schemas.common import IndexStatus
from app.schemas.index import IndexRequest, IndexResponse
from app.services import ocr, pdf
from app.services.chunking import chunk_pages

logger = get_logger(__name__)


def _pages_for(req: IndexRequest) -> list[tuple[int, str]]:
    if req.file_url:
        data = pdf.fetch_pdf(req.file_url)
        pages = pdf.extract_pages_from_bytes(data)
        if not pdf.has_text(pages):
            ocred = ocr.ocr_pdf_bytes(data)
            if ocred:
                pages = pdf.extract_pages_from_bytes(ocred)
        return pages
    if req.text:
        return [(1, req.text)]
    return []


def index_document(db: Session, req: IndexRequest) -> IndexResponse:
    try:
        chunks = chunk_pages(_pages_for(req))
        if not chunks:
            repositories.upsert_document(
                db,
                work_id=req.work_id,
                version_id=req.version_id,
                status="FAILED",
                error="aucun texte exploitable",
            )
            return IndexResponse(status=IndexStatus.FAILED, version_id=req.version_id)

        embedder = get_embedding_provider()
        vectors = embedder.embed([c["chunk_text"] for c in chunks])
        model_tag = f"{embedder.name}:{getattr(embedder, 'model', embedder.name)}"
        rows = [
            {
                "work_id": req.work_id,
                "document_id": req.document_id,
                "version_id": req.version_id,
                "chunk_index": c["chunk_index"],
                "chunk_text": c["chunk_text"],
                "page_start": c["page_start"],
                "page_end": c["page_end"],
                "embedding": vec,
                "chunk_metadata": dict(req.metadata),
                "visibility": req.visibility.value,
                "embedding_model": model_tag,
            }
            for c, vec in zip(chunks, vectors, strict=True)
        ]
        count = repositories.replace_version_chunks(db, req.version_id, rows)
        repositories.upsert_document(
            db,
            work_id=req.work_id,
            version_id=req.version_id,
            status="INDEXED",
            chunk_count=count,
        )
        return IndexResponse(
            status=IndexStatus.INDEXED, version_id=req.version_id, chunk_count=count
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Indexation échouée pour version %s", req.version_id)
        try:
            repositories.upsert_document(
                db,
                work_id=req.work_id,
                version_id=req.version_id,
                status="FAILED",
                error=str(exc),
            )
        except Exception as log_exc:  # noqa: BLE001
            logger.debug("Statut d'indexation non persisté: %s", log_exc)
        return IndexResponse(status=IndexStatus.FAILED, version_id=req.version_id)


def delete_document(db: Session, version_id: UUID) -> int:
    try:
        return repositories.delete_version_chunks(db, version_id)
    except Exception as exc:  # noqa: BLE001
        logger.debug("Suppression index ignorée: %s", exc)
        return 0
