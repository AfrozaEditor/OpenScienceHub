# OpenScience Hub — Spécification UI/UX complète

**Produit :** OpenScience Hub  
**Slogan :** *Le hub intelligent des travaux scientifiques universitaires*  
**Promesse :** *Archiver. Valider. Explorer. Vérifier.*  
**Positionnement :** plateforme institutionnelle d’archivage, de classification, de validation, d’exploration intelligente et de vérification des mémoires, thèses et articles universitaires.  
**Couche SSI :** couche SSI basée sur **e-IDStack de IDS**.  
**IA :** extraction de métadonnées, classification thématique, synthèse, travaux similaires et Assistant IA de recherche scientifique.

---

## 0. Objectif du document

Ce document décrit la spécification UI/UX complète d’OpenScience Hub. Il sert de référence pour :

- la conception des interfaces ;
- la réalisation des maquettes ;
- l’alignement entre produit, design et développement ;
- la préparation de la démonstration hackathon ;
- la clarification des parcours utilisateurs ;
- la cohérence visuelle et fonctionnelle du système.

Le document couvre les quatre portails du système :

1. **Portail Déposant** ;
2. **Portail Validation académique** ;
3. **Portail Archive publique** ;
4. **Portail Administration**.

Chaque portail est décrit avec :

- objectifs ;
- utilisateurs cibles ;
- pages ;
- composants UI ;
- données affichées ;
- actions ;
- règles métier ;
- états vides ;
- états de chargement ;
- états d’erreur ;
- permissions ;
- style visuel ;
- usage de la palette.

---

## 1. Direction produit et expérience globale

### 1.1 Vision utilisateur

OpenScience Hub ne doit pas être perçu comme une simple application d’upload PDF. L’expérience doit donner l’impression d’une plateforme académique sérieuse, institutionnelle, moderne et vérifiable.

L’utilisateur doit comprendre rapidement que la plateforme permet de :

- déposer des travaux scientifiques ;
- structurer les métadonnées ;
- faire intervenir l’IA pour accélérer la classification ;
- organiser un workflow de validation académique ;
- archiver officiellement la version finale ;
- rendre les travaux consultables ;
- interroger l’archive avec l’Assistant IA ;
- vérifier l’authenticité d’un document par QR code, lien public ou identifiant de preuve.

### 1.2 Principe UX central

Le système doit transformer un **PDF isolé** en **dossier scientifique structuré**.

Un dossier scientifique contient :

- document PDF ;
- versions ;
- métadonnées ;
- avis ;
- corrections ;
- décisions ;
- statut ;
- preuve ;
- archive ;
- historique ;
- liens de consultation et vérification.

### 1.3 Ton de l’interface

Le ton textuel doit être :

- clair ;
- institutionnel ;
- rassurant ;
- précis ;
- non publicitaire ;
- non trop technique côté utilisateur final.

À éviter dans l’interface utilisateur :

- termes trop techniques comme `RAG`, `DID Registry`, `Credential Issuer`, `Vector DB`, `Chunking` ;
- promesses excessives sur l’IA ;
- messages qui donnent l’impression que l’IA remplace les jurys ou comités ;
- vocabulaire crypto/blockchain non nécessaire.

À privilégier :

- **Assistant IA** ;
- **preuve de vérification** ;
- **document vérifiable** ;
- **version finale archivée** ;
- **métadonnées validées** ;
- **couche SSI basée sur e-IDStack de IDS**.

---

## 2. Identité visuelle et branding UI

### 2.1 Palette officielle

| Rôle | Nom | Code hex | Usage principal |
|---|---|---:|---|
| Noir principal | Primary Black | `#050505` | logo, titres, sidebar, texte premium |
| Rouge signature | Academic Red | `#C40012` | boutons principaux, accents, actions fortes |
| Rouge profond | Deep Red | `#8B000B` | hover, états actifs, zones premium |
| Gris technologique | Tech Gray | `#9CA3AF` | icônes secondaires, circuits, texte tertiaire |
| Argent clair | Light Silver | `#E5E7EB` | bordures, séparateurs, fonds doux |
| Blanc pur | Pure White | `#FFFFFF` | fonds, cartes, zones de lecture |
| Texte sombre | Dark Text | `#111827` | texte principal |
| Texte secondaire | Slate Gray | `#4B5563` | sous-titres, descriptions |
| Fond clair | Soft Background | `#F8F9FA` | fond global des dashboards |
| Bordure | Border Gray | `#D1D5DB` | tableaux, champs, séparations |
| Succès | Verified Green | `#10B981` | validé, authentique, actif |
| Avertissement | Warning Amber | `#F59E0B` | correction, attention, en attente |
| Erreur | Error Red | `#EF4444` | rejeté, invalide, erreur |

### 2.2 Règles d’usage des couleurs

#### Noir

Le noir est utilisé pour :

- titres majeurs ;
- sidebar ;
- logo ;
- textes institutionnels ;
- zones premium ;
- badges `ARCHIVÉ`.

#### Rouge

Le rouge doit être utilisé avec parcimonie pour garder un rendu premium :

- bouton principal ;
- accent actif dans la navigation ;
- filets graphiques ;
- icônes de preuve ;
- éléments de vérification ;
- CTA forts : `Soumettre`, `Archiver`, `Vérifier`.

Le rouge ne doit pas saturer l’interface. Il sert à guider l’œil.

#### Gris

Le gris sert à stabiliser la lecture :

- bordures ;
- fonds de cartes ;
- textes secondaires ;
- icônes neutres ;
- états désactivés ;
- squelette de chargement.

#### Vert, orange, rouge erreur

Ces couleurs fonctionnelles sont réservées aux statuts :

- vert : validé, authentique, actif ;
- orange : correction demandée, attente, attention ;
- rouge erreur : rejeté, invalide, échec technique.

### 2.3 Typographie recommandée

#### Police principale

- **Inter** ou **Satoshi** pour l’interface ;
- style clair, moderne, lisible ;
- très adaptée aux dashboards et tableaux.

#### Police alternative

- **Manrope** pour un rendu plus premium ;
- **IBM Plex Sans** si on veut un style plus institutionnel et technique.

#### Hiérarchie typographique

| Élément | Taille recommandée | Poids |
|---|---:|---:|
| Titre page | 28–36 px | 700 |
| Titre section | 20–24 px | 600 |
| Titre carte | 16–18 px | 600 |
| Texte normal | 14–16 px | 400 |
| Texte secondaire | 13–14 px | 400 |
| Badge | 11–12 px | 600 uppercase |
| Bouton | 14–15 px | 600 |

### 2.4 Style général

Le style doit être :

- premium ;
- blanc dominant ;
- cartes aérées ;
- ombres très légères ;
- coins arrondis modérés ;
- séparation claire des zones ;
- pictogrammes sobres ;
- pas de surcharge graphique.

#### Radius recommandé

- boutons : 10–12 px ;
- cartes : 16–20 px ;
- champs : 10–12 px ;
- badges : 999 px ou 8 px selon style.

#### Ombres

Utiliser des ombres faibles :

```css
box-shadow: 0 8px 24px rgba(5, 5, 5, 0.06);
```

Pour les cartes importantes :

```css
box-shadow: 0 12px 32px rgba(5, 5, 5, 0.08);
```

### 2.5 Composants UI standard

#### Bouton principal

- fond : `#C40012` ;
- texte : `#FFFFFF` ;
- hover : `#8B000B` ;
- radius : 12 px ;
- hauteur : 44–48 px.

Usage :

- `Nouveau dépôt` ;
- `Soumettre officiellement` ;
- `Archiver officiellement` ;
- `Vérifier` ;
- `Confirmer décision`.

#### Bouton secondaire

- fond : blanc ;
- bordure : `#D1D5DB` ;
- texte : `#111827` ;
- hover : `#F8F9FA`.

Usage :

- `Annuler` ;
- `Voir détails` ;
- `Retour` ;
- `Exporter`.

#### Bouton danger

- fond : `#EF4444` ;
- texte blanc ;
- hover rouge plus foncé.

Usage :

- `Révoquer preuve` ;
- `Désactiver utilisateur` ;
- `Rejeter`.

#### Badges de statut

| Statut | Couleur | Style |
|---|---|---|
| BROUILLON | gris | fond `#F3F4F6`, texte `#4B5563` |
| SOUMIS | noir | fond `#050505`, texte blanc |
| EN INSTRUCTION | gris foncé | fond `#E5E7EB`, texte `#111827` |
| CORRECTION DEMANDÉE | orange | fond `#FEF3C7`, texte `#92400E` |
| VALIDÉ | vert | fond `#D1FAE5`, texte `#065F46` |
| ARCHIVÉ | noir/rouge | fond noir, accent rouge |
| REJETÉ | rouge | fond `#FEE2E2`, texte `#991B1B` |
| AUTHENTIQUE | vert | fond `#D1FAE5`, texte `#065F46` |
| INVALIDE | rouge | fond `#FEE2E2`, texte `#991B1B` |
| RESTREINT | orange/gris | fond `#FFF7ED`, texte `#9A3412` |

### 2.6 Layouts principaux

#### Dashboard interne

- sidebar gauche fixe ;
- header supérieur ;
- zone contenu sur fond `#F8F9FA` ;
- cartes blanches ;
- tables propres ;
- accent rouge sur actions principales.

#### Portail public

- header horizontal ;
- hero premium ;
- recherche centrale ;
- cartes publiques ;
- footer institutionnel ;
- beaucoup d’espace blanc.

#### Pages critiques

Les pages comme `Décision finale`, `Archivage institutionnel`, `Paramètres SSI / e-IDStack` doivent avoir un design plus sérieux :

- blocs de confirmation ;
- checklist ;
- alertes ;
- historique visible ;
- peu de distraction visuelle.

---

## 3. Architecture globale des portails

