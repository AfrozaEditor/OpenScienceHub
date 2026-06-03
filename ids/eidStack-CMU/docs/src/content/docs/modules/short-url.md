---
title: Short URL Module
description: Shorten long SSI invitation URLs for QR codes
---

## Overview

SSI invitation URLs can be hundreds of characters long — too complex for QR codes. This module creates short codes that redirect to the original URL, generating clean scannable QR codes.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/short-url/create` | Create short URL |
| GET | `/short-url/resolve` | Resolve code to original URL |
| GET | `/short-url/s/{code}` | Redirect to original URL |

## Create Short URL
```http
POST /short-url/create
{
  "originalUrl": "http://your-agent:8000/oob?oob=eyJAdHlwZSI6..."
}
```

Returns:
```json
{
  "shortCode": "abc123",
  "shortUrl": "http://yourapp.com/s/abc123"
}
```

## Resolve Code
```http
GET /short-url/resolve?code=abc123
```

## Redirect
```http
GET /short-url/s/abc123
→ 302 Redirect to original URL
```

## Typical Usage
```
POST /issuance/offer       → get long invitationUrl
POST /short-url/create     → get shortUrl
POST /email/send-invite-url → send shortUrl to holder
Holder clicks → wallet opens
```
