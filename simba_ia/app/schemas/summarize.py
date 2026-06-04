from uuid import UUID

from pydantic import BaseModel, Field


class SummarizeRequest(BaseModel):
    work_id: UUID | None = None
    version_id: UUID | None = None
    mode: str = "reading_sheet"


class SummarySource(BaseModel):
    page: int | None = None
    excerpt: str = ""


class SummarizeResponse(BaseModel):
    summary_short: str | None = None
    summary_long: str | None = None
    problem_statement: str | None = None
    methodology: str | None = None
    main_results: str | None = None
    limitations: str | None = None
    suggested_keywords: list[str] = Field(default_factory=list)
    sources: list[SummarySource] = Field(default_factory=list)
    generated_by_ai: bool = True
