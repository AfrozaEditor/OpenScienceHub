import httpx

from app.core.config import settings
from app.providers.base import LLMProvider, ProviderError


class GeminiLLMProvider(LLMProvider):
    name = "gemini"

    def __init__(self) -> None:
        if not settings.gemini_api_key:
            raise ProviderError("GEMINI_API_KEY manquante")
        self._base = settings.gemini_base_url.rstrip("/")
        self._key = settings.gemini_api_key
        self.model = settings.gemini_model

    def generate(
        self,
        *,
        system: str,
        prompt: str,
        temperature: float = 0.1,
        max_tokens: int | None = None,
    ) -> str:
        url = f"{self._base}/models/{self.model}:generateContent"
        payload: dict = {
            "systemInstruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature},
        }
        if max_tokens:
            payload["generationConfig"]["maxOutputTokens"] = max_tokens
        try:
            resp = httpx.post(
                url,
                headers={"x-goog-api-key": self._key},
                json=payload,
                timeout=settings.http_timeout,
            )
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            status = exc.response.status_code if getattr(exc, "response", None) else "unknown"
            raise ProviderError(f"Gemini generate failed (status={status})") from exc
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
