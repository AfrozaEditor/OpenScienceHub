"""Full-stack live Docker smoke test for OpenScience Hub.

Expected stack:
  docker compose up -d --build

The test drives the public HTTP APIs only:
backend -> simba_ia -> e-IDStack de IDS.
"""
from __future__ import annotations

import io
import os
import sys
import time
from typing import Any

import requests


BACKEND_ROOT = os.getenv("BACKEND_ROOT", "http://localhost:8000").rstrip("/")
BACKEND_URL = f"{BACKEND_ROOT}/api/v1"
SIMBA_URL = os.getenv("SIMBA_URL", "http://localhost:8001").rstrip("/")
IDS_URL = os.getenv("IDS_URL", "http://localhost:4000").rstrip("/")
ADMIN_EMAIL = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@openscience.local")
ADMIN_PASSWORD = os.getenv("DJANGO_SUPERUSER_PASSWORD", "adminpass")


def wait_for(name: str, url: str, timeout: int = 240) -> None:
    deadline = time.time() + timeout
    last = ""
    while time.time() < deadline:
        try:
            response = requests.get(url, timeout=10)
            if response.status_code < 500:
                print(f"[OK] {name} pret ({response.status_code})")
                return
            last = f"HTTP {response.status_code}: {response.text[:200]}"
        except requests.RequestException as exc:
            last = str(exc)
        time.sleep(3)
    raise SystemExit(f"[KO] {name} indisponible: {last}")


def check(label: str, condition: bool, details: Any = "") -> None:
    print(("[OK] " if condition else "[KO] ") + label + (f" :: {details}" if details else ""))
    if not condition:
        raise SystemExit(1)


def pdf_bytes(text: str) -> bytes:
    safe = text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
    stream = f"BT /F1 18 Tf 72 720 Td ({safe}) Tj ET".encode()
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    pdf = b"%PDF-1.4\n"
    offsets = [0]
    for idx, obj in enumerate(objects, 1):
        offsets.append(len(pdf))
        pdf += f"{idx} 0 obj\n".encode() + obj + b"\nendobj\n"
    xref = len(pdf)
    pdf += b"xref\n0 6\n0000000000 65535 f \n"
    for off in offsets[1:]:
        pdf += f"{off:010d} 00000 n \n".encode()
    pdf += b"trailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n" + str(xref).encode() + b"\n%%EOF\n"
    return pdf


def post_json(session: requests.Session, path: str, payload: dict, timeout: int = 60) -> dict:
    response = session.post(f"{BACKEND_URL}{path}", json=payload, timeout=timeout)
    check(f"POST {path}", response.status_code < 400, f"{response.status_code} {response.text[:400]}")
    return response.json()


