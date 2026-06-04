"""Client simba_ia. Mode `mock` pour démo hors-ligne (même interface)."""
from __future__ import annotations

import requests
from django.conf import settings


class SimbaError(Exception):
    pass


class SimbaClient:
    def __init__(self):
        self.base_url = settings.SIMBA_IA_URL.rstrip("/")
        self.api_key = settings.SIMBA_API_KEY
        self.mode = settings.SIMBA_MODE  # mock | live
        self.timeout = 30

    @property
    def is_mock(self) -> bool:
        return self.mode != "live"

    def _headers(self):
        return {"X-API-Key": self.api_key} if self.api_key else {}

    def extract(self, *, document_id, version_id, text=None, file_url=None) -> dict:
        if self.is_mock:
            return {
                "status": "EXTRACTED",
                "confidence_score": 0.82,
                "metadata": {
                    "title": "",
                    "authors": [],
                    "abstract": "Résumé proposé automatiquement (mode démonstration).",
                    "keywords": ["IA", "recherche", "université"],
                    "scientific_domain": "Informatique",
                    "language": "fr",
                    "themes": ["archivage", "vérification"],
                },
                "raw_json": {"mock": True},
            }
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
        if self.is_mock:
            return {
                "answer_status": "NO_CONTEXT_FOUND",
                "answer": None,
                "sources": [],
                "note": "Assistant IA en mode démonstration : indexation requise pour des réponses sourcées.",
            }
        try:
            body = {"question": question, "filters": {"allowed_visibilities": allowed_visibilities, **(filters or {})}, "top_k": top_k}
            r = requests.post(f"{self.base_url}/v1/assistant/query", json=body, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc

    def similar(self, *, work_id, allowed_visibilities, top_k=5) -> dict:
        if self.is_mock:
            return {"results": []}
        try:
            body = {"work_id": str(work_id), "filters": {"allowed_visibilities": allowed_visibilities}, "top_k": top_k}
            r = requests.post(f"{self.base_url}/v1/similar", json=body, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc

    def index(self, *, work_id, document_id, version_id, file_url=None, metadata=None, visibility="PUBLIC") -> dict:
        """Indexation pour recherche/Assistant IA (backend -> simba_ia /v1/index)."""
        if self.is_mock:
            return {"status": "INDEXED", "version_id": str(version_id), "chunk_count": 0, "mock": True}
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
        if self.is_mock:
            return {
                "summary_short": "Résumé court (mode démonstration).",
                "summary_long": "",
                "problem_statement": "",
                "methodology": "",
                "main_results": "",
                "limitations": "",
                "suggested_keywords": [],
                "sources": [],
                "generated_by_ai": True,
                "mock": True,
            }
        try:
            body = {"work_id": str(work_id), "version_id": str(version_id) if version_id else None, "mode": mode}
            r = requests.post(f"{self.base_url}/v1/summarize", json=body, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as exc:
            raise SimbaError(str(exc)) from exc
