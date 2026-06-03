from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import ExtractStatus


class ExtractRequest(BaseModel):
    document_id: UUID
    version_id: UUID
    text: str | None = None
    file_url: str | None = None
    language_hint: str | None = None


class ExtractedMetadata(BaseModel):
    title: str | None = None
    authors: list[str] = Field(default_factory=list)
    abstract: str | None = None
    keywords: list[str] = Field(default_factory=list)
    scientific_domain: str | None = None
    problem_statement: str | None = None
    methodology: str | None = None
    main_results: str | None = None
    language: str | None = None
    themes: list[str] = Field(default_factory=list)


class ExtractResponse(BaseModel):
    status: ExtractStatus
    confidence_score: float = Field(ge=0.0, le=1.0, default=0.0)
    metadata: ExtractedMetadata = Field(default_factory=ExtractedMetadata)
    raw_json: dict[str, Any] = Field(default_factory=dict)
