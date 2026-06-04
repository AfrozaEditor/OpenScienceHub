# OpenScience Hub — Backend (Django + DRF)

API du hub intelligent des travaux scientifiques universitaires. Voir la doc de conception dans `../docs/` et les règles agent dans `AGENTS.md`.

## Stack
Python 3.11+ · Django 5 · Django REST Framework · PostgreSQL · JWT · drf-spectacular · Docker.

> Validé de bout en bout : `manage.py check` (0 problème), migrations appliquées sur PostgreSQL, et **33/33 tests E2E** (`scripts/e2e_check.py`) couvrant tout le parcours + l'orchestration des services : dépôt → upload (hash) → **extraction IA (simba_ia)** → validation → décision → archivage → **indexation (simba_ia)** + **émission preuve (e-IDStack)** + QR → vérification publique → catalogue/facettes → Assistant IA / résumé / similaires → inbox validation → corrections (PATCH) → dashboard/stats/audit admin → **révocation/réémission/test-connexion e-IDStack** → document-types.

## Architecture orientée services

Le backend est le **chef d'orchestre** ; il appelle deux services externes via des clients dédiés (avec mode `mock` pour tourner hors-ligne) :
- **`apps/ai/client.py` → `simba_ia`** : `extract`, `index`, `assistant_query`, `similar`, `summarize`.
- **`apps/ssi/client.py` → `e-IDStack de IDS`** : `get_issuer_did`, `offer_credential`, `verify_credential`. SSI **sans wallet** (plateforme dépositaire, vérification web).

## Démarrage Docker (recommandé, de A à Z)

### Backend + IDS/e-IDStack réels

Depuis la racine `OpenScienceHub`, ce compose lance le backend Django, IDS/e-IDStack NestJS, deux bases PostgreSQL séparées et Redis :

```bash
docker compose -f docker-compose.backend-ids.yml up --build
```

Ports locaux :
- Backend : http://localhost:8000
- Swagger backend : http://localhost:8000/api/docs/
- IDS/e-IDStack : http://localhost:4000/api/docs
- Agent DIDComm IDS : http://localhost:3021
- PostgreSQL backend : `localhost:5433`
- PostgreSQL IDS : `localhost:5434`

Test réseau réel backend → IDS :

```bash
cd backend
python scripts/live_backend_ids_check.py
```

Ce test attend les services, initialise l'agent IDS via `/credo-agent/initAgent`, se connecte au backend avec `admin@openscience.local` / `adminpass`, puis appelle `/api/v1/admin/ssi/test-connection`. Il nécessite l'accès réseau au ledger de test BCovrin utilisé par IDS.

> Note : `SSI_MODE=live` valide la communication avec IDS. Pour émettre une vraie offre AnonCreds lors de l'archivage, il faut créer un schema + credential definition dans IDS et renseigner `EIDSTACK_CREDENTIAL_DEFINITION_ID` dans `backend/.env` ou dans le compose. Sans cette valeur, l'archivage reste fonctionnel mais la preuve SSI passe en attente côté backend.

### Backend seul

```bash
cd OpenScienceHub/backend
docker compose up --build
```

Au démarrage, le conteneur `web` :
1. attend PostgreSQL,
2. applique les migrations (`makemigrations` + `migrate`),
3. collecte les fichiers statiques,
4. crée un superuser (`admin@openscience.local` / `adminpass`),
5. lance Gunicorn sur le port 8000.

Accès :
- API : http://localhost:8000/api/v1/
- Documentation OpenAPI (Swagger) : http://localhost:8000/api/docs/
- Schéma : http://localhost:8000/api/schema/
- Admin Django : http://localhost:8000/admin/

## Démarrage local (sans Docker)

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # ajuster DATABASE_URL
docker compose up -d db         # ou un PostgreSQL local
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Parcours d'API (Phase 1)

| Étape | Endpoint |
|---|---|
| Inscription | `POST /api/v1/auth/register` |
| Connexion (JWT) | `POST /api/v1/auth/login` |
| Profil | `GET /api/v1/accounts/me` |
| Créer un dossier | `POST /api/v1/works` |
| Ajouter un contributeur | `POST /api/v1/works/{id}/contributors` |
| Upload PDF (+ hash) | `POST /api/v1/works/{id}/documents` |
| Extraction IA | `POST /api/v1/works/{id}/extract-metadata` |
| Valider métadonnées | `POST /api/v1/works/{id}/metadata/accept` |
| Soumettre | `POST /api/v1/works/{id}/submit` |
| Avis / correction / décision | `POST /api/v1/works/{id}/reviews|corrections|decision` |
| Inbox validation | `GET /api/v1/validation/inbox` |
| Répondre/valider correction | `PATCH /api/v1/corrections/{id}` |
| Valider métadonnées | `POST /api/v1/works/{id}/metadata/validate` |
| Soutenance | `GET/POST /api/v1/works/{id}/defense` |
| Archiver (+ index simba_ia + preuve/QR) | `POST /api/v1/works/{id}/archive` |
| Catalogue public | `GET /api/v1/catalog` · `GET /api/v1/catalog/search` · `GET /api/v1/catalog/facets` |
| Fiche publique | `GET /api/v1/catalog/{slug}` |
| Assistant IA / résumé / similaires | `POST /api/v1/ai/assistant/query` · `GET /api/v1/works/{id}/summary` · `GET /api/v1/works/{id}/similar` |
| Vérification publique | `GET /api/v1/verify/{proof_code}` |
| Preuve : révoquer / réémettre | `POST /api/v1/ssi/proofs/{id}/revoke|reissue` |
| SSI : connexion / test | `GET/PUT /api/v1/admin/ssi/connection` · `POST /api/v1/admin/ssi/test-connection` |
| Admin : dashboard / stats / audit | `GET /api/v1/admin/dashboard|stats|audit` |
| Admin : types docs / workflows | `/api/v1/admin/document-types` · `/api/v1/admin/workflows` |
| Admin : paramètres IA / recherche | `GET /api/v1/admin/ai-settings|search-settings` |

## Intégrations
- **simba_ia** (IA) : `SIMBA_MODE=mock|live`, `SIMBA_IA_URL`, `SIMBA_API_KEY`.
- **e-IDStack de IDS** (SSI) : `SSI_MODE=mock|live`, `EIDSTACK_BASE_URL`, `EIDSTACK_API_KEY`. Modèle **sans wallet** (plateforme dépositaire, vérification web).

En mode `mock`, l'extraction IA et l'émission de preuve fonctionnent **sans services externes** (idéal démo).

## Structure
Voir `AGENTS.md` (apps : common, accounts, institutions, works, documents, validation, archive, search, ai, ssi, audit).
