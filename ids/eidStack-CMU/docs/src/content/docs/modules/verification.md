---
title: Verification Module
description: Create proof requests and verify credentials from holders
---

## Overview

Requests cryptographic proofs from holders and verifies credentials — without unnecessary data exposure.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/verification/createProofRequest` | Create proof request |
| GET | `/verification/proofStatus` | Poll proof status |

## Create Proof Request
```http
POST /verification/createProofRequest
{
  "credDefId": "did:indy:...",
  "attributes": [
    { "name": "full_name" },
    { "name": "department" }
  ],
  "comment": "Please prove your employee credentials"
}
```

## With ZKP Predicate
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

Supported operators: `>=` `<=` `>` `<`

## Connection-Based
```http
POST /verification/createProofRequest
{
  "credDefId": "did:indy:...",
  "attributes": [{ "name": "full_name" }],
  "connectionId": "conn-uuid-here"
}
```

## Poll Status
```http
GET /verification/proofStatus?proofRecordId=proof-uuid
```

States: `request-sent` → `presentation-received` → `done`