```text
OpenScience Hub
│
├── Portail Déposant
│   ├── Tableau de bord
│   ├── Mes dossiers scientifiques
│   ├── Nouveau dépôt
│   ├── Détail dossier
│   ├── Métadonnées IA
│   ├── Versions document
│   ├── Corrections demandées
│   ├── Preuve et vérification
│   ├── Notifications
│   └── Profil
│
├── Portail Validation académique
│   ├── Tableau de bord validation
│   ├── Dossiers à traiter
│   ├── Détail dossier à valider
│   ├── Validation métadonnées
│   ├── Avis académiques
│   ├── Gestion corrections
│   ├── Décision finale
│   ├── Archivage institutionnel
│   ├── Articles / Peer Review
│   ├── Historique & audit
│   ├── Notifications
│   └── Profil validateur
│
├── Portail Archive publique
│   ├── Accueil public
│   ├── Catalogue
│   ├── Recherche avancée à facettes
│   ├── Fiche document
│   ├── Assistant IA
│   ├── Travaux similaires
│   ├── Vérification QR code
│   ├── Tendances scientifiques
│   ├── Institutions participantes
│   └── Aide / FAQ
│
└── Portail Administration
    ├── Tableau de bord administration
    ├── Utilisateurs
    ├── Rôles & permissions
    ├── Institutions
    ├── Structures académiques
    ├── Workflows
    ├── Types de documents
    ├── Paramètres IA
    ├── Recherche & facettes
    ├── SSI / e-IDStack
    ├── Preuves & vérifications
    ├── Statistiques
    ├── Audit système
    ├── Paramètres généraux
    └── Profil administrateur
```

---

# 4. Portail Déposant — Spécification UI/UX détaillée

## 4.1 Description générale

Le Portail Déposant est destiné aux personnes qui soumettent des travaux scientifiques : étudiants, doctorants, enseignants-chercheurs et auteurs d’articles. L’expérience doit être guidée, rassurante et progressive.

Le déposant ne doit jamais avoir l’impression qu’il remplit un formulaire administratif interminable. Le système doit l’accompagner étape par étape :

```text
Créer → Uploader → Analyser par IA → Corriger → Soumettre → Suivre → Répondre → Vérifier
```

## 4.2 Page : Tableau de bord déposant

### Objectif

Afficher une vue synthétique des dossiers du déposant et des actions urgentes.

### Utilisateur cible

- étudiant ;
- doctorant ;
- enseignant-chercheur ;
- auteur d’article.

### Layout

- header supérieur ;
- sidebar déposant ;
- bloc de bienvenue ;
- cartes statistiques ;
- liste des dossiers récents ;
- notifications urgentes ;
- raccourcis.

### Composants UI

#### Header

- logo OpenScience Hub ;
- libellé `Espace déposant` ;
- recherche rapide ;
- icône notifications ;
- menu utilisateur.

#### Sidebar

- Tableau de bord ;
- Mes dossiers ;
- Nouveau dépôt ;
- Corrections ;
- Notifications ;
- Profil.

#### Bloc bienvenue

Texte :

> Bonjour, [Nom]. Bienvenue dans votre espace de dépôt scientifique.

Boutons :

- `Nouveau dépôt` — bouton rouge ;
- `Consulter mes dossiers` — bouton secondaire.

#### Cartes statistiques

- total dossiers ;
- brouillons ;
- soumis ;
- en instruction ;
- correction demandée ;
- validés ;
- archivés ;
- rejetés.

Style :

- carte blanche ;
- titre gris ;
- chiffre noir ;
- icône fine ;
- accent couleur selon statut.

### Données affichées

```text
user.fullName
stats.totalWorks
stats.draftCount
stats.submittedCount
stats.inReviewCount
stats.correctionRequestedCount
stats.validatedCount
stats.archivedCount
stats.rejectedCount
recentWorks[]
urgentNotifications[]
```

### Actions

- créer un nouveau dépôt ;
- ouvrir un dossier ;
- continuer un brouillon ;
- répondre à une correction ;
- voir la preuve ;
- ouvrir une notification.

### Règles métier

- un brouillon peut être modifié ;
- un dossier soumis est en lecture seule ;
- un dossier en instruction est en lecture seule ;
- un dossier avec correction demandée peut recevoir une réponse ou une nouvelle version ;
- un dossier archivé ne peut plus être modifié ;
- un dossier rejeté reste consultable.

### États vides

Si aucun dossier :

> Vous n’avez encore créé aucun dossier scientifique. Commencez par déposer un mémoire, une thèse ou un article.

CTA : `Nouveau dépôt`.

### États d’erreur

- impossible de charger les statistiques ;
- impossible de charger les dossiers récents ;
- impossible de charger les notifications.

Style erreur :

- carte blanche avec bordure rouge clair ;
- message en `#991B1B` ;
- bouton secondaire `Réessayer`.

---

## 4.3 Page : Mes dossiers scientifiques

### Objectif

Lister tous les dossiers scientifiques du déposant avec recherche, filtres et actions contextuelles.

### Layout

- header de page ;
- recherche ;
- filtres ;
- tableau ;
- pagination ;
- menu d’actions par ligne.

### Champs de recherche

- titre ;
- mots-clés ;
- département ;
- année académique ;
- type de document.

### Filtres

