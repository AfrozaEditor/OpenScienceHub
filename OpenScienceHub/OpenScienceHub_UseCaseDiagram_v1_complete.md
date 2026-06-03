# OpenScience Hub - Diagrammes de cas d'utilisation complets

Version : v1.0 complete  
Format source : PlantUML  
Produit : OpenScience Hub  
Périmètre : système complet, pas seulement le MVP

## 1. Intention de conception

OpenScience Hub est conçu comme une plateforme institutionnelle complète pour la gestion des travaux scientifiques universitaires : mémoires, thèses et articles. Le système couvre le dépôt, l'extraction IA des métadonnées, la validation académique, l'archivage, la consultation, la recherche à facettes, l'assistant IA, la vérification d'authenticité et l'émission native de preuves SSI via eidStack-CMU.

Le thème du hackathon impose le noyau métier suivant : archivage, classification, consultation des travaux scientifiques et moteur de recherche à facettes. L'intégration IA est représentée par deux capacités : extraction automatique des métadonnées PDF et assistant IA d'exploration documentaire.

## 2. Structure des diagrammes

Le fichier PlantUML contient 6 vues :

| Vue | Nom | Objectif |
|---|---|---|
| 0 | Vue globale | Montrer les grands acteurs, espaces produit et dépendances majeures |
| 1 | Espace déposant | Détailler le cycle de création, upload, extraction IA, soumission et corrections |
| 2 | Validation académique | Détailler les workflows mémoire, thèse et article |
| 3 | Archive publique et assistant IA | Détailler recherche à facettes, consultation, indexation et assistant IA |
| 4 | SSI natif et administration | Détailler eidStack-CMU, QR code, vérification et back-office |
| 5 | Matrice responsabilités | Résumer les responsabilités principales par acteur |

## 3. Acteurs humains

### 3.1 Déposant

Acteur générique représentant toute personne qui crée et soumet un dossier scientifique.

Spécialisations :

- Étudiant : dépose principalement un mémoire.
- Doctorant : dépose principalement une thèse.
- Enseignant-chercheur : dépose principalement un article, une communication ou une production scientifique.

Responsabilités :

- créer un dossier scientifique ;
- choisir le type de travail : mémoire, thèse ou article ;
- uploader le document PDF ;
- corriger les métadonnées extraites par IA ;
- soumettre officiellement le dossier ;
- suivre le statut ;
- répondre aux demandes de correction ;
- consulter la preuve et le QR code après archivage.

### 3.2 Validateur académique

Acteur générique représentant toute personne ou structure habilitée à instruire un dossier.

Spécialisations :

- Encadreur ;
- Rapporteur ;
- Reviewer d'article ;
- Chef de département ;
- Comité scientifique ;
- École doctorale ;
- Archiviste / Bibliothèque.

Responsabilités :

- consulter les dossiers soumis ;
- vérifier la complétude administrative ;
- valider ou corriger les métadonnées ;
- affecter des acteurs de validation ;
- produire avis, rapport ou peer review ;
- demander des corrections ;
- enregistrer les décisions ;
- transmettre à l'archive.

### 3.3 Administrateur institutionnel

Acteur représentant l'administration d'une institution utilisatrice.

Responsabilités :

- gérer les institutions, facultés, départements et filières ;
- gérer utilisateurs, rôles et permissions ;
- configurer les workflows par type de document ;
- configurer les référentiels de facettes ;
- configurer l'issuer DID institutionnel ;
- gérer les politiques d'accès aux PDF ;
- consulter les statistiques et journaux d'audit.

### 3.4 Super admin plateforme

Acteur technique global de la plateforme.

Responsabilités :

- administrer plusieurs institutions ;
- gérer les paramètres globaux ;
- superviser les journaux ;
- intervenir sur les incidents ;
- gérer la configuration système transverse.

### 3.5 Public / Lecteur

Acteur anonyme ou authentifié qui consulte les travaux archivés.

Spécialisations :

- Étudiant ;
- Chercheur ;
- Partenaire ;
- Recruteur ;
- Vérificateur externe.

Responsabilités :

- consulter le catalogue ;
- rechercher par mots-clés ;
- filtrer par facettes ;
- consulter une fiche scientifique ;
- télécharger un PDF si autorisé ;
- interroger l'assistant IA ;
- vérifier l'authenticité d'un document.

## 4. Acteurs systèmes externes

### 4.1 Service IA

Service externe ou interne utilisé par OpenScience Hub pour les fonctions IA.

Cas d'utilisation associés :

