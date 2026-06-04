# OpenScience Hub - Description détaillée du diagramme de classes v4.0

## 1. Intention du modèle

Ce diagramme de classes modélise **OpenScience Hub** comme une plateforme institutionnelle qui transforme les mémoires, thèses et articles en **dossiers scientifiques structurés**. Le modèle couvre le dépôt, l'extraction IA de métadonnées, la validation académique, l'archivage, la recherche à facettes, l'assistant IA et la preuve d'authenticité **native via eidStack-CMU**.

Le principe central est le suivant : le PDF n'est pas l'objet métier principal. L'objet principal est `ScientificWork`, c'est-à-dire le dossier académique complet. Un travail scientifique possède des versions de document, des contributeurs, des validations, des décisions, une archive et une preuve SSI.

## 2. Vue globale des agrégats

Les agrégats principaux sont :

- `Institution` : racine du référentiel académique. Elle possède des facultés, départements, programmes, utilisateurs, travaux scientifiques et une configuration SSI eidStack-CMU.
- `User` : compte applicatif utilisé par les déposants, validateurs, administrateurs, archivistes et utilisateurs internes.
- `ScientificWork` : racine métier du dossier scientifique. Il représente un mémoire, une thèse ou un article.
- `DocumentVersion` : version physique ou numérique d'un PDF lié au dossier.
- `ValidationAssignment`, `Review`, `Decision` : classes qui structurent le processus de validation académique.
- `ArchiveRecord` : publication institutionnelle contrôlée d'un travail validé.
- `SearchIndexEntry`, `AIKnowledgeChunk`, `AIQueryLog` : classes de recherche, d'indexation et d'assistant IA.
- `VerificationProof` et `VerifiableCredential` : classes de preuve d'authenticité. Le SSI est natif et repose sur `eidStack-CMU`.

## 3. Référentiel académique

### 3.1 `Institution`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant technique unique de l'institution. |
| `name` | `String` | Nom officiel : Université, Institut, Revue ou organisme de recherche. |
| `type` | `InstitutionType` | Type contrôlé : université publique, université privée, institut, revue. |
| `country` | `String` | Pays de rattachement. |
| `city` | `String` | Ville principale. |
| `officialEmail` | `String?` | Adresse officielle de contact, optionnelle. |
| `websiteUrl` | `String?` | Site web officiel, optionnel. |
| `createdAt` | `DateTime` | Date de création de l'enregistrement. |

Relations :

- `Institution 1 o-- 0..* Faculty` : une institution peut avoir plusieurs facultés.
- `Institution 1 -- 0..* User` : les utilisateurs peuvent être affiliés à une institution.
- `Institution 1 -- 0..* ScientificWork` : les travaux sont rattachés à une institution.
- `Institution 1 -- 1 EidStackCMUConnection` : chaque institution active possède une configuration SSI.
- `Institution 1 -- 1 DecentralizedIdentifier` : l'institution possède un DID émetteur.

### 3.2 `Faculty`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant unique. |
| `name` | `String` | Nom de la faculté. |
| `code` | `String` | Code court utilisé pour les références internes. |

Relation : `Faculty 1 o-- 0..* Department`.

### 3.3 `Department`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant unique. |
| `name` | `String` | Nom du département. |
| `code` | `String` | Code du département. |

Relations :

- `Department 1 o-- 0..* AcademicProgram`.
- `Department 1 -- 0..* ScientificWork`.

### 3.4 `AcademicProgram`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant unique. |
| `name` | `String` | Nom de la filière ou du programme. |
| `level` | `AcademicLevel` | Niveau académique associé. |
| `code` | `String?` | Code optionnel du programme. |

Relation : `AcademicProgram 0..1 -- 0..* ScientificWork`. Le programme peut être absent pour certains articles scientifiques.

## 4. Identité, rôles et permissions

### 4.1 `User`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant utilisateur. |
| `fullName` | `String` | Nom complet. |
| `email` | `String` | Email unique. |
| `passwordHash` | `String` | Mot de passe haché, jamais stocké en clair. |
| `status` | `UserStatus` | Statut du compte. |
| `createdAt` | `DateTime` | Date de création. |
| `lastLoginAt` | `DateTime?` | Dernière connexion, optionnelle. |

