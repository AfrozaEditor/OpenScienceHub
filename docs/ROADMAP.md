# OpenScience Hub — Roadmap (backend)

> Priorisation des modules backend en phases. Voir [PRD.md](PRD.md), [API_SPEC.md](API_SPEC.md).

---

## Phase 1 — Socle compétition (MVP démontrable)

Objectif : démontrer le parcours complet **dépôt → extraction IA → validation → archivage → preuve/QR → recherche → Assistant IA → vérification**.

### Backend à livrer
- `accounts` : auth JWT, 4 rôles simplifiés (`DEPOSANT`, `VALIDATOR`, `ADMIN`, `PUBLIC`), `me`.
- `institutions` : référentiel minimal (institution → faculté → département).
- `works` : créer dossier, contributeurs, soumettre, timeline, historique.
- `documents` : upload PDF, hash SHA-256, versions, version finale.
- `ai` : client `simba_ia`, extraction métadonnées (`MetadataExtraction`), accept/correction, Assistant IA basique avec sources.
- `validation` : avis, corrections, décision finale (checklist simple), transitions de statut.
- `archive` : `ArchiveRecord`, verrouillage version finale, déclenchement preuve.
- `ssi` : client e-IDStack live, `VerificationProof` + QR, endpoint public `/verify/{code}`, état `SSI_PENDING` si le service est indisponible.
- `search` : catalogue public + recherche à facettes (filtres principaux).
- `audit` : journal minimal des actions sensibles.

### Critères de sortie Phase 1
- Démo bout en bout < 3 min.
- Extraction IA ≥ 6 champs + score.
- Recherche combinant ≥ 5 facettes.
- Assistant IA répond avec sources.
- Vérification QR avec résultat clair.
- Cohérence des hash (version finale == preuve == claim).

## Phase 2 — Produit institutionnel

- `accounts` : RBAC complet par périmètre (tous les rôles, `UserRoleAssignment`, matrice de permissions).
- `validation` : workflows mémoire/thèse/article différenciés, soutenances (`DefenseSession`), multi-rapporteurs, module articles / peer review (interne).
- `admin` : configuration des workflows (étapes/transitions versionnées), types de documents, paramètres IA, paramètres SSI/e-IDStack.
- `ssi` : durcissement e-IDStack (schema + cred-def), révocation/réémission, `CredentialStatusRecord`, supervision et retries.
- `search` : indexation avancée, tri multiples, sauvegarde de recherche.
- `ai` : similarité (`AIKnowledgeChunk`), fiche de lecture, aide à la validation.
- `audit` : niveaux de criticité, exports, statistiques et pilotage.
- Notifications (email + internes), tâches asynchrones (Celery/Redis).

## Phase 3 — Échelle nationale / interuniversitaire

- Multi-institutions et fédération de catalogues.
- Référentiels disciplinaires partagés.
- Interopérabilité SSI (DID holder/wallet `e-IDapp`, status lists, formats SD-JWT VC).
- Authentification de diplôme / intégration bibliothèques.
- Analytics de recherche, détection avancée de similarité/plagiat.
- Politiques d'accès fines (embargo, restreint par rôle), conservation/retention.

## À éviter pendant la compétition

- Wallet SSI complet, DID registry custom, ledger blockchain maison.
- Signature cryptographique « maison » (tout passe par e-IDStack).
- Réimplémentation du RAG/LLM dans le backend (tout passe par `simba_ia`).
- Workflow réglementaire ultra-détaillé, peer review comme portail séparé.
- Annotations PDF avancées, statistiques avancées.

## Ordre d'implémentation recommandé (Phase 1)

```text
1. common + accounts (auth) 
2. institutions (référentiel)
3. works + documents (dépôt + hash)
4. ai (extraction via simba_ia live)
5. validation (avis, décision)
6. archive + ssi (preuve + QR via e-IDStack live)
7. search (catalogue + facettes)
8. ai (Assistant IA sourcé)
9. audit + dashboard admin minimal
```
