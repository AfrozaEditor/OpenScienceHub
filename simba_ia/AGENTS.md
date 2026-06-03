# AGENTS.md — simba_ia (module IA d'OpenScience Hub)

Règles pour les assistants de code travaillant dans `simba_ia/`. Complète `../AGENTS.md` et `docs/SYSTEM_PROMPT.md`.

## Rôle

Microservice **IA** d'OpenScience Hub : **extraction de métadonnées PDF** + **Assistant IA** (RAG sourcé), **similarité**, **résumé**. **Python 3.12+ / FastAPI / Pydantic v2 / PostgreSQL + pgvector**. Appelé **uniquement par le backend Django** (pas d'accès public direct).

Docs de référence (lire avant de coder) : `docs/SYSTEM_PROMPT.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/RAG_PIPELINE.md`, `docs/DATA_MODEL.md`, `docs/API_SPEC.md`, `docs/INTEGRATION.md`, `docs/ROADMAP.md`, `docs/GLOSSARY.md`.

## Structure du code

```text
simba_ia/
├── pyproject.toml / requirements.txt
├── app/
│   ├── main.py            # FastAPI + /health
│   ├── core/              # config (pydantic-settings), logging, security (X-API-Key)
│   ├── api/v1/            # extract, index, assistant, similar, summarize
│   ├── schemas/           # Pydantic (requêtes/réponses)
│   ├── services/          # extraction, ingestion, retrieval, generation, similarity
│   ├── providers/         # base (interfaces), openai/local, mock
│   └── db/                # session, models (ai_chunk, ai_query_log...), repositories (pgvector)
└── tests/
```

## Conventions

- **Schémas Pydantic** pour toutes les I/O ; API versionnée `/v1` ; conforme à `docs/API_SPEC.md`.
- Logique IA dans les **services** ; providers derrière **interfaces** (`EmbeddingProvider`, `LLMProvider`) + factory + **`mock`**.
- Accès `pgvector` via repositories ; modèle de données = `docs/DATA_MODEL.md`.
- Tests `pytest` : extraction (champs+score), chunking, retrieval (filtres/visibilité), réponse sourcée (≥1 source), refus sans contexte.
- Qualité : `ruff` + `black`. Pas de commentaires qui paraphrasent le code.

## Commandes (à adapter une fois le projet initialisé)

```bash
pip install -r requirements.txt
docker compose up -d db            # PostgreSQL + pgvector (partagé avec le backend)
uvicorn app.main:app --reload --port 8001
pytest
ruff check . && black --check .
# Docs API : /docs  | schéma : /openapi.json
```

## Variables d'environnement

```text
DATABASE_URL=postgresql://...      # pgvector (schéma simba)
SIMBA_API_KEY=...                  # vérifie X-API-Key (même valeur que le backend)
EMBEDDING_PROVIDER=openai|mistral|local|mock
LLM_PROVIDER=openai|mistral|ollama|mock
OPENAI_API_KEY=... / MISTRAL_API_KEY=...   # jamais en clair dans le code
SIMBA_MODE=mock                    # mock | live
```

## Garde-fous (rappel)

- **L'IA propose, ne décide jamais** (extraction = proposition, validée par l'humain côté backend).
- **Réponses toujours sourcées** ; sans source pertinente → `NO_CONTEXT_FOUND`, jamais d'invention.
- **Respect des droits** : n'utiliser que les `allowed_visibilities`/filtres transmis par le backend ; jamais de document privé en réponse publique.
- **Pas de vérité métier** ici (dossiers, statuts, droits = backend) ; `simba_ia` stocke chunks/vecteurs/logs.
- **Secrets** via env ; auth `X-API-Key` ; pas d'exposition publique directe.
- **`mock` toujours disponible** (même interface que le réel) pour démo hors-ligne.
- Suivre le scope **Phase 1** de `docs/ROADMAP.md`.
