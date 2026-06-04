import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_settings_accept_inline_comments_for_integer_values():
    settings = Settings(
        embedding_dim="1024 # doit correspondre à VECTOR(N) en base",
        default_top_k="6 # nombre de sources",
        chunk_size="1000 # caractères",
        chunk_overlap="150 # caractères",
    )

    assert settings.embedding_dim == 1024
    assert settings.default_top_k == 6
    assert settings.chunk_size == 1000
    assert settings.chunk_overlap == 150


def test_settings_reject_invalid_integer_values():
    with pytest.raises(ValidationError):
        Settings(embedding_dim="not-a-number # commentaire")
