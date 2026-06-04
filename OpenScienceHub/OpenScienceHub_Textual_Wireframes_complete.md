# OpenScience Hub — Wireframes textuels écran par écran

**Produit :** OpenScience Hub  
**Slogan :** *Le hub intelligent des travaux scientifiques universitaires*  
**Palette :** noir `#050505`, rouge `#C40012`, rouge profond `#8B000B`, gris `#9CA3AF`, argent `#E5E7EB`, blanc `#FFFFFF`.  
**Style :** institutionnel, premium, académique, technologique, sobre.  
**SSI :** couche SSI basée sur **e-IDStack de IDS**.  
**IA :** Assistant IA, extraction de métadonnées, synthèse, classification, travaux similaires.

---

## 0. Règles générales de wireframe

Les wireframes ci-dessous sont textuels. Ils indiquent la structure attendue de chaque écran, les zones, les composants, les données, les boutons, les états et le style.

### Convention visuelle

```text
[HEADER]       = barre supérieure
[SIDEBAR]      = navigation latérale interne
[HERO]         = zone de présentation publique
[CARD]         = carte blanche premium
[TABLE]        = tableau de données
[FORM]         = formulaire
[CTA]          = bouton principal rouge
[SECONDARY]    = bouton secondaire
[BADGE]        = statut ou indicateur
[ALERT]        = message d’alerte
[MODAL]        = fenêtre de confirmation
```

### Règles de style global

- fond principal dashboard : `#F8F9FA` ;
- cartes : blanc `#FFFFFF` ;
- bordures : `#E5E7EB` ;
- titres : `#050505` ou `#111827` ;
- texte secondaire : `#4B5563` ;
- action principale : rouge `#C40012` ;
- hover rouge : `#8B000B` ;
- succès : `#10B981` ;
- correction / attente : `#F59E0B` ;
- erreur : `#EF4444`.

---

# 1. Portail Déposant — Wireframes textuels

## 1.1 Tableau de bord déposant

### Objectif

Donner au déposant une vue immédiate sur ses dossiers et les actions à effectuer.

### Wireframe

```text
┌─────────────────────────────────────────────────────────────────────┐
│ [HEADER] OpenScience Hub | Espace déposant | Recherche | 🔔 | Profil │
└─────────────────────────────────────────────────────────────────────┘
┌───────────────┬─────────────────────────────────────────────────────┐
│ [SIDEBAR]     │ [WELCOME CARD]                                      │
│ Dashboard     │ Bonjour, Bell Aqil                                  │
│ Mes dossiers  │ Bienvenue dans votre espace de dépôt scientifique.   │
│ Nouveau dépôt │ [CTA Nouveau dépôt] [SECONDARY Mes dossiers]         │
│ Corrections   │                                                     │
│ Notifications │ [STATS GRID]                                        │
│ Profil        │ Total | Brouillons | Soumis | En instruction         │
│               │ Corrections | Validés | Archivés | Rejetés          │
│               │                                                     │
│               │ [TABLE Dossiers récents]                            │
│               │ Titre | Type | Statut | Dernière activité | Action   │
│               │                                                     │
│               │ [CARD Notifications urgentes]                       │
│               │ - Correction demandée sur... [Répondre]             │
└───────────────┴─────────────────────────────────────────────────────┘
```

### Style

- header blanc, bordure basse gris clair ;
- sidebar noire `#050505`, élément actif rouge `#C40012` ;
- carte bienvenue blanche avec filet rouge discret en haut ;
- statistiques en cartes blanches avec icône fine ;
- carte correction demandée avec accent orange.

### Composants

- `StatCard` ;
- `RecentWorksTable` ;
- `UrgentNotificationsCard` ;
- `PrimaryButton` ;
- `SecondaryButton` ;
- `StatusBadge`.

### Données

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
notifications[]
```

### Actions

- `Nouveau dépôt` ;
- ouvrir dossier ;
- continuer brouillon ;
- répondre correction ;
- voir preuve ;
- marquer notification lue.

### États vides

```text
[CARD]
Aucun dossier scientifique pour le moment.
Commencez par créer votre premier dépôt.
[CTA Nouveau dépôt]
```

### Erreurs

```text
[ALERT ERROR]
Impossible de charger vos statistiques.
[Réessayer]
```

---

## 1.2 Mes dossiers scientifiques

### Wireframe

```text
[HEADER]
[SIDEBAR]

[PAGE HEADER]
Mes dossiers scientifiques
Consultez, modifiez et suivez l’évolution de vos travaux déposés.
[CTA Nouveau dépôt]

[SEARCH BAR]
Rechercher par titre, mot-clé, département ou année...

