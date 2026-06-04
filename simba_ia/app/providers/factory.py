from app.core.config import settings
from app.core.logging import get_logger
from app.providers.base import EmbeddingProvider, LLMProvider, ProviderError

logger = get_logger(__name__)


def _build_embedding(name: str) -> EmbeddingProvider:
    if name == "mistral":
        from app.providers.mistral import MistralEmbeddingProvider

        return MistralEmbeddingProvider()
    raise ProviderError(f"Embedding provider non supporté en live: {name}")


def get_embedding_provider() -> EmbeddingProvider:
    return _build_embedding(settings.embedding_provider)


def _build_llm(name: str) -> LLMProvider:
    if name == "groq":
        from app.providers.groq import GroqLLMProvider

        return GroqLLMProvider()
    if name == "gemini":
        from app.providers.gemini import GeminiLLMProvider

        return GeminiLLMProvider()
    raise ProviderError(f"LLM provider non supporté en live: {name}")


class ChainLLMProvider(LLMProvider):
    """Essaie chaque provider live dans l'ordre, sans fallback simulé."""

    name = "chain"

    def __init__(self, providers: list[LLMProvider]) -> None:
        if not providers:
            raise ProviderError("Aucun LLM live disponible")
        self._providers = providers
        self.name = "→".join(p.name for p in self._providers)

    def generate(
        self,
        *,
        system: str,
        prompt: str,
        temperature: float = 0.1,
        max_tokens: int | None = None,
    ) -> str:
        last: Exception | None = None
        for provider in self._providers:
            try:
                return provider.generate(
                    system=system, prompt=prompt, temperature=temperature, max_tokens=max_tokens
                )
            except Exception as exc:  # noqa: BLE001
                logger.warning("LLM '%s' a échoué (%s)", provider.name, exc)
                last = exc
        raise ProviderError(f"Tous les LLM ont échoué: {last}")


def get_llm_provider() -> LLMProvider:
    providers: list[LLMProvider] = []
    seen: set[str] = set()
    for name in [settings.llm_provider, *settings.llm_fallback_list]:
        if name in seen:
            continue
        seen.add(name)
        try:
            providers.append(_build_llm(name))
        except ProviderError as exc:
            logger.warning("LLM '%s' indisponible (%s)", name, exc)
    return ChainLLMProvider(providers)
