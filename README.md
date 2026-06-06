# OpenScience Hub

**OpenScience Hub** est le hub intelligent des travaux scientifiques universitaires.

La plateforme permet d'**archiver**, **valider**, **explorer** et **vérifier** des mémoires, thèses et articles universitaires grâce à :

- une API centrale Django/DRF ;
- un frontend web multi-portails ;
- un microservice IA FastAPI (`simba_ia`) pour l'extraction PDF, l'indexation et l'Assistant IA sourcé ;
- une couche SSI basée sur **e-IDStack de IDS** pour les preuves d'authenticité et les QR codes de vérification.

> Règle produit majeure : le **dossier scientifique** (`ScientificWork`) est l'objet central, pas le PDF seul. Le PDF est une version documentaire rattachée au dossier.

---

## Sommaire

- [Vision Produit](#vision-produit)
- [Architecture Du Monorepo](#architecture-du-monorepo)
- [Services Et Ports](#services-et-ports)
- [Workflow Métier Global](#workflow-métier-global)
- [Portails Frontend](#portails-frontend)
- [Backend Django](#backend-django)
- [Microservice IA `simba_ia`](#microservice-ia-simba_ia)
- [SSI / e-IDStack De IDS](#ssi--e-idstack-de-ids)
- [QR Code Et Vérification Publique](#qr-code-et-vérification-publique)
- [Lancement Local Sans Build](#lancement-local-sans-build)
- [Lancement Docker Full Stack](#lancement-docker-full-stack)
- [Variables D'environnement](#variables-denvironnement)
- [Comptes Et Accès De Démo](#comptes-et-accès-de-démo)
- [API Principale](#api-principale)
- [Assistant IA Et Base De Connaissance](#assistant-ia-et-base-de-connaissance)
- [Processus De Validation](#processus-de-validation)
- [Démo En 3 Minutes](#démo-en-3-minutes)
- [Tests Et Vérifications](#tests-et-vérifications)
- [Dépannage](#dépannage)
- [Documentation De Référence](#documentation-de-référence)

---

## Vision Produit

OpenScience Hub répond à plusieurs problèmes récurrents dans les universités :

- archives dispersées ou non numérisées ;
- difficulté à retrouver un mémoire, une thèse ou un article ;
- absence de preuve numérique fiable ;
- faiblesse de la traçabilité des validations académiques ;
- risque de duplication ou de faux documents ;
- impossibilité pour un tiers de vérifier rapidement l'authenticité d'un travail.

La solution proposée est une plateforme institutionnelle qui couvre tout le cycle :

```text
Dépôt PDF
→ Extraction IA des métadonnées
→ Validation humaine
→ Archivage final
→ Preuve SSI
→ QR code public
→ Recherche + Assistant IA sourcé
```

L'IA ne décide jamais. Elle aide à extraire, résumer, indexer et retrouver les informations. La décision académique reste humaine.

---

## Architecture Du Monorepo

```text
OpenScienceHub/
├── backend/                 # API principale Django + DRF + PostgreSQL
├── frontend/                # Application web Next.js, 4 portails
├── simba_ia/                # Microservice IA FastAPI + pgvector
├── ids/                     # e-IDStack de IDS et composants tiers
│   ├── eidStack-CMU/        # Backend NestJS + Credo-TS
│   ├── e-IDapp_CMU/         # Wallet mobile, non utilisé dans le MVP web
│   └── eid-sandbox-CMU/
├── docs/                    # Documents produit, architecture et API
├── scripts/                 # Scripts de vérification full stack
├── docker-compose.yml       # Compose principal
└── docker-compose.dev.yml   # Overrides dev sans rebuild permanent
```

Le backend Django est le chef d'orchestre :

- il détient le modèle métier ;
- il applique l'authentification, le RBAC et les règles de confidentialité ;
- il appelle `simba_ia` pour l'IA ;
- il appelle e-IDStack de IDS pour la preuve SSI ;
- il expose une API unique consommée par le frontend.

---

## Services Et Ports

En environnement local courant :

| Service | Rôle | URL locale | URL LAN exemple |
|---|---|---|---|
| Frontend | Interface web | `http://localhost:3000` | `http://10.96.182.39:3000` |
| Backend | API Django | `http://localhost:8000` | `http://10.96.182.39:8000` |
| Swagger / schema | OpenAPI backend | `http://localhost:8000/api/docs/` | `http://10.96.182.39:8000/api/docs/` |
| `simba_ia` | IA FastAPI | `http://localhost:8001` | `http://10.96.182.39:8001` |
| e-IDStack API | SSI | `http://localhost:4001` | `http://10.96.182.39:4001` |
| Agent e-IDStack | Agent SSI local | `http://localhost:3021` | `http://10.96.182.39:3021` |
| PostgreSQL backend | DB métier | `localhost:5433` | Interne |
| PostgreSQL IDS | DB SSI | `localhost:5434` | Interne |
| PostgreSQL IA/pgvector | DB IA | `localhost:5435` | Interne |
| Redis | Cache/tâches | `localhost:6379` | Interne |

L'IP `10.96.182.39` est l'IP LAN de la machine de dev au moment de la rédaction. Pour une autre machine, remplacer par l'IP retournée par :

```bash
hostname -I | awk '{print $1}'
```

---

## Workflow Métier Global

Le workflow central est :

```text
BROUILLON
→ SOUMIS
→ EN_INSTRUCTION / EN_EXPERTISE
→ CORRECTION_DEMANDEE
→ RE_SOUMIS
→ VALIDE_APRES_SOUTENANCE / ARCHIVABLE
→ ARCHIVE
```

Correspondance métier :

| Statut | Sens |
|---|---|
| `BROUILLON` | Brouillon du déposant |
| `SOUMIS` | Dossier soumis, visible dans l'inbox validation |
| `EN_INSTRUCTION` / `EN_EXPERTISE` | Dossier en instruction ou expertise |
| `CORRECTION_DEMANDEE` | Correction demandée au déposant |
| `RE_SOUMIS` | Correction renvoyée par le déposant |
| `VALIDE` / `VALIDE_APRES_SOUTENANCE` | Validation académique terminée |
| `ARCHIVABLE` | Version finale prête pour archivage |
| `ARCHIVE` | Version finale verrouillée, publiée et prouvée |
| `REJETE` | Dossier rejeté |

Après archivage :

- une `ArchiveRecord` est créée ;
- la version finale est verrouillée ;
- le document est indexé pour la recherche et l'Assistant IA ;
- une preuve SSI est émise via e-IDStack de IDS ;
- un QR code de vérification publique est disponible.

---

## Portails Frontend

Le frontend Next.js expose quatre grands espaces.

### 1. Portail Public

Pages principales :

- `/` : accueil, recherche, derniers documents, Assistant IA flottant ;
- `/explorer` : catalogue et recherche à facettes ;
- `/documents/[id]` : détail public d'un document ;
- `/assistant` : page dédiée Assistant IA ;
- `/verify/[proofCode]` : vérification publique d'une preuve QR.

Objectifs :

- consulter les documents publics ;
- chercher par mots-clés, domaines, types ;
- interroger l'Assistant IA sur les sources autorisées ;
- vérifier une preuve sans compte.

### 2. Espace Déposant

Pages principales :

- `/deposant/dashboard` : résumé des dossiers du déposant ;
- `/deposant/mes-dossiers` : liste des dossiers ;
- `/deposant/deposer` : assistant de dépôt PDF ;
- `/deposant/dossier/[id]` : détail du dossier ;
- `/deposant/preuve/[id]` : preuve et QR après archivage.

Flux :

1. créer un dossier ;
2. uploader le PDF ;
3. déclencher l'extraction IA ;
4. valider/corriger les métadonnées ;
5. ajouter les contributeurs ;
6. soumettre ;
7. suivre la validation ;
8. consulter la preuve après archivage.

### 3. Espace Validation

Pages principales :

- `/validation/dashboard` : tableau de bord validation ;
- `/validation/a-traiter` : inbox des dossiers soumis ;
- `/validation/dossiers/[id]` : détail validation.

Actions :

- consulter les métadonnées et le PDF ;
- affecter un validateur ;
- ajouter un avis ;
- demander une correction ;
- valider les métadonnées ;
- prendre une décision ;
- archiver si le dossier est validé.

### 4. Administration

Pages principales :

- `/admin/dashboard` : KPIs et état des services ;
- `/admin/statistiques` : statistiques ;
- `/admin/audit` : journal des actions ;
- `/admin/utilisateurs` : utilisateurs ;
- `/admin/roles` : rôles et permissions ;
- `/admin/institutions` : institutions ;
- `/admin/structures` : facultés, départements, filières ;
- `/admin/types-documents` : référentiel documentaire ;
- `/admin/workflows` : workflows ;
- `/admin/ia` : paramètres IA ;
- `/admin/ssi` : connexion e-IDStack ;
- `/admin/preuves` : preuves et vérifications.

---

## Backend Django

Le backend est dans `backend/`.

Stack :

- Python ;
- Django 5 ;
- Django REST Framework ;
- SimpleJWT ;
- PostgreSQL ;
- `django-cors-headers` ;
- `drf-spectacular` ;
- `qrcode` + PIL pour les QR codes.

Apps principales :

| App | Rôle |
|---|---|
| `accounts` | utilisateurs, rôles, permissions, JWT |
| `institutions` | institutions, facultés, départements, programmes |
| `works` | dossiers scientifiques |
| `documents` | versions PDF, SHA-256, version finale |
| `ai` | client `simba_ia`, extraction, Assistant IA |
| `validation` | avis, corrections, décisions, soutenances |
| `archive` | archivage et publication |
| `search` | index local/facettes |
| `ssi` | preuve, QR, e-IDStack |
| `audit` | journal d'audit |
| `administration` | dashboard, settings, référentiels |

Docs API :

```text
http://localhost:8000/api/schema/
http://localhost:8000/api/docs/
```

---

## Microservice IA `simba_ia`

`simba_ia` est un service FastAPI indépendant.

Rôles :

- extraction de texte depuis PDF ;
- extraction de métadonnées ;
- indexation en chunks ;
- embeddings ;
- stockage vectoriel via pgvector ;
- Assistant IA sourcé ;
- résumé ;
- similarité entre travaux.

Endpoints importants côté IA :

| Endpoint | Rôle |
|---|---|
| `GET /health` | santé du service |
| `POST /v1/extract` | extraction métadonnées PDF |
| `POST /v1/index` | indexation d'un document |
| `POST /v1/assistant/query` | question/réponse sourcée |
| `POST /v1/similar` | travaux similaires |
| `POST /v1/summarize` | résumé |

Le frontend ne doit pas appeler `simba_ia` directement. Le frontend appelle le backend, et le backend orchestre.

Confidentialité IA :

- les documents publics sont interrogeables publiquement ;
- les documents privés ne sont interrogeables que dans un contexte authentifié et autorisé ;
- l'Assistant IA cite toujours ses sources ;
- l'IA ne valide jamais un dossier.

---

## SSI / e-IDStack De IDS

La preuve d'authenticité est déléguée à **e-IDStack de IDS**.

Règles :

- pas de crypto maison ;
- pas de DID/VC réimplémenté dans Django ;
- le backend orchestre uniquement ;
- e-IDStack signe et vérifie ;
- OpenScience Hub conserve la preuve en mode custodian ;
- le wallet mobile n'est pas utilisé dans le MVP.

Modèle MVP :

```text
Issuer  = Institution / OpenScience Hub
Holder  = Plateforme OpenScience Hub
Verifier = Public via page web de vérification
```

Flux SSI :

1. un dossier est validé ;
2. une version finale PDF est verrouillée ;
3. le hash SHA-256 de cette version est utilisé dans la preuve ;
4. le backend demande à e-IDStack l'émission d'un credential ;
5. le backend stocke la référence de credential ;
6. un `proof_code` et un QR code sont générés ;
7. le public scanne le QR ;
8. le backend vérifie hash + statut + preuve SSI ;
9. la page affiche le résultat.

---

## QR Code Et Vérification Publique

Le QR code ne contient pas les données sensibles du document.

Il contient uniquement :

- une URL publique de vérification ; ou
- un `proof_code`.

Exemple :

```text
http://10.96.182.39:3000/verify/OSH-VC-XXXX
```

La page publique appelle ensuite :

```text
GET /api/v1/verify/{proofCode}
```

Le backend vérifie :

- existence de la preuve ;
- statut de la preuve ;
- hash du document ;
- statut du credential ;
- cohérence entre version finale, archive et claim SSI.

Résultats possibles :

- `VALID` ;
- `INVALID_HASH` ;
- `NOT_FOUND` ;
- `REVOKED` ;
- `EXPIRED` ;
- `TECHNICAL_ERROR`.

---

## Lancement Local Sans Build

Ce mode est utile pendant la démo ou le développement rapide. Il évite les rebuilds Docker.

### 1. Monter uniquement les services nécessaires

```bash
docker compose stop backend
docker compose up -d --no-build backend_db simba_db ids_db redis ids simba_ia
```

### 2. Lancer le backend Django en direct

Depuis la racine :

```bash
LAN_IP=$(hostname -I | awk '{print $1}')

cd backend
python -m venv .venv
.venv/bin/pip install -r requirements.txt

DJANGO_SECRET_KEY=dev-openscience-hub-local-secret-key-change-in-prod \
DJANGO_DEBUG=True \
DATABASE_URL=postgresql://osh:osh@localhost:5433/osh \
DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1,0.0.0.0,$LAN_IP,*" \
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://$LAN_IP:3000" \
CORS_ALLOWED_ORIGIN_REGEXES='^http://([0-9]{1,3}\.){3}[0-9]{1,3}:3000$' \
SIMBA_MODE=live \
SIMBA_IA_URL=http://localhost:8001 \
SIMBA_API_KEY="..." \
BACKEND_PUBLIC_BASE_URL=http://$LAN_IP:8000 \
SSI_MODE=live \
EIDSTACK_BASE_URL=http://localhost:4001 \
EIDSTACK_API_KEY="..." \
EIDSTACK_ENVIRONMENT=TEST \
EIDSTACK_AGENT_ENDPOINT=http://$LAN_IP:3021 \
PUBLIC_VERIFY_BASE_URL=http://$LAN_IP:3000/verify \
.venv/bin/python manage.py migrate --noinput
```

Puis :

```bash
DJANGO_SECRET_KEY=dev-openscience-hub-local-secret-key-change-in-prod \
DJANGO_DEBUG=True \
DATABASE_URL=postgresql://osh:osh@localhost:5433/osh \
DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1,0.0.0.0,$LAN_IP,*" \
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://$LAN_IP:3000" \
CORS_ALLOWED_ORIGIN_REGEXES='^http://([0-9]{1,3}\.){3}[0-9]{1,3}:3000$' \
SIMBA_MODE=live \
SIMBA_IA_URL=http://localhost:8001 \
SIMBA_API_KEY="..." \
BACKEND_PUBLIC_BASE_URL=http://$LAN_IP:8000 \
SSI_MODE=live \
EIDSTACK_BASE_URL=http://localhost:4001 \
EIDSTACK_API_KEY="..." \
EIDSTACK_ENVIRONMENT=TEST \
EIDSTACK_AGENT_ENDPOINT=http://$LAN_IP:3021 \
PUBLIC_VERIFY_BASE_URL=http://$LAN_IP:3000/verify \
.venv/bin/python manage.py runserver 0.0.0.0:8000
```

### 3. Lancer le frontend Next.js

```bash
cd frontend
npm install

NEXT_PUBLIC_API_BASE_URL=/api/v1 \
BACKEND_INTERNAL_API_BASE_URL=http://localhost:8000/api/v1 \
NEXT_PUBLIC_FRONTEND_VERIFY_BASE_URL=http://$LAN_IP:3000/verify \
npm run dev -- --hostname 0.0.0.0 --port 3000
```

### 4. Vérifier

```bash
curl http://localhost:8000/api/schema/
curl http://localhost:8001/health
curl http://localhost:4001/api/docs-yaml
curl http://localhost:3000
```

Depuis une autre machine du réseau :

```text
http://<LAN_IP>:3000
```

---

## Lancement Docker Full Stack

Le mode Docker lance tout le runtime :

- frontend ;
- backend ;
- `simba_ia` ;
- e-IDStack ;
- PostgreSQL backend ;
- PostgreSQL IA ;
- PostgreSQL IDS ;
- Redis.

```bash
docker compose up -d --build
```

Si le port IDS `4000` est occupé :

```bash
IDS_API_PORT=4001 docker compose up -d --build
```

Mode dev avec volumes de code source :

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

Ce mode monte `backend/`, `frontend/` et `simba_ia/` dans les conteneurs. Le frontend utilise
`NEXT_PUBLIC_API_BASE_URL=/api/v1`; Next.js relaie ensuite les requêtes vers
`BACKEND_INTERNAL_API_BASE_URL=http://backend:8000/api/v1`. Cela évite d'exposer une URL backend
LAN codée en dur dans le navigateur.

Après le premier build, relancer sans rebuild tant que les dépendances ne changent pas :

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Rebuild seulement si changent :

- `backend/requirements.txt` ;
- `simba_ia/requirements.txt` ou `simba_ia/requirements-dev.txt` ;
- `frontend/package-lock.json` ;
- `ids/eidStack-CMU/package-lock.json` ;
- un `Dockerfile` ;
- une dépendance système.

Voir aussi : [`docs/FULL_STACK_DOCKER.md`](docs/FULL_STACK_DOCKER.md).

---

## Variables D'environnement

### Backend

```text
DJANGO_SECRET_KEY=...
DJANGO_DEBUG=True
DATABASE_URL=postgresql://osh:osh@localhost:5433/osh
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,<LAN_IP>,*
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://<LAN_IP>:3000
CORS_ALLOWED_ORIGIN_REGEXES=^http://([0-9]{1,3}\.){3}[0-9]{1,3}:3000$
SIMBA_MODE=live
SIMBA_IA_URL=http://localhost:8001
SIMBA_API_KEY=...
BACKEND_PUBLIC_BASE_URL=http://<LAN_IP>:8000
SSI_MODE=live
EIDSTACK_BASE_URL=http://localhost:4001
EIDSTACK_API_KEY=...
EIDSTACK_ENVIRONMENT=TEST
EIDSTACK_AGENT_ENDPOINT=http://<LAN_IP>:3021
PUBLIC_VERIFY_BASE_URL=http://<LAN_IP>:3000/verify
```

### Frontend

```text
NEXT_PUBLIC_API_BASE_URL=/api/v1
BACKEND_INTERNAL_API_BASE_URL=http://<LAN_IP>:8000/api/v1
NEXT_PUBLIC_FRONTEND_VERIFY_BASE_URL=http://<LAN_IP>:3000/verify
```

### `simba_ia`

```text
SIMBA_MODE=live
SIMBA_API_KEY=...
DATABASE_URL=postgresql+psycopg://simba:simba@localhost:5435/simba
GROQ_API_KEY=...
GEMINI_API_KEY=...
MISTRAL_API_KEY=...
```

Ne jamais committer de vraie clé API dans le dépôt.

---

## Comptes Et Accès De Démo

L'application utilise JWT pour le frontend et la session Django pour `/admin/`.

Pour créer un super-admin local :

```bash
cd backend
.venv/bin/python manage.py createsuperuser
```

Ou via shell Django :

```bash
.venv/bin/python manage.py shell
```

```python
from django.contrib.auth import get_user_model

User = get_user_model()
user, _ = User.objects.get_or_create(
    email="admin@openscience.local",
    defaults={"full_name": "Administrateur OpenScience Hub"},
)
user.is_staff = True
user.is_superuser = True
user.is_active = True
user.set_password("change-me")
user.save()
```

> Ne pas documenter de mot de passe réel dans le dépôt. Utiliser un mot de passe de démo local et le changer avant toute présentation publique.

---

## API Principale

Base :

```text
/api/v1/
```

### Auth

| Méthode | Endpoint | Rôle |
|---|---|---|
| `POST` | `/auth/register` | inscription |
| `POST` | `/auth/login` | login JWT |
| `POST` | `/auth/refresh` | refresh token |
| `GET` | `/accounts/me` | utilisateur courant |

### Dossiers

| Méthode | Endpoint | Rôle |
|---|---|---|
| `GET` | `/works` | dossiers du périmètre |
| `POST` | `/works` | créer |
| `GET` | `/works/{id}` | détail |
| `PATCH` | `/works/{id}` | modifier |
| `POST` | `/works/{id}/contributors` | contributeurs |
| `POST` | `/works/{id}/submit` | soumettre |

### Documents

| Méthode | Endpoint | Rôle |
|---|---|---|
| `POST` | `/works/{id}/documents` | upload PDF |
| `GET` | `/works/{id}/documents` | versions PDF |
| `POST` | `/documents/{versionId}/set-final` | version finale |

### IA

| Méthode | Endpoint | Rôle |
|---|---|---|
| `POST` | `/works/{id}/extract-metadata` | extraction IA |
| `GET` | `/works/{id}/metadata-extraction` | résultat extraction |
| `POST` | `/works/{id}/metadata/accept` | acceptation/correction |
| `POST` | `/ai/assistant/query` | Assistant IA |
| `GET` | `/works/{id}/similar` | similarité |
| `GET` | `/works/{id}/summary` | résumé |

### Validation

| Méthode | Endpoint | Rôle |
|---|---|---|
| `GET` | `/validation/inbox` | dossiers à traiter |
| `POST` | `/works/{id}/assignments` | affecter |
| `POST` | `/works/{id}/reviews` | avis |
| `POST` | `/works/{id}/corrections` | correction |
| `POST` | `/works/{id}/metadata/validate` | validation métadonnées |
| `POST` | `/works/{id}/decision` | décision |
| `POST` | `/works/{id}/archive` | archivage |

### Catalogue Et Vérification

| Méthode | Endpoint | Rôle |
|---|---|---|
| `GET` | `/catalog` | catalogue public |
| `GET` | `/catalog/search` | recherche |
| `GET` | `/catalog/facets` | facettes |
| `GET` | `/catalog/{slug}` | fiche publique |
| `GET` | `/verify/{proofCode}` | vérification publique |
| `GET` | `/works/{id}/proof` | preuve d'un dossier |

---

## Assistant IA Et Base De Connaissance

Le comportement attendu :

- public non connecté : l'assistant interroge uniquement les sources publiques ;
- utilisateur connecté : l'assistant peut interroger les sources autorisées du compte ;
- admin : accès au corpus de l'administration selon les règles backend ;
- déposant : accès à ses dossiers privés ou soumis ;
- l'Assistant IA retourne `NO_CONTEXT_FOUND` si aucun chunk pertinent n'est indexé ;
- l'Assistant IA retourne toujours des sources quand il répond.

Moments d'indexation :

- upload PDF ;
- acceptation des métadonnées ;
- soumission ;
- archivage final.

Pour un dossier privé non archivé, il doit être indexé avec visibilité `PRIVATE` et consulté avec un token utilisateur autorisé.

Exemple de question de démo :

```text
Parle-moi de Contrôle Continu INF312 Analyse Statistique
```

Résultat attendu si le dossier est indexé :

- `answer_status = ANSWERED` ;
- sources contenant `Contrôle Continu INF312 - Analyse Statistique`.

---

## Processus De Validation

### Déposant

1. Connexion.
2. Création du dossier.
3. Upload PDF.
4. Extraction IA.
5. Correction/validation des métadonnées proposées.
6. Ajout des contributeurs.
7. Soumission.

### Validateur / Admin

1. Ouvrir `/validation/a-traiter`.
2. Consulter le dossier.
3. Vérifier PDF, métadonnées et contributeurs.
4. Affecter un reviewer si nécessaire.
5. Ajouter un avis.
6. Demander une correction si nécessaire.
7. Valider les métadonnées.
8. Prendre une décision :
   - correction ;
   - validation ;
   - rejet ;
   - archivage selon le type.

### Archivage

1. La version finale est sélectionnée.
2. Le hash SHA-256 est conservé.
3. L'archive est créée.
4. L'index IA/recherche est mis à jour.
5. La preuve SSI est émise.
6. Le QR code devient disponible.
7. La fiche publique est consultable.

---

## Démo En 3 Minutes

### 0:00 - 0:30 : Page publique

Ouvrir :

```text
http://<LAN_IP>:3000
```

Montrer :

- accueil ;
- recherche ;
- catalogue ;
- Assistant IA flottant.

Phrase :

> OpenScience Hub centralise les mémoires, thèses et articles et les rend recherchables, vérifiables et exploitables par IA.

### 0:30 - 1:15 : Espace déposant

Ouvrir :

```text
/deposant/mes-dossiers
```

Montrer un dossier :

```text
Contrôle Continu INF312 - Analyse Statistique
```

Montrer :

- métadonnées ;
- PDF ;
- statut ;
- timeline ;
- mots-clés.

Phrase :

> Le déposant crée un dossier, téléverse son PDF, laisse l'IA proposer les métadonnées, puis soumet à validation.

### 1:15 - 2:00 : Assistant IA connecté

Question :

```text
Parle-moi de Contrôle Continu INF312 Analyse Statistique
```

Montrer :

- réponse sourcée ;
- sources du dossier ;
- différence entre corpus public et corpus connecté.

Phrase :

> L'assistant n'invente pas : il répond depuis les sources indexées et autorisées.

### 2:00 - 2:35 : Validation / Admin

Ouvrir :

```text
/validation/a-traiter
/admin/dashboard
/admin/structures
/admin/audit
/admin/ssi
```

Montrer :

- inbox ;
- structures académiques ;
- audit ;
- statut SSI.

Phrase :

> La validation reste humaine et chaque action sensible est auditée.

### 2:35 - 3:00 : Preuve / QR

Ouvrir :

```text
/admin/preuves
/verify/<proofCode>
```

Phrase :

> Une fois archivé, le document reçoit une preuve SSI. Le QR ne contient pas de données sensibles : il pointe vers une page qui vérifie le hash et le statut de la preuve côté serveur.

Phrase de conclusion :

> OpenScience Hub couvre tout le cycle : déposer, extraire, valider, archiver, explorer et vérifier.

---

## Tests Et Vérifications

### Backend

```bash
cd backend
.venv/bin/python manage.py check
.venv/bin/python manage.py test
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

### `simba_ia`

```bash
cd simba_ia
pytest
```

### Full Stack

```bash
python scripts/full_stack_live_check.py
```

Ce script vérifie notamment :

- santé backend ;
- santé `simba_ia` ;
- santé e-IDStack ;
- dépôt PDF ;
- extraction IA ;
- archivage ;
- preuve SSI ;
- vérification publique ;
- révocation/réémission.

### Checks rapides

```bash
curl http://localhost:8000/api/schema/
curl http://localhost:8001/health
curl http://localhost:4001/api/docs-yaml
curl http://localhost:3000
```

---

## Dépannage

### Le frontend s'ouvre sur l'IP LAN mais les boutons ne répondent pas

Cause probable : Next.js bloque les ressources dev cross-origin.

Solution : vérifier `frontend/next.config.ts` :

```ts
allowedDevOrigins: [...]
```

Puis redémarrer le frontend.

### Erreur Django `PatternError missing ), unterminated subpattern`

Cause : `CORS_ALLOWED_ORIGIN_REGEXES` a été parsé comme liste et coupé sur les virgules de `{1,3}`.

Solution : utiliser une seule chaîne regex côté settings et ne splitter que sur un séparateur sûr comme `;;`.

### L'Assistant IA ne trouve pas un dossier déposé

Vérifier :

1. le dossier a un PDF ;
2. le PDF est indexé dans `simba_ia` ;
3. l'utilisateur est connecté ;
4. l'appel frontend envoie le token JWT ;
5. les visibilités autorisées incluent `PRIVATE` si le dossier est privé ;
6. le `work_id` est filtré correctement si la question cible un dossier précis.

### Le dossier affiche `Fichier —`

Vérifier que la page charge :

```text
GET /api/v1/works/{id}/documents
```

Le détail dossier doit utiliser la dernière `DocumentVersion`.

### Backend accessible localement mais pas depuis une autre machine

Vérifier :

- `runserver 0.0.0.0:8000` ;
- `DJANGO_ALLOWED_HOSTS` contient l'IP LAN ou `*` en local ;
- CORS contient `http://<LAN_IP>:3000` ;
- firewall local ;
- frontend lancé avec `--hostname 0.0.0.0`.

### IDS sur port 4000 déjà occupé

Utiliser :

```bash
IDS_API_PORT=4001 docker compose up -d --no-build ids
```

---

## Sécurité Et Confidentialité

Règles impératives :

- aucun secret réel dans Git ;
- les clés IA et e-IDStack restent côté serveur ;
- le frontend ne reçoit jamais les clés ;
- les documents privés ne doivent pas apparaître dans le catalogue public ;
- l'Assistant IA public ne doit interroger que le public ;
- les preuves QR ne contiennent pas de données sensibles ;
- l'audit garde la trace des actions sensibles ;
- les décisions académiques restent humaines.

---

## Documentation De Référence

Documents principaux :

- [`docs/PRD.md`](docs/PRD.md) : vision produit et exigences ;
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) : architecture technique ;
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) : modèle de données ;
- [`docs/API_SPEC.md`](docs/API_SPEC.md) : endpoints API ;
- [`docs/SSI_INTEGRATION.md`](docs/SSI_INTEGRATION.md) : intégration e-IDStack ;
- [`docs/FULL_STACK_DOCKER.md`](docs/FULL_STACK_DOCKER.md) : runbook Docker ;
- [`docs/ROADMAP.md`](docs/ROADMAP.md) : roadmap ;
- [`docs/GLOSSARY.md`](docs/GLOSSARY.md) : vocabulaire.

---

## Glossaire Court

| Terme | Sens |
|---|---|
| Dossier scientifique | Objet métier central représentant mémoire, thèse ou article |
| DocumentVersion | Version PDF attachée au dossier |
| ArchiveRecord | Publication archivée d'une version finale |
| Assistant IA | Interface question/réponse sourcée |
| `simba_ia` | Microservice IA FastAPI |
| SSI | Self-Sovereign Identity, utilisée ici pour la preuve |
| e-IDStack de IDS | Service externe responsable des credentials |
| Proof code | Identifiant public de vérification |
| QR | Lien vers la page publique de vérification |
| Hash SHA-256 | Empreinte cryptographique du PDF final |

---

## Statut Actuel Du MVP

Fonctionnalités intégrées :

- frontend multi-portails ;
- backend API Django ;
- auth JWT ;
- création et soumission de dossiers ;
- upload PDF ;
- extraction IA ;
- indexation IA ;
- Assistant IA public et connecté ;
- validation ;
- administration ;
- audit ;
- SSI via e-IDStack ;
- QR code de vérification ;
- accès LAN ;
- lancement sans rebuild ;
- Docker full stack.

Points à renforcer avant production :

- durcissement RBAC fin par périmètre ;
- tâches asynchrones Celery pour extraction/indexation/SSI ;
- stockage S3 ou compatible ;
- HTTPS obligatoire ;
- gestion avancée des workflows ;
- monitoring centralisé ;
- rotation des secrets ;
- tests e2e frontend automatisés.
