---
title: Issuance Module
description: Schema management, credential definitions, and credential issuance
---

## Overview

Handles everything for issuing verifiable credentials — schema creation, credential definitions, and sending credentials to holders.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/issuance/listSchemas` | List all schemas |
| GET | `/issuance/schemas` | List schemas paginated |
| POST | `/issuance/schemas` | Create schema |
| GET | `/issuance/credential-definitions` | List cred defs paginated |
| POST | `/issuance/credential-definitions` | Create cred def |
| POST | `/issuance/offer` | Offer credential |
| GET | `/issuance/offerStatus` | Poll offer status |

## Create Schema
```http
POST /issuance/schemas
{
  "name": "EmployeeID",
  "version": "1.0",
  "attributes": [
    { "attributeName": "full_name", "schemaDataType": "string", "displayName": "Full Name" },
    { "attributeName": "employee_id", "schemaDataType": "string", "displayName": "Employee ID" },
    { "attributeName": "department", "schemaDataType": "string", "displayName": "Department" }
  ]
}
```

## Create Credential Definition
```http
POST /issuance/credential-definitions
{
  "schemaId": "did:indy:bcovrin:test:ABC/anoncreds/v0/SCHEMA/EmployeeID/1.0",
  "tag": "default",
  "supportRevocation": false
}
```

## Offer Credential (OOB)
```http
POST /issuance/offer
{
  "credentialDefinitionId": "did:indy:...",
  "attributes": [
    { "name": "full_name", "value": "Jane Smith" },
    { "name": "employee_id", "value": "EMP-007" },
    { "name": "department", "value": "Engineering" }
  ],
  "comment": "Your Employee ID credential"
}
```

## Check Offer Status
```http
GET /issuance/offerStatus?credentialExchangeId=exchange-uuid
```

States: `offer-sent` → `request-received` → `credential-issued` → `done`
