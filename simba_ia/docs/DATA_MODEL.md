# simba_ia — Modèle de données (stockage IA)

> Tables propres au microservice IA (PostgreSQL + `pgvector`). `simba_ia` ne possède **pas** la vérité métier (dossiers, statuts, droits) : il stocke chunks, vecteurs et logs, et référence les entités du backend par identifiant. Voir [RAG_PIPELINE.md](RAG_PIPELINE.md), [ARCHITECTURE.md](ARCHITECTURE.md), et le modèle backend `../../docs/DATA_MODEL.md`.

---

## 1. Principes

- **Base** : PostgreSQL avec extension **`pgvector`** (`CREATE EXTENSION IF NOT EXISTS vector;`).
- **Isolation** : tables IA dans un schéma dédié (`simba`) ou base dédiée, séparées des tables backend.
- **Références croisées** : on stocke les **identifiants backend** (`work_id`, `document_id`, `version_id`) sans FK dure vers le schéma backend (couplage faible entre services).
- **Visibilité** : chaque chunk porte sa `visibility` (copiée depuis le backend) pour filtrer au retrieval.
- PK `UUID`, horodatage `created_at`/`updated_at`.

## 2. Table `ai_chunk` (cœur du RAG)

| Colonne | Type | Notes |
|---|---|---|
| `id` | `UUID` PK | |
| `work_id` | `UUID` (index) | référence `ScientificWork` (backend) |
| `document_id` | `UUID` (index) | référence document backend |
| `version_id` | `UUID` (index) | version indexée |
| `chunk_index` | `int` | ordre du segment dans le document |
| `chunk_text` | `text` | passage |
| `page_start` | `int null` | |
| `page_end` | `int null` | |
| `embedding` | `vector(N)` | dimension selon le modèle (ex. 768/1024/1536) |
| `metadata` | `jsonb` | titre, auteur, type, institution, department, year, keywords, status |
| `visibility` | `text` | `PUBLIC / INSTITUTION_ONLY / RESTRICTED / PRIVATE` |
| `embedding_model` | `text` | modèle/version d'embedding utilisé |
| `created_at` | `timestamptz` | |

Index :
- Vectoriel : `USING hnsw (embedding vector_cosine_ops)` (ou `ivfflat`).
- Filtres : index B-tree sur `work_id`, `version_id`, et GIN sur `metadata` / `visibility` selon besoin.

```sql
CREATE TABLE simba.ai_chunk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_id UUID NOT NULL,
  document_id UUID NOT NULL,
  version_id UUID NOT NULL,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  page_start INT,
  page_end INT,
  embedding VECTOR(1024) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'PUBLIC',
  embedding_model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ai_chunk_work_idx ON simba.ai_chunk (work_id);
CREATE INDEX ai_chunk_version_idx ON simba.ai_chunk (version_id);
CREATE INDEX ai_chunk_vec_idx ON simba.ai_chunk USING hnsw (embedding vector_cosine_ops);
```

## 3. Table `ai_document` (suivi d'indexation)

| Colonne | Type | Notes |
|---|---|---|
| `id` | `UUID` PK | |
| `work_id` | `UUID` | |
| `version_id` | `UUID` (unique) | une entrée par version indexée |
| `status` | `text` | `PENDING / INDEXED / FAILED` |
| `chunk_count` | `int` | nb de chunks produits |
| `error` | `text null` | message si `FAILED` |
| `indexed_at` | `timestamptz null` | |

## 4. Table `ai_extraction` (proposition de métadonnées)

> Optionnelle côté `simba_ia` (le backend stocke aussi `MetadataExtraction`). Utile pour cache/audit interne.

| Colonne | Type | Notes |
|---|---|---|
| `id` | `UUID` PK | |
| `version_id` | `UUID` | |
| `model_name` | `text` | |
| `result_json` | `jsonb` | métadonnées proposées |
| `confidence_score` | `numeric` | 0..1 |
| `status` | `text` | `EXTRACTED / FAILED` |
| `created_at` | `timestamptz` | |

## 5. Table `ai_query_log` (journal Assistant IA)

| Colonne | Type | Notes |
|---|---|---|
| `id` | `UUID` PK | |
| `question` | `text` | |
| `answer` | `text` | |
| `answer_status` | `text` | `ANSWERED / NO_CONTEXT_FOUND / FAILED / FLAGGED` |
| `filters` | `jsonb` | filtres reçus du backend |
| `model_name` | `text` | LLM utilisé |
| `latency_ms` | `int` | |
| `created_at` | `timestamptz` | |

## 6. Table `ai_query_citation` (sources d'une réponse)

| Colonne | Type | Notes |
|---|---|---|
| `id` | `UUID` PK | |
| `query_id` | `UUID` (FK → `ai_query_log`) | |
| `chunk_id` | `UUID` (FK → `ai_chunk`, null si mock) | |
| `work_id` | `UUID` | |
| `excerpt` | `text` | extrait cité |
| `score` | `numeric` | pertinence |
| `page_number` | `int null` | |

## 7. Requête de retrieval (exemple)

Recherche **hybride** : filtres structurés + similarité cosine, dans le périmètre autorisé.

```sql
SELECT id, work_id, chunk_text, page_start, metadata,
       1 - (embedding <=> :q_embedding) AS similarity
FROM simba.ai_chunk
WHERE visibility = ANY(:allowed_visibilities)
  AND (:type IS NULL OR metadata->>'type' = :type)
  AND (:department IS NULL OR metadata->>'department' = :department)
  AND (:year_min IS NULL OR (metadata->>'year')::int >= :year_min)
ORDER BY embedding <=> :q_embedding
LIMIT :top_k;
```

## 8. Cohérence avec le backend

- `work_id` / `document_id` / `version_id` = identifiants du backend (`ScientificWork`, `DocumentVersion`).
- La `visibility` et les `metadata` sont **fournies par le backend** lors de l'`/index` ; `simba_ia` ne les invente pas.
- Après changement de visibilité/retrait d'un document côté backend, le backend appelle `simba_ia` pour **réindexer/supprimer** les chunks concernés (cohérence des droits).
- `simba_ia` ne stocke **aucune donnée d'authentification** ni de PDF (lecture seule via `file_url`).

## 9. Rétention / purge

- Suppression des chunks d'une version remplacée lors de la réindexation.
- Purge des `ai_query_log` selon une politique de rétention (configurable).
- Aucune donnée personnelle sensible stockée hors nécessité ; IP éventuelles hachées (déléguées au backend de préférence).