Un `User` peut être déposant, validateur, administrateur, archiviste, reviewer, rapporteur ou membre de jury selon ses rôles.

### 4.2 `Role`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant du rôle. |
| `code` | `String` | Code système : `DEPOSANT`, `VALIDATOR`, `ADMIN`, etc. |
| `label` | `String` | Libellé lisible. |
| `scope` | `RoleScope` | Portée du rôle : globale, institution, département ou dossier. |

### 4.3 `Permission`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant de permission. |
| `code` | `String` | Code : `WORK_SUBMIT`, `WORK_VALIDATE`, `ARCHIVE_PUBLISH`, etc. |
| `description` | `String` | Description métier. |

### 4.4 `UserRoleAssignment`

Cette classe évite de mettre les rôles directement dans `User`. Elle permet de donner un rôle à un utilisateur dans un contexte précis.

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `assignedAt` | `DateTime` | Date d'affectation. |
| `scopeType` | `ScopeType` | Type de périmètre : plateforme, institution, département ou dossier. |
| `scopeId` | `UUID?` | Identifiant du périmètre concerné. |

Relations :

- `User 1 -- 0..* UserRoleAssignment`.
- `Role 1 -- 0..* UserRoleAssignment`.

### 4.5 `RolePermission`

Classe de jointure entre `Role` et `Permission`.

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `grantedAt` | `DateTime` | Date d'octroi de la permission au rôle. |

## 5. Dossier scientifique

### 5.1 `ScientificWork`

`ScientificWork` est la classe centrale du modèle. Elle représente un mémoire, une thèse ou un article, indépendamment du nombre de fichiers et de versions.

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant unique. |
| `referenceCode` | `String` | Code public ou institutionnel : exemple `OSH-UY1-INF-2026-0001`. |
| `type` | `WorkType` | `MEMOIRE`, `THESE` ou `ARTICLE`. |
| `title` | `String` | Titre validé ou en cours de validation. |
| `abstractText` | `Text` | Résumé du travail. |
| `language` | `String` | Langue principale : `fr`, `en`, etc. |
| `academicYear` | `String` | Année académique : exemple `2025-2026`. |
| `keywords` | `String[*]` | Liste de mots-clés validés. |
| `status` | `WorkStatus` | État courant dans le workflow. |
| `visibility` | `Visibility` | Niveau de visibilité du dossier. |
| `createdAt` | `DateTime` | Date de création. |
| `submittedAt` | `DateTime?` | Date de soumission officielle. |
| `updatedAt` | `DateTime` | Dernière modification. |

Relations :

- `ScientificWork 1 *-- 1..* WorkContributor` : au moins un auteur.
- `ScientificWork 1 *-- 1..* DocumentVersion` : au moins une version PDF.
- `ScientificWork 1 *-- 0..* ValidationAssignment` : validations et reviews affectées.
- `ScientificWork 1 *-- 0..* Decision` : décisions prises pendant le cycle de vie.
- `ScientificWork 1 *-- 0..1 ArchiveRecord` : un dossier n'a qu'une archive finale active.

### 5.2 `WorkContributor`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `contributorType` | `ContributorType` | Auteur, encadreur, rapporteur, reviewer, membre de jury, etc. |
| `displayName` | `String` | Nom affiché dans la fiche publique. |
| `email` | `String?` | Email optionnel. |
| `orcid` | `String?` | Identifiant ORCID optionnel pour les chercheurs. |
| `orderIndex` | `Integer` | Ordre d'affichage des contributeurs. |

Relation optionnelle : `WorkContributor 0..* -- 0..1 User`. Un contributeur peut exister sans compte applicatif.

