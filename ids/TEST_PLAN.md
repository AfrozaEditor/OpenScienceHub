# Plan de test complet IDS

Ce plan couvre les trois projets:

- `eidStack-CMU`: backend NestJS, agent Credo, API REST, PostgreSQL.
- `eid-sandbox-CMU`: dashboard web Next.js.
- `e-IDapp_CMU`: wallet mobile React Native.

## 0. Pre-requis a verifier

Depuis le dossier `IDS`, verifier:

```bash
node -v
npm -v
docker --version
docker compose version
```

Pour le dashboard:

```bash
pnpm -v
```

Pour le mobile Android:

```bash
java -version
adb version
```

Important: dans l'environnement actuel, `node` et `npm` ne sont pas disponibles dans le terminal. Il faut installer Node.js ou charger `nvm` avant les tests.

## 1. Tests automatises backend

```bash
cd eidStack-CMU
npm install
npx prisma generate
npm test
npm run test:e2e
npm run build
```

Le test e2e demande une base PostgreSQL. Le plus simple est de lancer PostgreSQL avec Docker, puis de lancer les migrations:

```bash
docker compose up -d postgres
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polyid_db?schema=public" npx prisma migrate deploy
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polyid_db?schema=public" npm run test:e2e
```

## 2. Lancement backend local

Creer `eidStack-CMU/.env` a partir de `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/polyid_db?schema=public"
API_BASE_URL="http://localhost:4000"
AGENT_PUBLIC_URL="http://localhost:3021"
AGENT_PORT=3021
BCOVRIN_TESTNET_URL="http://test.bcovrin.vonx.io/register"
INDY_NETWORK_NAMESPACE="bcovrin:test"
ISSUER_LABEL="e-ID_Issuer"
VERIFIER_LABEL="e-ID_Verifier"
CREDENTIAL_PROTOCOL_VERSION="v2"
MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=false
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_EMAIL=
MAIL_FROM_NAME=
```

Puis:

```bash
cd eidStack-CMU
docker compose up -d postgres
npx prisma migrate deploy
npm run start:dev
```

Verifier:

```bash
curl http://localhost:4000
curl http://localhost:4000/api
```

Pour tester avec un vrai telephone, remplacer `AGENT_PUBLIC_URL` et `API_BASE_URL` par des URLs publiques HTTPS, par exemple ngrok.

## 3. Tests dashboard web

```bash
cd eid-sandbox-CMU
pnpm install
cp .env.example .env.local
```

Mettre dans `.env.local`:

```env
NEXT_PUBLIC_REST_URL=http://localhost:4000
```

Puis:

```bash
pnpm lint
pnpm build
pnpm dev
```

Ouvrir:

```text
http://localhost:3000
```

## 4. Tests wallet mobile

```bash
cd e-IDapp_CMU
npm install
cp .env.sample .env
npm test
npm run lint
```

Pour Android:

```bash
npm start -- --reset-cache
npm run android
```

Verifier que `.env` contient:

```env
MEDIATOR_URL=https://polyid-mediator.onrender.com/createMediatorInvitation
GENESIS_URL=https://test.bcovrin.vonx.io/genesis
```

## 5. Scenario metier complet

Ordre obligatoire:

1. Demarrer PostgreSQL.
2. Demarrer le backend.
3. Initialiser l'agent serveur si l'API le demande: `POST /credo-agent/initAgent`.
4. Demarrer le dashboard.
5. Demarrer le wallet mobile.
6. Dans le dashboard, creer un schema.
7. Creer une credential definition depuis ce schema.
8. Creer une offre de credential avec des valeurs de test.
9. Scanner le QR avec le wallet.
10. Accepter le credential dans le wallet.
11. Creer une demande de preuve depuis le dashboard.
12. Scanner le QR de preuve avec le wallet.
13. Partager seulement les attributs demandes.
14. Verifier dans le dashboard que la preuve est acceptee.

## 6. Donnees de test conseillees

Schema `Student ID`:

- `firstName`
- `lastName`
- `studentId`
- `program`
- `birthDate`
- `expiryDate`

Credential de test:

- `firstName`: `Amina`
- `lastName`: `Test`
- `studentId`: `CMU-2026-001`
- `program`: `Computer Science`
- `birthDate`: `2001-04-15`
- `expiryDate`: `2027-12-31`

Preuve selective:

- Reveler `firstName`, `studentId`, `program`.
- Ne pas reveler `birthDate`.

## 7. Criteres de reussite

- Backend: tests unitaires verts, build vert, migrations Prisma appliquees.
- Dashboard: lint vert, build vert, interface accessible sur `localhost:3000`.
- Wallet: tests Jest verts, app installee sur emulateur ou telephone.
- Cycle SSI: schema cree, credential definition creee, credential recu dans le wallet, preuve selective verifiee.

## 8. Blocages frequents

- `node: command not found`: installer Node.js ou charger `nvm`.
- `pnpm: command not found`: installer avec `npm install -g pnpm`.
- Docker permission denied: demarrer Docker Desktop ou ajouter l'utilisateur au groupe Docker.
- QR scanne mais wallet ne recoit rien: `AGENT_PUBLIC_URL` doit etre une URL HTTPS publique qui pointe vers le port `3021`.
- Dashboard ne contacte pas le backend: verifier `NEXT_PUBLIC_REST_URL`.
- Agent Credo echoue au demarrage: verifier `GENESIS_URL`, `BCOVRIN_TESTNET_URL`, mediator et connectivite internet.
