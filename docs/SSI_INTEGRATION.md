# OpenScience Hub — Intégration SSI via e-IDStack de IDS

> Contrat d'intégration entre le **backend Django** et la couche SSI **e-IDStack de IDS** (`../ids/eidStack-CMU`, NestJS + Credo-TS / AnonCreds / Indy-VDR / Askar). Voir [ARCHITECTURE.md](ARCHITECTURE.md), [DATA_MODEL.md](DATA_MODEL.md).

---

## 1. Principe

- Le backend **orchestre** ; e-IDStack **émet et vérifie** les Verifiable Credentials. Aucune cryptographie « maison » côté backend.
- **Modèle SANS wallet** : **Issuer** = Institution · **Holder/dépositaire** = **la plateforme OpenScience Hub** (le credential est stocké en base, pas dans une appli mobile) · **Verifier** = Public/Recruteur/Jury via une **page web** (`/verify/{code}`).
- Le wallet mobile `e-IDapp` n'est **pas** utilisé dans ce produit (option roadmap). Conséquence : on n'attend **aucune acceptation d'offre par un holder externe** ; la plateforme est à la fois émettrice (via le DID institutionnel d'e-IDStack) et conservatrice de la preuve.
- Toute la logique d'appel est encapsulée dans `backend/apps/ssi/client.py` (timeouts, mode live obligatoire, gestion `SSI_PENDING`).
- Vocabulaire : on dit toujours **« e-IDStack de IDS »** (jamais « eidStack-CMU »/« CMU ») dans le produit et l'API publique.

## 2. Service e-IDStack (rappel technique)

- Base : NestJS, Swagger exposé (`/api` selon config), `@credo-ts/*`, AnonCreds, Indy-VDR, Askar, `qrcode`, Prisma/PostgreSQL.
- L'agent Credo doit être **initialisé** et disposer d'un **DID issuer** + d'un **schema** + d'une **credential definition** avant d'émettre.
- e-IDStack supporte un modèle **Out-of-Band (OOB)** où un holder accepte une offre via son wallet. **Comme OpenScience Hub n'utilise pas de wallet**, le flux nominal est **`live` custodian** : la plateforme/l'agent institutionnel détient le credential émis ; aucune invitation à un wallet tiers n'est nécessaire. On stocke `credential_id`, statut et `raw_credential_json`.
- Dans les deux cas, la **vérification reste web** (QR → `/verify/{code}`), sans wallet.

### 2.1 Endpoints e-IDStack utilisés par OpenScience Hub

| Domaine | Méthode + chemin | Usage |
|---|---|---|
| Bootstrap OpenScience | `POST /openscience/bootstrap` | Initialiser l'agent, obtenir le DID issuer, créer ou retrouver le schema et la credential definition |
| Credential custodian | `POST /openscience/credentials` | Enregistrer/émettre côté e-IDStack un credential custodian sans wallet externe |
| Statut credential | `GET /openscience/credentials/{credentialId}/status` | Vérifier le statut du credential custodian |
| Agent bas niveau | `POST /credo-agent/initAgent` · `GET /credo-agent/getIssuerDid` | Utilisés par `/openscience/bootstrap` |
| Schémas/cred-def bas niveau | `POST /issuance/schemas` · `POST /issuance/credential-definitions` | Utilisés par `/openscience/bootstrap` |

### 2.2 Payload bootstrap (`POST /openscience/bootstrap`)

```json
{
  "walletId": "openscience-hub-issuer-local",
  "walletKey": "<secret>",
  "endpoint": "http://localhost:3021",
  "label": "OpenScienceHub IDS Local",
  "seed": "<32 chars>",
  "schemaName": "ScientificWorkArchiveCredential",
  "schemaVersion": "1.0",
  "credentialDefinitionTag": "openscience-hub-archive-v1"
}
```

Réponse :

