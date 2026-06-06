# OpenScience Hub — Product Requirements Document (PRD)

> Version 1.0 — Document de référence produit. Centré sur le **backend** mais décrit le produit complet. Voir aussi [ARCHITECTURE.md](ARCHITECTURE.md), [DATA_MODEL.md](DATA_MODEL.md), [SSI_INTEGRATION.md](SSI_INTEGRATION.md), [API_SPEC.md](API_SPEC.md), [ROADMAP.md](ROADMAP.md), [GLOSSARY.md](GLOSSARY.md).

---

## 1. Vision et positionnement

**OpenScience Hub** est une plateforme institutionnelle qui transforme les **mémoires, thèses et articles** en **dossiers scientifiques structurés**, puis permet de les archiver, classifier, valider, explorer (via IA) et vérifier.

- **Slogan** : « Le hub intelligent des travaux scientifiques universitaires ».
- **Promesse** : **Archiver. Valider. Explorer. Vérifier.**
- **Phrase produit officielle** : « OpenScience Hub permet d'archiver, classifier, valider, explorer et vérifier les mémoires, thèses et articles universitaires grâce à l'IA, la recherche avancée et une couche SSI basée sur **e-IDStack de IDS**. »

On ne vend **pas** « une plateforme SSI ». On vend un **répertoire institutionnel intelligent** ; le SSI est la **couche de preuve d'authenticité** qui intervient après validation et archivage.

## 2. Problème

Dans les universités (contexte Cameroun et au-delà) :

1. Difficulté à vérifier l'authenticité d'un mémoire / thèse / article.
2. Risque de plagiat / duplication.
3. Mauvaise traçabilité des travaux scientifiques.
4. Archives dispersées ou non numérisées.
5. Absence de preuve numérique officielle liée aux travaux.

## 3. Solution

Une plateforme qui centralise les travaux, **extrait automatiquement les métadonnées par IA**, organise la **validation académique**, **archive** les versions finales, offre une **recherche à facettes** + un **Assistant IA** sourcé, et délivre une **preuve d'authenticité vérifiable** (QR + Verifiable Credential via e-IDStack de IDS).

## 4. Utilisateurs et acteurs

### 4.1 Acteurs humains

| Acteur | Description | Portail principal |
|---|---|---|
| Déposant | Étudiant, doctorant, enseignant-chercheur, auteur | Déposant |
| Validateur académique | Encadreur, rapporteur, reviewer, chef de département, comité scientifique, école doctorale, archiviste | Validation |
| Administrateur institutionnel | Gère utilisateurs, structures, workflows de son institution | Administration |
| Super administrateur | Gère plusieurs institutions et la config globale | Administration |
| Public / Lecteur | Étudiant, chercheur, recruteur, vérificateur externe | Archive publique |

### 4.2 Acteurs systèmes (externes au backend)

| Système | Rôle |
|---|---|
| `simba_ia` (FastAPI) | Extraction des métadonnées PDF + Assistant IA (RAG, embeddings, pgvector) |
| `e-IDStack de IDS` (NestJS/Credo) | Émission et vérification des Verifiable Credentials |
| Stockage fichiers | PDF et versions |
| Service notification | Email / notifications internes |

### 4.3 Modèle SSI (sans wallet)

`Issuer` = Institution · `Holder` = **la plateforme OpenScience Hub** (dépositaire : la preuve est stockée en base, pas dans une appli mobile) · `Verifier` = Public/Recruteur/Jury via une **page web** (QR/lien).

> **Décision** : le wallet mobile `e-IDapp` n'est **pas** utilisé. La vérification est 100 % web (aucun wallet ni compte requis côté vérificateur). Un wallet holder pour les auteurs reste une option **roadmap** (voir [ROADMAP.md](ROADMAP.md) Phase 3).

## 5. Portails (vue produit) et rôle du backend

Le backend expose une **API unique** qui sert les 4 portails (front séparé).