- type : mémoire, thèse, article ;
- statut ;
- année académique ;
- institution ;
- département ;
- date de création.

### Tableau

Colonnes :

- titre ;
- type ;
- institution ;
- département ;
- année ;
- statut ;
- dernière mise à jour ;
- actions.

### Actions par dossier

Selon statut :

| Statut | Actions |
|---|---|
| Brouillon | Voir, Modifier, Continuer, Supprimer si autorisé |
| Soumis | Voir |
| En instruction | Voir |
| Correction demandée | Voir, Répondre, Déposer nouvelle version |
| Validé | Voir, Télécharger si disponible |
| Archivé | Voir, Voir fiche publique, Voir preuve, Télécharger PDF final |
| Rejeté | Voir décision |

### Règles métier

- le déposant ne voit que ses propres dossiers ;
- un dossier archivé est verrouillé ;
- un dossier soumis ne peut pas être modifié ;
- un dossier avec correction demandée ouvre un accès contrôlé aux champs concernés.

---

## 4.4 Page : Nouveau dépôt

### Objectif

Créer un nouveau dossier scientifique via un wizard guidé.

### Layout

- stepper horizontal ;
- formulaire central ;
- bloc d’aide latéral ;
- boutons `Précédent`, `Suivant`, `Enregistrer brouillon` ;
- sauvegarde automatique discrète.

### Étapes

1. Type de travail ;
2. Informations académiques ;
3. Upload PDF ;
4. Analyse IA ;
5. Vérification métadonnées ;
6. Soumission officielle.

### Étape 1 — Type de travail

Cartes :

- mémoire ;
- thèse ;
- article scientifique.

Chaque carte contient :

- icône ;
- titre ;
- description ;
- badge éventuel.

Style :

- carte blanche ;
- bordure grise ;
- carte sélectionnée : bordure rouge `#C40012`, fond très légèrement rosé.

### Étape 2 — Informations académiques

Champs communs :

```text
title: string, required
mainAuthor: string, required
coAuthors: string[], optional
institutionId: uuid, required
facultyId: uuid, optional
departmentId: uuid, required
programId: uuid, optional
academicYear: string, required
language: enum, required
visibilityRequested: enum, required
```

Enums :

```text
language = FR | EN | OTHER
visibilityRequested = PUBLIC | RESTRICTED | PRIVATE_INSTITUTIONAL
```

Champs mémoire :

```text
level: LICENCE | MASTER | INGENIEUR | OTHER
supervisorName: string
specialization: string
plannedDefenseDate: date optional
```

Champs thèse :

```text
doctoralCycle: DOCTORAT | PHD | OTHER
thesisDirectorName: string
coDirectorName: string optional
doctoralSchoolId: uuid optional
laboratoryName: string optional
doctoralDomain: string
```

Champs article :

```text
journalOrConference: string optional
editorialStatus: DRAFT | SUBMITTED | UNDER_REVIEW | ACCEPTED | PUBLISHED
doi: string optional
authors: string[]
correspondingAuthor: string optional
```

### Étape 3 — Upload PDF

Composants :

- zone drag-and-drop ;
- bouton choisir fichier ;
- progression upload ;
- carte fichier ;
- affichage hash SHA-256.

Données :

```text
fileName
fileSize
mimeType
pageCount
sha256Hash
uploadedAt
versionNumber
```

Règles :

- PDF obligatoire ;
- hash calculé automatiquement ;
- chaque upload crée une version ;
- le fichier doit être stocké avant analyse IA.

### Étape 4 — Analyse IA

Sous-tâches affichées :

- extraction texte ;
- détection titre ;
- détection auteurs ;
- extraction résumé ;
- suggestion mots-clés ;
- classification thématique ;
- détection méthodologie ;
- détection résultats.

Résultats :

```text
detectedTitle
detectedAuthors
detectedAbstract
suggestedKeywords
detectedDomain
detectedProblemStatement
detectedMethodology
detectedResults
detectedLanguage
suggestedThemes
confidenceScore
```

Message UX :

> L’analyse IA vous aide à préparer les métadonnées. Vous devez vérifier et confirmer les informations avant soumission.

### Étape 5 — Vérification métadonnées

Layout :

- colonne gauche : champs modifiables ;
- colonne droite : propositions IA ;
- badges de confiance ;
- boutons `Accepter`, `Modifier`, `Relancer`.

Règles :

- titre obligatoire ;
- résumé obligatoire ;
- au moins trois mots-clés recommandés ;
- domaine scientifique obligatoire ;
- les métadonnées confirmées deviennent les métadonnées soumises.

### Étape 6 — Soumission officielle

Récapitulatif :

- type ;
- titre ;
- auteur ;
- institution ;
- département ;
- année ;
- PDF ;
- hash ;
- mots-clés ;
- visibilité demandée.

Cases à cocher :

- confirmation des informations ;
- confirmation du fichier ;
- accord de transmission au circuit de validation.

Après soumission :

- statut = `SOUMIS` ;
- dossier en lecture seule ;
- notification envoyée au portail validation ;
- événement historisé.

---

## 4.5 Page : Détail d’un dossier