```json
{
  "success": true,
  "data": {
    "issuerDid": "did:indy:bcovrin:test:...",
    "schemaId": ".../SCHEMA/ScientificWorkArchiveCredential/1.0",
    "credentialDefinitionId": ".../CLAIM_DEF/..."
  }
}
```

### 2.3 Payload d'émission custodian (`POST /openscience/credentials`)

```json
{
  "credentialDefinitionId": "<cred-def-id>",
  "attributes": [
    { "name": "workId", "value": "OSH-UY1-INF-2026-0001" },
    { "name": "title", "value": "..." },
    { "name": "author", "value": "..." },
    { "name": "institution", "value": "Université de Yaoundé I" },
    { "name": "workType", "value": "MEMOIRE" },
    { "name": "documentHash", "value": "9f2a8c7b..." },
    { "name": "academicStatus", "value": "ARCHIVE" },
    { "name": "issuedAt", "value": "2026-06-02" }
  ],
  "comment": "ScientificWorkArchiveCredential"
}
```

> Les `attributes` doivent correspondre au schema/cred-def configuré. Adapter selon la cred-def réellement créée dans e-IDStack.
> Sans wallet, **`connectionId` est omis** (pas de holder externe à connecter) ; `POST /connection/createInvitation` et `POST /issuance/offer` ne sont donc **pas utilisés** dans le flux nominal OpenScience Hub.

## 3. Credential `ScientificWorkArchiveCredential`

Claims minimaux (mappés depuis `CredentialSubject.claims_json`) :

```text
workId          (reference_code du ScientificWork)
title
author          (auteur principal)
institution
department
workType        (MEMOIRE | THESE | ARTICLE)
academicStatus  (ARCHIVE / soutenu / accepté ...)
documentHash    (SHA-256 de la DocumentVersion finale)
issuedAt
issuerDid
```

Règle de cohérence : `documentHash` (claim) == `DocumentVersion.sha256_hash` (finale) == `VerificationProof.document_hash`.

## 4. Flux d'émission (après archivage)

```mermaid
sequenceDiagram
    participant API as Backend Django (ssi)
    participant EID as e-IDStack de IDS
    participant Registry as DID/Registry

    API->>API: ArchiveRecord cree + version finale verrouillee (hash)
    API->>EID: POST /openscience/bootstrap
    EID->>Registry: DID + schema + cred-def si absents
    EID-->>API: issuerDid + schemaId + credentialDefinitionId
    API->>EID: POST /openscience/credentials (credentialDefinitionId + attributes)
    EID-->>API: credentialId + statut done
    API->>API: Creer VerifiableCredential + VerificationProof
    API->>EID: POST /short-url/create (verificationUrl)
    EID-->>API: code court
    API->>API: Generer QR -> qr_code_url -> /verify/{proof_code}
```

Pseudo-code (`ssi/services.py`) :

```python
def issue_proof_for_archive(archive_record):
    conn = archive_record.work.institution.eidstack_connection
    if not conn.is_active:
        return mark_pending(archive_record, reason="SSI_NOT_CONFIGURED")
    try:
        bootstrap = client.bootstrap_openscience()
        issuer_did = bootstrap["issuerDid"]
        attrs = build_attributes(archive_record)         # claims = hash final, etc.
        offer = client.offer_credential(attrs)           # POST /openscience/credentials
        vc = persist_verifiable_credential(offer, issuer_did)
        proof = create_verification_proof(archive_record, vc)  # document_hash == version finale
        proof.verification_url = build_verify_url(proof.proof_code)
        proof.qr_code_url = generate_qr(proof.verification_url)
        proof.status = ProofStatus.ACTIVE
        proof.save()
        audit("PROOF_ISSUED", archive_record)
    except EidStackError:
        mark_pending(archive_record, reason="SSI_PENDING")
```

## 5. Flux de vérification publique (scan QR)

