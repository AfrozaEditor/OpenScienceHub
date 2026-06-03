from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.index import DeleteResponse, IndexRequest, IndexResponse
from app.services.ingestion import delete_document, index_document

router = APIRouter(tags=["index"])


@router.post("/index", response_model=IndexResponse)
def post_index(req: IndexRequest, db: Session = Depends(get_db)) -> IndexResponse:
    return index_document(db, req)


@router.delete("/index/{version_id}", response_model=DeleteResponse)
def delete_index(version_id: UUID, db: Session = Depends(get_db)) -> DeleteResponse:
    deleted = delete_document(db, version_id)
    return DeleteResponse(version_id=version_id, deleted=deleted)
