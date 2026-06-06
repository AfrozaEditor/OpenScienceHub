"""Client simba_ia live-only. Les réponses simulées sont interdites en runtime."""
from __future__ import annotations

import requests
from django.conf import settings


class SimbaError(Exception):
    pass


class SimbaClient:
    def __init__(self):
        self.base_url = settings.SIMBA_IA_URL.rstrip("/")
        self.api_key = settings.SIMBA_API_KEY
        self.mode = settings.SIMBA_MODE
        self.timeout = 30

    @property
    def is_mock(self) -> bool:
        return self.mode != "live"

    def _ensure_live(self):
        if self.is_mock:
            raise SimbaError("SIMBA_MODE doit être 'live' : les réponses simulées sont désactivées.")

    def _headers(self):
        return {"X-API-Key": self.api_key} if self.api_key else {}

    def extract(self, *, document_id, version_id, text=None, file_url=None) -> dict:
        self._ensure_live()
        try:
            r = requests.post(
                f"{self.base_url}/v1/extract",
                json={"document_id": str(document_id), "version_id": str(version_id), "text": text, "file_url": file_url},
                headers=self._headers(), timeout=self.timeout,
            )
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc

    def assistant_query(self, *, question, allowed_visibilities, filters=None, top_k=6) -> dict:
        self._ensure_live()
        try:
            body = {"question": question, "filters": {"allowed_visibilities": allowed_visibilities, **(filters or {})}, "top_k": top_k}
            r = requests.post(f"{self.base_url}/v1/assistant/query", json=body, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc

    def similar(self, *, work_id, allowed_visibilities, top_k=5) -> dict:
        self._ensure_live()
        try:
            body = {"work_id": str(work_id), "filters": {"allowed_visibilities": allowed_visibilities}, "top_k": top_k}
            r = requests.post(f"{self.base_url}/v1/similar", json=body, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc

    def index(self, *, work_id, document_id, version_id, file_url=None, metadata=None, visibility="PUBLIC") -> dict:
        """Indexation pour recherche/Assistant IA (backend -> simba_ia /v1/index)."""
        self._ensure_live()
        try:
            body = {
                "work_id": str(work_id), "document_id": str(document_id), "version_id": str(version_id),
                "file_url": file_url, "metadata": metadata or {}, "visibility": visibility,
            }
            r = requests.post(f"{self.base_url}/v1/index", json=body, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc

    def summarize(self, *, work_id, version_id=None, mode="reading_sheet") -> dict:
        self._ensure_live()
        try:
            body = {"work_id": str(work_id), "version_id": str(version_id) if version_id else None, "mode": mode}
            r = requests.post(f"{self.base_url}/v1/summarize", json=body, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc
