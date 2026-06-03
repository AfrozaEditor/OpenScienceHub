# simba_ia — Intégration avec le backend OpenScience Hub

> Comment le **backend Django** consomme `simba_ia`, et les responsabilités de chaque côté. Vue « consommateur » du contrat. Voir [API_SPEC.md](API_SPEC.md), [RAG_PIPELINE.md](RAG_PIPELINE.md), et côté backend `../../docs/ARCHITECTURE.md`.

---

## 1. Principe d'intégration

- **Le backend est le seul appelant** de `simba_ia` (service interne, non exposé au public).
- Communication **HTTP REST** ; le backend encapsule les appels dans `ai/simba_client.py` (timeouts, retries, mode `mock`).
- **Séparation des responsabilités** :
  - **Backend** : dossiers, statuts, droits, **visibilités**, déclenchement des traitements, stockage des résultats officiels (`MetadataExtraction`, `AIQueryLog`).
  - **simba_ia** : texte, chunks, embeddings, retrieval, génération **sourcée** ; renvoie des **propositions** et des **réponses**.
- **Le backend applique les droits**, `simba_ia` applique les **filtres** qu'il reçoit. `simba_ia` ne décide jamais de la visibilité d'un document.

## 2. Répartition des responsabilités

| Sujet | Backend | simba_ia |
|---|---|---|
| Authentification utilisateur | Oui (JWT, RBAC) | Non (appel interne par clé) |
| Visibilité / périmètre | **Décide** et transmet les filtres | **Applique** les filtres reçus |
| Déclenchement extraction/indexation | Oui (au dépôt/archivage) | Exécute |
| Validation des métadonnées | Oui (humain valide) | Propose seulement |
| Stockage vérité métier | Oui | Non (chunks/logs seulement) |
| Émission/vérif. SSI | Oui (via e-IDStack) | **Aucun rapport** |

## 3. Flux d'appels (backend → simba_ia)

| Action backend | Appel simba_ia | Moment |
|---|---|---|
| Upload PDF + déclenchement extraction | `POST /v1/extract` | Étape « Analyse IA » du dépôt |
| Indexation pour recherche/Assistant | `POST /v1/index` | À l'archivage (ou après validation) |
| Réindexation / retrait | `POST /v1/index` (réémis) / `DELETE /v1/index/{version_id}` | Nouvelle version, changement de visibilité, retrait |
| Question Assistant IA | `POST /v1/assistant/query` | Portail Archive publique / Validation |
| Travaux similaires | `POST /v1/similar` | Fiche document / dépôt |
| Résumé / fiche de lecture | `POST /v1/summarize` | Fiche document / aide validation |

## 4. Transmission des droits (essentiel)

À chaque `/index`, le backend transmet la `visibility` du document. À chaque `/assistant/query` et `/similar`, le backend transmet `allowed_visibilities` (et tout filtre de périmètre).

- **Archive publique** → `allowed_visibilities = ["PUBLIC"]`.
- **Utilisateur authentifié** → le backend peut élargir selon le rôle/périmètre (ex. `["PUBLIC","INSTITUTION_ONLY"]`).
- `simba_ia` ne retourne **jamais** un chunk hors de ce périmètre. Si la visibilité d'un document change, le backend **réindexe** (met à jour `visibility`) ou **supprime** les chunks.

## 5. Exemple — client backend (`ai/simba_client.py`)

```python
class SimbaClient:
    def __init__(self, base_url, api_key, mode="live", timeout=20):
        ...

    def extract(self, document_id, version_id, *, text=None, file_url=None):
        return self._post("/v1/extract", {...})

    def index(self, work_id, document_id, version_id, *, file_url, metadata, visibility):
        return self._post("/v1/index", {...})

    def assistant_query(self, question, *, allowed_visibilities, filters=None, top_k=6):
        return self._post("/v1/assistant/query", {
            "question": question,
            "filters": {"allowed_visibilities": allowed_visibilities, **(filters or {})},
            "top_k": top_k,
        })
```

Le backend stocke ensuite :
- la proposition d'extraction dans `MetadataExtraction` (l'humain valide) ;
- la réponse Assistant dans `AIQueryLog` + `AIAnswerCitation`.

## 6. Gestion des erreurs

| Réponse simba_ia | Comportement backend |
|---|---|
| `status: EXTRACTED` | Pré-remplir les métadonnées proposées (à valider) |
| `status: FAILED` (extraction) | Proposer saisie manuelle, marquer extraction `FAILED` |
| `answer_status: ANSWERED` | Afficher réponse + sources |
| `answer_status: NO_CONTEXT_FOUND` | Afficher « aucune source pertinente trouvée » |
| HTTP 503 (provider down) | Retry/backoff ; message « Assistant IA momentanément indisponible » |
| Timeout | Annuler proprement ; ne pas bloquer le parcours de dépôt |

## 7. Mode `mock` (démo hackathon)

- Si `SIMBA_MODE=mock` (ou pas de clé LLM/embeddings), `simba_ia` répond derrière la **même API** :
  - `/extract` renvoie des métadonnées plausibles déterministes ;
  - `/assistant/query` construit une réponse **à partir des passages récupérés** (reste « sourcé ») ;
  - `/index` indexe avec des embeddings simulés.
- Le backend peut lui aussi avoir un `SIMBA_MODE=mock` pour tourner totalement hors-ligne. Le passage en `live` ne change pas les contrats.

## 8. Configuration partagée

Backend :
```text
SIMBA_IA_URL=http://localhost:8001
SIMBA_API_KEY=...          # même valeur que côté simba_ia
SIMBA_MODE=mock            # mock | live
```
simba_ia :
```text
SIMBA_API_KEY=...          # vérifie X-API-Key
DATABASE_URL=postgresql://...   # pgvector (peut être la base du backend, schéma simba)
EMBEDDING_PROVIDER=openai|mistral|local|mock
LLM_PROVIDER=openai|mistral|ollama|mock
SIMBA_MODE=mock|live
```

## 9. Checklist d'intégration

- [ ] `SIMBA_API_KEY` partagée backend ↔ simba_ia.
- [ ] `/health` OK avant d'activer les appels.
- [ ] Extraction branchée à l'étape « Analyse IA » du dépôt.
- [ ] Indexation déclenchée à l'archivage (et réindexation/suppression sur changement de version/visibilité).
- [ ] `allowed_visibilities` transmis à chaque requête Assistant/similar.
- [ ] Réponses Assistant stockées avec leurs sources côté backend.
- [ ] Mode `mock` testé de bout en bout (démo hors-ligne).