### 5.3 `DocumentVersion`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `versionNumber` | `Integer` | Numéro de version : 1, 2, 3... |
| `versionType` | `VersionType` | Soumission initiale, version corrigée, version finale archivée. |
| `fileName` | `String` | Nom original ou normalisé du fichier. |
| `fileUrl` | `String` | Emplacement du PDF dans le stockage. |
| `mimeType` | `String` | Type MIME, normalement `application/pdf`. |
| `pageCount` | `Integer?` | Nombre de pages si détecté. |
| `sha256Hash` | `String` | Empreinte SHA-256 du fichier. Sert à l'authenticité. |
| `changeNote` | `Text?` | Description des changements. |
| `isFinal` | `Boolean` | Indique la version finale archivée. |
| `uploadedAt` | `DateTime` | Date d'upload. |

Contraintes recommandées :

- Une seule `DocumentVersion` finale par `ScientificWork`.
- `sha256Hash` doit être recalculé à chaque upload.
- Une version finale ne doit plus être modifiée ; une correction crée une nouvelle version.

### 5.4 `MetadataExtraction`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `modelName` | `String` | Modèle IA utilisé. |
| `extractedTitle` | `String?` | Titre proposé par l'IA. |
| `extractedAbstract` | `Text?` | Résumé extrait ou généré. |
| `extractedKeywords` | `String[*]` | Mots-clés suggérés. |
| `suggestedDomain` | `String?` | Domaine scientifique proposé. |
| `detectedLanguage` | `String?` | Langue détectée. |
| `confidenceScore` | `Decimal` | Score de confiance global, de 0 à 1. |
| `rawJson` | `JSON` | Réponse brute du modèle pour audit. |
| `status` | `ExtractionStatus` | État de l'extraction. |
| `createdAt` | `DateTime` | Date de création. |
| `reviewedAt` | `DateTime?` | Date de revue humaine. |

Cette classe est volontairement séparée de `ScientificWork` : l'IA propose, l'humain valide.

## 6. Validation académique

### 6.1 `ValidationAssignment`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `assignmentType` | `AssignmentType` | Type d'affectation : encadreur, comité, peer review, contrôle archive. |
| `status` | `AssignmentStatus` | État de l'affectation. |
| `assignedAt` | `DateTime` | Date d'affectation. |
| `dueAt` | `DateTime?` | Échéance optionnelle. |

Relations :

- `ScientificWork 1 *-- 0..* ValidationAssignment`.
- `ValidationAssignment 1 -- 1 User` : personne assignée.
- `ValidationAssignment 1 *-- 0..* Review`.

### 6.2 `Review`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `comment` | `Text` | Avis du validateur. |
| `recommendation` | `Recommendation` | Acceptation, correction mineure, correction majeure, rejet. |
| `conformityScore` | `Integer?` | Score optionnel de conformité. |
| `createdAt` | `DateTime` | Date de l'avis. |

Relation : un `Review` est rédigé par un `User` et peut viser une `DocumentVersion` précise.

### 6.3 `CorrectionRequest`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `message` | `Text` | Détail des corrections demandées. |
| `status` | `CorrectionStatus` | Ouverte, résolue ou annulée. |
| `requestedAt` | `DateTime` | Date de demande. |
| `resolvedAt` | `DateTime?` | Date de résolution. |

### 6.4 `DefenseSession`

Cette classe concerne surtout les mémoires et les thèses. Elle n'est pas obligatoire pour les articles.

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `sessionType` | `DefenseSessionType` | Soutenance Master ou Doctorat. |
| `scheduledAt` | `DateTime` | Date et heure de soutenance. |
| `location` | `String?` | Lieu ou lien de visioconférence. |
| `result` | `DefenseResult?` | Résultat après délibération. |

Relation : `DefenseSession 0..1 -- 0..* User : juryMembers`.

### 6.5 `Decision`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `decisionType` | `DecisionType` | Type de décision formelle. |
| `comment` | `Text?` | Commentaire optionnel. |
| `decidedAt` | `DateTime` | Date de décision. |

Une `Decision` doit être prise par un utilisateur habilité (`decidedBy`) et peut concerner une version précise du document.

### 6.6 `WorkflowEvent`