- extraire les métadonnées ;
- générer résumé, fiche de lecture et mots-clés ;
- récupérer les passages pertinents ;
- générer une réponse sourcée ;
- suggérer des travaux similaires.

### 4.2 eidStack-CMU

Système SSI natif utilisé pour émettre et vérifier des Verifiable Credentials liés aux travaux scientifiques archivés.

Cas d'utilisation associés :

- configurer un issuer DID institutionnel ;
- émettre un VC `AcademicWorkCredential` ;
- vérifier la signature et le statut du VC ;
- suspendre ou révoquer une preuve ;
- contrôler le statut d'une preuve.

### 4.3 Service QR

Service technique de génération des QR codes.

Cas d'utilisation associés :

- générer un QR code de vérification ;
- encoder une URL publique de vérification ;
- relier le QR code à une preuve SSI et au hash du document final.

### 4.4 Stockage fichiers

Service de stockage des PDF et versions documentaires.

Cas d'utilisation associés :

- uploader un PDF ;
- stocker les versions ;
- verrouiller la version finale ;
- télécharger selon les droits d'accès.

### 4.5 Service notification

Service utilisé pour informer les acteurs des changements importants.

Cas d'utilisation associés :

- notifier une affectation ;
- notifier une demande de correction ;
- notifier une décision ;
- notifier l'archivage ou l'émission d'une preuve.

## 5. Cas d'utilisation détaillés

### 5.1 Créer et gérer un dossier scientifique

Acteur principal : Déposant  
Précondition : utilisateur authentifié ou inscrit  
Postcondition : un dossier scientifique est créé avec un statut initial `BROUILLON`.

Flux nominal :

1. Le déposant crée un nouveau dossier.
2. Il choisit le type : mémoire, thèse ou article.
3. Il renseigne institution, faculté, département, programme, année académique et encadreur si disponible.
4. Il sauvegarde le dossier.

Données manipulées :

- type de travail ;
- titre provisoire ;
- auteur ;
- institution ;
- département ;
- programme ;
- encadreur ;
- langue ;
- visibilité souhaitée.

### 5.2 Uploader document PDF et gérer les versions

Acteur principal : Déposant  
Acteurs secondaires : Stockage fichiers, Service IA  
Précondition : dossier scientifique existant  
Postcondition : une nouvelle version documentaire est créée et indexée.

Flux nominal :

1. Le déposant ajoute un fichier PDF.
2. Le système vérifie le format.
3. Le système calcule le hash SHA-256.
4. Le système crée une version documentaire.
5. Le système extrait le texte.
6. Le système déclenche l'extraction IA des métadonnées.
7. Le système prépare l'indexation documentaire.

Relations UML :

- `Uploader document PDF` inclut `Calculer hash et créer version`.
- `Uploader document PDF` inclut `Extraire texte du PDF`.
- `Uploader document PDF` inclut `Lancer extraction IA des métadonnées`.

### 5.3 Extraire les métadonnées par IA

Acteur principal : Service IA  
Acteur métier bénéficiaire : Déposant, Validateur académique  
Précondition : texte PDF extrait  
Postcondition : des métadonnées proposées sont disponibles pour validation humaine.

Métadonnées attendues :

- titre ;
- auteur ;
- résumé ;
- mots-clés ;
- domaine scientifique ;
- problématique ;
- méthodologie ;
- encadreur si détecté ;
- langue ;
- thématiques associées.

Règle métier : les métadonnées IA sont des propositions. Elles doivent rester modifiables et validables par un humain.

### 5.4 Soumettre officiellement

Acteur principal : Déposant  
Précondition : dossier complet, PDF présent, métadonnées minimales renseignées  
Postcondition : statut du dossier = `SOUMIS`.

Flux nominal :

1. Le déposant prévisualise le dossier.
2. Le système vérifie les champs obligatoires.
3. Le déposant confirme la soumission.
4. Le système verrouille certaines informations de base.
5. Le système notifie les validateurs concernés.

### 5.5 Instruire un dossier

Acteur principal : Validateur académique  
Précondition : dossier soumis  
Postcondition : le dossier avance vers correction, avis, décision ou archivage.

Flux nominal :

1. Le validateur consulte l'inbox des dossiers.
2. Il ouvre le dossier et les versions PDF.
3. Il contrôle la complétude.
4. Il valide ou corrige les métadonnées.
5. Il affecte des acteurs de validation si nécessaire.
6. Il donne un avis ou demande une correction.

### 5.6 Workflow mémoire

Acteurs : Encadreur, Chef de département, Comité scientifique, Archiviste  
Objectif : gérer la validation d'un mémoire depuis l'instruction jusqu'au dépôt final.

