"""Client e-IDStack de IDS. Mode `mock` pour démo hors-ligne (même interface)."""
from __future__ import annotations

import uuid

import requests
from django.conf import settings


class EidStackError(Exception):
    pass


class EidStackClient:
    def __init__(self):
        self.base_url = settings.EIDSTACK_BASE_URL.rstrip("/")
        self.api_key = settings.EIDSTACK_API_KEY
        self.mode = settings.SSI_MODE  # mock | live
        self.timeout = 20

    @property
    def is_mock(self) -> bool:
        return self.mode != "live"

    def _headers(self):
        return {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}

    def _unwrap(self, payload):
        """Accepte les réponses directes ou le wrapper NestJS {success, data}."""
        if isinstance(payload, dict) and "data" in payload:
            return payload["data"]
        return payload

    def get_issuer_did(self) -> str:
        if self.is_mock:
            return "did:web:openscience.local"
        try:
            r = requests.get(f"{self.base_url}/credo-agent/getIssuerDid", headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            data = self._unwrap(r.json())
            return data.get("issuerDid") or data.get("did") or "did:unknown"
        except requests.RequestException as exc:  # pragma: no cover
            raise EidStackError(str(exc)) from exc

    def offer_credential(self, attributes: list[dict], comment: str = "") -> dict:
        """Émet/prépare un credential. En mock : credential factice cohérent."""
        if self.is_mock:
            return {
                "credentialId": f"OSH-VC-{uuid.uuid4().hex[:12]}",
                "issuerDid": self.get_issuer_did(),
                "attributes": attributes,
                "mock": True,
            }
        try:
            payload = {
                "credentialDefinitionId": getattr(settings, "EIDSTACK_CREDENTIAL_DEFINITION_ID", ""),
                "connectionId": getattr(settings, "EIDSTACK_CONNECTION_ID", ""),
                "attributes": attributes,
                "comment": comment,
            }
            r = requests.post(f"{self.base_url}/issuance/offer", json=payload, headers=self._headers(), timeout=self.timeout)
            r.raise_for_status()
            data = self._unwrap(r.json())
            credential_id = data.get("credentialId") or data.get("credentialExchangeId")
            return {
                "credentialId": credential_id,
                "issuerDid": data.get("issuerDid") or self.get_issuer_did(),
                "attributes": data.get("credentialAttributes") or attributes,
                "raw": data,
            }
        except requests.RequestException as exc:
            raise EidStackError(str(exc)) from exc

    def verify_credential(self, credential_id: str) -> dict:
        if self.is_mock:
            return {"credentialId": credential_id, "status": "ACTIVE", "valid": True, "mock": True}
        try:
            r = requests.get(
                f"{self.base_url}/issuance/offerStatus",
                params={"credentialExchangeId": credential_id}, headers=self._headers(), timeout=self.timeout,
            )
            r.raise_for_status()
            data = self._unwrap(r.json())
            state = data.get("state") if isinstance(data, dict) else str(data)
            invalid_states = {"not-found", "abandoned", "problem-report"}
            return {
                "credentialId": credential_id,
                "status": state,
                "valid": state not in invalid_states,
                "raw": data,
            }
        except requests.RequestException as exc:
            raise EidStackError(str(exc)) from exc