[FILTER BAR]
Type: Tous ▼ | Statut: Tous ▼ | Année ▼ | Institution ▼ | Département ▼

[TABLE]
┌──────────────────────┬─────────┬─────────────┬────────────┬─────────┬──────────┬─────────┐
│ Titre                │ Type    │ Institution │ Département│ Année   │ Statut   │ Actions │
├──────────────────────┼─────────┼─────────────┼────────────┼─────────┼──────────┼─────────┤
│ Système de vérif...  │ Mémoire │ UY1         │ Info       │ 2026    │ Archivé  │ Voir ⋯  │
│ Identité numérique   │ Article │ ...         │ ...        │ 2025    │ Soumis   │ Voir ⋯  │
└──────────────────────┴─────────┴─────────────┴────────────┴─────────┴──────────┴─────────┘

[PAGINATION]
```

### Style

- fond `#F8F9FA` ;
- table en carte blanche ;
- badges de statut colorés ;
- menu actions en trois points ;
- boutons principaux rouges uniquement pour création ou soumission.

### Actions par statut

| Statut | Action principale |
|---|---|
| Brouillon | Continuer |
| Soumis | Voir |
| En instruction | Voir |
| Correction demandée | Répondre |
| Validé | Voir détail |
| Archivé | Voir preuve |
| Rejeté | Voir décision |

---

## 1.3 Nouveau dépôt — Wizard global

### Wireframe global

```text
[HEADER]
[SIDEBAR]

[PAGE HEADER]
Nouveau dépôt scientifique
Créez un dossier structuré pour votre mémoire, thèse ou article.

[STEPPER]
1 Type de travail → 2 Infos académiques → 3 PDF → 4 Analyse IA → 5 Métadonnées → 6 Soumission

┌───────────────────────────────────────────────┬─────────────────────┐
│ [MAIN FORM AREA]                              │ [HELP PANEL]        │
│ Contenu de l’étape courante                   │ Conseils            │
│                                               │ Champs requis       │
│                                               │ Progression         │
└───────────────────────────────────────────────┴─────────────────────┘

[FOOTER ACTIONS]
[SECONDARY Enregistrer brouillon] [Précédent] [CTA Suivant]
```

### Style

- stepper horizontal avec étape active en rouge ;
- étape terminée avec check vert ;
- formulaire sur carte blanche ;
- panneau aide avec fond gris très clair ;
- sauvegarde automatique en texte discret.

---

## 1.4 Nouveau dépôt — Étape 1 : Type de travail

```text
[STEPPER]

[TITLE]
Quel type de travail souhaitez-vous déposer ?

[CARD GRID 3 COLS]
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ 📘 Mémoire        │ │ 🎓 Thèse          │ │ 📰 Article        │
│ Travail de fin... │ │ Travail doctoral  │ │ Publication...    │
│ [Sélectionner]    │ │ [Sélectionner]    │ │ [Sélectionner]    │
└───────────────────┘ └───────────────────┘ └───────────────────┘

[HELP]
Le type choisi détermine le workflow de validation.
```

### Style

- cartes blanches ;
- icône noire ;
- sélection : bordure rouge, mini check rouge ;
- texte secondaire gris.

### Erreur

```text
Veuillez sélectionner un type de travail avant de continuer.
```

---

## 1.5 Nouveau dépôt — Étape 2 : Informations académiques

```text
[TITLE]
Informations académiques

[FORM]
Titre provisoire *
Auteur principal *
Co-auteurs
Institution *
Faculté
Département *
Filière
Année académique *
Langue *
Visibilité souhaitée *

[CONDITIONAL BLOCK: Mémoire]
Niveau *
Encadreur *
Spécialité
Date prévue de soutenance

[CONDITIONAL BLOCK: Thèse]
Cycle doctoral *
Directeur de thèse *
Codirecteur
École doctorale
Laboratoire
Domaine doctoral *

[CONDITIONAL BLOCK: Article]
Revue ou conférence
Statut éditorial *
DOI
Auteurs *
Auteur correspondant
```

### Style

- champs en deux colonnes sur desktop ;
- sections conditionnelles avec titre noir et barre verticale rouge ;
- champs requis marqués par astérisque rouge ;
- aide sous champ en gris.

---

## 1.6 Nouveau dépôt — Étape 3 : Upload PDF

```text
[TITLE]
Téléversement du document PDF

[UPLOAD ZONE]
┌───────────────────────────────────────────────┐
│ Glissez votre fichier PDF ici                 │
│ ou                                            │
│ [Choisir un fichier]                          │
│ Format accepté : PDF                          │
└───────────────────────────────────────────────┘

[UPLOAD PROGRESS]
Téléversement... 72%

[FILE CARD]
Nom : memoire_2026.pdf
Taille : 3.8 MB
Pages : 84
Hash SHA-256 : 8fa23d...
Version : V1
[Remplacer fichier]
```

