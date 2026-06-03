---
title: Connection Module
description: Create Out-of-Band connection invitations
---

## Overview

Creates persistent, encrypted connections between your agent and a holder's wallet. Once connected, you can push offers and proof requests directly without new invitation URLs each time.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/connection/createInvitation` | Create OOB connection invitation |

## Create Invitation
```http
POST /connection/createInvitation
```

No request body needed. Returns:
```json
{
  "invitationUrl": "http://your-agent/oob?oob=eyJ...",
  "connectionId": "conn-uuid-here"
}
```

Share the `invitationUrl` as QR code. When holder scans it, a persistent connection is established.

## When to Use Connections

| Scenario | Approach |
|----------|----------|
| One-time credential to new user | OOB directly |
| Repeated interactions with same holder | Establish connection first |
| Employee portal | Use connection |
| Public event check-in | OOB is simpler |
