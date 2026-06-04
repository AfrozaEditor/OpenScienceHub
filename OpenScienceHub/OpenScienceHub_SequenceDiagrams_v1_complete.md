# OpenScience Hub - Diagrammes de sequence complets

Ce document decrit les diagrammes de sequence du systeme complet OpenScience Hub. Il ne se limite pas au MVP : il couvre le depot, la validation, les variantes memoire/these/article, l’archivage, l’Assistant IA, la consultation publique, la verification QR code et le SSI natif via eidStack-CMU.

## Convention de lecture

- **Deposant / Doctorant / Auteur** : utilisateur qui cree un dossier scientifique et depose un document.
- **Validateur / Ecole doctorale / Editeur / Reviewer / Jury** : acteurs academiques qui interviennent dans l’instruction.
- **API OpenScience** : coeur applicatif, responsable des regles metier, statuts, validations et orchestration.
- **Stockage PDF / Archive / Index recherche** : composants de persistance documentaire et de recherche.
- **Service IA / Assistant IA** : composants d’intelligence artificielle pour l’extraction des metadonnees, la recherche en langage naturel, les resumes et les reponses sourcees.
- **eidStack-CMU** : composant SSI natif responsable de l’emission et de la verification des Verifiable Credentials.


## 1. 1. Depot scientifique, extraction IA et indexation

Creation d’un dossier, upload PDF, extraction des metadonnees et preparation de l’archive interrogeable.

### Participants

- **Deposant** (`actor`)
- **Portail deposant** (`ui`)
- **API OpenScience** (`backend`)
- **Stockage PDF** (`data`)
- **Service IA** (`ai`)
- **Index recherche** (`data`)

### Sequence nominale

1. **Deposant** -> **Portail deposant** : creer un dossier scientifique.
2. **Portail deposant** -> **API OpenScience** : POST /research-works.
3. **API OpenScience** -> **Index recherche** : enregistrer dossier brouillon - persistance/recherche.
4. **Deposant** -> **Portail deposant** : uploader le PDF.
5. **Portail deposant** -> **API OpenScience** : POST /documents.
6. **API OpenScience** -> **Stockage PDF** : stocker fichier et calculer SHA-256 - persistance/recherche.
7. **API OpenScience** -> **Service IA** : extraire titre, auteur, resume, mots-cles - traitement IA.
8. **Service IA** -> **API OpenScience** : retourner metadonnees proposees - traitement IA - retour.
9. **API OpenScience** -> **Index recherche** : creer chunks + index texte/vectoriel - persistance/recherche.
10. **Portail deposant** -> **Deposant** : afficher metadonnees a valider - retour.

### Regle de conception

le dossier scientifique est l’objet central ; le PDF n’est qu’une version documentaire rattachee au dossier.


## 2. 2. Soumission et validation academique generique

Workflow commun aux memoires, theses et articles : avis, correction, nouvelle version, decision finale.

### Participants

- **Deposant** (`actor`)
- **Portail deposant** (`ui`)
- **API OpenScience** (`backend`)
- **Portail validation** (`ui`)
- **Validateur** (`actor`)
- **Journal audit** (`data`)

### Sequence nominale

1. **Deposant** -> **Portail deposant** : soumettre le dossier complete.
2. **Portail deposant** -> **API OpenScience** : changer statut : SUBMITTED.
3. **API OpenScience** -> **Portail validation** : notifier nouveau dossier.
4. **Validateur** -> **Portail validation** : consulter PDF, metadonnees, historique.
5. **Portail validation** -> **API OpenScience** : charger dossier + versions + hash.
6. **Validateur** -> **Portail validation** : ajouter avis academique.
7. **Portail validation** -> **API OpenScience** : enregistrer Review.
8. **API OpenScience** -> **Journal audit** : tracer action et auteur - persistance/recherche.
9. **Validateur** -> **Portail validation** : demander correction ou proposer validation.
10. **Portail validation** -> **API OpenScience** : creer Decision.
11. **API OpenScience** -> **Portail deposant** : notifier statut : correction/valide - retour.

### Regle de conception

les variantes memoire, these et article changent les roles et statuts, pas le noyau du workflow.


## 3. 3. Variante These : expertise et autorisation de soutenance

Flux plus exigeant : ecole doctorale, rapporteurs, autorisation, soutenance et depot final.

### Participants

- **Doctorant** (`actor`)
- **Ecole doctorale** (`actor`)
- **API OpenScience** (`backend`)
- **Rapporteur** (`actor`)
- **Jury** (`actor`)
- **Archive** (`data`)

### Sequence nominale

