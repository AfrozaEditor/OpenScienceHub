# OpenScience Hub — Glossaire

> Vocabulaire métier et SSI. Règle produit : on dit **« Assistant IA »** (pas « RAG ») et **« e-IDStack de IDS »** (pas « eidStack-CMU »/« CMU ») dans le produit et l'API.

---

## Métier / produit

| Terme | Définition |
|---|---|
| **OpenScience Hub** | La plateforme : archiver, classifier, valider, explorer, vérifier les travaux scientifiques. |
| **Dossier scientifique (`ScientificWork`)** | Objet métier central : mémoire, thèse ou article, avec ses versions, métadonnées, avis, décisions, archive et preuve. Le PDF n'est qu'une pièce du dossier. |
| **Mémoire** | Travail de fin de cycle (Licence/Master/Ingénieur). |
| **Thèse** | Travail doctoral (validation renforcée : expertise, soutenance). |
| **Article** | Manuscrit/publication soumis à un processus éditorial (screening, peer review). |
| **Version de document (`DocumentVersion`)** | Un PDF versionné rattaché au dossier, avec hash SHA-256. La version finale est verrouillée à l'archivage. |
| **Métadonnées** | Titre, auteur, résumé, mots-clés, domaine, etc. Proposées par l'IA, validées par un humain. |
| **Workflow de validation** | Suite d'étapes (soumission → instruction → avis → corrections → décision → archivage), paramétrable par institution et type. |
| **Avis (`Review`)** | Contribution d'un validateur (recommandation + commentaire), pas une décision finale. |
| **Correction (`CorrectionRequest`)** | Demande de modification adressée au déposant ; une correction « bloquante » empêche la re-soumission/décision. |
| **Décision (`Decision`)** | Acte formel d'un acteur habilité qui fait avancer le dossier. |
| **Soutenance (`DefenseSession`)** | Session de défense (Master/Doctorat) avec jury et résultat. |
| **Archive (`ArchiveRecord`)** | Publication institutionnelle contrôlée d'un travail validé (version finale + visibilité). |
| **Recherche à facettes** | Recherche filtrée (type, institution, département, année, auteur, mots-clés, statut...). Exigence centrale du thème. |
| **Assistant IA** | Interrogation en langage naturel de l'archive, avec réponses **sourcées**. N'a aucun pouvoir de décision académique. |
| **Travaux similaires** | Détection de proximité scientifique (pas un détecteur de plagiat complet). |
| **Preuve d'authenticité (`VerificationProof`)** | Élément public permettant de vérifier un document (hash + QR + lien + statut), adossé à un Verifiable Credential. |
| **QR code** | Image pointant vers `verification_url` (`/verify/{code}`). Ne contient pas le document ni le credential. |
| **Vérification publique** | Page/endpoint qui confirme : hash document + statut dossier + statut VC + signature. |
| **Visibilité** | Niveau d'accès d'un dossier : `PUBLIC`, `INSTITUTION_ONLY`, `RESTRICTED`, `PRIVATE`. |
| **Portail** | Espace produit : Déposant, Validation académique, Archive publique, Administration. |

## Acteurs

| Terme | Définition |
|---|---|
| **Déposant** | Auteur qui crée et soumet un dossier (étudiant, doctorant, enseignant-chercheur). |
| **Validateur** | Acteur académique : encadreur, rapporteur, reviewer, chef de département, comité scientifique, école doctorale, archiviste. |
| **Administrateur institutionnel** | Configure et pilote une institution. |
| **Super administrateur** | Gère plusieurs institutions et la config globale. |
| **Public / Vérificateur** | Consulte le catalogue et vérifie l'authenticité. |

## SSI / identité numérique

| Terme | Définition |
|---|---|
| **SSI (Self-Sovereign Identity)** | Identité auto-souveraine : l'utilisateur/institution contrôle ses preuves vérifiables. |
| **e-IDStack de IDS** | La couche SSI du monorepo (`ids/eidStack-CMU`) qui émet et vérifie les Verifiable Credentials (Credo-TS, AnonCreds, Indy-VDR, Askar). |
| **Issuer** | Émetteur d'une preuve : l'institution. |
| **Holder / dépositaire** | Détenteur de la preuve : **la plateforme OpenScience Hub** (stockée en base). Pas de wallet personnel dans ce produit. |
| **Verifier** | Vérificateur : public, recruteur, jury, autre université — via une **page web** (QR/lien), sans wallet. |
| **`e-IDapp` (wallet mobile)** | Appli React Native d'IDS pour porter des credentials. **Non utilisée** par OpenScience Hub (option roadmap). |
| **DID (`DecentralizedIdentifier`)** | Identifiant décentralisé (ex. `did:web:uy1.cm`). |
| **Verifiable Credential (VC)** | Attestation numérique signée (ici `ScientificWorkArchiveCredential`). |
| **CredentialSubject** | Sujet/claims du credential (titre, auteur, hash, institution, statut...). |
| **Credential definition / Schema** | Définition AnonCreds du credential émis par e-IDStack. |
| **OOB (Out-of-Band)** | Mode d'émission/connexion par invitation (URL/QR) accepté par le wallet. |
| **Hash SHA-256** | Empreinte du PDF. Garantit l'intégrité : toute modification change le hash. |
| **Statut de credential** | `ISSUED`, `ACTIVE`, `SUSPENDED`, `REVOKED`, `EXPIRED`. |
| **`SSI_PENDING`** | État interne quand l'émission via e-IDStack échoue/est différée. |

## IA / technique (interne, hors interface)

| Terme | Définition |
|---|---|
| **`simba_ia`** | Microservice Python/FastAPI : extraction de métadonnées PDF + Assistant IA (RAG). |
| **RAG (Retrieval-Augmented Generation)** | Technique interne de l'Assistant IA : récupérer des passages pertinents puis générer une réponse sourcée. Terme **non exposé** dans le produit. |
| **Embedding** | Vecteur représentant un passage de texte (stocké via `pgvector`). |
| **Chunk (`AIKnowledgeChunk`)** | Segment de document indexé avec ses métadonnées. |
| **pgvector** | Extension PostgreSQL pour la recherche vectorielle. |
| **Extraction de métadonnées** | Détection automatique (titre, auteur, résumé, mots-clés, domaine...) à partir du PDF. |

## Statuts de dossier (`WorkStatus`)

`BROUILLON` · `SOUMIS` · `EN_INSTRUCTION` · `EN_EXPERTISE` · `CORRECTION_DEMANDEE` · `RE_SOUMIS` · `VALIDE` · `VALIDE_APRES_SOUTENANCE` · `ARCHIVABLE` · `ARCHIVE` · `REJETE`. Le flux article conserve aussi des statuts éditoriaux comme `UNDER_REVIEW`, `RESUBMITTED`, `ACCEPTED` et `PUBLISHED`.

## Branding

| Élément | Valeur |
|---|---|
| Palette | Noir `#050505`, Rouge `#C40012`, Rouge profond `#8B000B`, Gris `#9CA3AF`, Argent `#E5E7EB`, Blanc `#FFFFFF` |
| Fonctionnel | Succès `#10B981`, Avertissement `#F59E0B`, Erreur `#EF4444` |
| Slogan | « Le hub intelligent des travaux scientifiques universitaires » |
| Promesse | Archiver. Valider. Explorer. Vérifier. |
