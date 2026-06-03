# 🔐 eidStack-CMU
 
Backend service built using:
 
- Node.js
- NestJS
- Prisma ORM
- Credo (SSI / Aries / AnonCreds)
- PostgreSQL
- Swagger
 
This service manages:
 
- DID creation
- Credential issuance
- Proof verification
- SSI agent lifecycle management
 
---
 
# 📦 Prerequisites
 
Ensure the following are installed:
 
| Tool | Required Version |
|------|------------------|
| Node.js | v18.17.1 |
| npm | v9.6.7 |
| NestJS CLI | v10.4.9 |
| PostgreSQL | 14+ |
| Git | Latest |
 
Verify versions:
 
```bash
node -v
npm -v
nest -v
git --version
```
 
---
 
# 🗂 Project Structure
 
```
eidStack-CMU/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── dto/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   └── utils/
│   ├── config/
│   ├── cleanup/
│   ├── connection/
│   │   ├── dto/
│   │   ├── connection.controller.ts
│   │   ├── connection.module.ts
│   │   └── connection.service.ts
│   ├── credo-agent/
│   │   ├── dto/
│   │   ├── credo-agent.controller.ts
│   │   ├── credo-agent.module.ts
│   │   ├── credo-agent.service.ts
│   │   └── credo-events.service.ts
│   ├── email/
│   │   ├── dto/
│   │   ├── templates/
│   │   ├── email.controller.ts
│   │   ├── email.module.ts
│   │   └── email.service.ts
│   ├── issuance/
│   │   ├── dto/
│   │   ├── issuance.controller.ts
│   │   ├── issuance.module.ts
│   │   └── issuance.service.ts
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── short-url/
│   │   ├── dto/
│   │   ├── short-url.controller.ts
│   │   ├── short-url.module.ts
│   │   └── short-url.service.ts
│   ├── utils/
│   └── verification/
│       ├── dto/
│       ├── verification.controller.ts
│       ├── verification.module.ts
│       └── verification.service.ts
├── docs/                          ← Starlight documentation site
│   ├── public/
│   │   └── api-docs.html          ← Custom interactive API reference
│   ├── src/content/docs/
│   │   ├── guides/
│   │   ├── concepts/
│   │   └── modules/
│   └── astro.config.mjs
├── prisma/
│   └── schema.prisma
├── ngrok.yml
├── .env
└── package.json
```
 
---
 
# 🚀 Project Setup
 
## 1️⃣ Clone Repository
 
```bash
git clone <REPOSITORY_URL>
cd eidStack-CMU
```
 
## 2️⃣ Install Dependencies
 
```bash
npm install
```
 
---
 
# ⚙️ Environment Configuration
 
Create a `.env` file in the project root:
 
```env
# Database
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public"
 
# Application URLs
API_BASE_URL="http://localhost:4000"
AGENT_PUBLIC_URL="https://<ngrok-api-tunnel>.ngrok-free.app"
 
# SSI / Credo Agent
AGENT_PORT=3021
BCOVRIN_TESTNET_URL="http://test.bcovrin.vonx.io/register"
INDY_NETWORK_NAMESPACE="bcovrin:test"
 
# Issuance & Verification
ISSUER_LABEL="e-ID_Issuer"
VERIFIER_LABEL="e-ID_Verifier"
CREDENTIAL_PROTOCOL_VERSION="v2"
 
# Email (SMTP)
MAIL_HOST="smtp.provider.com"
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME="<SMTP_USERNAME>"
MAIL_PASSWORD="<SMTP_PASSWORD>"
MAIL_FROM_EMAIL="no-reply@yourdomain.com"
MAIL_FROM_NAME="e-ID System"
```
 
