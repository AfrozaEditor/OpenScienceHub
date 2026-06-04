from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import get_logger
from app.core.security import require_api_key
from app.db.session import check_db, init_db
from app.schemas.health import HealthResponse

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        init_db()
    except Exception as exc:  # noqa: BLE001
        logger.warning("init_db ignoré (base indisponible ?): %s", exc)
    yield


app = FastAPI(
    title="simba_ia — OpenScience Hub",
    description="Microservice IA : extraction PDF + Assistant IA sourcé.",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        mode=settings.simba_mode,
        embedding_provider=settings.embedding_provider,
        llm_provider=settings.llm_provider,
        db="ok" if check_db() else "down",
    )


app.include_router(
    api_router, prefix=settings.api_v1_prefix, dependencies=[Depends(require_api_key)]
)
