"""Test reseau reel backend <-> IDS/e-IDStack.

Usage:
  python scripts/live_backend_ids_check.py

Variables utiles:
  BACKEND_URL=http://localhost:8000/api/v1
  IDS_URL=http://localhost:4000
  IDS_INIT_AGENT=true|false
  IDS_AGENT_SEED=00000000000000000000000000000001
"""
from __future__ import annotations

import os
import sys
import time

import requests


BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000/api/v1").rstrip("/")
IDS_URL = os.getenv("IDS_URL", "http://localhost:4000").rstrip("/")
BACKEND_ROOT = BACKEND_URL.removesuffix("/api/v1")
ADMIN_EMAIL = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@openscience.local")
ADMIN_PASSWORD = os.getenv("DJANGO_SUPERUSER_PASSWORD", "adminpass")


def wait_for(name: str, url: str, timeout: int = 180) -> None:
    deadline = time.time() + timeout
    last_error = ""
    while time.time() < deadline:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code < 500:
                print(f"[OK] {name} pret ({response.status_code})")
                return
            last_error = f"HTTP {response.status_code}"
        except requests.RequestException as exc:
            last_error = str(exc)
        time.sleep(3)
    raise SystemExit(f"[KO] {name} indisponible apres {timeout}s: {last_error}")


def post_json(name: str, url: str, payload: dict, headers: dict | None = None) -> dict:
    response = requests.post(url, json=payload, headers=headers or {}, timeout=90)
    if response.status_code >= 400:
        raise SystemExit(f"[KO] {name}: HTTP {response.status_code} {response.text[:1000]}")
    print(f"[OK] {name} ({response.status_code})")
    if not response.content:
        return {}
    return response.json()


def get_json(name: str, url: str, headers: dict | None = None) -> dict:
    response = requests.get(url, headers=headers or {}, timeout=30)
    if response.status_code >= 400:
        raise SystemExit(f"[KO] {name}: HTTP {response.status_code} {response.text[:1000]}")
    print(f"[OK] {name} ({response.status_code})")
    return response.json()


def init_ids_agent() -> None:
    if os.getenv("IDS_INIT_AGENT", "true").lower() not in {"1", "true", "yes"}:
        print("[INFO] Initialisation IDS ignoree (IDS_INIT_AGENT=false)")
        return

    seed = os.getenv("IDS_AGENT_SEED", "00000000000000000000000000000001")
    if len(seed) != 32:
        raise SystemExit("[KO] IDS_AGENT_SEED doit contenir exactement 32 caracteres.")

    payload = {
        "walletId": os.getenv("IDS_WALLET_ID", "openscience-hub-issuer-local"),
        "walletKey": os.getenv("IDS_WALLET_KEY", "openscience-hub-wallet-key"),
        "endpoint": os.getenv("IDS_AGENT_ENDPOINT", "http://localhost:3021"),
        "label": os.getenv("IDS_AGENT_LABEL", "OpenScienceHub IDS Local"),
        "seed": seed,
    }
    data = post_json("IDS initAgent", f"{IDS_URL}/credo-agent/initAgent", payload)
    issuer_did = data.get("issuerDid")
    if not issuer_did:
        raise SystemExit(f"[KO] IDS initAgent sans issuerDid: {data}")
    print(f"[OK] IDS issuerDid = {issuer_did}")


def main() -> None:
    wait_for("Backend schema", f"{BACKEND_ROOT}/api/schema/")
    wait_for("IDS Swagger", f"{IDS_URL}/api/docs-yaml")

    init_ids_agent()
    direct_did = get_json("IDS getIssuerDid direct", f"{IDS_URL}/credo-agent/getIssuerDid")
    print(f"[OK] DID direct IDS = {direct_did.get('issuerDid') or direct_did.get('did')}")

    token_data = post_json(
        "Login backend admin",
        f"{BACKEND_URL}/auth/login",
        {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    access = token_data.get("access")
    if not access:
        raise SystemExit(f"[KO] Login backend sans token access: {token_data}")

    headers = {"Authorization": f"Bearer {access}"}
    result = post_json("Backend -> IDS test-connection", f"{BACKEND_URL}/admin/ssi/test-connection", {}, headers)
    if not result.get("ok"):
        raise SystemExit(f"[KO] Backend ne joint pas IDS correctement: {result}")

    print(f"[OK] Backend communique avec IDS en mode {result.get('mode')} ({result.get('issuer_did')})")
    print("\nRESULTAT: communication reseau backend + IDS validee")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
