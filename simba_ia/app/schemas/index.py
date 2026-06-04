from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import IndexStatus, Visibility


class IndexRequest(BaseModel):
    work_id: UUID
    document_id: UUID
    version_id: UUID
    file_url: str | None = None
    text: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    visibility: Visibility = Visibility.PUBLIC


class IndexResponse(BaseModel):
    status: IndexStatus
    version_id: UUID
    chunk_count: int = 0


class DeleteResponse(BaseModel):
    status: IndexStatus = IndexStatus.DELETED
    version_id: UUID
    deleted: int = 0