> `AGENT_PUBLIC_URL` must be set to the ngrok `api` tunnel URL (port 3021). See [ngrok setup](#-ngrok-setup-local-development) below.
 
---
 
# 🗄 Database Setup
 
Generate Prisma client:
 
```bash
npx prisma generate
```
 
Run migrations:
 
```bash
npx prisma migrate deploy
```
 
---
 
# 🔌 Port Overview
 
| Port | Service | Purpose |
|------|----------|---------|
| 3021 | Credo Agent | DIDComm inbound transport — must be publicly accessible |
| 4000 | NestJS API | REST endpoints |
| 4321 | Starlight Docs | Documentation site (dev only) |
 
---
 
# 🌐 ngrok Setup (Local Development)
 
SSI mobile wallets require a **public URL** to reach the Credo Agent on port 3021.
The NestJS API on port 4000 also needs a public URL so short URLs and callbacks resolve externally.
 
## Tunnel Overview
 
| Tunnel | Port | `.env` variable |
|--------|------|-----------------|
| `api`  | 3021 | `AGENT_PUBLIC_URL` |
| `web`  | 4000 | `API_BASE_URL` |
 
## Install ngrok
 
```bash
brew install ngrok
```
 
Or download from https://ngrok.com/download
 
Add your auth token:
 
```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```
 
Get your token from https://dashboard.ngrok.com/get-started/your-authtoken
 
## ngrok.yml Configuration
 
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
 
## Starting ngrok
 
### Paid Plan
 
If you have a paid ngrok account, both tunnels get separate public URLs:
 
```bash
ngrok start --all --config ngrok.yml
```
 
### Free Plan
 
The free plan shares one public URL across tunnels, which breaks routing. Run each tunnel in a **separate terminal**:
 
```bash
# Terminal 1 — Credo Agent (port 3021) → sets AGENT_PUBLIC_URL
ngrok http 3021
 
# Terminal 2 — NestJS API (port 4000) → sets API_BASE_URL
ngrok start web --config ngrok.yml
```
 
Each terminal will show its own unique URL:
 
```
Terminal 1:  https://abc111.ngrok-free.app -> http://localhost:3021
Terminal 2:  https://abc222.ngrok-free.app -> http://localhost:4000
```
 
## Update .env After Starting ngrok
 
```env
AGENT_PUBLIC_URL="https://abc111.ngrok-free.app"   # Terminal 1 URL (port 3021)
API_BASE_URL="https://abc222.ngrok-free.app"        # Terminal 2 URL (port 4000)
```
 
---
 
# ▶️ Run the Application (Development)
 
Start in watch mode:
 
```bash
npm run start:dev
```
 
Access:
 
| Service | URL |
|---------|-----|
| REST API | http://localhost:4000 |
| Swagger Docs | http://localhost:4000/api |
| Credo Agent | http://localhost:3021 |
 
---
 
# 🔐 Initialize SSI Agent
 
After the server and ngrok are running, initialize the agent:
 
### Endpoint
 
```
POST http://localhost:4000/credo-agent/initAgent
```
 
### Request Body
 
```json
{
  "walletId": "eidstack-wallet-01",
  "walletKey": "eidstack-wallet-key-01",
  "endpoint": "https://abc111.ngrok-free.app",
  "label": "e-ID_Issuer",
  "seed": "00000000000000000000000000000001"
}
```
 
### Field Descriptions
 
| Field | Description |
|-------|-------------|
| `walletId` | Unique wallet identifier |
| `walletKey` | Wallet encryption key |
| `endpoint` | Must match `AGENT_PUBLIC_URL` (ngrok api tunnel) |
| `label` | Display name for the issuer |
| `seed` | Exactly 32 characters |
 
### Success Response
 
```json
{
  "message": "Agent initialized and DID registered",
  "issuerDid": "did:indy:bcovrin:test:XXXXXXXXXXXX"
}
```
 
---
 
# 🔄 Credential Flow
 
End-to-end flow after agent initialization:
 
1. `POST /credo-agent/initAgent`
2. `POST /issuance/schemas`
3. `POST /issuance/credential-definitions`
4. `POST /issuance/offer/oob` — returns QR code (OOB)
   or `POST /issuance/offer/connection` — sends directly to connected wallet
5. `POST /verification/proof-request/oob` — returns QR code (OOB)
   or `POST /verification/proof-request/connection` — sends directly to connected wallet
 
---
 
# 📚 Documentation Site (Starlight)
 
The project includes a full documentation site built with [Astro Starlight](https://starlight.astro.build/), located in the `docs/` folder.
 
## Setup
 
Install docs dependencies (one-time):
 
```bash
cd docs
npm install
cd ..
```
 
## Scripts
 
The following scripts are available from the **project root** (`package.json`):
 
| Script | Command | Description |
|--------|---------|-------------|
| `docs:dev` | `npm run docs:dev` | Start docs dev server at `http://localhost:4321` |
| `docs:build` | `npm run docs:build` | Build docs for production |
 
```json
"scripts": {
  "docs:dev":     "cd docs && npm run dev",
  "docs:build":   "cd docs && npm run build",
  "docs:preview": "cd docs && npm run preview"
}
```
 
## Running the Docs
 
```bash
# From project root
npm run docs:dev
```
 
Docs site starts at `http://localhost:4321`
 
| Page | URL |
|------|-----|
| Home | http://localhost:4321 |
| Introduction | http://localhost:4321/guides/introduction |
| Installation | http://localhost:4321/guides/installation |
| API Reference | http://localhost:4321/api-reference |
 
## Docs Structure
 
```
docs/
├── public/
│   └── api-docs.html          ← Interactive API reference (custom UI)
├── src/
│   └── content/
│       └── docs/
│           ├── index.mdx      ← Home page
│           ├── guides/
│           │   ├── introduction.md
│           │   ├── installation.md
│           │   └── env-setup.md
│           ├── concepts/
│           │   ├── ssi.md
│           │   ├── issuance-flow.md
│           │   └── verification-flow.md
│           └── modules/
│               ├── agent.md
│               ├── connection.md
│               ├── issuance.md
│               ├── verification.md
│               ├── short-url.md
│               └── email.md
└── astro.config.mjs
```
 
---
 
# 🛠 Troubleshooting
 
### initAgent fails
- Ensure ngrok is running
- Verify `AGENT_PUBLIC_URL` matches the ngrok `api` tunnel URL
- Seed must be exactly 32 characters
 
### Wallet cannot connect
- Confirm the `api` tunnel is active on port 3021
- Verify `AGENT_PUBLIC_URL` is set correctly
 
### ngrok URL changed
- Update `AGENT_PUBLIC_URL` (and `API_BASE_URL` if needed) in `.env`
- Restart the application
- Reinitialize the agent
 
### Port already in use
 
```bash
lsof -i :3021
lsof -i :4000
kill -9 <PID>
```
 
### Docs site not starting
- Run `npm install` inside the `docs/` folder first
- Ensure Node.js v18+ is installed
 
---
 
# 🧪 Run Tests
 
```bash
npm run test
npm run test:e2e
npm run test:cov
```
 
---
 
# 🏭 Production
 
Update `.env` with production URLs:
 
```env
AGENT_PUBLIC_URL="https://agent.yourdomain.com"
API_BASE_URL="https://api.yourdomain.com"
```
 
Build and start:
 
```bash
npm run build
npm run start:prod
```
 
Or using Docker:
 
```bash
docker compose up -d --build
```
 
> Ensure port 3021 and 4000 are exposed via a reverse proxy (e.g. Nginx) with SSL.
 
---
 
# 📄 License
 
NestJS is MIT Licensed.
 
---
 
**Maintained by eidStack Team**
