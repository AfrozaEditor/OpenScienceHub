---
title: Installation
description: How to clone, install, and run eidStack-CMU locally
---

## Prerequisites

| Tool | Required Version |
|------|-----------------|
| Node.js | v18.17.1 |
| npm | v9.6.7 |
| NestJS CLI | v10.4.9 |
| PostgreSQL | 14+ |
| Git | Latest |

Verify your versions:

```bash
node -v
npm -v
nest -v
git --version
```

---

## 1. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd eidStack-CMU
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

See [Environment Setup](/guides/env-setup/) for all variables explained in detail.

---

## 4. Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate deploy
```

---

## 5. ngrok Setup (Local Development)

SSI mobile wallets require a **public URL** to reach the Credo Agent on port `3021`. ngrok creates this tunnel.

### Install ngrok

```bash
brew install ngrok
# or download from https://ngrok.com/download
```

Add your auth token:

```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

### Port Overview

| Port | Service | Purpose |
|------|---------|---------|
| `3021` | Credo Agent | DIDComm inbound transport — must be publicly accessible |
| `4000` | NestJS API | REST endpoints |

### Tunnel Overview

| Tunnel | Port | `.env` variable |
|--------|------|----------------|
| `api` | 3021 | `AGENT_PUBLIC_URL` |
| `web` | 4000 | `API_BASE_URL` |

### ngrok.yml

```yaml
version: "2"
authtoken: YOUR_NGROK_AUTHTOKEN
tunnels:
  api:
    proto: http
    addr: 3021
  web:
    proto: http
    addr: 4000
```

### Start ngrok

**Paid plan** — both tunnels together:

```bash
ngrok start --all --config ngrok.yml
```

**Free plan** — run each in a separate terminal:

```bash
# Terminal 1 — Credo Agent (port 3021)
ngrok http 3021

# Terminal 2 — NestJS API (port 4000)
ngrok start web --config ngrok.yml
```

Each terminal shows its own URL:

```
Terminal 1:  https://abc111.ngrok-free.app -> http://localhost:3021
Terminal 2:  https://abc222.ngrok-free.app -> http://localhost:4000
```

Update `.env` with these URLs:

```env
AGENT_PUBLIC_URL="https://abc111.ngrok-free.app"
API_BASE_URL="https://abc222.ngrok-free.app"
```

---

## 6. Run the Application

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

| Service | URL |
|---------|-----|
| REST API | http://localhost:4000 |
| Swagger Docs | http://localhost:4000/api/docs |
| Credo Agent | http://localhost:3021 |

---

## 7. Initialize the SSI Agent

After server and ngrok are running, initialize the agent:

```http
POST http://localhost:4000/credo-agent/initAgent
```

```json
{
  "walletId": "eidstack-wallet-01",
  "walletKey": "eidstack-wallet-key-01",
  "endpoint": "https://abc111.ngrok-free.app",
  "label": "e-ID_Issuer",
  "seed": "00000000000000000000000000000001"
}
```

| Field | Description |
|-------|-------------|
| `walletId` | Unique wallet identifier |
| `walletKey` | Wallet encryption key |
| `endpoint` | Must match `AGENT_PUBLIC_URL` (ngrok api tunnel) |
| `label` | Display name for the issuer |
| `seed` | Exactly 32 characters |

Success response:

```json
{
  "message": "Agent initialized and DID registered",
  "issuerDid": "did:indy:bcovrin:test:XXXXXXXXXXXX"
}
```

---

## Troubleshooting

**initAgent fails**
- Ensure ngrok is running
- Verify `AGENT_PUBLIC_URL` matches the ngrok `api` tunnel URL
- Seed must be exactly 32 characters

**Wallet cannot connect**
- Confirm the `api` tunnel is active on port 3021
- Verify `AGENT_PUBLIC_URL` is set correctly

**ngrok URL changed**
- Update `AGENT_PUBLIC_URL` in `.env`
- Restart the application
- Reinitialize the agent

**Port already in use**

```bash
lsof -i :3021
lsof -i :4000
kill -9 <PID>
```