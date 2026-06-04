# OpenScience Hub - Diagrammes d'activite complets

## Objectif du livrable

Ce document de conception decrit les activites principales du systeme complet **OpenScience Hub**. Il ne se limite pas au MVP : il couvre le depot des travaux scientifiques, l'extraction IA, la validation academique, l'archivage institutionnel, la recherche a facettes, l'Assistant IA, la verification publique et le SSI natif via **eidStack-CMU**.

Le systeme reste centre sur le theme du hackathon : **archivage, classification et consultation des memoires, theses et articles scientifiques**, avec recherche indexee a facettes et extraction IA des metadonnees PDF.

---

## Vue 0 - Cycle de vie global

### Description

Cette vue resume le cycle de vie complet d'un travail scientifique depuis sa creation jusqu'a sa consultation publique et sa verification d'authenticite.

### Flux principal

1. Creation du dossier scientifique.
2. Upload du PDF et creation de la version initiale.
3. Extraction IA des metadonnees.
4. Verification et correction des metadonnees.
5. Soumission officielle.
6. Instruction academique.
7. Decision finale.
8. Archivage institutionnel.
9. Emission SSI native via eidStack-CMU.
10. Publication dans le catalogue public.
11. Consultation, Assistant IA et verification QR.

### Decisions

| Decision | Sorties possibles | Effet |
|---|---|---|
| Decision finale | validation | passage a l'archivage |
| Decision finale | correction | retour vers nouvelle version |
| Decision finale | rejet | cloture du dossier |

---

## Vue 1 - Depot, extraction IA et indexation

### Acteurs et couloirs

| Couloir | Responsabilite |
|---|---|
| Deposant | cree le dossier, fournit le PDF, valide les metadonnees proposees |
| Service Document | controle le PDF, calcule le hash, cree la version, extrait le texte |
| Service IA | extrait les metadonnees academiques et genere un score de confiance |
| Indexation | segmente le texte, genere les embeddings et rend le contenu exploitable |
| Systeme | met a jour le statut et notifie les validateurs |

### Donnees creees ou modifiees

| Objet | Champs impactes |
|---|---|
| `ResearchWork` | `type`, `title`, `abstract`, `status`, `institutionId`, `departmentId`, `createdById` |
| `Document` | `fileUrl`, `mimeType`, `sha256Hash`, `pageCount`, `uploadedById` |
| `DocumentVersion` | `versionNumber`, `fileUrl`, `sha256Hash`, `changeNote`, `createdAt` |
| `MetadataExtraction` | `extractedTitle`, `extractedAuthors`, `extractedKeywords`, `confidenceScore`, `modelName` |
| `AIChunk` | `chunkText`, `embedding`, `pageNumber`, `metadata` |

### Regles metier

- Seuls les fichiers PDF valides peuvent etre soumis au pipeline.
- Le hash SHA-256 est calcule des le depot initial.
- L'extraction IA propose des metadonnees, mais ne les impose pas.
- Le deposant doit confirmer ou corriger les metadonnees avant soumission.
- L'indexation documentaire alimente la recherche et l'Assistant IA.

---

## Vue 2 - Validation academique complete

### Objectif

Cette activite formalise un workflow unique, mais parametrable selon le type de travail : memoire, these ou article.

### Branches par type

#### Memoire

1. Verification par encadreur ou departement.
2. Autorisation de soutenance ou demande de correction.
3. Enregistrement de la soutenance.
4. Decision : valide, correction ou rejet.

#### These

1. Instruction par l'ecole doctorale.
2. Expertise par rapporteurs.
3. Autorisation de soutenance.
4. Depot final apres corrections eventuelles.
5. Decision de validation.

#### Article

1. Screening editorial.
2. Peer review.
3. Revision eventuelle.
4. Decision editoriale : accepte, revise ou rejete.

### Objets metier concernes

| Objet | Role dans l'activite |
|---|---|
| `ReviewAssignment` | affecte un validateur, rapporteur ou reviewer |
| `AcademicReview` | stocke les avis, commentaires et recommandations |
| `Decision` | formalise une decision academique ou editoriale |
| `AuditTrail` | conserve l'historique des actions |
| `WorkflowConfiguration` | permet de parametrer le processus par institution et type de document |

### Enums utilises

```text
ResearchWorkType = MASTER_THESIS | PHD_THESIS | ARTICLE | WORKING_PAPER | REPORT
ResearchWorkStatus = DRAFT | SUBMITTED | UNDER_REVIEW | CORRECTION_REQUIRED | VALIDATED | ARCHIVED | REJECTED
ReviewRecommendation = ACCEPT | MINOR_REVISION | MAJOR_REVISION | REJECT | FORWARD
DecisionType = AUTHORIZE_DEFENSE | REQUEST_CORRECTION | VALIDATE_AFTER_DEFENSE | ACCEPT_ARTICLE | REJECT | ARCHIVE
```

---