### Style

- zone upload bordure pointillée gris ;
- hover rouge clair ;
- carte fichier blanche avec icône PDF rouge ;
- hash affiché en police monospace.

---

## 1.7 Nouveau dépôt — Étape 4 : Analyse IA

```text
[TITLE]
Analyse IA du document

[INFO CARD]
L’IA extrait les métadonnées principales du PDF. Vous pourrez les vérifier avant soumission.

[CTA Lancer l’analyse IA]

[PROGRESS TASKS]
✓ Extraction du texte
✓ Détection du titre
✓ Détection des auteurs
⏳ Extraction du résumé
○ Suggestion des mots-clés
○ Classification thématique

[RESULT CARD]
Titre détecté : ...
Auteurs détectés : ...
Résumé proposé : ...
Mots-clés : [SSI] [Diplômes] [Vérification]
Domaine : Informatique
Confiance : 86%

[Actions]
[Relancer analyse] [Continuer]
```

### Style

- progression verticale ;
- tâches terminées en vert ;
- tâche active en rouge ;
- résultat dans carte blanche ;
- score confiance sous forme de petit badge.

---

## 1.8 Nouveau dépôt — Étape 5 : Vérification métadonnées

```text
[TITLE]
Vérifiez les métadonnées

┌─────────────────────────────────────┬─────────────────────────────────────┐
│ [CHAMPS FINAUX]                     │ [PROPOSITIONS IA]                   │
│ Titre *                             │ Titre détecté                       │
│ [input]                             │ [Accepter]                          │
│ Résumé *                            │ Résumé IA                           │
│ [textarea]                          │ [Accepter]                          │
│ Mots-clés                           │ [SSI] [Diplômes] [Vérification]     │
│ [tags input]                        │ [Tout accepter]                     │
└─────────────────────────────────────┴─────────────────────────────────────┘

[Actions]
[Accepter toutes les propositions] [Relancer analyse] [CTA Continuer]
```

### Style

- deux colonnes ;
- propositions IA avec fond gris clair ;
- valeurs acceptées en bordure verte ;
- champs manquants en bordure rouge erreur.

---

## 1.9 Nouveau dépôt — Étape 6 : Soumission officielle

```text
[TITLE]
Soumission officielle

[SUMMARY CARD]
Type : Mémoire
Titre : ...
Auteur : ...
Institution : ...
Département : ...
Année : ...
PDF : memoire_2026.pdf
Hash : 8fa23d...
Visibilité demandée : Public

[CONFIRMATION CHECKBOXES]
☐ Je confirme que les informations fournies sont exactes.
☐ Je confirme que le fichier correspond à la version à évaluer.
☐ J’accepte la transmission au circuit de validation académique.

[CTA Soumettre officiellement]
[SECONDARY Enregistrer brouillon]
```

### Modal de confirmation

```text
[MODAL]
Soumettre ce dossier ?
Après soumission, le dossier passera en lecture seule jusqu’à décision ou correction demandée.
[Annuler] [Confirmer la soumission]
```

---

## 1.10 Détail dossier déposant

```text
[HEADER]
[SIDEBAR]

[DOCUMENT HEADER]
Titre du travail
[BADGE Statut]
Type | Institution | Département | Année
[Action principale selon statut]

[TIMELINE]
Brouillon → Soumis → En instruction → Correction demandée → Validé → Archivé

[TABS]
Vue d’ensemble | Métadonnées | Document | Versions | Avis & décisions | Corrections | Preuve | Historique

[TAB CONTENT]
Selon onglet sélectionné
```

### Style

- header dossier en carte blanche ;
- badge statut visible ;
- timeline horizontale avec étape active rouge ;
- onglets sobres avec soulignement rouge actif.

---

## 1.11 Corrections demandées

```text
[PAGE HEADER]
Corrections demandées
Répondez aux demandes de correction de l’institution.

[CORRECTION CARD]
Titre : Résumé incomplet
Type : Résumé
Priorité : Bloquante
Demandée par : Dr ...
Date : ...
Page concernée : 3
Description : ...
Statut : Ouverte

[RESPONSE AREA]
Votre réponse
[textarea]
[Upload nouvelle version si nécessaire]
[CTA Soumettre la correction]
```

### Style

- correction bloquante : accent orange fort ;
- statut ouvert : badge orange ;
- correction validée : badge vert ;
- réponse déposant dans bloc gris clair.

---

## 1.12 Preuve et vérification déposant

