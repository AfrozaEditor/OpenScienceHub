# simba_ia — Pipeline IA / RAG détaillé

> Cœur technique du module : extraction de métadonnées, ingestion/indexation, retrieval, génération sourcée, similarité. Voir [ARCHITECTURE.md](ARCHITECTURE.md), [DATA_MODEL.md](DATA_MODEL.md), [API_SPEC.md](API_SPEC.md).

---

## 1. Vue d'ensemble

Deux pipelines complémentaires :

- **Pipeline A — Extraction de métadonnées** (au dépôt) : PDF → texte → LLM/règles → métadonnées proposées + score.
- **Pipeline B — RAG** (Assistant IA) : ingestion (PDF → chunks → embeddings → pgvector) puis interrogation (question → retrieval → génération sourcée).

```text
DEPOT
  PDF ──► extraction texte ──► (A) extraction métadonnées ──► proposition (backend valide)
                          └──► (B) nettoyage ─► chunking ─► enrichissement ─► embeddings ─► pgvector

REQUETE
  question ─► embedding ─► retrieval hybride (filtres + similarité) ─► contexte ─► génération ─► réponse + sources
```

## 2. Pipeline A — Extraction de métadonnées (`/extract`)

1. **Entrée** : texte du PDF (ou `file_url` que le service lit) + langue éventuelle.
2. **Pré-traitement léger** : détection de la zone titre/résumé (premières pages), nettoyage.
   - **Combo recommandé (gratuit)** pour l'académique : **GROBID** (titre, auteurs, résumé, sections, références en TEI) **puis** LLM pour compléter/normaliser. Détails et alternatives : [FREE_STACK_OPTIONS.md](FREE_STACK_OPTIONS.md).
3. **Extraction** : appel LLM avec un prompt structuré demandant un **JSON strict** :
   - `title`, `authors[]`, `abstract`, `keywords[]`, `scientificDomain`, `problemStatement`, `methodology`, `mainResults`, `language`, `themes[]`.
4. **Score de confiance** : `confidenceScore ∈ [0,1]` (heuristique : complétude des champs + signal du modèle).
5. **Sortie** : objet de proposition + `rawJson` (réponse brute du modèle, pour audit côté backend).

Règles :
- Sortie = **proposition** ; l'humain valide côté backend. `simba_ia` ne « valide » rien.
- Si le texte est insuffisant/illisible → `status = FAILED` avec message clair.
- Prompt à température basse, format JSON imposé et validé (Pydantic) ; en cas de JSON invalide, 1 retry puis échec propre.

## 3. Pipeline B1 — Ingestion / indexation (`/index`)

Étapes (alignées sur le guide RAG : conversion, nettoyage, chunking, enrichissement, vectorisation, indexation) :

1. **Extraction texte** : `pypdf`/`pdfplumber` ; OCR (`pytesseract`) en roadmap pour PDF scannés.
2. **Nettoyage** : suppression en-têtes/pieds de page répétés, normalisation des espaces, dé-hyphénation.
3. **Chunking** : segments de ~800–1200 caractères (ou ~200–400 tokens) avec **chevauchement** ~10–15 % ; on conserve `page_start`/`page_end`.
4. **Enrichissement** : chaque chunk porte les **métadonnées du dossier** transmises par le backend : `document_id`, `version_id`, `work_id`, `title`, `author`, `type`, `institution`, `department`, `year`, `keywords`, `status`, **`visibility`**.
5. **Embeddings** : via `EmbeddingProvider` (dimension selon le modèle ; stockée en `vector` pgvector).
6. **Stockage** : upsert dans `ai_chunk` (texte + métadonnées + embedding). Index `pgvector` (ex. HNSW/IVotFlat) + index sur les colonnes de filtre.
7. **Réindexation** : à chaque nouvelle version, invalider/remplacer les chunks de l'ancienne version.

Exemple de métadonnée de chunk :

