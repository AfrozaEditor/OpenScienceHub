# OpenScience Hub — Spécification API (backend Django + DRF)

> Endpoints REST par module. Conventions globales puis détail. Voir [DATA_MODEL.md](DATA_MODEL.md), [SSI_INTEGRATION.md](SSI_INTEGRATION.md), [PRD.md](PRD.md).

---

## 1. Conventions

- **Base** : `/api/v1/`.
- **Format** : JSON. Dates ISO 8601 (UTC). Identifiants = UUID.
- **Auth** : `Authorization: Bearer <access_token>` (JWT). Endpoints publics explicitement marqués `[public]`.
- **Pagination** : `?page=&page_size=` ; réponse `{ count, next, previous, results }`.
- **Filtres** : query params (`?status=&type=&institution=`...). Tri : `?ordering=-created_at`.
- **Erreurs** : `{ "detail": "...", "code": "...", "errors": { champ: [..] } }` ; codes HTTP standard (400, 401, 403, 404, 409, 422, 502 pour erreurs SSI/IA).
- **RBAC** : chaque endpoint déclare permissions + périmètre. Un utilisateur n'accède qu'à son périmètre.
- **Docs vivantes** : `GET /api/schema` (OpenAPI), `GET /api/docs` (Swagger UI) via `drf-spectacular`.

## 2. Auth & comptes (`/auth`, `/accounts`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Inscription déposant |
| POST | `/auth/login` | public | Login → `{ access, refresh }` |
| POST | `/auth/refresh` | public | Rafraîchir le token |
| POST | `/auth/logout` | user | Invalider le refresh |
| GET | `/accounts/me` | user | Profil courant + rôles/permissions |
| PATCH | `/accounts/me` | user | Modifier profil |
| POST | `/accounts/me/change-password` | user | Changer mot de passe |
| GET | `/accounts/users` | admin | Lister (filtres: role, institution, status) |
| POST | `/accounts/users` | admin | Créer un utilisateur |
| PATCH | `/accounts/users/{id}` | admin | Modifier / suspendre / désactiver |
| POST | `/accounts/users/{id}/roles` | admin | Attribuer un rôle (avec périmètre) |
| GET | `/accounts/roles` | admin | Rôles |
| GET | `/accounts/permissions` | admin | Permissions |

## 3. Référentiel académique (`/institutions`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| GET/POST | `/institutions` | mixte | Lister `[public]` (réduit) / créer (admin) |
| GET/PATCH | `/institutions/{id}` | mixte | Détail / modifier |
| GET/POST | `/institutions/{id}/faculties` | mixte | Facultés |
| GET/POST | `/faculties/{id}/departments` | mixte | Départements |
| GET/POST | `/departments/{id}/programs` | mixte | Programmes |

## 4. Dossiers scientifiques (`/works`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/works` | user | Mes dossiers (déposant) / périmètre (validateur) |
| POST | `/works` | déposant | Créer un dossier (type, infos académiques) |
| GET | `/works/{id}` | user | Détail (selon permissions) |
| PATCH | `/works/{id}` | déposant | Modifier (si `BROUILLON` / `CORRECTION_DEMANDEE`) |
| POST | `/works/{id}/contributors` | déposant | Ajouter un contributeur |
| POST | `/works/{id}/submit` | déposant | Soumettre officiellement → `SOUMIS` |
| GET | `/works/{id}/history` | user | Événements (`WorkflowEvent`) |
| GET | `/works/{id}/timeline` | user | Timeline de statut |

### Documents & versions
| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/works/{id}/documents` | déposant | Upload PDF (multipart) → version + hash SHA-256 |
| GET | `/works/{id}/documents` | user | Lister versions |
| GET | `/documents/{versionId}` | user | Détail version |
| POST | `/documents/{versionId}/set-final` | validateur | Marquer version finale (verrouillage) |

## 5. IA — extraction & Assistant (`/ai`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/works/{id}/extract-metadata` | déposant | Déclencher extraction via `simba_ia` |
| GET | `/works/{id}/metadata-extraction` | user | Proposition IA + score |
| POST | `/works/{id}/metadata/accept` | déposant | Valider/corriger → métadonnées officielles |
| POST | `/ai/assistant/query` | mixte `[public]` | Question → réponse **sourcée** (`{ answer, sources[] }`) |
| GET | `/works/{id}/similar` | mixte | Travaux similaires |

> L'IA propose ; l'humain valide. Réponses Assistant IA **toujours** avec sources (sinon `NO_CONTEXT_FOUND`).