Journal d'audit du workflow.

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `fromStatus` | `WorkStatus?` | Statut avant l'événement. |
| `toStatus` | `WorkStatus` | Nouveau statut. |
| `eventType` | `WorkflowEventType` | Type d'événement. |
| `comment` | `Text?` | Commentaire optionnel. |
| `createdAt` | `DateTime` | Date de l'événement. |

## 7. Archivage institutionnel

### `ArchiveRecord`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant d'archive. |
| `publicSlug` | `String` | URL courte publique. |
| `accessLevel` | `AccessLevel` | Accès libre, métadonnées seulement ou accès restreint. |
| `archivedAt` | `DateTime` | Date d'archivage institutionnel. |
| `publishedAt` | `DateTime?` | Date de publication publique. |
| `isDownloadAllowed` | `Boolean` | Autorise ou non le téléchargement du PDF. |

Relations :

- `ScientificWork 1 *-- 0..1 ArchiveRecord`.
- `ArchiveRecord 1 -- 1 DocumentVersion` : la version finale archivée.
- `ArchiveRecord 1 *-- 1 VerificationProof` : preuve native obligatoire après archivage.

## 8. Recherche à facettes

### 8.1 `SearchIndexEntry`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `normalizedTitle` | `String` | Titre normalisé pour recherche. |
| `fullTextRef` | `String` | Référence vers l'index plein texte. |
| `indexedAt` | `DateTime` | Date d'indexation. |
| `status` | `IndexStatus` | État de l'indexation. |

Relation : `ArchiveRecord 1 *-- 1 SearchIndexEntry`.

### 8.2 `FacetDefinition`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `code` | `String` | Code de facette : `type`, `year`, `department`, etc. |
| `label` | `String` | Libellé affiché. |
| `sourceField` | `String` | Champ source utilisé pour construire la facette. |
| `dataType` | `FacetDataType` | Type : texte, nombre, date ou enum. |
| `isEnabled` | `Boolean` | Active ou désactive la facette. |

### 8.3 `SearchFacetValue`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `value` | `String` | Valeur brute affichée. |
| `normalizedValue` | `String` | Valeur normalisée pour recherche. |
| `countHint` | `Integer?` | Nombre estimatif de résultats. |

Relation : un `SearchIndexEntry` possède plusieurs `SearchFacetValue`, et chaque valeur est liée à une `FacetDefinition`.

## 9. Assistant IA

Le produit parle d'**assistant IA**, pas d'assistant RAG. Techniquement, l'assistant IA peut utiliser une architecture de récupération augmentée : segmentation des documents, enrichissement par métadonnées, embeddings, récupération de passages, puis génération d'une réponse sourcée.

### 9.1 `AIKnowledgeChunk`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant du segment. |
| `chunkText` | `Text` | Passage textuel extrait du document. |
| `pageStart` | `Integer?` | Page de début. |
| `pageEnd` | `Integer?` | Page de fin. |
| `embeddingRef` | `String` | Référence vers le vecteur en base vectorielle. |
| `metadataJson` | `JSON` | Métadonnées du chunk : titre, auteur, département, type, année. |
| `createdAt` | `DateTime` | Date de création. |

Relation : `DocumentVersion 1 *-- 0..* AIKnowledgeChunk`.

### 9.2 `AIModelConfig`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `provider` | `String` | Fournisseur : OpenAI, Mistral, local, etc. |
| `modelName` | `String` | Nom du modèle. |
| `purpose` | `AIPurpose` | Usage : extraction, recherche, résumé, aide validation. |
| `isActive` | `Boolean` | Modèle actif ou non. |

### 9.3 `AIQueryLog`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `question` | `Text` | Question posée par l'utilisateur. |
| `answer` | `Text` | Réponse générée. |
| `answerStatus` | `AIAnswerStatus` | Répondu, aucun contexte, échec, signalé. |
| `createdAt` | `DateTime` | Date de la requête. |

### 9.4 `AIAnswerCitation`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `excerpt` | `Text` | Extrait cité. |
| `score` | `Decimal` | Score de pertinence. |
| `pageNumber` | `Integer?` | Page citée si connue. |

Relation : `AIAnswerCitation 1 -- 1 AIKnowledgeChunk`. Toute réponse importante doit pouvoir citer ses sources.