```json
{
  "chunk_id": "...", "work_id": "OSH-UY1-INF-2026-0001", "version_id": "...",
  "title": "Système de vérification des diplômes par SSI", "author": "Bell Aqil",
  "type": "MEMOIRE", "institution": "Université de Yaoundé I", "department": "Informatique",
  "year": 2026, "keywords": ["SSI","DID","Verifiable Credentials"],
  "status": "ARCHIVED", "visibility": "PUBLIC", "page_start": 12, "page_end": 12,
  "chunk_text": "..."
}
```

## 4. Pipeline B2 — Retrieval (recherche hybride)

1. **Embedding de la question**.
2. **Filtres structurés** (transmis par le backend) : `type`, `institution`, `department`, `year`, `visibility` autorisée, `status`, etc.
3. **Recherche sémantique** : top-k par similarité vectorielle (cosine) **dans le périmètre filtré uniquement**.
4. **(Roadmap) Reranking** : reclassement des passages (cross-encoder) pour la précision.
5. **Garde-fou droits** : ne jamais retourner un chunk dont la `visibility`/le périmètre n'est pas autorisé par les filtres reçus.

Recherche **hybride** = filtres structurés **+** similarité sémantique. Exemple :

```text
filtres : type=MEMOIRE, department=Informatique, year in [2022..2026], visibility in [PUBLIC]
+ similarité : "identité numérique, SSI, vérification des diplômes"
```

## 5. Pipeline B3 — Génération sourcée (`/assistant/query`)

1. **Assemblage du contexte** : concaténer les passages top-k (avec leur référence document/page), borné en taille.
2. **Prompt** : instruction stricte —
   > « Réponds **uniquement** à partir du contexte fourni. Cite les sources (document, page). Si le contexte ne contient pas la réponse, dis que tu n'as pas trouvé de source pertinente. N'invente rien. »
3. **Génération** : `LLMProvider.generate` (température basse).
4. **Sortie** :
   - `answer` (synthèse) + `keyPoints` éventuels,
   - `sources[]` (work_id, titre, auteur, page/section, lien fiche),
   - `answer_status ∈ { ANSWERED, NO_CONTEXT_FOUND, FAILED, FLAGGED }`.
5. **Garde-fous** :
   - Aucune source pertinente → `NO_CONTEXT_FOUND` (pas de réponse inventée).
   - Toute réponse `ANSWERED` doit contenir ≥ 1 source.
   - Journalisation (`ai_query_log` + citations).

## 6. Similarité (`/similar`)

- Entrée : `work_id` (on part de ses chunks/embedding moyen) **ou** texte libre.
- Recherche des documents proches (similarité agrégée par document) + pondération métadonnées (mots-clés, domaine, méthodologie, institution).
- Sortie : liste `{ work_id, title, score, motifs[] }`. **Proximité scientifique**, pas un détecteur de plagiat complet.

## 7. Résumé / fiche de lecture (`/summarize`)

- Entrée : `work_id` ou `version_id`.
- Récupère les chunks du document, génère : résumé court/long, problématique, méthodologie, résultats, limites, mots-clés suggérés.
- Cite les sections/pages utilisées ; identifie clairement le contenu comme **généré par l'IA**.

## 8. Paramètres recommandés (MVP)

| Paramètre | Valeur de départ |
|---|---|
| Taille de chunk | ~1000 caractères |
| Chevauchement | ~150 caractères |
| top-k retrieval | 5–8 |
| Température LLM | 0.0–0.2 |
| Seuil de similarité | configurable (ex. 0.2 cosine distance) |
| Distance pgvector | cosine |

## 9. Contrôle qualité et anti-hallucination

- Réponses **toujours sourcées** ; refus propre sans contexte.
- Validation **Pydantic** des sorties JSON (extraction).
- Journalisation des sources réellement utilisées pour audit côté backend.
- Mode full live strict : la génération est assurée par le LLM réel configuré, avec réponse toujours sourcée ou `NO_CONTEXT_FOUND`.

## 10. Ce que le pipeline NE fait PAS

- Il ne valide pas un travail, ne décide pas d'une soutenance, ne certifie pas l'authenticité (ça, c'est le SSI côté backend/e-IDStack).
- Il ne contourne pas les droits : il n'indexe et ne restitue que ce que le backend autorise.
- Il ne remplace pas la recherche à facettes (qui reste côté backend) ; il la **complète**.
