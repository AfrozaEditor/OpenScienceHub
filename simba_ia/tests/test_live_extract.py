DOC = "88888888-8888-8888-8888-888888888801"
VER = "99999999-9999-9999-9999-999999999901"

SAMPLE = (
    "Système de vérification des mémoires universitaires\n"
    "Auteur: Bell Aqil\n"
    "Résumé: Ce mémoire présente une plateforme qui archive les travaux scientifiques, "
    "calcule un hash SHA-256 et vérifie leur authenticité avec une preuve numérique.\n"
    "Mots-clés: archive, hash, preuve, mémoire"
)


def test_extract_requires_api_key(client):
    resp = client.post(
        "/v1/extract",
        json={"document_id": DOC, "version_id": VER, "text": SAMPLE},
    )

    assert resp.status_code == 401


def test_extract_live_returns_structured_metadata(client, auth_headers):
    resp = client.post(
        "/v1/extract",
        headers=auth_headers,
        json={"document_id": DOC, "version_id": VER, "text": SAMPLE, "language_hint": "fr"},
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "EXTRACTED"
    assert 0.0 <= body["confidence_score"] <= 1.0
    assert body["metadata"]["title"]
    assert isinstance(body["metadata"]["authors"], list)
    assert isinstance(body["metadata"]["keywords"], list)


def test_extract_rejects_malformed(client, auth_headers):
    resp = client.post("/v1/extract", headers=auth_headers, json={"text": SAMPLE})

    assert resp.status_code == 422
