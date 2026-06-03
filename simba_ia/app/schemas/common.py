from enum import StrEnum

from pydantic import BaseModel


class ExtractStatus(StrEnum):
    EXTRACTED = "EXTRACTED"
    FAILED = "FAILED"


class IndexStatus(StrEnum):
    PENDING = "PENDING"
    INDEXED = "INDEXED"
    FAILED = "FAILED"
    DELETED = "DELETED"


class AnswerStatus(StrEnum):
    ANSWERED = "ANSWERED"
    NO_CONTEXT_FOUND = "NO_CONTEXT_FOUND"
    FAILED = "FAILED"
    FLAGGED = "FLAGGED"


class Visibility(StrEnum):
    PUBLIC = "PUBLIC"
    INSTITUTION_ONLY = "INSTITUTION_ONLY"
    RESTRICTED = "RESTRICTED"
    PRIVATE = "PRIVATE"


class ErrorResponse(BaseModel):
    detail: str
    code: str | None = None
