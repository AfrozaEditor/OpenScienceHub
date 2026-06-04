# frontend — Product Requirements Document (application web)

> Exigences du frontend React d'OpenScience Hub. Source design : Spécification UI/UX et Wireframes dans `../../../Docs/`. Voir [ARCHITECTURE.md](ARCHITECTURE.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [PAGES.md](PAGES.md), [API_INTEGRATION.md](API_INTEGRATION.md).

---

## 1. Rôle du frontend

L'application web est la **vitrine et l'outil** d'OpenScience Hub. Elle rend l'expérience des **4 portails** et masque la complexité technique (IA, recherche, SSI). L'utilisateur doit comprendre vite : **déposer, valider, rechercher, explorer, vérifier, administrer**.

Le frontend **consomme uniquement l'API du backend** ; il n'accède jamais directement à `simba_ia` ni à `e-IDStack`.

## 2. Principe UX central

Transformer un **PDF isolé** en **dossier scientifique structuré** lisible et suivable : document + versions + métadonnées + avis + corrections + décisions + statut + preuve + historique.

Parcours déposant : `Créer → Uploader → Analyser par IA → Corriger → Soumettre → Suivre → Répondre → Vérifier`.

## 3. Utilisateurs et portails

| Portail | Utilisateurs | But |
|---|---|---|
| **Déposant** | Étudiant, doctorant, enseignant-chercheur, auteur | Créer et suivre des dossiers, déposer, corriger, voir la preuve |
| **Validation académique** | Encadreur, rapporteur, reviewer, chef de département, comité, école doctorale, archiviste | Instruire, aviser, corriger, décider, archiver |
| **Archive publique** | Public, chercheurs, recruteurs | Rechercher (facettes), consulter, Assistant IA, vérifier |
| **Administration** | Admin institutionnel, super admin | Configurer, superviser, sécuriser, auditer |

## 4. Exigences fonctionnelles (par portail)

### 4.1 Portail Déposant
- Tableau de bord (cartes statistiques, dossiers récents, notifications urgentes).
- Mes dossiers (recherche, filtres, actions contextuelles selon statut).
- **Wizard Nouveau dépôt (6 étapes)** : type → infos académiques → upload PDF → analyse IA → vérification métadonnées → soumission.
- Détail dossier (timeline + onglets : vue d'ensemble, métadonnées, document, versions, avis & décisions, corrections, preuve, historique).
- Corrections demandées (réponse + nouvelle version).
- Preuve & vérification (QR, lien, hash, statut, référence e-IDStack de IDS).

### 4.2 Portail Validation académique
- Dashboard (file prioritaire, stats, résumé par type).
- Dossiers à traiter (inbox, filtres, priorités).
- Détail dossier à valider (visualiseur PDF, métadonnées comparées IA/déposant/institution, analyse IA, avis, corrections, décision, archivage).
- Décision finale (checklist bloquante avant validation).
- Archivage institutionnel (verrouillage version finale, options preuve/QR/publication).
- Module articles / peer review (interne).

### 4.3 Portail Archive publique
- Accueil (hero, recherche, actions rapides, stats, travaux récents, bloc vérification).
- Catalogue (cartes documents, badges).
- **Recherche avancée à facettes** (panneau facettes + résultats expliqués + tri).
- Fiche publique document (résumé, métadonnées, accès PDF, bloc preuve, Assistant IA contextuel, travaux similaires, citation).
- **Assistant IA** (question, réponse **sourcée**, sources visibles, filtres contextuels).
- **Vérification QR** (scan/lien/identifiant → authentique/invalide/introuvable/révoqué).

### 4.4 Portail Administration
- Dashboard (KPIs + état des services).
- Utilisateurs, rôles & permissions, institutions, structures académiques.
- Workflows, types de documents, paramètres IA, paramètres SSI/e-IDStack.
- Preuves & vérifications, statistiques, audit.

## 5. Exigences non fonctionnelles

- **Design premium institutionnel** : palette noir/rouge/gris/blanc, sobre, aéré. Voir [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
- **Réactivité** : responsive (desktop prioritaire pour les portails internes ; public mobile-friendly).
- **Performance perçue** : skeletons, pas de spinner global ; chargement rapide (Vite, code-splitting par route).
- **Accessibilité** : contraste, clavier, labels, badges non uniquement colorés.
- **États systématiques** : vide / chargement / erreur sur chaque écran.
- **Sécurité côté client** : JWT en stockage sûr, garde de routes par rôle, aucun secret API/SSI/IA exposé.
- **Confidentialité** : ne jamais afficher de contenu non autorisé (le backend filtre, l'UI respecte).
- **i18n** : FR par défaut, EN en roadmap.

## 6. Contraintes compétition

- Prioriser les écrans à fort effet démo : Accueil public, Recherche à facettes, Fiche document, Nouveau dépôt, Analyse IA, Détail validation, Décision, Archivage + preuve, Vérification QR.
- Pouvoir tourner avec une **API mockée** (MSW) si le backend n'est pas prêt.
- Effet démo : *un document déposé → l'IA extrait → un validateur décide → archivage → recherchable → Assistant IA l'explore → QR vérifie l'authenticité.*

## 7. Scope

### MVP (Phase 1)
Auth + layouts ; Accueil public ; Catalogue + recherche à facettes ; Fiche document ; Wizard de dépôt ; Analyse IA / métadonnées ; Détail validation + décision ; Archivage + preuve ; Assistant IA (sourcé) ; Vérification QR ; Dashboard admin minimal.

### Hors scope MVP (roadmap)
Workflows configurables visuels, peer review avancé, statistiques riches, multi-langues, sauvegarde de recherche, notifications temps réel. Voir [ROADMAP.md](ROADMAP.md).

## 8. KPIs / critères de succès

- Parcours de démo complet sans accroc (< 3 min).
- Recherche à facettes combinant ≥ 5 filtres, résultats « expliqués ».
- Assistant IA affichant systématiquement ses **sources**.
- Page de vérification claire (états authentique/invalide/introuvable/révoqué).
- Cohérence visuelle (palette, badges, états) sur tous les écrans.
- Accessibilité de base respectée.

## 9. Règles d'interface (rappel)

1. Rouge avec parcimonie (CTA forts : Soumettre, Archiver, Vérifier, Confirmer).
2. Badges de statut cohérents (voir design system).
3. « L'analyse IA est une aide ; la décision reste humaine » affiché là où l'IA intervient en validation.
4. Confirmations critiques en modale.
5. Vocabulaire : « Assistant IA », « document vérifiable », « e-IDStack de IDS ». Jamais « RAG »/« wallet »/« DID » en surface.
