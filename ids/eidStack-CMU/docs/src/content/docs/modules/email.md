---
title: Email Module
description: Send credential offer and proof request links via email
---

## Overview

Sends invitation links to holders via email with templates based on invitation type.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/email/send-invite-url` | Send invitation email |

## Send Invite Email
```http
POST /email/send-invite-url
{
  "email": "john@example.com",
  "name": "John Doe",
  "inviteLink": "http://yourapp.com/s/abc123",
  "type": "offer"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `email` | Yes | Recipient email address |
| `name` | Yes | Recipient name for greeting |
| `inviteLink` | Yes | Short URL to include in email |
| `type` | No | Template type — see below |

## Type Values

| Value | Use Case |
|-------|----------|
| `connection` | Invite to connect with agent |
| `offer` | Send credential offer |
| `proof` | Request a proof |
| `zkp-proof` | Request ZKP proof |

## Full Issuance + Email Flow
```http
# 1. Offer credential
POST /issuance/offer → { invitationUrl, credentialExchangeId }

# 2. Shorten
POST /short-url/create → { shortUrl }

# 3. Email
POST /email/send-invite-url
{
  "email": "student@university.edu",
  "name": "Alice",
  "inviteLink": "http://yourapp.com/s/xyz789",
  "type": "offer"
}
```

:::note
Configure SMTP settings in `.env` before using this module. See [Environment Setup](/guides/env-setup).
:::
