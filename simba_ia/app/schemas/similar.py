from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.assistant import AssistantFilters


class SimilarRequest(BaseModel):
    work_id: UUID | None = None
    text: str | None = None
    filters: AssistantFilters = Field(default_factory=AssistantFilters)
    top_k: int = Field(default=5, ge=1, le=20)


class SimilarResult(BaseModel):
    work_id: UUID | None = None
    title: str | None = None
    type: str | None = None
    year: str | int | None = None
    score: float = 0.0
    motifs: list[str] = Field(default_factory=list)


class SimilarResponse(BaseModel):
    results: list[SimilarResult] = Field(default_factory=list)