### Objectif

Afficher le cycle de vie complet d’un dossier scientifique.

### Layout

- header dossier ;
- timeline ;
- onglets ;
- actions contextuelles.

### Onglets

- vue d’ensemble ;
- métadonnées ;
- document ;
- versions ;
- avis & décisions ;
- corrections ;
- preuve ;
- historique.

### Timeline

Étapes génériques :

```text
Brouillon → Soumis → En instruction → Correction demandée → Re-soumis → Validé → Archivé
```

États d’étape :

```text
DONE | CURRENT | BLOCKED | PENDING
```

### Onglet preuve

Disponible uniquement si :

```text
dossier.status = ARCHIVE
verificationProof.exists = true
```

Données :

- identifiant preuve ;
- hash final ;
- date émission ;
- institution ;
- statut preuve ;
- QR code ;
- lien vérification ;
- référence e-IDStack de IDS.

---

## 4.6 Page : Corrections demandées

### Objectif

Permettre au déposant de répondre aux corrections.

### Carte correction

Champs :

```text
title
type
description
priority
requestedBy
requestedAt
dueDate
status
relatedPage
relatedSection
```

Types :

```text
ADMINISTRATIVE | SCIENTIFIC | METADATA | PDF_FILE | ABSTRACT | KEYWORDS | BIBLIOGRAPHY | VISIBILITY | FINAL_VERSION
```

Priorités :

```text
LOW | NORMAL | HIGH | BLOCKING
```

Statuts :

```text
OPEN | IN_PROGRESS | ANSWERED | VALIDATED | REJECTED | CANCELLED
```

Règles :

- une correction bloquante empêche la re-soumission ;
- une correction fichier exige souvent une nouvelle version ;
- chaque réponse est historisée.

---

# 5. Portail Validation académique — Spécification UI/UX détaillée

## 5.1 Description générale

Le Portail Validation académique est le cœur institutionnel du système. Il outille les processus académiques existants sans les remplacer.

Flux principal :

```text
Recevoir → Examiner → Corriger → Aviser → Décider → Archiver → Générer preuve
```

## 5.2 Page : Tableau de bord validation

### Objectif

Afficher les dossiers à traiter et les actions prioritaires.

### Utilisateurs

- encadreur ;
- directeur de thèse ;
- rapporteur ;
- reviewer ;
- chef de département ;
- comité scientifique ;
- archiviste ;
- administrateur académique.

### Cartes statistiques

- dossiers assignés ;
- dossiers soumis ;
- en instruction ;
- corrections demandées ;
- corrections traitées ;
- avis en attente ;
- décisions requises ;
- archivable ;
- archivé ;
- rejeté.

### File prioritaire

Critères :

- dossier soumis depuis longtemps ;
- correction traitée ;
- décision attendue ;
- dossier validé non archivé ;
- erreur preuve ;
- article bloqué en review.

### Permissions

- encadreur : dossiers encadrés ;
- reviewer : articles assignés ;
- rapporteur : thèses/mémoires assignés ;
- chef de département : département ;
- archiviste : dossiers archivables ;
- admin académique : périmètre institutionnel.

---

## 5.3 Page : Dossiers à traiter

### Objectif

Lister les dossiers soumis au périmètre de validation.

### Filtres

- type document ;
- statut ;
- institution ;
- faculté ;
- département ;
- filière ;
- année académique ;
- assignation ;
- priorité ;
- date soumission.

### Tableau

Colonnes :

- titre ;
- auteur ;
- type ;
- département ;
- statut ;
- assigné à ;
- date de soumission ;
- dernière activité ;
- action attendue ;
- actions.

### Actions

- ouvrir ;
- assigner ;
- valider métadonnées ;
- donner avis ;
- demander correction ;
- enregistrer décision ;
- envoyer archivage.

---

## 5.4 Page : Détail du dossier à valider

### Objectif

Permettre l’examen complet du dossier.

### Onglets

- vue d’ensemble ;
- document ;
- métadonnées ;
- analyse IA ;
- avis ;
- corrections ;
- décision ;
- archivage ;
- historique.

### Onglet document

Composants :

- visualiseur PDF ;
- navigation pages ;
- zoom ;
- téléchargement si autorisé ;
- sélecteur de version.

Règle :

> Toute décision ou avis doit être lié à une version précise.

### Onglet métadonnées

États d’un champ :

```text
Non vérifié
Proposé par IA
Confirmé par déposant
Corrigé par institution
Validé
Incohérent
```

Actions :

- accepter valeur déposant ;
- accepter valeur IA ;
- saisir valeur institutionnelle ;
- marquer validé ;
- demander correction ;
- verrouiller.

### Onglet analyse IA

Données :

- résumé court ;
- résumé détaillé ;
- problématique ;
- méthodologie ;
- résultats ;
- limites ;
- mots-clés ;
- travaux similaires ;
- points à vérifier.

Message obligatoire :

> L’analyse IA est une aide à la lecture. La décision académique reste humaine.

### Onglet avis

Recommandations :