## 6. Validation académique (`/validation`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/validation/inbox` | validateur | Dossiers à traiter (filtres + priorité) |
| POST | `/works/{id}/assignments` | chef dépt / admin | Affecter un validateur |
| POST | `/works/{id}/reviews` | validateur | Ajouter un avis (recommandation) |
| GET | `/works/{id}/reviews` | validateur | Avis du dossier |
| POST | `/works/{id}/corrections` | validateur | Demander une correction |
| PATCH | `/corrections/{id}` | mixte | Répondre / valider / rejeter |
| POST | `/works/{id}/metadata/validate` | validateur | Valider/verrouiller métadonnées |
| POST | `/works/{id}/decision` | validateur habilité | Décision finale (checklist requise) |
| POST | `/works/{id}/defense` | validateur | Planifier/saisir soutenance |

Checklist avant décision finale : métadonnées validées, version active définie, hash calculé, avis requis présents, corrections bloquantes traitées, utilisateur autorisé.

## 7. Archivage (`/archive`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/works/{id}/archive` | archiviste/admin | Verrouiller version finale + créer `ArchiveRecord` + déclencher preuve + publier |
| GET | `/archive/{id}` | user | Détail archive |

Effets : `status → ARCHIVE`, génération preuve (SSI), QR, fiche publique, indexation.

## 8. Recherche & catalogue public (`/catalog`) `[public]`

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/catalog` | Catalogue paginé (documents publiables uniquement) |
| GET | `/catalog/search` | Recherche à facettes |
| GET | `/catalog/facets` | Définitions de facettes disponibles |
| GET | `/catalog/{publicSlug}` | Fiche publique d'un document |

Facettes : `type, institution, faculty, department, program, scientificDomain, academicYear, author, supervisor, keywords, language, status, visibility, isVerifiable, hasPdf`. Règle : ne jamais révéler de documents privés.

## 9. Preuve & vérification (`/ssi`, `/verify`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/verify/{proofCode}` | public | Vérifier (hash + statut dossier + statut VC) → `VALID/INVALID_HASH/NOT_FOUND/REVOKED/EXPIRED` |
| GET | `/works/{id}/proof` | user | Preuve du dossier (`id`, QR, verificationUrl, statut) |
| POST | `/ssi/proofs/{id}/revoke` | admin | Révoquer une preuve (justifié, audité) |
| POST | `/ssi/proofs/{id}/reissue` | admin | Réémettre (nouvelle entrée) |
| GET | `/admin/ssi/connection` | admin SSI | Config e-IDStack (sans secrets) |
| PUT | `/admin/ssi/connection` | admin SSI | Mettre à jour config (audité) |
| POST | `/admin/ssi/test-connection` | admin SSI | Tester la connexion |

Voir [SSI_INTEGRATION.md](SSI_INTEGRATION.md) pour le mapping des claims, le flux e-IDStack de IDS et les états `SSI_PENDING` / `TECHNICAL_ERROR`.

## 10. Administration & audit (`/admin`)

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/admin/dashboard` | admin | KPIs + état des services |
| GET/POST/PUT | `/admin/workflows` | admin | Configurer workflows (étapes, transitions) |
| GET/POST | `/admin/document-types` | admin | Types de documents |
| GET/PUT | `/admin/ai-settings` | admin | Paramètres IA (extraction, Assistant, sécurité) |
| GET/PUT | `/admin/search-settings` | admin | Champs indexés + facettes |
| GET | `/admin/proofs` | admin | Liste des preuves + journal de vérifications |
| GET | `/admin/stats` | admin | Statistiques + exports (CSV/PDF) |
| GET | `/admin/audit` | admin autorisé | Journal d'audit (lecture seule) |

## 11. Exemples

### Créer un dossier
```http
POST /api/v1/works
Authorization: Bearer <token>
Content-Type: application/json

{ "type": "MEMOIRE", "title": "Système de vérification des diplômes par SSI",
  "institution": "<uuid>", "department": "<uuid>", "academic_year": "2025-2026",
  "language": "FR", "visibility": "PUBLIC" }
```

### Question Assistant IA (avec sources)
```http
POST /api/v1/ai/assistant/query
{ "question": "Quels travaux parlent d'identité numérique universitaire ?",
  "filters": { "type": "MEMOIRE", "academic_year_from": 2022 } }
```
```json
{ "answer": "Trois axes ressortent ...",
  "sources": [ { "work_id": "...", "title": "...", "page": 12, "url": "/catalog/osh-..." } ],
  "answer_status": "ANSWERED" }
```

### Vérification publique
```http
GET /api/v1/verify/OSH-VC-2026-0001
```
```json
{ "result": "VALID", "title": "...", "author": "...", "institution": "...",
  "document_hash": "9f2a...", "archived_at": "2026-06-02", "proof_status": "ACTIVE",
  "eidstack_reference": "..." }
```

## 12. Codes de statut spécifiques

- `409 Conflict` : transition de statut interdite, deuxième version finale.
- `422 Unprocessable Entity` : checklist de décision incomplète, métadonnées obligatoires manquantes.
- `502 Bad Gateway` : `simba_ia` ou e-IDStack indisponible (extraction `FAILED` / preuve `SSI_PENDING`).
