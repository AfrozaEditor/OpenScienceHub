# AGENTS.md — backend OpenScience Hub

Règles pour les assistants de code travaillant dans `backend/`. Complète `../AGENTS.md` et `../docs/SYSTEM_PROMPT.md`.

## Rôle

API principale d'OpenScience Hub. **Python 3.12+ / Django 5.x / Django REST Framework / PostgreSQL (pgvector)**. Orchestre `simba_ia` (IA) et `ids/eidStack-CMU` (SSI). Ne pas introduire d'autre framework (pas de FastAPI/Node ici).

## Architecture du code (apps Django)

```text
backend/
├── manage.py
├── pyproject.toml / requirements.txt
├── config/                 # settings, urls, wsgi/asgi, celery
└── apps/
    ├── common/             # TimeStampedModel (UUID + timestamps), permissions de base, pagination
    ├── accounts/           # User, Role, Permission, UserRoleAssignment, JWT
    ├── institutions/       # Institution, Faculty, Department, AcademicProgram
    ├── works/              # ScientificWork, WorkContributor, services workflow
    ├── documents/          # DocumentVersion (upload, SHA-256, version finale)
    ├── validation/         # ValidationAssignment, Review, CorrectionRequest, Decision, DefenseSession, WorkflowEvent
    ├── archive/            # ArchiveRecord
    ├── search/             # SearchIndexEntry, FacetDefinition, SearchFacetValue
    ├── ai/                 # simba_client, MetadataExtraction, AIKnowledgeChunk, AIQueryLog
    ├── ssi/                # eidstack_client, VerifiableCredential, VerificationProof, vérification publique
    └── audit/              # AuditEvent (immuable), stats
```

## Conventions

- Modèles : `UUID` PK, `created_at`/`updated_at`, enums via `models.TextChoices` (voir `../docs/DATA_MODEL.md`).
- Logique métier dans des **services** (`works/services.py`, `validation/services.py`, `ssi/services.py`), pas dans les vues.
- DRF : `ViewSet` + `Serializer` + `permissions` explicites ; pagination par défaut ; endpoints conformes à `../docs/API_SPEC.md`.
- Clients externes : `apps/ai/client.py` et `apps/ssi/client.py` (timeouts, retries, mode `live` obligatoire, `SSI_PENDING`).
- Migrations toujours fournies. Tests `pytest`/`pytest-django` pour chaque règle métier critique.
- Qualité : `ruff` + `black`. Pas de commentaires qui paraphrasent le code.

## Commandes (à adapter une fois le projet initialisé)

```bash
# Dépendances
pip install -r requirements.txt

# Base de données (dev)
docker compose up -d db redis

# Migrations & lancement
python manage.py migrate
python manage.py runserver

# Tests & qualité
pytest
ruff check . && black --check .

# Docs API
# Swagger UI : /api/docs   | schéma OpenAPI : /api/schema
```

## Variables d'environnement

```text
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SIGNING_KEY=...
STORAGE_BACKEND=local|s3
SIMBA_IA_URL=http://localhost:8001
EIDSTACK_BASE_URL=http://localhost:3000
EIDSTACK_API_KEY=...            # jamais renvoyé par l'API
EIDSTACK_ENVIRONMENT=TEST
SSI_MODE=live
```

## Garde-fous (rappel)

- L'IA propose, l'humain valide ; aucune décision automatique.
- SSI uniquement via e-IDStack ; preuve après archivage ; cohérence des hash.
- Secrets via env ; jamais exposés par l'API.
- RBAC par périmètre ; pas de fuite de documents privés.
- Actions sensibles auditées.
- Suivre le scope **Phase 1** de `../docs/ROADMAP.md` ; si un service externe n'est pas prêt, retourner un état explicite et auditable, jamais un résultat simulé.