Cas d'utilisation :

- autoriser soutenance de mémoire ;
- enregistrer jury de mémoire ;
- enregistrer résultat après soutenance ;
- valider dépôt final du mémoire.

États métier typiques :

- `SOUMIS` ;
- `EN_INSTRUCTION` ;
- `CORRECTION_DEMANDEE` ;
- `AUTORISE_SOUTENANCE` ;
- `SOUTENU` ;
- `DEPOT_FINAL` ;
- `ARCHIVE`.

### 5.7 Workflow thèse

Acteurs : École doctorale, Rapporteur, Comité scientifique, Archiviste  
Objectif : gérer la validation plus lourde d'une thèse.

Cas d'utilisation :

- demander expertise de thèse ;
- collecter rapports d'expertise ;
- autoriser soutenance de thèse ;
- enregistrer jury et décision doctorale ;
- valider version finale après corrections.

États métier typiques :

- `SOUMIS` ;
- `EN_EXPERTISE` ;
- `RAPPORTS_RECUS` ;
- `AUTORISE_SOUTENANCE` ;
- `SOUTENU` ;
- `CORRECTIONS_POST_SOUTENANCE` ;
- `DEPOT_FINAL` ;
- `ARCHIVE`.

### 5.8 Workflow article

Acteurs : Reviewer, Comité scientifique, Archiviste  
Objectif : gérer un article sans transformer la plateforme en revue scientifique complète.

Cas d'utilisation :

- screening éditorial initial ;
- affecter reviewers ;
- collecter peer reviews ;
- décider : accepter, réviser ou rejeter ;
- archiver statut publié ou accepté.

États métier typiques :

- `SOUMIS` ;
- `SCREENING` ;
- `EN_REVIEW` ;
- `REVISION_DEMANDEE` ;
- `ACCEPTE` ;
- `REJETE` ;
- `PUBLIE` ;
- `ARCHIVE`.

### 5.9 Rechercher par facettes

Acteur principal : Public / Lecteur  
Précondition : des travaux sont archivés et publiables  
Postcondition : une liste filtrée de notices scientifiques est retournée.

Facettes principales :

- type : mémoire, thèse, article ;
- institution ;
- faculté ;
- département ;
- programme ;
- domaine scientifique ;
- année ;
- auteur ;
- encadreur ;
- mots-clés ;
- langue ;
- statut ;
- accès : public ou restreint.

### 5.10 Interroger l'archive avec l'assistant IA

Acteur principal : Public / Lecteur  
Acteurs secondaires : Service IA, moteur d'indexation  
Précondition : les documents sont indexés  
Postcondition : une réponse sourcée est produite.

Flux nominal :

1. L'utilisateur pose une question en langage naturel.
2. Le système récupère les passages pertinents.
3. Le service IA génère une réponse.
4. Le système affiche la réponse avec les sources utilisées.

Fonctions associées :

- résumer un document ;
- générer une fiche de lecture ;
- suggérer des travaux similaires ;
- suggérer mots-clés et thématiques.

Règle métier : l'assistant IA assiste la recherche et l'analyse. Il ne valide pas officiellement un travail académique.

### 5.11 Émettre une preuve SSI via eidStack-CMU

Acteur principal : Archiviste / Institution  
Acteur système : eidStack-CMU  
Précondition : dossier validé et version finale verrouillée  
Postcondition : un Verifiable Credential `AcademicWorkCredential` est émis et associé au dossier.

Flux nominal :

1. Le validateur finalise l'archivage.
2. Le système récupère le hash final du document.
3. Le système prépare le credential subject.
4. eidStack-CMU émet le Verifiable Credential.
5. Le système associe le VC au dossier archivé.
6. Le système génère un QR code de vérification.

Données minimales dans la preuve :

- identifiant du dossier ;
- titre ;
- auteur ;
- institution ;
- type de travail ;
- statut académique ;
- hash du document final ;
- date d'émission ;
- issuer DID ;
- statut du credential.

### 5.12 Vérifier authenticité

Acteur principal : Public / Vérificateur  
Acteurs secondaires : eidStack-CMU, Service QR  
Précondition : preuve émise  
Postcondition : résultat d'authenticité affiché.

Flux nominal :

1. Le vérificateur scanne un QR code ou ouvre un lien.
2. Le système retrouve la preuve.
3. Le système vérifie le hash du document final.
4. Le système vérifie la signature et le statut du VC via eidStack-CMU.
5. Le système affiche un résultat clair : authentique, invalide, suspendu, révoqué ou introuvable.