## 10. SSI natif via eidStack-CMU

Le SSI n'est pas une extension. Il est intégré nativement au cycle d'archivage. Lorsqu'un travail est validé et archivé, la plateforme émet une preuve vérifiable via `eidStack-CMU`.

### 10.1 `EidStackCMUConnection`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant de configuration. |
| `baseUrl` | `String` | URL du service eidStack-CMU. |
| `tenantId` | `String?` | Tenant optionnel si l'instance est multi-tenant. |
| `environment` | `String` | `dev`, `staging`, `production`. |
| `isActive` | `Boolean` | Configuration active ou non. |
| `createdAt` | `DateTime` | Date de création. |

Relation : `Institution 1 -- 1 EidStackCMUConnection`.

### 10.2 `DecentralizedIdentifier`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant local. |
| `did` | `String` | DID complet : exemple `did:web:uy1.cm`. |
| `method` | `String` | Méthode DID : `web`, `key`, `indy`, etc. |
| `controllerType` | `DIDControllerType` | Institution, utilisateur ou plateforme. |
| `createdAt` | `DateTime` | Date de création. |

Relations :

- Une institution possède un DID émetteur.
- Un utilisateur peut posséder un DID holder optionnel.

### 10.3 `CredentialSchema`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `schemaUri` | `String` | URI du schéma de credential. |
| `schemaName` | `String` | Nom du schéma : `ScientificWorkArchiveCredential`. |
| `version` | `String` | Version du schéma. |

### 10.4 `CredentialSubject`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `subjectDid` | `String?` | DID du holder si disponible. |
| `subjectType` | `CredentialSubjectType` | Type du sujet : travail scientifique, auteur, institution. |
| `claimsJson` | `JSON` | Claims métier : titre, auteur, type, institution, hash, statut. |

Relations :

- `CredentialSubject 1 -- 1 ScientificWork`.
- `CredentialSubject 1 -- 1 DocumentVersion`.

### 10.5 `VerifiableCredential`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant local. |
| `credentialId` | `String` | Identifiant global du VC. |
| `issuerDid` | `String` | DID de l'institution émettrice. |
| `issuanceDate` | `DateTime` | Date d'émission. |
| `expirationDate` | `DateTime?` | Date d'expiration optionnelle. |
| `proofFormat` | `ProofFormat` | Format : JWT VC, JSON-LD VC ou SD-JWT VC. |
| `status` | `CredentialStatus` | Émis, suspendu, révoqué ou expiré. |
| `rawCredentialJson` | `JSON` | Credential complet retourné par eidStack-CMU. |

Relations :

- `VerificationProof 1 *-- 1 VerifiableCredential`.
- `VerifiableCredential 1 -- 1 CredentialSubject`.
- `VerifiableCredential 1 -- 1 CredentialSchema`.
- `VerifiableCredential 1 -- 1 CredentialStatusRecord`.
- `VerifiableCredential 1 -- 1 DecentralizedIdentifier : issuer`.

### 10.6 `CredentialStatusRecord`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `statusListUrl` | `String?` | URL de statut ou de révocation si disponible. |
| `revocationReason` | `String?` | Motif de révocation. |
| `updatedAt` | `DateTime` | Dernière mise à jour. |

### 10.7 `VerificationProof`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `proofCode` | `String` | Code court public : exemple `OSH-VC-2026-0001`. |
| `proofType` | `ProofType` | Type de preuve. Pour le MVP natif, `VERIFIABLE_CREDENTIAL`. |
| `documentHash` | `String` | Hash SHA-256 de la version finale. |
| `verificationUrl` | `String` | URL publique de vérification. |
| `qrCodeUrl` | `String` | URL de l'image QR code. |
| `issuedAt` | `DateTime` | Date d'émission. |
| `status` | `ProofStatus` | Active, révoquée ou expirée. |

Le QR code ne stocke pas le credential complet. Il pointe vers `verificationUrl`, qui permet au portail public de vérifier le hash, le statut, le credential et l'émetteur.

