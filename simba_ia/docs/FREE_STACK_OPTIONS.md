# simba_ia — Solutions gratuites / open-source et alternatives (complet)

> Panorama complet des options **gratuites** (open-source auto-hébergé ou offres API free tier) pour chaque brique du microservice IA, avec **licences**, avantages/limites et **recommandation** adaptée à OpenScience Hub : PDF académiques **FR/EN**, **PostgreSQL + pgvector**, **FastAPI**, contexte **hackathon**, **mode hors-ligne** possible. Données vérifiées en 2026. Voir [RAG_PIPELINE.md](RAG_PIPELINE.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DATA_MODEL.md](DATA_MODEL.md).

---

## 0. Principes de choix

1. **Gratuit et reproductible** : priorité à l'open-source auto-hébergeable ; les API « free tier » servent d'accélérateur mais on garde un **fallback local** (mode `mock`/`local`).
2. **Licences sûres pour un produit** : préférer **MIT / Apache-2.0 / BSD**. ⚠️ Éviter ou isoler : **AGPL** (PyMuPDF), **CC-BY-NC / non-commercial** (Jina v3, certains rerankers), modèles à licence restrictive.
3. **Multilingue FR/EN** obligatoire (corpus camerounais FR + EN).
4. **Interchangeables** : tout passe par les interfaces `EmbeddingProvider` / `LLMProvider` (+ `mock`) → on peut changer de fournisseur sans toucher au reste.
5. **Souveraineté / RGPD** : pour des documents institutionnels, le **local** (Ollama + modèle open) évite d'envoyer le contenu à un tiers ; à arbitrer selon l'institution.

---

## 1. Extraction de texte PDF

| Solution | Licence | Points forts | Limites | Reco |
|---|---|---|---|---|
| **pypdf** | BSD | léger, pur Python, simple | texte basique, pas de mise en page | fallback simple |
| **pdfplumber** | MIT | bon texte + tableaux + positions | plus lent sur gros PDF | **MVP recommandé** |
| **PyMuPDF (fitz)** | **AGPL-3.0** ⚠️ | très rapide, robuste | licence virale (risque produit) | éviter sauf accord licence |
| **Docling** (IBM) | MIT | structure (titres, tableaux, lecture order), export Markdown/JSON | plus lourd | **fort pour qualité** |
| **Unstructured** | Apache-2.0 | nombreux formats, partitionnement | dépendances lourdes | si multi-formats |
| **GROBID** | Apache-2.0 | **spécial articles académiques** : titre, auteurs, résumé, sections, **références** en TEI/XML | service Java à héberger | **idéal extraction métadonnées** |
| **Nougat** (Meta) | code MIT / poids CC-BY-NC ⚠️ | PDF scientifiques + formules | non-commercial sur poids, lourd (GPU) | roadmap formules |
| **Marker** | restrictions selon version ⚠️ | PDF→Markdown haute qualité | licence à vérifier | optionnel |

**Recommandation OpenScience Hub :**
- **Texte/chunking RAG** : `pdfplumber` (MVP) → `Docling` (qualité supérieure si temps).
- **Extraction de métadonnées académiques** : **GROBID** (titre, auteurs, résumé, sections, références) + LLM pour compléter/normaliser. C'est le meilleur combo gratuit pour des mémoires/thèses/articles.

## 2. OCR (PDF scannés) — roadmap

| Solution | Licence | Note |
|---|---|---|
| **Tesseract** (`pytesseract`) | Apache-2.0 | référence FR/EN, simple |
| **OCRmyPDF** | MPL-2.0 | ajoute une couche texte à un PDF scanné |
| **PaddleOCR** | Apache-2.0 | meilleure précision, plus lourd |

Reco : `OCRmyPDF` + `Tesseract` (FR+EN) en Phase 2/3 ; détecter « PDF sans texte » et router vers l'OCR.

## 3. Découpage (chunking)

| Solution | Licence | Note |
|---|---|---|
| **Splitters maison** (par caractères/tokens + chevauchement) | — | suffisant MVP, zéro dépendance |
| **LangChain `text-splitters`** | MIT | `RecursiveCharacterTextSplitter`, pratique |
| **LlamaIndex node parsers** | MIT | parsing sémantique/par sections |
| **tiktoken / tokenizers** | MIT / Apache-2.0 | découpe par tokens précise |

