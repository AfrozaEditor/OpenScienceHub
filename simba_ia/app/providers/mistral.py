import httpx

from app.core.config import settings
from app.providers.base import EmbeddingProvider, ProviderError


class MistralEmbeddingProvider(EmbeddingProvider):
    name = "mistral"

    def __init__(self) -> None:
        if not settings.mistral_api_key:
            raise ProviderError("MISTRAL_API_KEY manquante")
        self.dim = settings.embedding_dim
        self.model = settings.embedding_model
        self._base = settings.mistral_base_url.rstrip("/")
        self._key = settings.mistral_api_key

    def embed(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        try:
            resp = httpx.post(
                f"{self._base}/embeddings",
                headers={"Authorization": f"Bearer {self._key}"},
                json={"model": self.model, "input": texts},
                timeout=settings.http_timeout,
            )
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            status = exc.response.status_code if getattr(exc, "response", None) else "unknown"
            raise ProviderError(f"Mistral embeddings failed (status={status})") from exc
        data = resp.json().get("data", [])
        ordered = sorted(data, key=lambda d: d.get("index", 0))
        return [d["embedding"] for d in ordered]