1. **Doctorant** -> **API OpenScience** : soumettre manuscrit de these.
2. **API OpenScience** -> **Ecole doctorale** : demander instruction scientifique.
3. **Ecole doctorale** -> **API OpenScience** : designer rapporteurs.
4. **API OpenScience** -> **Rapporteur** : envoyer demande d’expertise.
5. **Rapporteur** -> **API OpenScience** : deposer rapport / avis.
6. **API OpenScience** -> **Ecole doctorale** : consolider avis.
7. **Ecole doctorale** -> **API OpenScience** : autoriser soutenance ou correction.
8. **API OpenScience** -> **Jury** : enregistrer soutenance.
9. **Jury** -> **API OpenScience** : decision finale + corrections.
10. **Doctorant** -> **API OpenScience** : deposer version finale.
11. **API OpenScience** -> **Archive** : archiver version finale verrouillee - persistance/recherche.

### Regle de conception

la these conserve des objets specifiques : Expertise, Jury, SoutenanceEvent et DepotFinal.


## 4. 4. Variante Article : screening, peer review et acceptation

Gestion des articles sans reconstruire toute une revue scientifique : statut editorial et avis reviewers.

### Participants

- **Auteur** (`actor`)
- **Portail deposant** (`ui`)
- **API OpenScience** (`backend`)
- **Editeur scientifique** (`actor`)
- **Reviewer** (`actor`)
- **Archive** (`data`)

### Sequence nominale

1. **Auteur** -> **Portail deposant** : soumettre article.
2. **Portail deposant** -> **API OpenScience** : creer dossier type ARTICLE.
3. **API OpenScience** -> **Editeur scientifique** : notifier screening initial.
4. **Editeur scientifique** -> **API OpenScience** : accepter pour review ou rejeter.
5. **API OpenScience** -> **Reviewer** : assigner reviewer.
6. **Reviewer** -> **API OpenScience** : deposer avis et recommandation.
7. **API OpenScience** -> **Auteur** : notifier revision demandee - retour.
8. **Auteur** -> **API OpenScience** : soumettre version revisee.
9. **Editeur scientifique** -> **API OpenScience** : decision : ACCEPTED/REJECTED.
10. **API OpenScience** -> **Archive** : archiver article accepte ou notice - persistance/recherche.

### Regle de conception

le peer review avance reste un module, pas un portail obligatoire separe.


## 5. 5. Archivage final, QR code et SSI natif eidStack-CMU

Apres validation, OpenScience Hub emet nativement une preuve verifiable via eidStack-CMU.

### Participants

- **Validateur** (`actor`)
- **API OpenScience** (`backend`)
- **Archive** (`data`)
- **eidStack-CMU** (`ssi`)
- **Ledger/Registry** (`ssi`)
- **Page verification** (`ui`)

### Sequence nominale

1. **Validateur** -> **API OpenScience** : valider pour archivage.
2. **API OpenScience** -> **Archive** : verrouiller version finale + hash - persistance/recherche.
3. **API OpenScience** -> **eidStack-CMU** : demander emission VC AcademicWork - operation SSI.
4. **eidStack-CMU** -> **Ledger/Registry** : resoudre DID issuer + schema/status - operation SSI.
5. **Ledger/Registry** -> **eidStack-CMU** : retour DID document / status list - operation SSI - retour.
6. **eidStack-CMU** -> **API OpenScience** : retourner VerifiableCredential signee - operation SSI - retour.
7. **API OpenScience** -> **Archive** : stocker credentialId, proof, status - persistance/recherche.
8. **API OpenScience** -> **Page verification** : generer verification_url + QR code.
9. **Page verification** -> **Validateur** : afficher preuve et QR code - retour.

### Regle de conception

le SSI est natif : la preuve d’authenticite n’est pas une extension future, elle est emise via eidStack-CMU.


## 6. 6. Consultation publique, recherche a facettes et Assistant IA

Le public consulte l’archive, filtre les resultats et interroge les travaux en langage naturel.

### Participants

- **Utilisateur public** (`actor`)
- **Archive publique** (`ui`)
- **API OpenScience** (`backend`)
- **Index recherche** (`data`)
- **Assistant IA** (`ai`)
- **Stockage PDF** (`data`)

### Sequence nominale

1. **Utilisateur public** -> **Archive publique** : rechercher par mot-cle et facettes.
2. **Archive publique** -> **API OpenScience** : GET /catalog?filters.
3. **API OpenScience** -> **Index recherche** : recherche plein texte + facettes - persistance/recherche.
4. **Index recherche** -> **API OpenScience** : retour resultats classes - persistance/recherche - retour.
5. **API OpenScience** -> **Archive publique** : afficher catalogue et filtres - retour.
6. **Utilisateur public** -> **Archive publique** : poser une question a l’Assistant IA.
7. **Archive publique** -> **API OpenScience** : POST /ai/query.
8. **API OpenScience** -> **Index recherche** : recuperer passages pertinents - persistance/recherche.
9. **API OpenScience** -> **Assistant IA** : generer reponse sourcee - traitement IA.
10. **Assistant IA** -> **API OpenScience** : reponse + references - traitement IA - retour.
11. **API OpenScience** -> **Archive publique** : afficher reponse et sources - retour.