```text
[PAGE HEADER]
Preuve et vérification

[STATUS CARD]
[BADGE AUTHENTIQUE]
Ce document dispose d’une preuve de vérification active.

[QR CARD]
[QR CODE]
Lien de vérification : https://...
[Copier lien] [Télécharger QR]

[PROOF DETAILS]
Identifiant preuve
Hash SHA-256
Date émission
Institution
Référence e-IDStack de IDS
Statut preuve

[ACTIONS]
[Ouvrir page de vérification]
[Télécharger PDF final]
```

### Style

- statut authentique en vert ;
- QR code centré dans carte blanche ;
- détails preuve en tableau clé/valeur ;
- hash monospace.

---

# 2. Portail Validation académique — Wireframes textuels

## 2.1 Tableau de bord validation

```text
[HEADER] OpenScience Hub | Validation académique | Institution active | 🔔 | Profil
[SIDEBAR]
Dashboard
Dossiers à traiter
Métadonnées
Avis
Corrections
Décisions
Archivage
Articles / Peer Review
Historique

[CONTEXT CARD]
Université de Yaoundé I > Faculté des Sciences > Département Informatique
Rôle : Chef de département

[STATS GRID]
Assignés | Soumis | En instruction | Corrections | Avis en attente | Décisions | Archivable | Archivé

[PRIORITY QUEUE]
Titre | Auteur | Type | Statut | Dernière activité | Action attendue | Priorité | Action

[ACTIVITY RECENT]
- Nouvelle version reçue
- Avis ajouté
- Dossier archivé
```

### Style

- sidebar noire ;
- contexte institutionnel en carte blanche avec accent rouge ;
- priorité haute avec badge rouge/orange ;
- action principale rouge seulement si action décisive.

---

## 2.2 Dossiers à traiter

```text
[PAGE HEADER]
Dossiers à traiter
Consultez les dossiers scientifiques soumis à votre périmètre.

[SEARCH]
Rechercher par titre, auteur, mot-clé, identifiant...

[FILTERS]
Type | Statut | Institution | Département | Année | Assignation | Priorité

[TABLE]
Titre | Auteur | Type | Département | Statut | Assigné à | Dernière activité | Action attendue | Actions
```

### Actions par ligne

- ouvrir ;
- assigner ;
- valider métadonnées ;
- donner avis ;
- demander correction ;
- décider ;
- archiver.

---

## 2.3 Détail dossier à valider

```text
[DOCUMENT HEADER]
Titre du dossier
ID dossier | Type | Auteur | Institution | Département | Année
[BADGE Statut]
[Actions: Valider métadonnées | Donner avis | Demander correction | Décider | Archiver]

[TIMELINE WORKFLOW]
Soumis → En instruction → Correction demandée → Re-soumis → Validé → Archivable → Archivé

[TABS]
Vue d’ensemble | Document | Métadonnées | Analyse IA | Avis | Corrections | Décision | Archivage | Historique

[MAIN]
Contenu de l’onglet actif
```

### Style

- header dossier très lisible ;
- actions critiques groupées à droite ;
- timeline avec blocages visibles ;
- onglet actif souligné rouge.

---

## 2.4 Onglet Document

```text
┌───────────────────────────────────────┬───────────────────────────────┐
│ [PDF VIEWER]                          │ [FILE INFO CARD]              │
│ Page controls                         │ Version active : V2           │
│ Zoom                                  │ Hash : 8fa23d...              │
│ PDF page                              │ Pages : 84                    │
│                                       │ Déposé le : ...               │
│                                       │ [Sélecteur version]           │
└───────────────────────────────────────┴───────────────────────────────┘
```

### Règle

L’avis ou la décision doit mentionner la version examinée.

---

## 2.5 Onglet Métadonnées

```text
[METADATA COMPARISON]
Champ | Valeur déposant | Valeur IA | Valeur institutionnelle | Statut | Action

Titre | ... | ... | [input] | Non vérifié | [Valider]
Résumé | ... | ... | [textarea] | Corrigé | [Verrouiller]
Mots-clés | ... | ... | [tags] | À vérifier | [Demander correction]
```

### Style

- table de comparaison ;
- statut par badge ;
- valeur institutionnelle en champ éditable ;
- ligne incohérente en fond rouge très pâle.

---

## 2.6 Onglet Analyse IA

```text
[INFO]
L’analyse IA est une aide à la lecture. La décision académique reste humaine.

[AI SUMMARY CARD]
Résumé court
Problématique
Méthodologie
Résultats
Limites

[KEYWORDS]
[IA] [SSI] [Diplômes numériques]

[SIMILAR WORKS]
Titre | Année | Similarité | Motifs

[ACTIONS]
[Relancer analyse] [Générer fiche de lecture] [Signaler analyse incorrecte]
```