```text
FAVORABLE
FAVORABLE_MINOR_CORRECTIONS
FAVORABLE_MAJOR_CORRECTIONS
UNFAVORABLE
REVISION_REQUIRED
TRANSFER_REQUIRED
```

Règles :

- un avis est lié à une version ;
- un utilisateur modifie uniquement son propre avis sauf permission admin ;
- un avis finalisé est historisé.

### Onglet corrections

Types :

```text
ADMINISTRATIVE | SCIENTIFIC | METADATA | PDF_FILE | ABSTRACT | KEYWORDS | BIBLIOGRAPHY | VISIBILITY | FINAL_VERSION | INSTITUTIONAL_COMPLIANCE
```

Règles :

- une correction bloquante empêche décision finale ;
- une correction PDF exige une nouvelle version ;
- une correction validée est historisée.

### Onglet décision finale

Checklist :

- métadonnées obligatoires validées ;
- version active définie ;
- PDF accessible ;
- hash calculé ;
- corrections bloquantes traitées ;
- avis requis disponibles ;
- utilisateur autorisé.

Décisions mémoire :

```text
VALIDATED_AFTER_DEFENSE | CORRECTION_REQUESTED | REJECTED | ARCHIVABLE
```

Décisions thèse :

```text
EXPERTISE_FAVORABLE | EXPERTISE_UNFAVORABLE | DEFENSE_AUTHORIZED | POST_DEFENSE_CORRECTION_REQUIRED | FINAL_DEPOSIT_ACCEPTED | REJECTED | ARCHIVABLE
```

Décisions article :

```text
ACCEPTED | MINOR_REVISION | MAJOR_REVISION | REJECTED | PUBLISHED | ARCHIVABLE
```

### Onglet archivage

Conditions :

- dossier `ARCHIVABLE` ;
- version finale sélectionnée ;
- métadonnées verrouillées ;
- hash final calculé ;
- aucune correction bloquante.

Actions :

- verrouiller version finale ;
- créer entrée d’archive ;
- générer QR code ;
- déclencher preuve via e-IDStack de IDS ;
- publier fiche publique.

---

# 6. Portail Archive publique — Spécification UI/UX détaillée

## 6.1 Description générale

Le Portail Archive publique est la vitrine de la plateforme. Il doit être plus simple que les portails internes, très lisible, premium et immédiatement compréhensible.

Flux principal :

```text
Rechercher → Filtrer → Consulter → Explorer avec IA → Vérifier
```

## 6.2 Page : Accueil public

### Hero

Texte :

> OpenScience Hub  
> Le hub intelligent des travaux scientifiques universitaires.  
> Archivez, explorez et vérifiez les mémoires, thèses et articles grâce à l’IA, la recherche avancée et une couche SSI basée sur e-IDStack de IDS.

CTA :

- Explorer l’archive ;
- Vérifier un document ;
- Utiliser l’Assistant IA.

### Recherche principale

Placeholder :

> Rechercher un mémoire, une thèse, un article, un auteur ou un mot-clé...

Si la requête est une question, proposer l’Assistant IA.

### Statistiques

- travaux archivés ;
- mémoires ;
- thèses ;
- articles ;
- institutions ;
- documents vérifiables ;
- vérifications effectuées.

---

## 6.3 Page : Catalogue

### Objectif

Afficher les travaux accessibles.

### Carte document

Données :

- titre ;
- type ;
- auteur ;
- institution ;
- faculté ;
- département ;
- année ;
- résumé court ;
- mots-clés ;
- statut ;
- badge vérifiable ;
- niveau d’accès.

Actions :

- consulter ;
- télécharger si autorisé ;
- vérifier ;
- travaux similaires ;
- synthèse IA ;
- copier référence.

Règles :

- documents privés non visibles ;
- documents restreints visibles avec notice limitée ;
- badge vérifiable seulement si preuve active ;
- PDF non public sans bouton téléchargement.

---

## 6.4 Page : Recherche avancée à facettes

### Facettes

- type document ;
- institution ;
- faculté ;
- département ;
- filière ;
- domaine ;
- année ;
- auteur ;
- encadreur ;
- mots-clés ;
- langue ;
- statut ;
- visibilité ;
- vérifiable ;
- PDF disponible.

### Composants

- colonne facettes ;
- chips filtres actifs ;
- tri ;
- compteur résultats ;
- résultats expliqués.

Règle :

> Les facettes publiques ne doivent jamais révéler l’existence de documents privés.

---

## 6.5 Page : Fiche publique document

### Sections

- header document ;
- résumé scientifique ;
- métadonnées académiques ;
- accès PDF ;
- preuve de vérification ;
- Assistant IA contextuel ;
- travaux similaires ;
- citation/export.

### Bloc preuve

Données :

- identifiant preuve ;
- statut ;
- hash ;
- date émission ;
- institution ;
- QR code ;
- référence e-IDStack de IDS.

États :

- preuve active ;
- preuve non disponible ;
- preuve révoquée ;
- preuve expirée ;
- erreur de preuve.

---

## 6.6 Page : Assistant IA

### Objectif

Interroger l’archive en langage naturel.

### Structure réponse