Reco : **maison** (≈1000 caractères, chevauchement ~150) pour le MVP ; chunking par sections (titres GROBID/Docling) en Phase 2.

## 4. Embeddings (le choix le plus structurant)

### Open-source auto-hébergé (gratuit, via `sentence-transformers`)
| Modèle | Licence | Dim. | Contexte | Multilingue FR | Note |
|---|---|---:|---:|---|---|
| **BGE-M3** (BAAI) | **MIT** | 1024 | 8192 | excellent (100+ langues) | **meilleur choix général** ; dense + sparse + multi-vecteur |
| **multilingual-e5-large** (MS) | MIT | 1024 | 512 | très bon | léger, éprouvé ; contexte court |
| **granite-embedding-multilingual-r2** (IBM) | Apache-2.0 | 384/768 | 8k–32k | bon | **excellent rapport taille/qualité** (97M), CPU-friendly |
| **nomic-embed-text-v2** | Apache-2.0 | 768→256 | 8192 | bon | MoE, Matryoshka (dim. réductible) |
| **GTE-Qwen2** | Apache-2.0 | 3584 | long | bon | qualité élevée, lourd (GPU) |
| **jina-embeddings-v3** | **CC-BY-NC** ⚠️ | 1024 | 8192 | bon | **non-commercial** : éviter en produit |

### API « free tier » (embeddings)
| Fournisseur | Gratuité | Note |
|---|---|---|
| **Mistral Embeddings** (FR/EU) | free tier | souveraineté EU, simple |
| **Jina Embeddings API** | free tier (quota) | pratique, mais modèle v3 NC en self-host |
| **Cohere Embed** | ~1000 appels/mois | carte requise |
| **OpenRouter** (`baai/bge-m3`) | via crédits | API OpenAI-compatible |

**Recommandation OpenScience Hub :**
- **Défaut (équilibré, gratuit, local)** : **BGE-M3** (MIT, FR/EN excellent, 1024d, 8192 ctx) → `vector(1024)` dans pgvector.
- **CPU/edge léger** : `granite-embedding-multilingual-r2` (Apache-2.0, 384d) → `vector(384)`, très bon sur petite machine de démo.
- **Sans GPU et sans télécharger de modèle** : API **Mistral Embeddings** (EU).
- ⚠️ Fixer la **dimension `vector(N)`** en base selon le modèle choisi (changer de modèle = réindexer).

## 5. Base vectorielle

| Solution | Licence | Note | Reco |
|---|---|---|---|
| **pgvector** (PostgreSQL) | PostgreSQL (BSD-like) | déjà dans la stack, transactions + filtres SQL + vecteurs au même endroit | **choix retenu** |
| **Qdrant** | Apache-2.0 | très bon filtrage + HNSW, Docker simple | alternative si besoin scale |
| **Chroma** | Apache-2.0 | ultra simple en dev | prototypage |
| **Weaviate** | BSD-3 | hybride dense+BM25 intégré | si recherche hybride avancée |
| **Milvus** | Apache-2.0 | scale massif | surdimensionné ici |
| **FAISS** (Meta) | MIT | rapide en mémoire, pas de filtrage métier | embarqué |
| **LanceDB** | Apache-2.0 | embarqué, fichier, simple | léger |

Reco : **pgvector** (cohérent avec le backend, filtres + vecteurs ensemble). Index **HNSW** (`vector_cosine_ops`). Qdrant uniquement si on dépasse les capacités de pgvector.

## 6. LLM de génération (Assistant IA, résumé)

### Local / auto-hébergé (gratuit, hors-ligne, souverain)
| Runtime | Licence | Note |
|---|---|---|
| **Ollama** | MIT | le plus simple pour servir un modèle local (CPU/GPU) |
| **llama.cpp** | MIT | quantization GGUF, CPU-friendly |
| **vLLM** | Apache-2.0 | débit élevé si GPU |