### Regle de conception

on parle d’Assistant IA cote produit ; l’architecture interne peut utiliser une recuperation augmentee.


## 7. 7. Verification d’authenticite par QR code

Un tiers scanne un QR code et verifie le document, son hash, son statut et son credential SSI.

### Participants

- **Verificateur** (`actor`)
- **QR / Navigateur** (`ui`)
- **Page verification** (`ui`)
- **API OpenScience** (`backend`)
- **eidStack-CMU** (`ssi`)
- **Archive** (`data`)

### Sequence nominale

1. **Verificateur** -> **QR / Navigateur** : scanner QR code.
2. **QR / Navigateur** -> **Page verification** : ouvrir /verify/{credentialId}.
3. **Page verification** -> **API OpenScience** : charger preuve et metadonnees.
4. **API OpenScience** -> **eidStack-CMU** : verifier VC, signature et statut - operation SSI.
5. **eidStack-CMU** -> **API OpenScience** : resultat cryptographique - operation SSI - retour.
6. **API OpenScience** -> **Archive** : recuperer hash final et notice - persistance/recherche.
7. **Archive** -> **API OpenScience** : retour notice archivee - persistance/recherche - retour.
8. **API OpenScience** -> **Page verification** : retour VALID/INVALID + details.
9. **Page verification** -> **Verificateur** : afficher authenticite et sources - retour.

### Regle de conception

la verification ne donne pas forcement acces au PDF ; elle confirme le statut et l’authenticite de la version archivee.


## 8. 8. Administration institutionnelle et parametrage des workflows

Configuration des institutions, roles, facettes, statuts et schemas de validation.

### Participants

- **Admin institution** (`actor`)
- **Back-office** (`ui`)
- **API OpenScience** (`backend`)
- **Base donnees** (`data`)
- **eidStack-CMU** (`ssi`)
- **Journal audit** (`data`)

### Sequence nominale

1. **Admin institution** -> **Back-office** : configurer institution/faculte/departement.
2. **Back-office** -> **API OpenScience** : POST/PUT referentiels.
3. **API OpenScience** -> **Base donnees** : enregistrer structure academique - persistance/recherche.
4. **Admin institution** -> **Back-office** : definir roles et permissions.
5. **Back-office** -> **API OpenScience** : mettre a jour RBAC.
6. **Admin institution** -> **Back-office** : parametrer statuts et workflow.
7. **Back-office** -> **API OpenScience** : sauver workflow par type document.
8. **API OpenScience** -> **eidStack-CMU** : configurer issuer DID/schema VC - operation SSI.
9. **eidStack-CMU** -> **API OpenScience** : confirmer configuration issuer - operation SSI - retour.
10. **API OpenScience** -> **Journal audit** : journaliser configuration - persistance/recherche.

### Regle de conception

le systeme doit etre parametrable, car les processus varient selon universite, cycle et discipline.


## Synthese des enchainements majeurs

1. Le **dossier scientifique** est cree avant tout traitement documentaire.
2. Le **PDF** est stocke, hashé, versionne, puis enrichi par extraction IA.
3. Les metadonnees extraites ne sont pas imposees : elles sont proposees, puis corrigees ou validees par l’humain.
4. Le **workflow academique** est generique mais parametrable par type de document.
5. Les memoires, theses et articles partagent le meme noyau : dossier, document, version, avis, decision, archive.
6. La these ajoute des controles plus forts : ecole doctorale, rapporteurs, autorisation de soutenance, jury, depot final.
7. L’article ajoute un flux editorial : screening, reviewer, revision, acceptation ou rejet.
8. L’archive publique expose seulement les documents autorises, avec recherche a facettes et fiches publiques.
9. L’**Assistant IA** permet l’interrogation en langage naturel de l’archive et retourne des reponses sourcees.
10. Le SSI est **natif** : apres validation finale, OpenScience Hub emet une preuve via eidStack-CMU.
11. Le QR code ne contient pas le document ; il pointe vers une URL de verification liee au credential et a la notice archivee.

## Livrables associes

- `OpenScienceHub_SequenceDiagrams_v1_complete.puml` : source PlantUML.
- `OpenScienceHub_SequenceDiagrams_v1_complete.pdf` : rendu PDF premium.
- `OpenScienceHub_SequenceDiagrams_v1_complete.md` : documentation textuelle detaillee.