- réponse synthétique ;
- points clés ;
- sources utilisées ;
- limites de la réponse.

Règles :

- utiliser uniquement les documents accessibles ;
- afficher les sources ;
- signaler quand aucun document pertinent n’est trouvé ;
- ne pas inventer de réponse sans source.

---

## 6.7 Page : Vérification QR code

### Modes d’entrée

- scan QR code ;
- lien direct ;
- identifiant de preuve.

### Résultats

- authentique ;
- introuvable ;
- invalide ;
- preuve révoquée ;
- erreur technique.

### Données affichées

- identifiant preuve ;
- titre ;
- type ;
- auteur ;
- institution ;
- département ;
- année ;
- date archivage ;
- hash ;
- référence e-IDStack de IDS.

Règle sécurité :

> La page de vérification n’affiche que les métadonnées publiques ou nécessaires à la vérification.

---

# 7. Portail Administration — Spécification UI/UX détaillée

## 7.1 Description générale

Le Portail Administration sert à configurer, superviser, sécuriser, auditer et piloter la plateforme.

Flux principal :

```text
Configurer → Superviser → Sécuriser → Auditer → Piloter
```

## 7.2 Page : Tableau de bord administration

### Cartes statistiques

- total dossiers ;
- documents archivés ;
- documents vérifiables ;
- utilisateurs actifs ;
- dossiers en attente ;
- corrections ouvertes ;
- vérifications QR ;
- requêtes Assistant IA.

### État des services

Services :

- API ;
- base de données ;
- stockage PDF ;
- extraction PDF ;
- IA ;
- Assistant IA ;
- moteur recherche ;
- QR code ;
- e-IDStack ;
- vérification ;
- email.

Statuts :

```text
OPERATIONAL | DEGRADED | DOWN | MAINTENANCE | MISCONFIGURED
```

---

## 7.3 Page : Utilisateurs

### Fonctions

- créer utilisateur ;
- modifier ;
- suspendre ;
- désactiver ;
- réactiver ;
- attribuer rôle ;
- réinitialiser mot de passe ;
- voir activité.

### Champs

```text
fullName
email
phone
institutionId
facultyId
departmentId
programId
primaryRoleId
academicIdentifier
sendInvitationEmail
```

Règles :

- email unique ;
- admin ne peut pas retirer son propre dernier rôle admin ;
- admin institutionnel limité à son institution.

---

## 7.4 Page : Rôles & permissions

### Rôles

- Déposant ;
- Encadreur ;
- Directeur de thèse ;
- Rapporteur ;
- Reviewer ;
- Chef de département ;
- Comité scientifique ;
- Archiviste ;
- Administrateur institutionnel ;
- Super administrateur ;
- Public.

### Permissions

Actions :

```text
VIEW | CREATE | UPDATE | DELETE | VALIDATE | DECIDE | ARCHIVE | EXPORT | CONFIGURE | AUDIT
```

Règles :

- rôles système non supprimables ;
- permissions critiques confirmées ;
- changements audités.

---

## 7.5 Page : Institutions et structures académiques

### Institution

Champs :

```text
officialName
shortName
country
city
address
officialEmail
phone
website
logoUrl
institutionType
status
```

Types :

```text
UNIVERSITY | SCHOOL | INSTITUTE | RESEARCH_CENTER | OTHER
```

### Structure

```text
Institution
└── Faculté / École
    └── Département
        └── Filière / Programme
```

Règles :

- une structure désactivée ne reçoit plus de nouveaux dossiers ;
- les anciens dossiers conservent leurs métadonnées historiques.

---

## 7.6 Page : Workflows

### Objectif

Configurer les circuits mémoire, thèse, article.

### Workflow

```text
workflowId
name
documentType
institutionId
description
isActive
version
```

### Étape

```text
stepId
workflowId
name
description
responsibleRoleId
order
isRequired
allowsCorrection
allowsDecision
triggersNotification
recommendedDelayDays
```

### Transition

```text
transitionId
workflowId
sourceStepId
targetStepId
actionLabel
authorizedRoleIds
conditionExpression
notificationTemplateId
```

Règles :

- workflow actif versionné ;
- dossier soumis conserve sa version de workflow ;
- étape initiale et finale obligatoires ;
- transitions critiques auditées.

---

## 7.7 Page : Paramètres IA

### Extraction IA

```text
aiExtractionEnabled
modelProvider
modelName
supportedLanguages
maxDocumentPages
confidenceThreshold
autoRetryOnFailure
fieldsToExtract
```

### Assistant IA

```text
aiAssistantEnabled
allowedSourceVisibility
maxSourcesPerAnswer
requireSources
answerOnlyFromSources
storeConversationHistory
```

Règle recommandée :

```text
requireSources = true
answerOnlyFromSources = true
```

### Sécurité IA

- exclure documents privés ;
- masquer données sensibles ;
- journaliser requêtes ;
- permettre feedback ;
- modérer prompts.

---

## 7.8 Page : Recherche & facettes

### Champs indexés

- title ;
- abstract ;
- keywords ;
- authors ;
- institution ;
- faculty ;
- department ;
- program ;
- supervisor ;
- scientificDomain ;
- extractedPdfText.