def main() -> None:
    wait_for("Backend schema", f"{BACKEND_ROOT}/api/schema/")
    wait_for("simba_ia health", f"{SIMBA_URL}/health")
    wait_for("IDS docs", f"{IDS_URL}/api/docs-yaml")

    simba_health = requests.get(f"{SIMBA_URL}/health", timeout=10).json()
    check("simba_ia live", simba_health.get("mode") == "live", simba_health)

    session = requests.Session()
    login = session.post(
        f"{BACKEND_URL}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=30,
    )
    check("Login admin backend", login.status_code == 200 and login.json().get("access"), login.text[:300])
    session.headers.update({"Authorization": f"Bearer {login.json()['access']}"})

    ssi = post_json(session, "/admin/ssi/test-connection", {}, timeout=240)
    check("Backend -> IDS live connected", ssi.get("ok") is True and ssi.get("mode") == "live", ssi)
    check("Issuer DID disponible", bool(ssi.get("issuer_did")), ssi)

    suffix = str(int(time.time()))
    inst = post_json(
        session,
        "/institutions",
        {"name": f"Universite Full Stack {suffix}", "short_name": f"UFS{suffix[-4:]}", "city": "Yaounde"},
    )
    fac = post_json(
        session,
        "/faculties",
        {"institution": inst["id"], "name": f"Faculte Full Stack {suffix}", "code": f"FF{suffix[-4:]}"},
    )
    dep = post_json(
        session,
        "/departments",
        {"faculty": fac["id"], "name": f"Departement IA SSI {suffix}", "code": f"DS{suffix[-4:]}"},
    )
    work = post_json(
        session,
        "/works",
        {
            "type": "MEMOIRE",
            "title": "Integration complete IDS IA Docker",
            "institution": inst["id"],
            "department": dep["id"],
            "academic_year": "2025-2026",
            "language": "FR",
            "visibility": "PUBLIC",
        },
    )
    work_id = work["id"]

    contributor = session.post(
        f"{BACKEND_URL}/works/{work_id}/contributors",
        json={"contributor_type": "AUTHOR", "display_name": "OpenScience Tester", "order_index": 0},
        timeout=30,
    )
    check("Ajout contributeur", contributor.status_code == 201, contributor.text[:300])

    upload = session.post(
        f"{BACKEND_URL}/works/{work_id}/documents",
        files={
            "file": (
                "memoire-full-stack.pdf",
                io.BytesIO(pdf_bytes("OpenScience Hub integration IDS IA Docker hash SHA-256 memoire.")),
                "application/pdf",
            )
        },
        timeout=60,
    )
    check("Upload PDF", upload.status_code == 201 and len(upload.json().get("sha256_hash", "")) == 64, upload.text[:300])

    extraction = session.post(f"{BACKEND_URL}/works/{work_id}/extract-metadata", timeout=240)
    check(
        "Extraction IA live",
        extraction.status_code == 200 and extraction.json().get("status") == "EXTRACTED",
        extraction.text[:400],
    )

    metadata = post_json(
        session,
        f"/works/{work_id}/metadata/accept",
        {
            "title": "Integration complete IDS IA Docker",
            "abstract_text": "Test full stack live.",
            "scientific_domain": "Informatique",
            "keywords": ["IDS", "SSI", "IA", "Docker"],
        },
    )
    check("Metadata acceptee", metadata.get("work_id") == work_id, metadata)

    extraction_state = session.get(f"{BACKEND_URL}/works/{work_id}/metadata-extraction", timeout=60)
    check(
        "Derniere extraction IA disponible",
        extraction_state.status_code == 200 and extraction_state.json().get("status") == "REVIEWED",
        extraction_state.text[:400],
    )

    submitted = session.post(f"{BACKEND_URL}/works/{work_id}/submit", timeout=30)
    check("Soumission", submitted.status_code == 200 and submitted.json().get("status") == "SUBMITTED", submitted.text[:300])

    decision = session.post(
        f"{BACKEND_URL}/works/{work_id}/decision",
        json={"decision_type": "VALIDATE_AFTER_DEFENSE", "comment": "OK full stack"},
        timeout=30,
    )
    check("Decision validation", decision.status_code == 201, decision.text[:300])

    archive = session.post(
        f"{BACKEND_URL}/works/{work_id}/archive",
        json={"access_level": "OPEN_ACCESS", "is_download_allowed": True},
        timeout=300,
    )
    check("Archivage + emission preuve IDS", archive.status_code == 201 and archive.json().get("is_verifiable") is True, archive.text[:500])

    summary = requests.get(f"{BACKEND_URL}/works/{work_id}/summary", timeout=240)
    check(
        "Resume IA live",
        summary.status_code == 200 and bool(summary.json().get("summary_short")),
        summary.text[:500],
    )

    similar = requests.get(f"{BACKEND_URL}/works/{work_id}/similar", timeout=120)
    check(
        "Similarite IA live",
        similar.status_code == 200 and isinstance(similar.json().get("results"), list),
        similar.text[:400],
    )

    assistant = requests.post(
        f"{BACKEND_URL}/ai/assistant/query",
        json={
            "question": "Que dit le document sur OpenScience Hub IDS IA Docker ?",
            "filters": {"work_id": work_id},
        },
        timeout=240,
    )
    assistant_data = assistant.json() if assistant.headers.get("content-type", "").startswith("application/json") else {}
    check(
        "Assistant IA live source",
        assistant.status_code == 200
        and assistant_data.get("answer_status") == "ANSWERED"
        and bool(assistant_data.get("sources")),
        assistant.text[:600],
    )

    proof = session.get(f"{BACKEND_URL}/works/{work_id}/proof", timeout=60)
    proof_data = proof.json()
    check("Preuve active", proof.status_code == 200 and proof_data.get("status") == "ACTIVE", proof.text[:400])
    check("Proof id disponible", bool(proof_data.get("id")), proof_data)

    verify = requests.get(f"{BACKEND_URL}/verify/{proof_data['proof_code']}", timeout=60)
    check("Verification publique VALID", verify.status_code == 200 and verify.json().get("result") == "VALID", verify.text[:400])

    revoke = session.post(
        f"{BACKEND_URL}/ssi/proofs/{proof_data['id']}/revoke",
        json={"reason": "full stack test"},
        timeout=60,
    )
    check("Revocation preuve", revoke.status_code == 200 and revoke.json().get("status") == "REVOKED", revoke.text[:300])

    revoked_verify = requests.get(f"{BACKEND_URL}/verify/{proof_data['proof_code']}", timeout=60)
    check(
        "Verification publique REVOKED",
        revoked_verify.status_code == 200 and revoked_verify.json().get("result") == "REVOKED",
        revoked_verify.text[:400],
    )

    reissue = session.post(f"{BACKEND_URL}/ssi/proofs/{proof_data['id']}/reissue", timeout=180)
    check("Reemission preuve", reissue.status_code == 200 and reissue.json().get("status") == "ACTIVE", reissue.text[:300])

    print("\nRESULTAT: full stack backend + IA + e-IDStack de IDS valide")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
