from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str = "ok"
    mode: str
    embedding_provider: str
    llm_provider: str
    db: str
