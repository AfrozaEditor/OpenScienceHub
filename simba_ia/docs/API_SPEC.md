# simba_ia — Spécification API (FastAPI)

> Contrat consommé par le **backend Django**. Préfixe `/v1`. Voir [INTEGRATION.md](INTEGRATION.md), [RAG_PIPELINE.md](RAG_PIPELINE.md), [DATA_MODEL.md](DATA_MODEL.md).

---

## 1. Conventions

- **Base** : `/v1/`. Format JSON ; identifiants = UUID (ceux du backend).
- **Auth service-to-service** : header `X-API-Key: <SIMBA_API_KEY>` requis (sauf `/health`).
- **Erreurs** : `{ "detail": "...", "code": "..." }` + codes HTTP (400, 401, 422, 500, 503 si provider indisponible).
- **Idempotence** : `/index` est idempotent par `version_id` (réindexe/remplace).
- **Docs** : OpenAPI auto (`/docs`, `/openapi.json`).
- **Statuts métier** : `answer_status` et `status` renvoyés dans le corps (pas seulement HTTP).

## 2. `GET /health`

Réponse :
```json
{ "status": "ok", "mode": "live", "embedding_provider": "openai", "llm_provider": "openai", "db": "ok" }
```

## 3. `POST /v1/extract` — Extraction de métadonnées

Requête :
```json
{
  "document_id": "uuid",
  "version_id": "uuid",
  "text": "texte du PDF (optionnel si file_url fourni)",
  "file_url": "https://.../memoire.pdf",
  "language_hint": "fr"
}
```

Réponse :
```json
{
  "status": "EXTRACTED",
  "confidence_score": 0.86,
  "metadata": {
    "title": "Système de vérification des diplômes par SSI",
    "authors": ["Bell Aqil"],
    "abstract": "...",
    "keywords": ["SSI", "DID", "Verifiable Credentials"],
    "scientific_domain": "Informatique",
    "problem_statement": "...",
    "methodology": "...",
    "main_results": "...",
    "language": "fr",
    "themes": ["identité numérique", "vérification"]
  },
  "raw_json": { "...": "réponse brute du modèle" }
}
```
Erreurs : `status: FAILED` (texte illisible/insuffisant), `503` (LLM indisponible).

## 4. `POST /v1/index` — Ingestion / indexation

Requête :
```json
{
  "work_id": "uuid",
  "document_id": "uuid",
  "version_id": "uuid",
  "file_url": "https://.../memoire.pdf",
  "text": "optionnel si déjà extrait",
  "metadata": {
    "title": "...", "author": "Bell Aqil", "type": "MEMOIRE",
    "institution": "Université de Yaoundé I", "department": "Informatique",
    "year": 2026, "keywords": ["SSI"], "status": "ARCHIVED"
  },
  "visibility": "PUBLIC"
}
```

Réponse :
```json
{ "status": "INDEXED", "version_id": "uuid", "chunk_count": 42 }
```
Notes : idempotent par `version_id` ; exécution possible en asynchrone (`status: PENDING` puis callback/poll). Erreurs : `FAILED` (PDF illisible).

### `DELETE /v1/index/{version_id}`
Supprime les chunks d'une version (retrait/visibilité changée). Réponse `{ "status": "DELETED" }`.

## 5. `POST /v1/assistant/query` — Assistant IA (réponse sourcée)

Requête :
```json
{
  "question": "Quels travaux parlent d'identité numérique universitaire ?",
  "filters": {
    "allowed_visibilities": ["PUBLIC"],
    "type": "MEMOIRE",
    "institution": null,
    "department": "Informatique",
    "year_min": 2022,
    "year_max": 2026
  },
  "top_k": 6
}
```

Réponse :
```json
{
  "answer_status": "ANSWERED",
  "answer": "Les travaux disponibles montrent trois axes ...",
  "key_points": ["vérification des diplômes", "identité décentralisée"],
  "sources": [
    { "work_id": "uuid", "title": "...", "author": "...", "page": 12, "score": 0.82, "excerpt": "..." }
  ]
}
```
Cas sans contexte :
```json
{ "answer_status": "NO_CONTEXT_FOUND", "answer": null, "sources": [] }
```
Règles : `ANSWERED` ⇒ `sources` non vide ; ne jamais renvoyer de réponse non sourcée ; respecter `allowed_visibilities` (transmis par le backend).

## 6. `POST /v1/similar` — Travaux similaires

Requête :
```json
{ "work_id": "uuid", "text": null, "filters": { "allowed_visibilities": ["PUBLIC"] }, "top_k": 5 }
```
Réponse :
```json
{
  "results": [
    { "work_id": "uuid", "title": "...", "type": "MEMOIRE", "year": 2025,
      "score": 0.78, "motifs": ["SSI", "diplômes numériques", "même méthodologie"] }
  ]
}
```

## 7. `POST /v1/summarize` — Résumé / fiche de lecture

Requête :
```json
{ "work_id": "uuid", "version_id": "uuid", "mode": "reading_sheet" }
```
Réponse :
```json
{
  "summary_short": "...",
  "summary_long": "...",
  "problem_statement": "...",
  "methodology": "...",
  "main_results": "...",
  "limitations": "...",
  "suggested_keywords": ["..."],
  "sources": [ { "page": 3, "excerpt": "..." } ],
  "generated_by_ai": true
}
```

## 8. Schémas Pydantic (indicatif)

```python
class ExtractRequest(BaseModel):
    document_id: UUID
    version_id: UUID
    text: str | None = None
    file_url: str | None = None
    language_hint: str | None = None

class AssistantFilters(BaseModel):
    allowed_visibilities: list[str] = ["PUBLIC"]
    type: str | None = None
    institution: str | None = None
    department: str | None = None
    year_min: int | None = None
    year_max: int | None = None

class AssistantQueryRequest(BaseModel):
    question: str
    filters: AssistantFilters = AssistantFilters()
    top_k: int = 6
```

## 9. Codes d'erreur

| Code | Cas |
|---|---|
| 401 | `X-API-Key` manquante/invalide |
| 422 | Requête mal formée (Pydantic) |
| 503 | Provider LLM/embeddings indisponible |
| 500 | Erreur interne (loggée) |

> Les statuts « métier » (`FAILED`, `NO_CONTEXT_FOUND`) sont renvoyés en 200 dans le corps, pour que le backend les traite proprement.

## 10. Alignement avec le backend

Le backend appelle ces endpoints via `ai/simba_client.py` (voir `../../docs/ARCHITECTURE.md` et `../../docs/API_SPEC.md`). Correspondances :
- Backend `POST /works/{id}/extract-metadata` → `simba_ia POST /v1/extract`.
- Backend archivage/indexation → `simba_ia POST /v1/index`.
- Backend `POST /ai/assistant/query` → `simba_ia POST /v1/assistant/query`.
- Backend `GET /works/{id}/similar` → `simba_ia POST /v1/similar`.