## 6. Statuts métier recommandés

### 6.1 WorkStatus

| Valeur | Signification |
|---|---|
| BROUILLON | Dossier en préparation par le déposant |
| SOUMIS | Dossier transmis à l'institution |
| EN_INSTRUCTION | Dossier examiné par des validateurs |
| CORRECTION_DEMANDEE | Une correction est attendue du déposant |
| RE_SOUMIS | Nouvelle version déposée après correction |
| EN_EXPERTISE | Thèse ou dossier avancé en expertise |
| EN_REVIEW | Article en peer review |
| REVISION_DEMANDEE | Article ou document à réviser |
| AUTORISE_SOUTENANCE | Soutenance autorisée |
| SOUTENU | Soutenance réalisée |
| DEPOT_FINAL | Version finale en attente d'archivage |
| VALIDE | Décision favorable enregistrée |
| REJETE | Décision défavorable |
| ARCHIVE | Dossier archivé institutionnellement |
| PUBLIE | Notice ou article publié publiquement |

### 6.2 WorkType

| Valeur | Signification |
|---|---|
| MEMOIRE | Mémoire de Master ou équivalent |
| THESE | Thèse de Doctorat / Ph.D |
| ARTICLE | Article scientifique |
| COMMUNICATION | Communication scientifique, option roadmap |
| RAPPORT_RECHERCHE | Rapport scientifique, option roadmap |

### 6.3 DecisionType

| Valeur | Signification |
|---|---|
| ACCEPTED_FOR_REVIEW | Accepté pour instruction ou review |
| CORRECTION_REQUIRED | Corrections demandées |
| REJECTED | Rejeté |
| DEFENSE_AUTHORIZED | Soutenance autorisée |
| DEFENSE_VALIDATED | Soutenance validée |
| ACCEPTED | Accepté |
| FINAL_DEPOSIT_ACCEPTED | Dépôt final accepté |
| ARCHIVING_APPROVED | Archivage approuvé |
| PUBLISHED | Publié |

### 6.4 AccessLevel

| Valeur | Signification |
|---|---|
| PUBLIC | PDF et notice accessibles publiquement |
| NOTICE_ONLY | Notice publique, PDF non téléchargeable |
| RESTRICTED | Accès réservé à certains rôles |
| EMBARGOED | Accès bloqué jusqu'à une date donnée |
| PRIVATE | Visible uniquement en interne |

### 6.5 CredentialStatus

| Valeur | Signification |
|---|---|
| ISSUED | Preuve SSI émise |
| ACTIVE | Preuve valide et vérifiable |
| SUSPENDED | Preuve temporairement suspendue |
| REVOKED | Preuve révoquée |
| EXPIRED | Preuve expirée si une date d'expiration existe |

## 7. Règles de cohérence importantes

1. Un dossier scientifique peut exister sans preuve SSI tant qu'il n'est pas archivé.
2. Une preuve SSI ne peut être émise que pour une version finale verrouillée.
3. Le QR code ne contient pas le document ; il pointe vers une page de vérification.
4. L'assistant IA n'a pas le droit de prendre une décision académique finale.
5. Les métadonnées IA sont toujours validables et corrigibles par un humain.
6. Le workflow doit rester paramétrable par institution, car les règles varient selon université, faculté, cycle et type de document.
7. La recherche à facettes et la recherche par assistant IA sont complémentaires : la première filtre des notices, la seconde interroge le contenu documentaire.
8. La vérification d'authenticité combine au minimum : hash du document, statut du dossier, statut du VC et signature via eidStack-CMU.

## 8. Priorité de réalisation

Même si le diagramme couvre le système complet, une réalisation progressive reste recommandée :

### Phase 1 - Socle hackathon solide

- création dossier ;
- upload PDF ;
- extraction IA des métadonnées ;
- soumission ;
- validation simple ;
- archivage ;
- recherche à facettes ;
- fiche publique ;
- assistant IA basique ;
- QR code et page de vérification ;
- émission SSI simulée ou connectée selon disponibilité eidStack-CMU.

### Phase 2 - Produit institutionnel

- workflows paramétrables ;
- rôles détaillés ;
- versioning avancé ;
- statistiques ;
- audits ;
- notifications ;
- politiques d'accès ;
- intégration complète eidStack-CMU.

### Phase 3 - Échelle nationale ou interuniversitaire

- multi-institutions ;
- fédération de catalogues ;
- référentiels disciplinaires ;
- interopérabilité SSI ;
- analytics de recherche ;
- détection avancée de similarité ;
- intégration bibliothèques et systèmes académiques existants.
