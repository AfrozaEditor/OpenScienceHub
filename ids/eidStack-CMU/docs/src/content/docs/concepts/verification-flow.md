---
title: Verification Flow
description: Complete step-by-step credential verification flow in eidStack-CMU
---

## Overview

Verification is where your backend asks a holder to prove claims from their wallet. Supports **OOB** and **connection-based** proof requests.

## Flow Diagram
```
1. POST /credo-agent/initAgent
         ↓
2. POST /verification/createProofRequest
         ↓  automatically returns shortUrl + verificationQr + proofRecordId
3. (Optional) POST /email/send-invite-url  ← send shortUrl to holder via email
         ↓
4. Holder scans QR / clicks link in wallet
         ↓
5. Holder shares proof from wallet
         ↓
6. GET /verification/proofStatus  ← poll until "done"
```

## Create Proof Request (OOB)
```http
POST /verification/createProofRequest
{
  "credDefId": "did:indy:...",
  "attributes": [
    { "name": "student_name" },
    { "name": "university" }
  ],
  "comment": "Please share your student credential"
}
```

## With Zero Knowledge Predicate

Prove age >= 18 without revealing actual age:
```http
POST /verification/createProofRequest
{
  "credDefId": "did:indy:...",
  "attributes": [{ "name": "full_name" }],
  "predicates": [
    { "name": "age", "pType": ">=", "pValue": 18 }
  ]
}
```

## Poll Status
```http
GET /verification/proofStatus?proofRecordId=xyz
```

States: `request-sent` → `presentation-received` → `done`

## OOB vs Connection-Based

| | OOB | Connection-based |
|--|-----|-----------------|
| Prior connection needed | No | Yes |
| Use case | One-time check | Ongoing relationship |
| How | No `connectionId` | Pass `connectionId` |
