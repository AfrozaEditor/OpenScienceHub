def test_health_ok(client):
    resp = client.get("/health")

    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["mode"] == "live"
    assert body["embedding_provider"] == "mistral"
    assert body["llm_provider"] == "groq"
    assert body["db"] == "ok"
    assert {"embedding_provider", "llm_provider", "db"} <= body.keys()