---

## 2.7 Onglet Avis

```text
[REVIEWS SUMMARY]
3 avis reçus | 2 favorables | 1 corrections mineures

[REVIEW LIST]
Reviewer | Rôle | Version | Recommandation | Date | Action

[NEW REVIEW FORM]
Version examinée
Recommandation
Commentaire général
Points forts
Points faibles
Corrections recommandées
Pièce jointe
[Enregistrer brouillon] [Soumettre avis]
```

---

## 2.8 Onglet Corrections

```text
[CORRECTIONS LIST]
Titre | Type | Priorité | Statut | Demandée par | Date | Action

[CREATE CORRECTION]
Type
Titre
Description
Page concernée
Priorité
Date limite
[Envoyer au déposant]

[RESPONSE REVIEW]
Réponse du déposant
Nouvelle version
[Valider correction] [Rejeter réponse] [Redemander correction]
```

---

## 2.9 Onglet Décision finale

```text
[CHECKLIST]
✓ Métadonnées validées
✓ Version active définie
✓ Hash calculé
✓ Avis requis disponibles
✕ Correction bloquante non traitée

[DECISION FORM]
Décision
Commentaire officiel
Date
Référence PV
Pièce justificative
Visibilité finale

[CTA Confirmer décision] disabled if checklist incomplete
```

### Modal

```text
[MODAL CRITICAL]
Confirmer cette décision ?
Cette action sera historisée et peut modifier le statut du dossier.
[Annuler] [Confirmer]
```

---

## 2.10 Onglet Archivage institutionnel

```text
[ARCHIVE READINESS]
✓ Dossier archivable
✓ Métadonnées verrouillées
✓ Version finale sélectionnée
✓ Hash final calculé
✓ Aucune correction bloquante

[FINAL VERSION CARD]
Version : V3
Hash : 8fa23d...
Visibilité : Public

[PROOF OPTIONS]
☑ Générer preuve via e-IDStack de IDS
☑ Générer QR code
☑ Publier fiche publique

[CTA Archiver officiellement]
```

### Succès

```text
Document archivé avec succès.
Fiche publique disponible.
Preuve générée.
[Voir fiche publique] [Voir preuve]
```

---

# 3. Portail Archive publique — Wireframes textuels

## 3.1 Accueil public

```text
[PUBLIC HEADER]
Logo | Explorer | Assistant IA | Vérifier | Institutions | Aide | Connexion | Déposer

[HERO]
OpenScience Hub
Le hub intelligent des travaux scientifiques universitaires.
Archivez, explorez et vérifiez les mémoires, thèses et articles grâce à l’IA, la recherche avancée et une couche SSI basée sur e-IDStack de IDS.
[CTA Explorer l’archive] [Vérifier un document] [Assistant IA]

[SEARCH LARGE]
Rechercher un mémoire, une thèse, un article, un auteur ou un mot-clé...

[QUICK ACTION CARDS]
Mémoires | Thèses | Articles | Vérifier | Assistant IA | Institutions

[STATS]
Travaux archivés | Mémoires | Thèses | Articles | Institutions | Vérifiables

[RECENT WORKS]
Cards documents récents

[VERIFICATION BLOCK]
Entrer un identifiant de preuve [Vérifier]
```

### Style

- fond blanc ;
- hero très aéré ;
- titre noir ;
- accent rouge ;
- motifs gris/rouge très subtils ;
- recherche centrale grande et premium.

---

## 3.2 Catalogue

```text
[PAGE HEADER]
Catalogue scientifique
Explorez les mémoires, thèses et articles archivés.

[SEARCH + QUICK FILTERS]
Recherche | Type | Institution | Domaine | Année | Vérifiable | PDF disponible

[RESULTS]
┌─────────────────────────────────────────────────────────────┐
│ Titre du document                                           │
│ Mémoire | UY1 | Informatique | 2026                         │
│ Auteur : ...                                                │
│ Résumé court...                                             │
│ [SSI] [Diplômes] [Identité numérique]                       │
│ [ARCHIVÉ] [VÉRIFIABLE] [PDF DISPONIBLE]                     │
│ [Consulter] [Vérifier] [Travaux similaires] [Synthèse IA]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3.3 Recherche avancée à facettes

```text
[HEADER]
Recherche avancée

