# simba_ia — Roadmap

> Priorisation du microservice IA. Voir [PRD.md](PRD.md), [RAG_PIPELINE.md](RAG_PIPELINE.md), [API_SPEC.md](API_SPEC.md).

---

## Phase 1 — Socle compétition (MVP démontrable)

Objectif : alimenter la démo backend — dépôt → **extraction IA** → indexation → **Assistant IA sourcé** → travaux similaires.

- API FastAPI : `/health`, `/extract`, `/index`, `/assistant/query`, `/similar`.
- Extraction de métadonnées (≥ 6 champs + `confidence_score`), sortie JSON validée (Pydantic).
- Ingestion : parse PDF (`pypdf`/`pdfplumber`) → nettoyage → chunking simple → embeddings → `pgvector`.
- Retrieval hybride minimal (filtres `allowed_visibilities`, `type`, `department`, `year` + similarité cosine).
- Génération **sourcée** (citations) + refus `NO_CONTEXT_FOUND` sans contexte.
- Similarité basique (top-k + motifs).
- Providers : 1 réel (OpenAI **ou** Mistral **ou** local) + **`mock`** (embeddings + LLM simulés).
- Auth `X-API-Key`, logs structurés, `ai_chunk` / `ai_query_log`.

### Critères de sortie Phase 1
- Extraction renvoie ≥ 6 champs + score sur un PDF de démo.
- 100 % des réponses `ANSWERED` contiennent ≥ 1 source ; refus propre sinon.
- Respect des `allowed_visibilities` (jamais de privé en public).
- Démo complète possible en **mode `mock`** (sans clé externe).

## Phase 2 — Qualité et robustesse

- `/summarize` (résumé / fiche de lecture) sourcé.
- **Reranking** des passages (cross-encoder) pour la précision.
- Chunking sémantique (par sections/titres) + dé-hyphénation avancée.
- Cache d'embeddings (documents + requêtes fréquentes) ; ingestion asynchrone (Celery/Redis).
- Multilingue (FR/EN) robuste ; détection de langue.
- Métriques (latence, taux de `NO_CONTEXT_FOUND`, couverture des sources) + feedback de réponse.
- `DELETE /v1/index/{version_id}` et synchronisation fine des visibilités.

## Phase 3 — Échelle et finesse

- OCR des PDF scannés (`pytesseract`).
- Évaluation automatique des réponses (groundedness, citation accuracy).
- Similarité avancée (détection de proximité fine, regroupement thématique).
- Tendances scientifiques (clustering de l'archive).
- Support multi-tenant / multi-institutions, quotas et coûts par institution.
- Garde-fous renforcés (modération, détection de prompt injection).

## À éviter pendant la compétition

- Fine-tuning de modèles, pipeline distribué, infra lourde.
- Réimplémenter la recherche à facettes (elle reste côté backend).
- Exposer `simba_ia` directement au public (toujours via le backend).
- Répondre sans source (interdit) ; stocker la vérité métier (rôle du backend).

## Ordre d'implémentation recommandé (Phase 1)

```text
1. app/core (config, logging, auth X-API-Key) + /health
2. providers (interfaces + mock) 
3. ingestion : parse PDF -> chunk -> embeddings (mock) -> pgvector
4. /index
5. retrieval hybride + /assistant/query (sourcé)
6. /extract (métadonnées + score)
7. /similar
8. provider réel (OpenAI/Mistral/local) + bascule live
9. logs ai_query_log + tests garde-fous
```
