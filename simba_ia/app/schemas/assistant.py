from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import AnswerStatus, Visibility


class AssistantFilters(BaseModel):
    allowed_visibilities: list[Visibility] = Field(default_factory=lambda: [Visibility.PUBLIC])
    work_id: UUID | None = None
    type: str | None = None
    institution: str | None = None
    department: str | None = None
    year_min: int | None = None
    year_max: int | None = None


class Source(BaseModel):
    work_id: UUID | None = None
    title: str | None = None
    author: str | None = None
    page: int | None = None
    score: float = 0.0
    excerpt: str = ""


class AssistantQueryRequest(BaseModel):
    question: str = Field(min_length=1)
    filters: AssistantFilters = Field(default_factory=AssistantFilters)
    top_k: int = Field(default=6, ge=1, le=20)


class AssistantQueryResponse(BaseModel):
    answer_status: AnswerStatus
    answer: str | None = None
    key_points: list[str] = Field(default_factory=list)
    sources: list[Source] = Field(default_factory=list)