1. **Portail Déposant** — créer un dossier, uploader le PDF, déclencher l'extraction IA, corriger/valider les métadonnées, soumettre, suivre le statut, répondre aux corrections, consulter la preuve.
2. **Portail Validation académique** — inbox des dossiers, consultation PDF + métadonnées, validation des métadonnées, avis, corrections, décision finale, archivage, module articles/peer review (interne).
3. **Portail Archive publique** — accueil, catalogue, recherche à facettes, fiche publique, Assistant IA, vérification QR.
4. **Portail Administration** — utilisateurs, rôles/permissions, institutions, structures, workflows, types de documents, paramètres IA, paramètres SSI/e-IDStack, preuves, statistiques, audit.

## 6. Workflow métier central

Workflow unique paramétrable par type de document :

```text
Brouillon → Soumis → En instruction → Correction demandée → Re-soumis → Validé → Archivé
```

- **Mémoire** : Soumis → Encadreur/Département → Autorisé soutenance → Soutenu → Corrigé → Dépôt final → Archivé.
- **Thèse** : Soumis → École doctorale → Expertise (rapporteurs) → Autorisé soutenance → Soutenu → Corrections post-soutenance → Dépôt final → Archivé.
- **Article** : Soumis → Screening éditorial → Peer review → Révision → Accepté/Rejeté → Publié/Archivé.

Après **Archivé** : émission de la preuve (e-IDStack) + QR + publication de la fiche publique + indexation pour recherche et Assistant IA.

## 7. Exigences fonctionnelles (par module backend)

### 7.1 Comptes & RBAC (`accounts`)
- Inscription/connexion (JWT), gestion de session, profil.
- Rôles : `DEPOSANT`, `VALIDATOR`, `SUPERVISOR`, `RAPPORTEUR`, `REVIEWER`, `DEPARTMENT_HEAD`, `SCIENTIFIC_COMMITTEE`, `ARCHIVIST`, `INSTITUTION_ADMIN`, `SUPER_ADMIN`, `PUBLIC`.
- Affectations de rôle par périmètre (`scopeType` ∈ {GLOBAL, INSTITUTION, FACULTY, DEPARTMENT, PROGRAM, WORKFLOW}).
- Permissions par module et par action (VIEW, CREATE, UPDATE, DELETE, VALIDATE, DECIDE, ARCHIVE, EXPORT, CONFIGURE, AUDIT).

### 7.2 Référentiel académique (`institutions`)
- CRUD institutions, facultés, départements, programmes (hiérarchie stricte).
- Désactivation : plus de nouveaux dossiers, anciens conservés.

### 7.3 Dossiers scientifiques (`works`)
- CRUD `ScientificWork` (type, titre, résumé, langue, année, mots-clés, statut, visibilité).
- Contributeurs (`WorkContributor`), au moins 1 auteur.
- Soumission officielle (passage en lecture seule, notification au portail validation).

### 7.4 Documents & versions (`documents`)
- Upload PDF (contrôle MIME), calcul **SHA-256**, `pageCount`, création de version.
- Versioning, une seule version finale (`is_final`), verrouillage après archivage.

### 7.5 Extraction IA (`ai`)
- Déclenche l'extraction via `simba_ia`, stocke `MetadataExtraction` (proposition + `confidenceScore` + `rawJson`).
- L'humain valide/corrige avant que ça devienne les métadonnées officielles.

### 7.6 Validation (`validation`)
- Affectations (`ValidationAssignment`), avis (`Review`), corrections (`CorrectionRequest`), décisions (`Decision`), soutenances (`DefenseSession`), événements de workflow (`WorkflowEvent`).
- Transitions de statut contrôlées par rôle et par conditions (checklist avant décision finale).

### 7.7 Archivage (`archive`)
- Création `ArchiveRecord` (publicSlug, accessLevel, isDownloadAllowed), liaison à la version finale.
- Déclenche la preuve (`ssi`) et la publication de la fiche.

