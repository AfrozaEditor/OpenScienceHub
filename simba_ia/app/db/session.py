from collections.abc import Iterator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class Base(DeclarativeBase):
    pass


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    future=True,
    connect_args={"connect_timeout": 2},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception as exc:  # noqa: BLE001
        logger.warning("DB indisponible: %s", exc)
        return False


def init_db() -> None:
    """Crée l'extension pgvector, le schéma, les tables et l'index HNSW (dev)."""
    from app.db import models  # noqa: F401  (enregistre les modèles)

    schema = settings.db_schema
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.execute(text(f"CREATE SCHEMA IF NOT EXISTS {schema}"))

    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        conn.execute(
            text(
                f"CREATE INDEX IF NOT EXISTS ai_chunk_vec_idx "
                f"ON {schema}.ai_chunk USING hnsw (embedding vector_cosine_ops)"
            )
        )
    logger.info("DB initialisée (schéma=%s, dim=%s)", schema, settings.embedding_dim)
