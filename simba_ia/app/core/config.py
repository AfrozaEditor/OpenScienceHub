from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ── Service ───────────────────────────────────────────────────────────
    app_name: str = "simba_ia"
    api_v1_prefix: str = "/v1"
    simba_mode: str = "live"
    simba_api_key: str = "dev-simba-key"
    log_level: str = "INFO"

    # ── Database ──────────────────────────────────────────────────────────
    database_url: str = "postgresql+psycopg://simba:simba@localhost:5432/simba"
    db_schema: str = "simba"

    # ── Embeddings ────────────────────────────────────────────────────────
    embedding_provider: str = "mistral"
    embedding_model: str = "mistral-embed"
    embedding_dim: int = 1024
    mistral_api_key: str | None = None
    mistral_base_url: str = "https://api.mistral.ai/v1"

    # ── LLM ───────────────────────────────────────────────────────────────
    llm_provider: str = "groq"
    llm_model: str = "qwen/qwen3-32b"
    llm_fallbacks: str = "gemini"  # liste séparée par des virgules
    groq_api_key: str | None = None
    groq_base_url: str = "https://api.groq.com/openai/v1"
    gemini_api_key: str | None = None
    gemini_base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    gemini_model: str = "gemini-2.0-flash"

    # ── GROBID / OCR ──────────────────────────────────────────────────────
    grobid_url: str | None = None
    ocr_enabled: bool = True
    ocr_languages: str = "fra+eng"

    # ── Assistant IA / chunking ───────────────────────────────────────────
    default_top_k: int = 6
    chunk_size: int = 1000
    chunk_overlap: int = 150

    @field_validator("embedding_dim", "default_top_k", "chunk_size", "chunk_overlap", mode="before")
    @classmethod
    def parse_inline_commented_int(cls, value):
        if isinstance(value, str):
            value = value.split("#", 1)[0].strip()
        return value

    @property
    def llm_fallback_list(self) -> list[str]:
        return [p.strip() for p in self.llm_fallbacks.split(",") if p.strip()]

    @property
    def http_timeout(self) -> float:
        return 30.0


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