### 7.8 Recherche & Assistant IA (`search`, `ai`)
- Catalogue public + recherche à facettes (type, institution, faculté, département, programme, domaine, année, auteur, encadreur, mots-clés, langue, statut, visibilité, `isVerifiable`, `hasPdf`).
- Assistant IA : question → `simba_ia` retourne réponse + sources ; stockage `AIQueryLog` / `AIAnswerCitation`.

### 7.9 SSI / Preuve (`ssi`)
- Configuration de connexion e-IDStack par institution.
- Émission de `VerifiableCredential` + `VerificationProof` (QR, verificationUrl), gestion statut (ACTIVE/REVOKED/EXPIRED), `SSI_PENDING` si échec.
- Endpoint public de vérification.

### 7.10 Audit & statistiques (`audit`)
- Journal immuable des actions sensibles ; statistiques et exports.

## 8. Exigences non fonctionnelles

- **Sécurité** : JWT, RBAC par périmètre, secrets en variables d'environnement, clés e-IDStack jamais exposées, hashing mot de passe (PBKDF2/Argon2), validation/limitation upload.
- **Confidentialité** : documents privés jamais exposés (ni dans facettes, ni dans Assistant IA, ni dans vérification publique).
- **Traçabilité** : audit immuable, logs e-IDStack consultables par admins autorisés.
- **Performance** : pagination, index DB, recherche scalable ; tâches longues (extraction, indexation, émission) en asynchrone.
- **Fiabilité** : si e-IDStack ou `simba_ia` indisponible → état explicite (`SSI_PENDING`, extraction `FAILED` avec relance), jamais de blocage silencieux.
- **Accessibilité / i18n** : messages clairs, FR par défaut, EN possible.
- **Observabilité** : statut des services exposé pour le dashboard admin.

## 9. Contraintes de la compétition (hackathon)

- Livrer un **MVP démontrable** : dépôt → extraction IA → validation → archivage → preuve/QR → recherche à facettes → Assistant IA → vérification.
- Le SSI démarre via **e-IDStack de IDS** en mode réel ; si le service n'est pas connecté, la preuve passe en état explicite (`SSI_PENDING`) et doit être réémise, sans preuve simulée.
- Éviter le sur-engineering : pas de wallet complet, pas de ledger custom, peer review = **module** interne (pas un portail séparé).

## 10. Scope

### MVP (Phase 1)
Auth + RBAC simple, référentiel minimal, dépôt + upload + hash, extraction IA (simba_ia), validation/correction des métadonnées, workflow simplifié, archivage, recherche à facettes, fiche publique, Assistant IA basique, génération QR + page de vérification, émission preuve réelle via e-IDStack de IDS ou état `SSI_PENDING` réémissible.

### Hors scope MVP (roadmap)
Workflows entièrement paramétrables, multi-rapporteurs, peer review avancé, statistiques avancées, wallet holder, révocation fine, fédération multi-institutions, détection de similarité avancée. Voir [ROADMAP.md](ROADMAP.md).

## 11. KPIs / critères de succès

- Démo de bout en bout fonctionnelle (< 3 min).
- Extraction IA renseignant ≥ 6 champs de métadonnées avec score de confiance.
- Recherche à facettes combinant ≥ 5 filtres.
- Assistant IA répondant **avec sources**.
- Vérification QR affichant un résultat clair (authentique / invalide / introuvable / révoqué).
- Cohérence hash : `DocumentVersion.sha256` == `VerificationProof.documentHash` == claim credential.

## 12. Règles métier structurantes (rappel)

1. Un `ScientificWork` a au moins un auteur et au moins une `DocumentVersion`.
2. Une seule version finale par dossier.
3. `ArchiveRecord` seulement si dossier validé/prêt ; référence exactement une version finale.
4. `VerificationProof` obligatoire après archivage ; preuve = VC via e-IDStack de IDS.
5. Les métadonnées IA sont des propositions validables par un humain.
6. L'Assistant IA assiste mais ne valide aucun travail ; il cite ses sources.
7. La vérification combine hash document + statut dossier + statut VC + signature (via e-IDStack).
8. Workflow paramétrable par institution / type de document.
