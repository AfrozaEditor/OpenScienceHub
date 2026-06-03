---
title: Credo Agent Module
description: Initialize and manage the Credo SSI agent
---

## Overview

The `credo-agent` module manages the Credo agent lifecycle — wallet, DID, and ledger. **Must be initialized first** before using any other module.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/credo-agent/initAgent` | Initialize agent |
| POST | `/credo-agent/receiveInvitation` | Receive OOB invitation |
| GET | `/credo-agent/getAgent` | Get agent status |
| GET | `/credo-agent/getIssuerDid` | Get issuer DID |
| GET | `/credo-agent/did` | Get agent DID |

## Initialize Agent
```http
POST /credo-agent/initAgent
{
  "walletId": "my-org-wallet",
  "walletKey": "super-secure-key",
  "endpoint": "http://your-public-ip:8000",
  "label": "My Organization Agent",
  "seed": "000000000000000000000000MyOrgSeed"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `walletId` | Yes | Unique wallet identifier |
| `walletKey` | Yes | Wallet encryption password |
| `endpoint` | Yes | Public URL of your agent |
| `label` | Yes | Agent name shown in wallets |
| `seed` | Yes | 32-char seed for DID generation |

:::caution
Never change your `seed` after DID is registered on ledger. Same seed = same DID always.
:::
