from abc import ABC, abstractmethod


class ProviderError(Exception):
    """Erreur d'un fournisseur externe (embeddings / LLM)."""


class EmbeddingProvider(ABC):
    name: str = "base"
    dim: int = 0

    @abstractmethod
    def embed(self, texts: list[str]) -> list[list[float]]: ...

    def embed_one(self, text: str) -> list[float]:
        return self.embed([text])[0]


class LLMProvider(ABC):
    name: str = "base"

    @abstractmethod
    def generate(
        self,
        *,
        system: str,
        prompt: str,
        temperature: float = 0.1,
        max_tokens: int | None = None,
    ) -> str: ...
