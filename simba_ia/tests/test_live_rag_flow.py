WORK = "77777777-7777-7777-7777-777777777901"
DOC = "88888888-8888-8888-8888-888888888901"
VER = "99999999-9999-9999-9999-999999999901"
PRIVATE_WORK = "77777777-7777-7777-7777-777777777902"
PRIVATE_VER = "99999999-9999-9999-9999-999999999902"
OTHER_WORK = "77777777-7777-7777-7777-777777777903"
OTHER_VER = "99999999-9999-9999-9999-999999999903"
FILTER_WORK = "77777777-7777-7777-7777-777777777904"
FILTER_VER = "99999999-9999-9999-9999-999999999904"

TEXT = (
    "OpenScience Hub archive les mémoires et thèses universitaires. "
    "La vérification repose sur un hash SHA-256 et une preuve d'authenticité. "
    "L'Assistant IA répond uniquement à partir de sources indexées et visibles."
)


def _index_payload(**overrides):
    payload = {
        "work_id": WORK,
        "document_id": DOC,
        "version_id": VER,
        "text": TEXT,
        "metadata": {
            "title": "Test live OpenScience Hub",
            "author": "Bell Aqil",
            "type": "MEMOIRE",
            "institution": "Université Test",
            "department": "Informatique",
            "year": 2026,
            "keywords": ["preuve", "assistant IA", "hash"],
        },
        "visibility": "PUBLIC",
    }
    payload.update(overrides)
    return payload


def test_live_index_then_assistant_returns_sourced_answer(client, auth_headers):
    index_resp = client.post("/v1/index", headers=auth_headers, json=_index_payload())

    assert index_resp.status_code == 200
    assert index_resp.json()["status"] == "INDEXED"
    assert index_resp.json()["chunk_count"] >= 1

    query_resp = client.post(
        "/v1/assistant/query",
        headers=auth_headers,
        json={
            "question": "Comment OpenScience Hub vérifie un mémoire ?",
            "filters": {"allowed_visibilities": ["PUBLIC"], "type": "MEMOIRE"},
            "top_k": 3,
        },
    )

    assert query_resp.status_code == 200
    body = query_resp.json()
    assert body["answer_status"] == "ANSWERED"
    assert body["answer"]
    assert body["sources"]
    assert body["sources"][0]["title"]
    assert 0.0 <= body["sources"][0]["score"] <= 1.0


def test_live_assistant_respects_visibility_filters(client, auth_headers):
    index_resp = client.post(
        "/v1/index",
        headers=auth_headers,
        json=_index_payload(work_id=PRIVATE_WORK, version_id=PRIVATE_VER, visibility="PRIVATE"),
    )
    assert index_resp.status_code == 200

    query_resp = client.post(
        "/v1/assistant/query",
        headers=auth_headers,
        json={
            "question": "Quelles preuves privées sont disponibles ?",
            "filters": {"allowed_visibilities": ["PUBLIC"], "type": "MEMOIRE"},
            "top_k": 3,
        },
    )

    assert query_resp.status_code == 200
    sources = query_resp.json()["sources"]
    assert all(source["work_id"] != PRIVATE_WORK for source in sources)


def test_live_assistant_can_filter_to_one_work(client, auth_headers):
    client.post("/v1/index", headers=auth_headers, json=_index_payload())
    client.post(
        "/v1/index",
        headers=auth_headers,
        json=_index_payload(
            work_id=FILTER_WORK,
            version_id=FILTER_VER,
            text=(
                "Ce document parle d'agriculture durable et de collecte de données "
                "sur les sols. Il ne traite pas de hash SHA-256."
            ),
            metadata={
                "title": "Agriculture durable",
                "author": "Autre Auteur",
                "type": "MEMOIRE",
                "department": "Agronomie",
                "year": 2026,
                "keywords": ["agriculture", "sols"],
            },
        ),
    )

    query_resp = client.post(
        "/v1/assistant/query",
        headers=auth_headers,
        json={
            "question": "Comment OpenScience Hub vérifie un mémoire avec un hash ?",
            "filters": {"allowed_visibilities": ["PUBLIC"], "work_id": FILTER_WORK},
            "top_k": 3,
        },
    )

    assert query_resp.status_code == 200
    sources = query_resp.json()["sources"]
    assert sources
    assert all(source["work_id"] == FILTER_WORK for source in sources)


def test_live_delete_index_removes_context(client, auth_headers):
    client.post("/v1/index", headers=auth_headers, json=_index_payload())

    delete_resp = client.delete(f"/v1/index/{VER}", headers=auth_headers)

    assert delete_resp.status_code == 200
    assert delete_resp.json()["deleted"] >= 1


def test_live_summarize_uses_indexed_chunks(client, auth_headers):
    client.post("/v1/index", headers=auth_headers, json=_index_payload())

    resp = client.post(
        "/v1/summarize",
        headers=auth_headers,
        json={"work_id": WORK, "mode": "reading_sheet"},
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body["generated_by_ai"] is True
    assert body["summary_short"]
    assert body["sources"]


def test_live_similar_returns_other_public_work(client, auth_headers):
    client.post("/v1/index", headers=auth_headers, json=_index_payload())
    client.post(
        "/v1/index",
        headers=auth_headers,
        json=_index_payload(
            work_id=OTHER_WORK,
            version_id=OTHER_VER,
            metadata={
                "title": "Authentification documentaire",
                "author": "Autre Auteur",
                "type": "MEMOIRE",
                "department": "Informatique",
                "year": "2025-2026",
                "keywords": ["document", "preuve"],
            },
        ),
    )

    resp = client.post(
        "/v1/similar",
        headers=auth_headers,
        json={
            "work_id": WORK,
            "filters": {"allowed_visibilities": ["PUBLIC"]},
            "top_k": 3,
        },
    )

    assert resp.status_code == 200
    results = resp.json()["results"]
    assert results
    assert all(result["work_id"] != WORK for result in results)
    assert results[0]["year"] == "2025-2026"
    assert 0.0 <= results[0]["score"] <= 1.0
