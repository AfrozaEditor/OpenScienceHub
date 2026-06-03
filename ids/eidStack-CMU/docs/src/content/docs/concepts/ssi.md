---
title: What is SSI?
description: Self-Sovereign Identity concepts explained simply
---

## Self-Sovereign Identity

SSI is a model where individuals control their own digital identity without relying on any central authority. Users hold credentials in their own **digital wallet** and decide when and with whom to share them.

## The Three Roles

**Issuer** — Issues a signed credential to a holder. Example: university issuing a degree.

**Holder** — Receives and stores credentials in a digital wallet (e.g. Bifold app).

**Verifier** — Requests proof from the holder. Example: employer checking your degree.

## Key Concepts

### DID (Decentralized Identifier)
A globally unique identifier not tied to any central registry.
```
did:indy:bcovrin:test:AbCdEf1234567890
```

### Schema
Defines the structure of a credential — which attributes it contains.
```json
{
  "name": "StudentID",
  "version": "1.0",
  "attributes": ["student_name", "student_id", "university"]
}
```

### Credential Definition
An issuer's commitment to issue credentials based on a specific schema. Links the issuer's DID to a schema on the ledger.

### Proof Request
A verifier asks the holder to prove certain claims. The wallet generates a **Zero Knowledge Proof (ZKP)** — proving a claim without revealing unnecessary data.

### Out-of-Band (OOB) Invitation
A URL (often as QR code) that lets a holder's wallet receive a credential or connection request without a prior connection.