```mermaid
sequenceDiagram
    actor Verifier as Verificateur
    participant API as Backend Django
    participant EID as e-IDStack de IDS

    Verifier->>API: GET /verify/{proof_code}
    API->>API: Charger VerificationProof + ArchiveRecord
    API->>API: Comparer hash document final
    API->>EID: GET /openscience/credentials/{credentialId}/status
    EID-->>API: resultat (valide / revoque / ...)
    API->>API: Creer VerificationCheck
    API-->>Verifier: VALID / INVALID_HASH / NOT_FOUND / REVOKED / EXPIRED + metadonnees publiques
```

- La page de vérification n'expose **que** les métadonnées publiques/nécessaires.
- Combinaison vérifiée : **hash document** + **statut dossier** + **statut VC** + **signature** (via e-IDStack).

## 6. Gestion des erreurs et états

| Situation | État backend | Comportement |
|---|---|---|
| e-IDStack non configuré | `connection_status = NOT_CONFIGURED` | preuve `SSI_PENDING`, archivage possible mais non vérifiable |
| e-IDStack injoignable | `SERVICE_UNAVAILABLE` | retry + `SSI_PENDING`, alerte admin |
| Auth invalide | `AUTH_ERROR` | bloquer émission, alerte admin |
| Émission OK | `ProofStatus.ACTIVE` | QR + fiche publique |
| Révocation | `ProofStatus.REVOKED` | vérification renvoie `REVOKED` |

Politique institutionnelle : soit **bloquer l'archivage** tant que la preuve échoue, soit **archiver en `SSI_PENDING`** et ré-émettre plus tard (paramétrable).

## 7. Configuration (par institution)

Modèle `EidStackConnection` (voir [DATA_MODEL.md](DATA_MODEL.md)). Variables d'environnement backend :

```text
EIDSTACK_BASE_URL=http://ids:4000
EIDSTACK_API_KEY=...            # jamais renvoyé par l'API
EIDSTACK_ENVIRONMENT=TEST       # TEST | STAGING | PRODUCTION
EIDSTACK_WALLET_ID=openscience-hub-issuer-local
EIDSTACK_WALLET_KEY=...
EIDSTACK_AGENT_ENDPOINT=http://localhost:3021
EIDSTACK_AGENT_LABEL=OpenScienceHub IDS Local
EIDSTACK_AGENT_SEED=00000000000000000000000000000001
EIDSTACK_CREDENTIAL_DEFINITION_ID= # optionnel, sinon bootstrap auto
SSI_MODE=live
```

Règles de sécurité : clés/API tokens jamais exposés ; toute modification de config SSI est **auditée** ; tests de connexion (`getAgent` / `getIssuerDid`) avant passage en `PRODUCTION`.

## 8. Politique sans mock runtime

Le compose principal et les valeurs par défaut utilisent `SSI_MODE=live`. Si `SSI_MODE` n'est pas `live`, le client e-IDStack refuse l'opération avec une erreur explicite au lieu de générer un credential simulé.

Si e-IDStack est indisponible, l'archivage reste possible selon la politique institutionnelle, mais la preuve passe en `SSI_PENDING` et doit être réémise depuis l'administration après rétablissement du service. `/verify/{code}` ne renvoie `VALID` que pour une preuve réelle active et cohérente avec la version finale archivée.

## 9. Checklist d'intégration

- [ ] Agent e-IDStack initialisé (`initAgent`) + DID issuer disponible.
- [ ] Schema + credential definition `ScientificWorkArchiveCredential` créés.
- [ ] `EidStackConnection` configurée et testée (`CONNECTED`).
- [ ] Émission déclenchée uniquement après version finale verrouillée.
- [ ] `document_hash` cohérent (version finale == preuve == claim).
- [ ] QR pointe vers `/verify/{proof_code}` (jamais le credential complet).
- [ ] Vérification combine hash + statut dossier + statut VC.
- [ ] Erreurs gérées (`SSI_PENDING`) + audit `PROOF_ISSUED` / `PROOF_REVOKED`.
