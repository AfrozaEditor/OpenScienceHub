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

    def bootstrap_openscience(self) -> dict:
        if self.is_mock:
            return {
                "issuerDid": self.get_issuer_did(),
                "schemaId": "mock-schema-scientific-work-archive",
                "credentialDefinitionId": "mock-cred-def-scientific-work-archive",
                "mock": True,
            }
        payload = {
            "walletId": getattr(settings, "EIDSTACK_WALLET_ID", "openscience-hub-issuer-local"),
            "walletKey": getattr(settings, "EIDSTACK_WALLET_KEY", "openscience-hub-wallet-key"),
            "endpoint": getattr(settings, "EIDSTACK_AGENT_ENDPOINT", "http://localhost:3021"),
            "label": getattr(settings, "EIDSTACK_AGENT_LABEL", "OpenScienceHub IDS Local"),
            "seed": getattr(settings, "EIDSTACK_AGENT_SEED", "00000000000000000000000000000001"),
        }
        try:
            r = requests.post(
                f"{self.base_url}/openscience/bootstrap",
                json=payload,
                headers=self._headers(),
                timeout=max(self.timeout, 90),
            )
            r.raise_for_status()
            return self._unwrap(r.json())
        except requests.RequestException as exc:
            raise EidStackError(str(exc)) from exc

    def issue_openscience_credential(
        self,
        *,
        credential_definition_id: str,
        attributes: list[dict],
        comment: str = "",
    ) -> dict:
        if self.is_mock:
            return {
                "credentialId": f"OSH-VC-{uuid.uuid4().hex[:12]}",
                "issuerDid": self.get_issuer_did(),
                "credentialDefinitionId": credential_definition_id,
                "state": "done",
                "credentialAttributes": attributes,
                "mock": True,
            }
        try:
            r = requests.post(
                f"{self.base_url}/openscience/credentials",
                json={
                    "credentialDefinitionId": credential_definition_id,
                    "attributes": attributes,
                    "comment": comment,
                },
                headers=self._headers(),
                timeout=self.timeout,
            )
            r.raise_for_status()
            return self._unwrap(r.json())
        except requests.RequestException as exc:
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

        bootstrap = self.bootstrap_openscience()
        credential_definition_id = (
            getattr(settings, "EIDSTACK_CREDENTIAL_DEFINITION_ID", "")
            or bootstrap.get("credentialDefinitionId")
        )
        data = self.issue_openscience_credential(
            credential_definition_id=credential_definition_id,
            attributes=attributes,
            comment=comment,
        )
        return {
            "credentialId": data.get("credentialId"),
            "issuerDid": data.get("issuerDid") or bootstrap.get("issuerDid") or self.get_issuer_did(),
            "credentialDefinitionId": data.get("credentialDefinitionId") or credential_definition_id,
            "attributes": data.get("credentialAttributes") or attributes,
            "state": data.get("state"),
            "raw": data,
        }

    def verify_credential(self, credential_id: str) -> dict:
        if self.is_mock:
            return {"credentialId": credential_id, "status": "ACTIVE", "valid": True, "mock": True}
        try:
            r = requests.get(
                f"{self.base_url}/openscience/credentials/{credential_id}/status",
                headers=self._headers(),
                timeout=self.timeout,
            )
            r.raise_for_status()
            data = self._unwrap(r.json())
            state = data.get("status") or data.get("state") if isinstance(data, dict) else str(data)
            invalid_states = {"not-found", "abandoned", "problem-report"}
            return {
                "credentialId": credential_id,
                "status": state,
                "valid": state not in invalid_states,
                "raw": data,
            }
        except requests.RequestException as exc:
            raise EidStackError(str(exc)) from exc
