# simba_ia — Glossaire (module IA)

> Termes techniques du microservice IA. Pour le vocabulaire métier/produit complet, voir `../../docs/GLOSSARY.md`. Rappel : côté produit on dit **« Assistant IA »** ; **RAG** est un détail interne (acceptable ici).

---

## Service et rôles

| Terme | Définition |
|---|---|
| **simba_ia** | Microservice IA (FastAPI) de OpenScience Hub : extraction de métadonnées + Assistant IA. Appelé uniquement par le backend. |
| **Assistant IA** | Nom produit de la capacité de question/réponse sourcée sur l'archive. |
| **Backend** | API Django, seul appelant de `simba_ia` ; détient dossiers, droits, statuts. |
| **Provider** | Implémentation interchangeable d'un service externe (embeddings ou LLM), derrière une interface. |
| **Mode `mock`** | Mode démo hors-ligne : embeddings et LLM simulés derrière la même API. |

## IA / RAG

| Terme | Définition |
|---|---|
| **RAG (Retrieval-Augmented Generation)** | Récupérer des passages pertinents puis générer une réponse fondée dessus. Interne. |
| **Embedding** | Vecteur numérique représentant un texte, pour la recherche sémantique. |
| **EmbeddingProvider** | Interface produisant les embeddings (OpenAI / Mistral / local / mock). |
| **LLMProvider** | Interface de génération de texte (OpenAI / Mistral / Ollama / mock). |
| **Chunk** | Segment de document (texte + métadonnées + embedding) stocké pour le retrieval. |
| **Chunking** | Découpage du texte en segments (avec chevauchement). |
| **Retrieval** | Récupération des chunks les plus pertinents (filtres + similarité). |
| **Recherche hybride** | Combinaison de filtres structurés et de similarité sémantique. |
| **top-k** | Nombre de passages récupérés pour construire le contexte. |
| **Reranking** | Reclassement des passages récupérés pour améliorer la précision (roadmap). |
| **Contexte** | Ensemble des passages fournis au LLM pour répondre. |
| **Source / citation** | Référence (document, page) appuyant une réponse. **Obligatoire**. |
| **Hallucination** | Réponse non fondée sur les sources. **Interdite** : refus si pas de contexte. |
| **Score de confiance** | Indice `[0,1]` accompagnant l'extraction de métadonnées. |
| **Similarité (cosine)** | Mesure de proximité entre vecteurs utilisée par `pgvector`. |

## Stockage

| Terme | Définition |
|---|---|
| **pgvector** | Extension PostgreSQL pour stocker/rechercher des vecteurs. |
| **`ai_chunk`** | Table des segments + embeddings + métadonnées + visibilité. |
| **`ai_query_log` / `ai_query_citation`** | Journal des questions Assistant IA et de leurs sources. |
| **`ai_document`** | Suivi d'indexation par version (`PENDING/INDEXED/FAILED`). |

## Statuts renvoyés

| Statut | Sens |
|---|---|
| `EXTRACTED` / `FAILED` | Résultat de `/extract`. |
| `INDEXED` / `PENDING` / `FAILED` | Résultat de `/index`. |
| `ANSWERED` | Réponse Assistant IA avec sources. |
| `NO_CONTEXT_FOUND` | Aucune source pertinente → pas de réponse inventée. |
| `FLAGGED` | Réponse signalée (modération / incohérence). |

## Garde-fous (rappel)

- L'IA **propose**, ne **décide** jamais.
- Réponses **toujours sourcées** ou refus.
- Respect des **visibilités/filtres** transmis par le backend.
- `simba_ia` ne détient pas la vérité métier (dossiers/droits/statuts).