┌───────────────────────┬───────────────────────────────────────────────┐
│ [FACETS PANEL]        │ [RESULTS AREA]                                │
│ Type                  │ Recherche : identité numérique                 │
│ □ Mémoire             │ Filtres actifs : Mémoire, Informatique, 2026   │
│ □ Thèse               │ Tri : Pertinence ▼ | 24 résultats             │
│ □ Article             │                                               │
│ Institution           │ [RESULT CARD]                                  │
│ Département           │ Pourquoi ce résultat ?                         │
│ Année                 │ - mot-clé trouvé                               │
│ Auteur                │ - domaine informatique                          │
│ Encadreur             │                                               │
│ Vérifiable            │                                               │
└───────────────────────┴───────────────────────────────────────────────┘
```

### Style

- facettes dans panneau gauche blanc ;
- résultats en cartes ;
- filtres actifs en chips rouges/gris ;
- compteur résultats clair.

---

## 3.4 Fiche publique document

```text
[PUBLIC HEADER]

[DOCUMENT HERO]
Titre complet du travail
[BADGE ARCHIVÉ] [BADGE VÉRIFIABLE]
Auteur | Institution | Département | Année
[Lire PDF] [Vérifier] [Citer]

[CONTENT GRID]
┌─────────────────────────────────────┬───────────────────────────────┐
│ [Résumé scientifique]               │ [Preuve de vérification]      │
│ Résumé officiel                     │ QR code                       │
│ Mots-clés                           │ Identifiant preuve            │
│ Domaine                             │ Hash                          │
│ Thématiques                         │ e-IDStack de IDS              │
└─────────────────────────────────────┴───────────────────────────────┘

[METADATA]
Auteur | Encadreur | Faculté | Filière | Langue | Pages | Version

[ASSISTANT IA CONTEXTUEL]
[Résumer ce document] [Méthodologie] [Résultats] [Travaux similaires]

[SIMILAR WORKS]
Cards

[CITATION]
APA | MLA | BibTeX | Copier lien
```

---

## 3.5 Assistant IA public

```text
[PAGE HEADER]
Assistant IA
Interrogez les travaux scientifiques archivés avec des réponses sourcées.

[FILTERS]
Institution | Département | Type | Période | Domaine | Vérifiables seulement

[QUESTION BOX]
Posez une question sur les travaux scientifiques archivés...
[CTA Envoyer]

[SUGGESTIONS]
- Quels travaux parlent de l’identité numérique universitaire ?
- Résume les thèses récentes sur l’IA en santé.

[ANSWER]
Réponse synthétique
Points clés
Limites

[SOURCES]
Titre | Auteur | Institution | Année | Page/section | Ouvrir

[ACTIONS]
Copier | Exporter avec sources | Affiner | Signaler
```

### Style

- zone question centrale ;
- réponse dans carte blanche ;
- sources obligatoirement visibles ;
- avertissement discret : vérifier les sources.

---

## 3.6 Vérification QR code

```text
[PAGE HEADER]
Vérifier un document

[VERIFY BOX]
Entrer un identifiant de preuve ou un lien de vérification...
[CTA Vérifier] [Scanner QR]

[RESULT: AUTHENTIC]
✅ Document authentique
La version vérifiée correspond à une version finale archivée.

[DOCUMENT METADATA]
Titre
Auteur
Institution
Département
Année
Date archivage
Hash SHA-256
Référence e-IDStack de IDS

[ACTIONS]
Ouvrir fiche publique | Copier résultat | Télécharger attestation | Signaler anomalie
```

### États résultat

- authentique : vert ;
- introuvable : gris/rouge ;
- invalide : rouge ;
- révoqué : rouge profond ;
- erreur technique : orange.

---

# 4. Portail Administration — Wireframes textuels

## 4.1 Tableau de bord administration

```text
[HEADER] OpenScience Hub | Administration | Institution active | Recherche | 🔔 | Profil
[SIDEBAR]
Dashboard
Utilisateurs
Rôles & permissions
Institutions
Structures
Workflows
Types documents
Paramètres IA
Recherche & facettes
SSI / e-IDStack
Preuves
Statistiques
Audit
Paramètres

[STATS GRID]
Total dossiers | Archivés | Vérifiables | Utilisateurs | En attente | Corrections | QR checks | IA queries

[SERVICE STATUS]
API | DB | Stockage | IA | Recherche | QR | e-IDStack | Email

[RECENT ACTIVITY]
Date | Utilisateur | Action | Module | Statut

[ALERTS]
Erreur e-IDStack | Workflow incomplet | Stockage presque plein
```

### Style

- dashboard dense mais propre ;
- cartes KPI ;
- état service avec pastilles ;
- alertes critiques en rouge ;
- fond global gris clair.

---

## 4.2 Gestion utilisateurs

```text
[PAGE HEADER]
Gestion des utilisateurs
[CTA Ajouter utilisateur] [Importer CSV] [Exporter]

