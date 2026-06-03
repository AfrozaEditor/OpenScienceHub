import httpx

from app.core.config import settings
from app.providers.base import LLMProvider, ProviderError


class GroqLLMProvider(LLMProvider):
    name = "groq"

    def __init__(self) -> None:
        if not settings.groq_api_key:
            raise ProviderError("GROQ_API_KEY manquante")
        self._base = settings.groq_base_url.rstrip("/")
        self._key = settings.groq_api_key
        self.model = settings.llm_model

    def generate(
        self,
        *,
        system: str,
        prompt: str,
        temperature: float = 0.1,
        max_tokens: int | None = None,
    ) -> str:
        payload: dict = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            "temperature": temperature,
        }
        if max_tokens:
            payload["max_tokens"] = max_tokens
        try:
            resp = httpx.post(
                f"{self._base}/chat/completions",
                headers={"Authorization": f"Bearer {self._key}"},
                json=payload,
                timeout=settings.http_timeout,
            )
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            status = exc.response.status_code if getattr(exc, "response", None) else "unknown"
            raise ProviderError(f"Groq generate failed (status={status})") from exc
        content = _strip_thinking(resp.json()["choices"][0]["message"]["content"])
        if not content:
            raise ProviderError("Groq generate returned only hidden reasoning")
        return content


def _strip_thinking(text: str) -> str:
    cleaned = text.strip()
    while cleaned.startswith("<think>"):
        end = cleaned.find("</think>")
        if end == -1:
            return ""
        cleaned = cleaned[end + len("</think>") :].strip()
    return cleaned
