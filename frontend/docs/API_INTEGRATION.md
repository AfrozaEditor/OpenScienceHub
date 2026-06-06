# frontend — Intégration API (consommation du backend)

> Comment le frontend consomme l'**API du backend Django**. Le frontend **ne parle qu'au backend** (jamais `simba_ia` ni `e-IDStack` en direct). Référence backend : `../../docs/API_SPEC.md`. Voir [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 1. Principes

- **Base** : `NEXT_PUBLIC_API_BASE_URL=/api/v1` en Docker/dev. Next relaie ensuite vers `BACKEND_INTERNAL_API_BASE_URL` (`http://backend:8000/api/v1` en compose).
- **Auth** : JWT `Authorization: Bearer <access>`. Endpoints publics sans token.
- **Client centralisé** : `lib/api` (un wrapper `fetch`/`axios` + intercepteurs). Types alignés sur l'OpenAPI backend (`/api/schema`) — **génération de types recommandée** (`openapi-typescript`).
- **Cache & états** : TanStack Query (clé par ressource + filtres) ; mutations invalident les requêtes liées.
- **Erreurs** : mapper les codes backend (400/401/403/404/409/422/502) vers des messages UI clairs.

## 2. Authentification

```text
POST /auth/login      -> { access, refresh }
POST /auth/refresh    -> { access }
POST /auth/logout
GET  /accounts/me     -> profil + rôles + permissions
```
- Access token en mémoire ; refresh en stockage sécurisé (idéalement cookie httpOnly posé par le backend).
- Intercepteur : sur `401`, tenter `refresh` une fois, sinon rediriger `login`.
- `GET /accounts/me` au boot → construit navigation + gardes de rôle.

## 3. Endpoints par fonctionnalité (vue frontend)

### Déposant
```text
GET    /works                          # mes dossiers (filtres)
POST   /works                          # créer
GET    /works/{id}                     # détail
PATCH  /works/{id}                     # modifier (BROUILLON/CORRECTION_DEMANDEE)
POST   /works/{id}/contributors
POST   /works/{id}/documents           # upload PDF (multipart) -> hash
POST   /works/{id}/extract-metadata    # déclenche extraction IA (backend->simba_ia)
GET    /works/{id}/metadata-extraction # proposition IA + score
POST   /works/{id}/metadata/accept     # valider/corriger
POST   /works/{id}/submit              # soumission officielle
GET    /works/{id}/history
GET    /works/{id}/proof               # preuve (QR, statut)
```

### Validation
```text
GET  /validation/inbox
POST /works/{id}/assignments
POST /works/{id}/reviews
POST /works/{id}/corrections
PATCH /corrections/{id}
POST /works/{id}/metadata/validate
POST /works/{id}/decision              # checklist requise
POST /works/{id}/archive               # archivage -> preuve/QR
```

### Public (sans token)
```text
GET  /catalog
GET  /catalog/search                   # recherche à facettes
GET  /catalog/facets
GET  /catalog/{publicSlug}             # fiche publique
POST /ai/assistant/query               # Assistant IA (réponse + sources)
GET  /works/{id}/similar               # travaux similaires
GET  /verify/{proofCode}               # vérification publique
```

### Administration
```text
GET  /admin/dashboard
... /admin/users, /admin/roles, /admin/workflows, /admin/ai-settings,
    /admin/ssi/connection, /admin/proofs, /admin/stats, /admin/audit
```

## 4. Upload PDF (étape 3 du wizard)

- `multipart/form-data` vers `POST /works/{id}/documents`.
- Afficher la progression (XHR/`fetch` + `onUploadProgress`) ; à la fin, afficher nom, taille, pages, **hash SHA-256** renvoyé par le backend.
- Le **hash est calculé côté backend** (source de vérité) ; ne pas dépendre d'un hash client.

## 5. Assistant IA (toujours sourcé)

```http
POST /ai/assistant/query
{ "question": "Quels travaux parlent d'identité numérique universitaire ?",
  "filters": { "type": "MEMOIRE", "department": "Informatique", "year_min": 2022 } }
```
Réponse :
```json
{ "answer_status": "ANSWERED", "answer": "...", "sources": [ { "work_id": "...", "title": "...", "page": 12, "url": "/works/osh-..." } ] }
```
Règles UI :
- Afficher la réponse **et** la liste des **sources** (cliquables vers la fiche).
- Si `answer_status = NO_CONTEXT_FOUND` → message « Aucune source pertinente trouvée », pas de réponse inventée.
- Mention discrète : « Réponses basées sur les documents archivés ; vérifiez les sources. »
- Le frontend **ne connaît pas** `simba_ia` : il n'appelle que `/ai/assistant/query` du backend.

## 6. Vérification publique (sans wallet)

```http
GET /verify/{proofCode}
```
```json
{ "result": "VALID", "title": "...", "author": "...", "institution": "...",
  "document_hash": "9f2a...", "archived_at": "2026-06-02", "proof_status": "ACTIVE" }
```
- États UI : `VALID` (vert) / `INVALID_HASH` (rouge) / `NOT_FOUND` (gris) / `REVOKED` (rouge profond) / `EXPIRED` / `TECHNICAL_ERROR` (orange).
- Aucune installation requise côté vérificateur (page web). Pas de wallet.

## 7. Gestion des statuts métier

Certaines réponses renvoient un statut « métier » en 200 (ex. extraction `FAILED`, Assistant `NO_CONTEXT_FOUND`, preuve `SSI_PENDING`). L'UI doit les traiter explicitement (message + action), pas comme des erreurs réseau.

## 8. Politique API live

- Le frontend consomme le backend réel via `NEXT_PUBLIC_API_BASE_URL=/api/v1` et les rewrites Next.
- Les indisponibilités remontent comme statuts métier ou erreurs API explicites ; l'UI ne crée pas de fixtures de remplacement en runtime.

## 9. Types partagés

- Générer les types depuis l'OpenAPI backend (`/api/schema`) → `lib/api/types.ts`.
- Ne pas dupliquer les enums : refléter `WorkStatus`, `Visibility`, etc. depuis le backend (voir `../../docs/DATA_MODEL.md`).

## 10. Sécurité côté client

- Aucune clé IA/SSI dans le frontend ; seul le JWT utilisateur est manipulé.
- Gardes de routes par rôle (mais le backend reste l'autorité).
- Ne jamais afficher de données non autorisées ; respecter la visibilité renvoyée par le backend.