[SEARCH/FILTERS]
Nom/email | Rôle | Institution | Département | Statut | Dernière connexion

[TABLE]
Nom | Email | Rôle principal | Institution | Département | Statut | Dernière connexion | Actions

[USER DRAWER]
Profil utilisateur
Rôles
Périmètre
Activité récente
[Modifier] [Suspendre] [Réinitialiser mot de passe]
```

---

## 4.3 Rôles & permissions

```text
[PAGE HEADER]
Rôles & permissions

┌───────────────────────┬────────────────────────────────────────────┐
│ [ROLES LIST]          │ [ROLE DETAIL]                              │
│ Déposant              │ Nom : Archiviste                           │
│ Validateur            │ Description                                │
│ Archiviste            │                                            │
│ Admin institutionnel  │ [PERMISSION MATRIX]                        │
│ Super admin           │ Module | Voir | Créer | Modifier | ...     │
└───────────────────────┴────────────────────────────────────────────┘

[CRITICAL CHANGE MODAL]
Modifier une permission critique ?
[Annuler] [Confirmer]
```

---

## 4.4 Institutions

```text
[PAGE HEADER]
Institutions
[CTA Ajouter institution]

[INSTITUTION CARDS/TABLE]
Logo | Nom | Type | Ville | Statut | Documents | Vérifiables | Actions

[DETAIL PANEL]
Informations officielles
Administrateurs associés
Statistiques
Configuration e-IDStack
Visibilité publique
```

---

## 4.5 Structures académiques

```text
[PAGE HEADER]
Structures académiques

┌──────────────────────────┬─────────────────────────────────────────┐
│ [TREE]                   │ [DETAIL FORM]                           │
│ Université               │ Nom                                     │
│ └── Faculté              │ Sigle                                   │
│     └── Département      │ Responsable                             │
│         └── Filière      │ Email                                   │
│                          │ Statut                                  │
└──────────────────────────┴─────────────────────────────────────────┘

[ACTIONS]
Ajouter faculté | Ajouter département | Ajouter filière | Désactiver
```

---

## 4.6 Workflows

```text
[PAGE HEADER]
Configuration des workflows

[WORKFLOW LIST]
Mémoire UY1 | Thèse UY1 | Article UY1

[WORKFLOW BUILDER]
Brouillon → Soumis → En instruction → Correction demandée → Validé → Archivable → Archivé

[STEP DETAIL]
Nom étape
Rôle responsable
Obligatoire
Autorise correction
Autorise décision
Délai recommandé

[TRANSITION DETAIL]
Source
Cible
Action
Rôles autorisés
Condition

[ACTIONS]
Tester workflow | Publier nouvelle version | Désactiver
```

### Style

- builder en blocs reliés ;
- étape active rouge ;
- étape finale noire ;
- transitions critiques avec icône alerte.

---

## 4.7 Paramètres IA

```text
[PAGE HEADER]
Paramètres IA

[TABS]
Extraction IA | Assistant IA | Similarité | Sécurité | Logs | Tests

[Extraction IA]
Activer extraction IA [toggle]
Provider
Modèle
Langues supportées
Pages max
Seuil confiance
Champs à extraire
[Tester sur PDF]

[Assistant IA]
Activer Assistant IA
Sources autorisées
Nombre max sources
☑ Sources obligatoires
☑ Réponse uniquement depuis sources

[Sécurité]
☑ Exclure documents privés
☑ Masquer données sensibles
☑ Journaliser requêtes
```

---

## 4.8 Recherche & facettes

```text
[PAGE HEADER]
Recherche & facettes

[INDEXED FIELDS]
☑ Titre
☑ Résumé
☑ Mots-clés
☑ Auteur
☑ Texte PDF extrait

[FACETS]
☑ Type
☑ Institution
☑ Département
☑ Année
☑ Vérifiable
☑ PDF disponible

[ACTIONS]
Lancer réindexation | Tester recherche | Sauvegarder
```

---

## 4.9 SSI / e-IDStack

```text
[PAGE HEADER]
Paramètres SSI / e-IDStack

[CONNECTION CARD]
Provider : e-IDStack de IDS
Environnement : TEST / STAGING / PRODUCTION
URL service
Identifiant institutionnel
Statut connexion : CONNECTED
Dernière synchro
[Test connexion]

[PROOF SETTINGS]
☑ Générer preuve après archivage
Schéma credential
Issuer DID
☑ Révocation activée
Statut par défaut

[INCLUDED DATA]
Document ID | Titre | Auteur | Type | Institution | Hash | Date archive | URL vérification

