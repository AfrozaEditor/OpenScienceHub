---
title: Issuance Flow
description: Complete step-by-step credential issuance flow in eidStack-CMU
---

## Overview

Credential issuance is the process where your backend sends a verifiable credential to a holder's digital wallet. eidStack-CMU supports **Out-of-Band (OOB)** issuance — no prior connection needed.

## Flow Diagram
```
1. POST /credo-agent/initAgent
         ↓
2. POST /issuance/schemas
         ↓
3. POST /issuance/credential-definitions
         ↓
4. POST /issuance/offer
         ↓  automatically returns shortUrl + invitationQr + credentialExchangeId
5. (Optional) POST /email/send-invite-url  ← send shortUrl to holder via email
         ↓
6. Holder scans QR / clicks link in wallet
         ↓
7. GET /issuance/offerStatus  ← poll until "done"
```

## Step 1 — Initialize Agent
```http
POST /credo-agent/initAgent
{
  "walletId": "my-wallet",
  "walletKey": "secure-key",
  "endpoint": "http://your-agent:8000",
  "label": "My Issuer Agent",
  "seed": "000000000000000000000000MyIssuer"
}
```

## Step 2 — Create Schema
```http
POST /issuance/schemas
{
  "name": "StudentID",
  "version": "1.0",
  "attributes": [
    { "attributeName": "student_name", "schemaDataType": "string", "displayName": "Full Name" },
    { "attributeName": "student_id", "schemaDataType": "string", "displayName": "Student ID" }
  ]
}
```

## Step 3 — Create Credential Definition
```http
POST /issuance/credential-definitions
{
  "schemaId": "did:indy:bcovrin:test:ABC/anoncreds/v0/SCHEMA/StudentID/1.0",
  "tag": "default",
  "supportRevocation": false
}
```

## Step 4 — Offer Credential
```http
POST /issuance/offer
{
  "credentialDefinitionId": "did:indy:...",
  "attributes": [
    { "name": "student_name", "value": "John Doe" },
    { "name": "student_id", "value": "STU-001" }
  ]
}
```

## Step 5 — Poll Status
```http
GET /issuance/offerStatus?credentialExchangeId=abc-123
```

States: `offer-sent` → `request-received` → `credential-issued` → `done`
