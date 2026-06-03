---
title: Introduction
description: Overview of eidStack-CMU — SSI platform built with Credo and NestJS
---

## What is eidStack-CMU?

**eidStack-CMU** is a Self-Sovereign Identity (SSI) backend platform built with [Credo](https://credo.js.org/) and [NestJS](https://nestjs.com/). It exposes REST APIs for **DID-based credential issuance and verification**.

## The Three Roles in SSI

- **Issuer** — Organization that issues credentials (your backend)
- **Holder** — Person who receives credentials in their digital wallet
- **Verifier** — Organization that verifies credentials from holders

## Project Structure
```
NestJS App (eidStack-CMU)
├── credo-agent   → manages DID, wallet, ledger
├── connection    → OOB connection invitations
├── issuance      → schema, credDef, offer credential
├── verification  → proof requests, ZKP
├── short-url     → shorten invitation URLs for QR
└── email         → send invite links via email
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS |
| SSI | Credo (Aries Framework JS) |
| Database | PostgreSQL + Prisma |
| API Docs | Swagger UI at `/api/docs` |