### Facettes activables

- documentType ;
- institution ;
- faculty ;
- department ;
- program ;
- academicYear ;
- author ;
- supervisor ;
- scientificDomain ;
- keywords ;
- language ;
- status ;
- visibility ;
- isVerifiable ;
- hasPdf.

Règle :

> Les facettes publiques ne révèlent jamais les documents privés.

---

## 7.9 Page : SSI / e-IDStack

### Objectif

Configurer la couche SSI basée sur e-IDStack de IDS.

### Champs

```text
ssiEnabled
providerName = "e-IDStack de IDS"
environment
serviceUrl
institutionIdentifier
apiCredentialReference
connectionStatus
lastSyncAt
```

Enums :

```text
environment = TEST | STAGING | PRODUCTION
connectionStatus = CONNECTED | NOT_CONFIGURED | AUTH_ERROR | SERVICE_UNAVAILABLE | MISCONFIGURED
```

### Émission de preuve

```text
generateProofAfterArchiving
credentialSchemaId
issuerDid
enableRevocation
defaultCredentialStatus
```

Règles :

- preuve générée seulement pour version finale archivée ;
- hash PDF final obligatoire ;
- clés/API tokens jamais affichés en clair ;
- modifications SSI auditées.

---

## 7.10 Page : Preuves & vérifications

### Statuts preuve

```text
ACTIVE | REVOKED | EXPIRED | PENDING | ERROR
```

### Résultats vérification

```text
AUTHENTIC | NOT_FOUND | INVALID | REVOKED | TECHNICAL_ERROR
```

### Sources

```text
QR_CODE | DIRECT_LINK | MANUAL_INPUT | API
```

Règles :

- révocation justifiée ;
- réémission crée une nouvelle preuve ;
- logs conservés ;
- données privées non exposées.

---

## 7.11 Page : Audit système

### Actions auditées

```text
LOGIN
USER_CREATED
ROLE_CHANGED
WORKFLOW_CHANGED
PDF_UPLOADED
METADATA_UPDATED
REVIEW_ADDED
CORRECTION_CREATED
DECISION_RECORDED
DOCUMENT_ARCHIVED
PROOF_ISSUED
PROOF_REVOKED
QR_VERIFIED
AI_SETTINGS_CHANGED
SSI_SETTINGS_CHANGED
```

### Criticité

```text
INFO | IMPORTANT | SENSITIVE | CRITICAL
```

Règles :

- audit lecture seule ;
- événements critiques non supprimables ;
- export réservé aux admins autorisés.

---

# 8. Règles UX transverses

## 8.1 États vides

Chaque page doit proposer un message utile et une action claire.

Exemple :

> Aucun dossier trouvé. Créez votre premier dépôt scientifique.

Mauvais exemple :

> Aucun résultat.

## 8.2 États de chargement

Utiliser :

- skeleton cards ;
- skeleton tables ;
- progress bar pour upload et IA ;
- spinner uniquement pour petites actions.

## 8.3 États d’erreur

Un message d’erreur doit indiquer :

- ce qui s’est passé ;
- si l’utilisateur peut agir ;
- quelle action il peut faire.

Exemple :

> Impossible de générer la preuve. La connexion e-IDStack est indisponible. Réessayez ou contactez l’administrateur.

## 8.4 Confirmations critiques

Actions nécessitant confirmation :

- soumission officielle ;
- décision finale ;
- archivage ;
- révocation preuve ;
- modification workflow actif ;
- désactivation utilisateur ;
- changement paramètres SSI ;
- changement permissions critiques.

## 8.5 Accessibilité

Exigences :

- contraste suffisant ;
- labels visibles ;
- navigation clavier ;
- badges non dépendants uniquement de la couleur ;
- messages d’erreur textuels ;
- boutons suffisamment grands ;
- hiérarchie claire.

---

# 9. Priorités UI pour hackathon

## Pages à maquetter en priorité

1. Accueil public ;
2. Recherche à facettes ;
3. Fiche publique document ;
4. Nouveau dépôt ;
5. Analyse IA / Métadonnées IA ;
6. Détail dossier validation ;
7. Décision finale ;
8. Archivage + preuve ;
9. Vérification QR code ;
10. Dashboard administration.

## Effet démo recherché

La démo doit montrer :

```text
Un document est déposé → l’IA extrait les métadonnées → un validateur décide → le document est archivé → il devient recherchable → l’Assistant IA peut l’explorer → le QR code vérifie son authenticité.
```

---

# 10. Conclusion

OpenScience Hub doit être conçu comme une plateforme académique complète, mais l’interface doit rester claire. Les utilisateurs ne doivent pas voir la complexité interne du système. Ils doivent voir des parcours simples :

- déposer ;
- valider ;
- rechercher ;
- explorer ;
- vérifier ;
- administrer.

La cohérence visuelle repose sur la palette **noir / rouge / gris / blanc**, avec des statuts fonctionnels en vert, orange et rouge erreur. Le style doit rester premium, institutionnel et technologique.
