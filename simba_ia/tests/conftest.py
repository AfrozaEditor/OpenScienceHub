import pytest
from fastapi.testclient import TestClient

from app.core.config import settings
from app.db import repositories
from app.db.session import SessionLocal, init_db
from app.main import app

TEST_VERSION_IDS = [
    "99999999-9999-9999-9999-999999999901",
    "99999999-9999-9999-9999-999999999902",
    "99999999-9999-9999-9999-999999999903",
]


@pytest.fixture(autouse=True)
def clean_test_indexes():
    init_db()
    with SessionLocal() as db:
        for version_id in TEST_VERSION_IDS:
            repositories.delete_version_chunks(db, version_id)
    yield
    with SessionLocal() as db:
        for version_id in TEST_VERSION_IDS:
            repositories.delete_version_chunks(db, version_id)


@pytest.fixture
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def auth_headers() -> dict[str, str]:
    return {"X-API-Key": settings.simba_api_key}