## Vue 3 - Archivage, preuve et SSI natif eidStack-CMU

### Principe

Dans cette conception, le SSI n'est pas une extension future. Il est integre nativement au moment ou le document est valide et archive.

### Flux principal

1. Verrouillage de la version finale.
2. Calcul du hash final.
3. Creation de l'enregistrement d'archive.
4. Resolution du DID institutionnel.
5. Selection du schema de credential.
6. Construction du sujet du credential.
7. Emission du Verifiable Credential via eidStack-CMU.
8. Creation du statut du credential.
9. Creation de la preuve de verification.
10. Generation du QR code.
11. Activation de la page publique de verification.
12. Publication dans le catalogue.

### Objets SSI

| Objet | Champs principaux | Description |
|---|---|---|
| `EidStackCMUConnection` | `baseUrl`, `tenantId`, `apiKeyRef`, `status` | connexion technique au service SSI |
| `DecentralizedIdentifier` | `did`, `method`, `controller`, `status` | DID de l'institution emettrice |
| `CredentialSchema` | `schemaId`, `name`, `version`, `attributes` | schema du credential academique |
| `CredentialSubject` | `subjectId`, `claims`, `documentHash` | donnees certifiees sur le document |
| `VerifiableCredential` | `credentialId`, `issuerDid`, `subjectId`, `issuedAt`, `proofType` | credential emis par eidStack-CMU |
| `CredentialStatusRecord` | `statusListId`, `status`, `revokedAt` | statut verifier/revoque/suspendu |
| `VerificationProof` | `proofId`, `verificationUrl`, `qrCodeUrl`, `documentHash` | preuve exploitee par la page publique |

### Regles metier

- Un document archive doit correspondre a une version finale verrouillee.
- Le hash final est inclus dans le credential ou dans son subject.
- La page de verification doit interroger le statut du credential.
- Si l'emission du VC echoue, le systeme doit marquer un statut `SSI_PENDING` ou bloquer l'archivage selon la politique institutionnelle.

---

## Vue 4 - Consultation publique, recherche a facettes et Assistant IA

### Modes d'utilisation

| Mode | Description |
|---|---|
| Catalogue | l'utilisateur recherche et filtre les travaux scientifiques |
| Assistant IA | l'utilisateur pose une question en langage naturel |
| Verification | l'utilisateur scanne un QR code ou saisit un identifiant |

### Recherche a facettes

Facettes principales :

```text
Type de document
Institution
Faculte
Departement
Filiere
Domaine scientifique
Annee
Auteur
Encadreur
Mots-cles
Langue
Statut
Visibilite
```

### Assistant IA

L'Assistant IA peut :

- rechercher dans les documents archives ;
- resumer un document ;
- proposer des travaux similaires ;
- generer une fiche de lecture ;
- repondre avec des sources ;
- refuser de repondre si aucune source pertinente n'est trouvee.

### Verification publique

La verification combine :

1. l'identifiant de preuve ;
2. le hash du document ;
3. le Verifiable Credential ;
4. le statut du credential ;
5. la fiche archivee du document.

---

## Vue 5 - Administration et parametrage institutionnel

### Objectif

Ce diagramme montre que la plateforme est configurable par institution. Elle ne force pas un workflow unique pour toutes les universites.

### Parametres administrables

| Domaine | Elements configurables |
|---|---|
| Referentiels | institutions, facultes, departements, filieres, domaines scientifiques |
| Acces | roles, permissions, utilisateurs, validateurs |
| Workflows | etapes par type de document, ordre des validations, roles autorises |
| SSI | connexion eidStack-CMU, DID, schemas de credentials |
| Catalogue | facettes, visibilite, regles de diffusion |
| Pilotage | statistiques, logs, audit trail |

---

## Synthese des activites critiques

| Activite | Priorite systeme | Pourquoi elle est critique |
|---|---:|---|
| Depot PDF | Haute | point d'entree de tout dossier scientifique |
| Extraction IA | Haute | bonus IA et reduction de la saisie manuelle |
| Validation academique | Haute | donne une valeur institutionnelle au dossier |
| Archivage | Haute | coeur du theme OpenScience Hub |
| Recherche a facettes | Haute | exigence explicite du theme |
| Assistant IA | Moyenne/Haute | valeur differenciante et exploration intelligente |
| SSI eidStack-CMU | Haute | preuve native d'authenticite et coherence avec votre vision |
| Administration | Haute | rend le systeme adaptable aux institutions |

---

## Livrables inclus

- `OpenScienceHub_ActivityDiagrams_v1_complete.pdf` : rendu premium lisible.
- `OpenScienceHub_ActivityDiagrams_v1_complete.puml` : source PlantUML.
- `OpenScienceHub_ActivityDiagrams_v1_complete.md` : documentation textuelle detaillee.
- `OpenScienceHub_ActivityDiagrams_v1_complete_deliverables.zip` : pack complet.