### 10.8 `VerificationCheck`

| Champ | Type | Description |
|---|---:|---|
| `id` | `UUID` | Identifiant. |
| `checkedAt` | `DateTime` | Date de vérification. |
| `result` | `VerificationResult` | Résultat : valide, hash invalide, introuvable, révoqué, expiré. |
| `clientIpHash` | `String?` | Hash de l'adresse IP, pour éviter de stocker l'IP brute. |
| `userAgentHash` | `String?` | Hash du user-agent. |

## 11. Énumérations

### 11.1 Dossier scientifique

| Enum | Valeurs | Utilisation |
|---|---|---|
| `WorkType` | `MEMOIRE`, `THESE`, `ARTICLE` | Type du travail scientifique. |
| `WorkStatus` | `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `CORRECTION_REQUESTED`, `RESUBMITTED`, `VALIDATED`, `ARCHIVED`, `REJECTED` | Cycle de vie du dossier. |
| `Visibility` | `PRIVATE`, `INSTITUTION_ONLY`, `PUBLIC`, `RESTRICTED` | Visibilité métier du dossier. |
| `ContributorType` | `AUTHOR`, `SUPERVISOR`, `CO_SUPERVISOR`, `REVIEWER`, `RAPPORTEUR`, `JURY_MEMBER` | Rôle d'un contributeur. |
| `VersionType` | `INITIAL_SUBMISSION`, `CORRECTED_VERSION`, `FINAL_ARCHIVE` | Nature d'une version PDF. |
| `ExtractionStatus` | `PENDING`, `EXTRACTED`, `REVIEWED`, `FAILED` | État d'une extraction IA. |

### 11.2 Validation

| Enum | Valeurs | Utilisation |
|---|---|---|
| `AssignmentType` | `SUPERVISOR_REVIEW`, `SCIENTIFIC_COMMITTEE`, `PEER_REVIEW`, `ARCHIVE_CONTROL` | Type d'affectation. |
| `AssignmentStatus` | `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` | État de l'affectation. |
| `Recommendation` | `ACCEPT`, `MINOR_CORRECTION`, `MAJOR_CORRECTION`, `REJECT` | Recommandation d'un avis. |
| `DecisionType` | `AUTHORIZE_DEFENSE`, `VALIDATE_AFTER_DEFENSE`, `REQUEST_CORRECTION`, `ACCEPT_ARTICLE`, `REJECT`, `ARCHIVE` | Décision formelle. |
| `CorrectionStatus` | `OPEN`, `RESOLVED`, `CANCELLED` | Statut d'une correction. |
| `DefenseSessionType` | `MASTER_DEFENSE`, `PHD_DEFENSE` | Type de soutenance. |
| `DefenseResult` | `PASSED`, `PASSED_WITH_CORRECTIONS`, `FAILED`, `POSTPONED` | Résultat de soutenance. |
| `WorkflowEventType` | `SUBMISSION`, `ASSIGNMENT`, `REVIEW`, `CORRECTION`, `DECISION`, `ARCHIVE`, `CREDENTIAL_ISSUED` | Type d'événement audité. |

### 11.3 Archive, recherche et IA

| Enum | Valeurs | Utilisation |
|---|---|---|
| `AccessLevel` | `OPEN_ACCESS`, `METADATA_ONLY`, `RESTRICTED_ACCESS` | Niveau d'accès public. |
| `IndexStatus` | `PENDING`, `INDEXED`, `FAILED` | Statut de l'index de recherche. |
| `FacetDataType` | `TEXT`, `NUMBER`, `DATE`, `ENUM` | Type de facette. |
| `AIPurpose` | `METADATA_EXTRACTION`, `SCIENTIFIC_SEARCH`, `SUMMARY`, `VALIDATION_ASSISTANCE` | Usage du modèle IA. |
| `AIAnswerStatus` | `ANSWERED`, `NO_CONTEXT_FOUND`, `FAILED`, `FLAGGED` | Résultat d'une réponse IA. |

### 11.4 SSI natif via eidStack-CMU

| Enum | Valeurs | Utilisation |
|---|---|---|
| `ProofType` | `HASH_QR`, `VERIFIABLE_CREDENTIAL` | Type de preuve produite. |
| `ProofStatus` | `ACTIVE`, `REVOKED`, `EXPIRED` | État de la preuve publique. |
| `VerificationResult` | `VALID`, `INVALID_HASH`, `NOT_FOUND`, `REVOKED`, `EXPIRED` | Résultat d'une vérification. |
| `DIDControllerType` | `INSTITUTION`, `USER`, `PLATFORM` | Propriétaire du DID. |
| `CredentialSubjectType` | `SCIENTIFIC_WORK`, `AUTHOR`, `INSTITUTION` | Sujet du credential. |
| `ProofFormat` | `JWT_VC`, `JSON_LD_VC`, `SD_JWT_VC` | Format technique du VC. |
| `CredentialStatus` | `ISSUED`, `SUSPENDED`, `REVOKED`, `EXPIRED` | Statut du credential. |

### 11.5 Identité et référentiel

| Enum | Valeurs | Utilisation |
|---|---|---|
| `UserStatus` | `ACTIVE`, `SUSPENDED`, `PENDING` | Statut du compte utilisateur. |
| `RoleScope` | `GLOBAL`, `INSTITUTION`, `DEPARTMENT`, `WORK` | Portée d'un rôle. |
| `ScopeType` | `PLATFORM`, `INSTITUTION`, `FACULTY`, `DEPARTMENT`, `SCIENTIFIC_WORK` | Périmètre d'affectation d'un rôle. |
| `InstitutionType` | `PUBLIC_UNIVERSITY`, `PRIVATE_UNIVERSITY`, `RESEARCH_INSTITUTE`, `JOURNAL` | Type d'institution. |
| `AcademicLevel` | `BACHELOR`, `MASTER`, `DOCTORATE`, `RESEARCH_ARTICLE` | Niveau académique ou éditorial. |

## 12. Règles métier structurantes

1. Un `ScientificWork` doit avoir au moins un `WorkContributor` de type `AUTHOR`.
2. Un `ScientificWork` doit avoir au moins une `DocumentVersion`.
3. Une seule `DocumentVersion` peut avoir `isFinal = true` pour un même `ScientificWork`.
4. Un `ArchiveRecord` ne peut être créé que si le dossier est `VALIDATED` ou prêt pour archivage.
5. Un `ArchiveRecord` doit référencer exactement une version finale.
6. Un `VerificationProof` est obligatoire après l'archivage.
7. Une preuve d'authenticité native doit produire un `VerifiableCredential` via `eidStack-CMU`.
8. Le `documentHash` dans `VerificationProof`, `DocumentVersion.sha256Hash` et les claims du `CredentialSubject` doivent correspondre.
9. Une réponse de l'assistant IA doit être rattachée à des `AIAnswerCitation` lorsque le contexte existe.
10. Le module IA ne valide pas un travail à la place du comité ; il assiste la recherche, l'extraction, la synthèse et la validation.

## 13. Lecture rapide du cycle complet

1. Un `User` crée un `ScientificWork`.
2. Il ajoute des `WorkContributor` et une première `DocumentVersion`.
3. Le système crée une `MetadataExtraction` pour proposer les métadonnées.
4. Le dossier passe de `DRAFT` à `SUBMITTED`.
5. Des `ValidationAssignment` sont créées pour les validateurs.
6. Les validateurs produisent des `Review`, des `CorrectionRequest` ou des `Decision`.
7. Pour un mémoire ou une thèse, une `DefenseSession` peut être planifiée.
8. Après validation finale, une version `FINAL_ARCHIVE` est verrouillée.
9. Un `ArchiveRecord` publie la fiche dans le portail public.
10. Le contenu est indexé via `SearchIndexEntry` et `AIKnowledgeChunk`.
11. Une `VerificationProof` est créée.
12. `eidStack-CMU` émet un `VerifiableCredential` lié au dossier, au hash du PDF et à l'institution.
13. Le QR code ouvre `verificationUrl` et crée un `VerificationCheck` lors de chaque vérification publique.
