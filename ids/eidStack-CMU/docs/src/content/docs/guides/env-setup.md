---
title: Environment Setup
description: All environment variables explained for eidStack-CMU
---

Create a `.env` file in the project root with the following variables:

---

## Database

```env
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?schema=public"
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full PostgreSQL connection string used by Prisma |

---

## Application URLs

```env
API_BASE_URL="http://localhost:4000"
AGENT_PUBLIC_URL="https://<ngrok-api-tunnel>.ngrok-free.app"
```

| Variable | Description |
|----------|-------------|
| `API_BASE_URL` | Base URL of the NestJS REST API |
| `AGENT_PUBLIC_URL` | Public ngrok URL for the Credo Agent on port 3021 — must be publicly reachable by mobile wallets |

:::caution
`AGENT_PUBLIC_URL` must point to the ngrok tunnel for port `3021`, not port `4000`. See [Installation → ngrok Setup](/guides/installation/#5-ngrok-setup-local-development).
:::

---

## SSI / Credo Agent

```env
AGENT_PORT=3021
BCOVRIN_TESTNET_URL="http://test.bcovrin.vonx.io/register"
INDY_NETWORK_NAMESPACE="bcovrin:test"
```

| Variable | Description |
|----------|-------------|
| `AGENT_PORT` | Port the Credo DIDComm agent listens on |
| `BCOVRIN_TESTNET_URL` | BCovrin test ledger registration endpoint |
| `INDY_NETWORK_NAMESPACE` | Indy network namespace for DID resolution |

---

## Issuance & Verification

```env
ISSUER_LABEL="e-ID_Issuer"
VERIFIER_LABEL="e-ID_Verifier"
CREDENTIAL_PROTOCOL_VERSION="v2"
```

| Variable | Description |
|----------|-------------|
| `ISSUER_LABEL` | Display name for the issuer agent shown in wallets |
| `VERIFIER_LABEL` | Display name for the verifier agent |
| `CREDENTIAL_PROTOCOL_VERSION` | AnonCreds protocol version — use `v2` |

---

## Email (SMTP)

```env
MAIL_HOST="smtp.provider.com"
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME="<SMTP_USERNAME>"
MAIL_PASSWORD="<SMTP_PASSWORD>"
MAIL_FROM_EMAIL="no-reply@yourdomain.com"
MAIL_FROM_NAME="e-ID System"
```

| Variable | Description |
|----------|-------------|
| `MAIL_HOST` | SMTP server hostname |
| `MAIL_PORT` | SMTP port — 587 for TLS, 465 for SSL |
| `MAIL_SECURE` | `true` for SSL (port 465), `false` for TLS (port 587) |
| `MAIL_USERNAME` | SMTP login username |
| `MAIL_PASSWORD` | SMTP login password — use App Password for Gmail |
| `MAIL_FROM_EMAIL` | Sender email address shown to recipients |
| `MAIL_FROM_NAME` | Sender name shown to recipients |

:::note
If using Gmail, generate an **App Password** from your Google Account settings instead of your regular password.
:::

---

## Full Example `.env`

```env
# Database
DATABASE_URL="postgresql://postgres:secret@localhost:5432/eidstack?schema=public"

# Application URLs
API_BASE_URL="http://localhost:4000"
AGENT_PUBLIC_URL="https://abc111.ngrok-free.app"

# SSI / Credo Agent
AGENT_PORT=3021
BCOVRIN_TESTNET_URL="http://test.bcovrin.vonx.io/register"
INDY_NETWORK_NAMESPACE="bcovrin:test"

# Issuance & Verification
ISSUER_LABEL="e-ID_Issuer"
VERIFIER_LABEL="e-ID_Verifier"
CREDENTIAL_PROTOCOL_VERSION="v2"

# Email (SMTP)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USERNAME="you@gmail.com"
MAIL_PASSWORD="your_app_password"
MAIL_FROM_EMAIL="no-reply@yourdomain.com"
MAIL_FROM_NAME="e-ID System"
```

:::caution
Never commit your `.env` file to Git. Make sure `.env` is listed in `.gitignore`.
:::