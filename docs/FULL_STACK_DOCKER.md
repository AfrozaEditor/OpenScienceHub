# OpenScience Hub — Runbook Docker Full Stack

Ce runbook démarre le runtime local complet :

- backend Django
- `simba_ia` FastAPI en live strict
- e-IDStack de IDS en live custodian
- PostgreSQL backend, PostgreSQL pgvector IA, PostgreSQL IDS
- Redis

## Prérequis

Créer/configurer `simba_ia/.env` avec les clés live IA (`MISTRAL_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY`). Le compose surcharge seulement les URLs internes et `SIMBA_API_KEY`.

Le flux SSI choisi est **custodian sans wallet externe**. Le backend appelle e-IDStack via :

- `POST /openscience/bootstrap`
- `POST /openscience/credentials`
- `GET /openscience/credentials/{credentialId}/status`

## Build Et Démarrage

```bash
docker compose up -d --build
```

Services exposés :

- backend : `http://localhost:8000`
- frontend : `http://localhost:3000`
- `simba_ia` : `http://localhost:8001`
- e-IDStack de IDS API : `http://localhost:4000` (`IDS_API_PORT=4001` si le port 4000 est déjà occupé)
- agent e-IDStack : `http://localhost:3021`

Healthchecks :

```bash
docker compose ps
curl http://localhost:8000/api/schema/
curl http://localhost:8001/health
curl http://localhost:4000/api/docs-yaml
```

## Test Full Stack

Après démarrage complet :

```bash
python scripts/full_stack_live_check.py
```

Si l’API IDS est exposée sur un autre port hôte :

```bash
IDS_URL=http://localhost:4001 python scripts/full_stack_live_check.py
```

Le test couvre :

- health backend, IA, IDS
- bootstrap DID/schema/credential definition
- upload PDF
- extraction IA live
- archivage
- émission preuve IDS live
- vérification publique
- révocation
- réémission

## Mode Dev Sans Rebuild

Pour modifier le code sans rebuild à chaque changement :

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Ce mode monte les sources en volume :

- backend : `python manage.py runserver`
- `simba_ia` : `uvicorn --reload`
- IDS : target Docker `builder` + `npm run start:dev`
- frontend : `next dev` avec sources montées

Rebuild seulement si ces fichiers changent :

- `backend/requirements.txt`
- `simba_ia/requirements.txt`
- `ids/eidStack-CMU/package-lock.json`
- `frontend/package-lock.json`
- un `Dockerfile`
- une dépendance système

## Reset Volumes

Attention : supprime les bases locales.

```bash
docker compose down -v
```

## Logs Utiles

```bash
docker compose logs -f backend
docker compose logs -f simba_ia
docker compose logs -f ids
```

## Variables Importantes

Backend :

```text
SIMBA_MODE=live
SIMBA_IA_URL=http://simba_ia:8001
BACKEND_PUBLIC_BASE_URL=http://backend:8000
SSI_MODE=live
EIDSTACK_BASE_URL=http://ids:4000
EIDSTACK_AGENT_ENDPOINT=http://localhost:3021
PUBLIC_VERIFY_BASE_URL=http://localhost:3000/verify
```

Frontend :

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_FRONTEND_VERIFY_BASE_URL=http://localhost:3000/verify
```

## Test Depuis Une Autre Machine Du Réseau

1. Trouver l'IP de la machine qui lance Docker, par exemple `192.168.1.20`.
2. Démarrer avec :

```bash
LAN_HOST_IP=192.168.1.20 docker compose up -d --build
```

3. Depuis un téléphone ou un autre PC du même réseau, ouvrir :

```text
http://192.168.1.20:3000
```

Le frontend appelle alors `http://192.168.1.20:8000/api/v1`. Les QR codes doivent pointer vers `http://192.168.1.20:3000/verify/{proofCode}` afin que le scan mobile affiche la page publique, puis que cette page interroge le backend pour vérifier la preuve et le hash.

IDS :

```text
DATABASE_URL=postgresql://postgres:postgres@ids_db:5432/polyid_db?schema=public
BCOVRIN_TESTNET_URL=https://test.bcovrin.vonx.io/register
INDY_NETWORK_NAMESPACE=bcovrin:test
CREDO_ALLOW_INSECURE_HTTP=true
OPENSCIENCE_DISABLE_DIDCOMM=true
```

`CREDO_ALLOW_INSECURE_HTTP=true` est prévu pour le local uniquement. En staging/production, utiliser des URLs HTTPS publiques.
`OPENSCIENCE_DISABLE_DIDCOMM=true` désactive les transports OOB/wallet dans le compose local custodian ; le bootstrap DID/schema/cred-def et le credential custodian OpenScience restent actifs.