Modèles ouverts adaptés (servis via Ollama) : **Qwen2.5 / Qwen3** (Apache-2.0), **Mistral / Mistral-Nemo** (Apache-2.0), **Llama 3.1/3.3** (licence Llama), **Gemma 2** (termes Google), **Phi-3** (MIT). Pour démo CPU : un modèle **7–8B quantizé** (Qwen2.5-7B, Llama-3.1-8B, Mistral-7B).

### API « free tier » (rapides, sans carte sauf mention)
| Fournisseur | Quota gratuit (2026) | Carte | Note |
|---|---|---|---|
| **Google Gemini (AI Studio)** | ~1500 req/jour, contexte jusqu'à 1M | Non | meilleur modèle « frontier » gratuit |
| **Groq** | ~30 req/min, ~14 400 req/jour | Non | **très rapide** (Llama 3.3 70B, Qwen, GPT-OSS) |
| **Cerebras** | gros quota tokens/jour | Non | très rapide, gros prompts |
| **OpenRouter** | 28+ modèles `:free` (20 req/min, 50–1000/jour) | Non | une clé, beaucoup de modèles (DeepSeek, Llama 4, Qwen) |
| **Mistral La Plateforme** (FR/EU) | free tier | parfois | souveraineté EU |
| **DeepSeek** | ~5M tokens offerts (one-shot) | Non | bon raisonnement |
| **HuggingFace Inference** | quelques req/h | Non | modèles < 10B |
| **GitHub Models** | gratuit (compte) | compte | mix de modèles |

**Recommandation OpenScience Hub :**
- **Démo rapide gratuite** : **Groq** (vitesse, généreux, sans carte) ou **Google Gemini** (qualité, gros contexte).
- **EU / souveraineté** : **Mistral** (API) ou **Ollama + Mistral/Qwen** en local.
- **Hors-ligne total / sans clé** : **Ollama** (Qwen2.5-7B ou Llama-3.1-8B) → branché derrière `LLMProvider`.
- **Stratégie « stacking »** : configurer un fournisseur principal + un **fallback** (ex. Groq → Gemini → mock) pour absorber les quotas.

## 7. Reranking (précision du retrieval) — Phase 2

| Solution | Licence | Note |
|---|---|---|
| **bge-reranker-v2-m3** (BAAI) | MIT | multilingue, excellent, gratuit local |
| **cross-encoder/ms-marco** (sentence-transformers) | Apache-2.0 | léger EN |
| **mxbai-rerank** | Apache-2.0 | bon, ouvert |
| **Jina Reranker** | CC-BY-NC ⚠️ | non-commercial en self-host |
| **Cohere Rerank** | API (essai) | payant au-delà |

Reco : **bge-reranker-v2-m3** (MIT, FR/EN) si on ajoute un reranking ; sinon s'en passer au MVP.

## 8. Framework d'orchestration RAG

| Option | Licence | Note | Reco |
|---|---|---|---|
| **Sans framework** (maison) | — | contrôle total, peu de dépendances, idéal hackathon | **MVP recommandé** |
| **LlamaIndex** | MIT | abstractions RAG complètes | si on veut accélérer |
| **LangChain** | MIT | très répandu, modulaire | si l'équipe connaît |
| **Haystack** (deepset) | Apache-2.0 | pipelines production | plus lourd |

Reco : **maison léger** (FastAPI + sentence-transformers + pgvector + client LLM) pour rester transparent et démontrable ; passer à LlamaIndex si besoin de fonctions avancées.

## 9. Extraction de métadonnées académiques (combo recommandé)

Pour des mémoires/thèses/articles, le meilleur résultat gratuit vient d'un **combo** :
1. **GROBID** (Apache-2.0) extrait de façon structurée : titre, auteurs, résumé, sections, **références bibliographiques** (TEI/XML).
2. **LLM** (Groq/Gemini/Ollama) complète et normalise les champs manquants (domaine, mots-clés, problématique, méthodologie, thématiques) au **format JSON strict** validé par Pydantic.
3. **Score de confiance** = complétude GROBID + signal LLM.

→ Plus fiable qu'un LLM seul, et entièrement gratuit.

## 10. Trois profils de stack recommandés