[ACTIONS]
Synchroniser schémas | Émettre preuve test | Vérifier preuve test | Sauvegarder
```

### Sécurité

- API tokens masqués ;
- changement critique avec modal ;
- logs visibles seulement aux admins autorisés.

---

## 4.10 Preuves & vérifications

```text
[PAGE HEADER]
Preuves & vérifications

[FILTERS]
Statut | Institution | Date | Résultat vérification | Source

[TABLE PROOFS]
ID preuve | Document | Institution | Date émission | Statut | Hash | Actions

[DETAIL]
Credential ID
Hash
QR code
URL vérification
Statut
Logs e-IDStack
[Révoquer] [Réémettre] [Télécharger QR]

[VERIFICATION LOG]
Date | ID preuve | Résultat | Source | Document | Pays/IP
```

---

## 4.11 Statistiques

```text
[PAGE HEADER]
Statistiques et pilotage

[FILTERS]
Institution | Faculté | Département | Type | Année | Domaine | Statut

[KPI CARDS]
Total | Archivés | Validés | Rejetés | Temps moyen | Corrections | Vérifications | IA queries

[CHARTS]
Évolution dépôts
Répartition type
Top domaines
Top mots-clés
Vérifications QR
Utilisation Assistant IA

[EXPORT]
CSV | PDF | Rapport institutionnel
```

---

## 4.12 Audit système

```text
[PAGE HEADER]
Audit système

[SEARCH/FILTERS]
Utilisateur | Module | Action | Date | Institution | Criticité | Résultat

[TABLE]
Date | Utilisateur | Rôle | Action | Module | Criticité | Statut | Détail

[DETAIL EVENT]
Ancienne valeur
Nouvelle valeur
Adresse IP
Commentaire
Trace technique

[EXPORT AUDIT]
```

### Style

- actions critiques avec badge rouge profond ;
- logs lecture seule ;
- export réservé.

---

# 5. Écrans transverses et modals

## 5.1 Modal confirmation critique

```text
[MODAL]
Titre : Confirmer l’action
Message : Cette action est sensible et sera enregistrée dans l’audit.
Résumé : action, objet concerné, utilisateur, date
[Annuler] [Confirmer]
```

Usage :

- décision finale ;
- archivage ;
- révocation preuve ;
- modification workflow ;
- changement SSI ;
- changement rôle critique.

---

## 5.2 État vide standard

```text
[EMPTY STATE]
Icone fine gris clair
Titre clair
Description utile
Action principale
```

Exemple :

```text
Aucun document trouvé.
Essayez de modifier vos filtres ou d’interroger l’Assistant IA.
[Réinitialiser filtres]
```

---

## 5.3 État chargement standard

```text
[SKELETON]
Carte 1
Carte 2
Table rows...
```

Utiliser des skeletons plutôt qu’un spinner global pour donner une impression premium.

---

## 5.4 État erreur standard

```text
[ERROR CARD]
Titre : Impossible de charger les données.
Description : Une erreur technique est survenue.
[Réessayer] [Contacter support]
```

Couleurs :

- fond blanc ;
- bordure rouge clair ;
- icône rouge ;
- texte `#991B1B`.

---

# 6. Parcours de démonstration recommandé

```text
1. Accueil public : montrer la promesse.
2. Déposant : créer un nouveau dépôt.
3. Upload PDF : afficher hash.
4. Analyse IA : extraire titre, résumé, mots-clés.
5. Soumission : envoyer le dossier.
6. Validation : ouvrir le dossier, vérifier métadonnées.
7. Décision : marquer archivable.
8. Archivage : générer QR + preuve via e-IDStack.
9. Archive publique : retrouver le document par facettes.
10. Assistant IA : poser une question sourcée.
11. Vérification QR : afficher document authentique.
```

---

# 7. Priorités wireframes pour design rapide

## Priorité 1

- Accueil public ;
- Nouveau dépôt ;
- Analyse IA ;
- Détail validation ;
- Recherche à facettes ;
- Fiche document ;
- Vérification QR.

## Priorité 2

- Dashboard déposant ;
- Mes dossiers ;
- Décision finale ;
- Archivage ;
- Assistant IA ;
- Dashboard admin.

## Priorité 3

- Workflows ;
- Paramètres IA ;
- SSI / e-IDStack ;
- Audit ;
- Statistiques.

---

# 8. Conclusion wireframes

Les wireframes doivent rester cohérents avec la promesse :

> **Archiver. Valider. Explorer. Vérifier.**

Chaque écran doit clairement contribuer à l’un de ces objectifs. La complexité technique — IA, recherche, e-IDStack, preuve — doit être présente, mais toujours expliquée avec une interface simple, lisible et institutionnelle.
