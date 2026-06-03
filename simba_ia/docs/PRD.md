# simba_ia — Product Requirements Document (module IA)

> Exigences du microservice IA de OpenScience Hub. Voir [ARCHITECTURE.md](ARCHITECTURE.md), [RAG_PIPELINE.md](RAG_PIPELINE.md), [API_SPEC.md](API_SPEC.md), [INTEGRATION.md](INTEGRATION.md), [ROADMAP.md](ROADMAP.md), [GLOSSARY.md](GLOSSARY.md).

---

## 1. Rôle dans le produit

`simba_ia` est le **cerveau documentaire** d'OpenScience Hub. Il fournit au backend deux familles de services :

1. **Extraction de métadonnées** des PDF déposés (bonus IA central du thème : analyse automatique du PDF, suggestion de thématiques).
2. **Assistant IA** : exploration intelligente et **sourcée** de l'archive (questions/réponses, similarité, résumé, fiche de lecture, aide à la lecture pour les validateurs).

Positionnement : `simba_ia` **assiste**, il ne décide jamais et ne remplace ni jury, ni comité, ni la recherche à facettes (qui reste côté backend). Côté produit, on l'appelle **« Assistant IA »**.

## 2. Problème adressé

- Saisie manuelle des métadonnées longue et incohérente → **extraction automatique**.
- Recherche à facettes seule = filtres ; elle ne répond pas à une **question en langage naturel** → **Assistant IA sourcé**.
- Difficulté à situer un travail (doublons, proximité) → **travaux similaires**.
- Documents longs difficiles à appréhender → **résumé / fiche de lecture**.

## 3. Utilisateurs / consommateurs

| Consommateur | Usage |
|---|---|
| **Backend Django** (appelant principal) | Déclenche extraction/indexation au dépôt ; relaie les questions de l'Assistant IA ; demande similarité/résumé |
| Portail Déposant (via backend) | Voit les métadonnées proposées à valider |
| Portail Validation (via backend) | Aide à la lecture (résumé, points à vérifier) |
| Portail Archive publique (via backend) | Assistant IA public + travaux similaires |

> `simba_ia` n'est **pas** exposé directement aux utilisateurs finaux : tout passe par le backend (auth, droits, visibilité gérés en amont).

## 4. Capacités fonctionnelles

### 4.1 Extraction de métadonnées (`/extract`)
À partir du texte d'un PDF, proposer : `title`, `authors`, `abstract`, `keywords`, `scientificDomain`, `problemStatement`, `methodology`, `mainResults`, `language`, `themes`, `confidenceScore`. Sortie = **proposition** (l'humain valide côté backend).

### 4.2 Ingestion / indexation (`/index`)
Transformer un document en base de connaissance interrogeable : extraction texte → nettoyage → chunking → enrichissement (métadonnées du dossier) → embeddings → stockage `pgvector`. Réindexation possible après nouvelle version.

### 4.3 Assistant IA (`/assistant/query`)
Question en langage naturel + filtres → recherche hybride (sémantique + filtres) → réponse **synthétique, sourcée** (avec citations document/page) + `answerStatus`. Refus si aucune source pertinente.

### 4.4 Travaux similaires (`/similar`)
À partir d'un dossier ou d'un texte → liste de documents proches avec **score** et **motifs** (mots-clés, domaine, méthodologie...). Détecteur de **proximité scientifique**, pas de plagiat complet.

### 4.5 Résumé / fiche de lecture (`/summarize`)
Pour un document : résumé court/long, problématique, méthodologie, résultats, limites, mots-clés suggérés ; sources citées (sections/pages).

## 5. Exigences non fonctionnelles

- **Sourçage obligatoire** : toute réponse Assistant IA cite ses sources ; sinon `NO_CONTEXT_FOUND`.
- **Respect des droits** : n'utiliser que les documents/visibilités autorisés par le backend (filtres transmis à chaque requête). Jamais de document privé dans une réponse publique.
- **Fiabilité** : gérer PDF illisibles, documents très longs, provider LLM/embeddings indisponible → erreurs explicites + reprise.
- **Performance** : ingestion asynchrone ; recherche < ~2 s sur corpus de démo ; top-k borné ; cache d'embeddings de requêtes fréquent (roadmap).
- **Portabilité providers** : embeddings et LLM interchangeables via interfaces, avec providers réels en runtime.
- **Sécurité** : secrets via env ; modération de prompts ; pas d'exécution de contenu de document.
- **Observabilité** : logs structurés (question, sources, modèle, latence), `/health`, métriques de base.
- **Coût** : limiter les appels LLM (cache, troncature de contexte, top-k raisonnable).

## 6. Contraintes compétition (hackathon)

- Démo : un PDF déposé → extraction automatique (≥ 6 champs + score) → indexation → question Assistant IA **avec sources** → travaux similaires.
- Fonctionner en **mode full live strict** avec clés et providers réels configurés.
- Ne pas sur-ingénierer : pas de fine-tuning, pas de pipeline distribué.

## 7. Scope

### MVP (Phase 1)
`/health`, `/extract`, `/index`, `/assistant/query` (sourcé), `/similar` basique ; pgvector ; providers réels ; chunking simple ; recherche hybride minimale ; logs.

### Hors scope MVP (roadmap)
OCR PDF scannés, résumé multi-documents avancé, reranking, cache distribué, feedback/évaluation des réponses, multilingue avancé, détection de similarité fine. Voir [ROADMAP.md](ROADMAP.md).

## 8. KPIs / critères de succès

- Extraction renvoyant ≥ 6 champs avec `confidenceScore`.
- Assistant IA : 100 % des réponses « répondues » contiennent ≥ 1 source ; refus propre quand pas de contexte.
- Similarité : top-k pertinent avec motifs explicites.
- Latence requête Assistant IA acceptable sur le corpus de démo.
- Robustesse : aucun crash sur PDF invalide (erreur `FAILED` propre).
- Mode full live strict : démo complète avec Mistral, Groq/Gemini et pgvector configurés.

## 9. Règles métier (rappel)

1. L'IA propose, l'humain valide ; aucune décision automatique.
2. Réponses **toujours sourcées** ; pas d'hallucination tolérée (refus si pas de source).
3. Respect des visibilités/permissions transmises par le backend.
4. `simba_ia` ne stocke pas de vérité métier (statuts, droits) : il consomme les métadonnées fournies.
5. Vocabulaire produit : « Assistant IA » (RAG = interne).