### Profil A — « Hackathon gratuit & rapide » (recommandé pour la démo)
```text
PDF texte      : pdfplumber
Métadonnées    : GROBID + LLM
Embeddings     : BGE-M3 (local, sentence-transformers)  -> vector(1024)
Vector store   : pgvector (HNSW cosine)
LLM            : Groq (free) en principal, fallback Gemini, puis mock
Framework      : maison (FastAPI)
Reranking      : aucun (MVP)
```

### Profil B — « 100 % hors-ligne / souverain »
```text
PDF texte      : pdfplumber (+ Docling)
Métadonnées    : GROBID + LLM local
Embeddings     : BGE-M3 (ou granite-r2 si CPU faible)
Vector store   : pgvector
LLM            : Ollama (Qwen2.5-7B ou Llama-3.1-8B, quantizé)
Framework      : maison
Reranking      : bge-reranker-v2-m3 (optionnel)
```

### Profil C — « EU / RGPD »
```text
Embeddings     : Mistral Embeddings (API EU) OU BGE-M3 local
LLM            : Mistral La Plateforme (API EU) OU Ollama local
Reste          : identique au profil A
```

> Par défaut, partir sur le **Profil A** ; tout est interchangeable via la config (section 11).

## 11. Mapping vers `simba_ia` (config & providers)

Variables d'environnement (voir [INTEGRATION.md](INTEGRATION.md)) :
```text
EMBEDDING_PROVIDER=local|mistral|openrouter|mock
EMBEDDING_MODEL=BAAI/bge-m3            # ou intfloat/multilingual-e5-large, ibm-granite/...
EMBEDDING_DIM=1024                     # doit correspondre à vector(N) en base
LLM_PROVIDER=groq|gemini|mistral|ollama|openrouter|mock
LLM_MODEL=llama-3.3-70b-versatile      # selon le fournisseur
LLM_FALLBACKS=gemini,mock              # stratégie de repli sur quota
GROBID_URL=http://localhost:8070       # si extraction académique activée
SIMBA_MODE=mock|live
```

Interfaces (rappel) : `EmbeddingProvider.embed()` et `LLMProvider.generate()` ; chaque fournisseur (local, groq, gemini, mistral, ollama, openrouter, **mock**) implémente la même interface. Changer de modèle = changer la config (+ réindexer si la **dimension** d'embedding change).

## 12. Tableau licences (vigilance produit)

| Catégorie | À privilégier (MIT/Apache/BSD) | À éviter / isoler |
|---|---|---|
| PDF | pdfplumber, pypdf, Docling, Unstructured, GROBID | **PyMuPDF (AGPL)**, Marker (selon version) |
| Embeddings | BGE-M3, e5, granite, nomic, GTE | **jina-v3 (CC-BY-NC)** |
| Reranker | bge-reranker, cross-encoders, mxbai | **Jina reranker (CC-BY-NC)** |
| LLM local | Qwen (Apache), Mistral (Apache), Phi (MIT) | modèles à licence restrictive non commerciale |
| Vector DB | pgvector, Qdrant, Chroma, Weaviate, FAISS, LanceDB | — |
| Frameworks | LangChain, LlamaIndex, Haystack | — |

> Règle : pour un produit institutionnel, **rester en MIT/Apache/BSD**. Si une option AGPL/NC est tentante (ex. PyMuPDF pour la vitesse), l'isoler derrière une interface et documenter le risque.

## 13. Synthèse (la plus adaptée à OpenScience Hub)

- **Embeddings** : **BGE-M3** (gratuit, local, MIT, FR/EN excellent) — meilleur défaut.
- **Vector store** : **pgvector** (déjà en place).
- **Extraction métadonnées** : **GROBID + LLM** (combo gratuit le plus fiable pour l'académique).
- **LLM** : **Groq** (free, rapide) ou **Gemini** (free, qualité) pour la démo ; **Ollama** local pour le hors-ligne / souveraineté.
- **Texte PDF** : **pdfplumber** (MVP), **Docling** si qualité.
- **Framework** : **maison** (transparent, démontrable).
- **Tout interchangeable** via `EmbeddingProvider` / `LLMProvider` + `mock`, avec **fallback** sur quota.
