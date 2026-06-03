# IDS eID Stack - Documentation globale

Analyse realisee le 29 mai 2026 sur le dossier `/home/bello-dev/IDS/ids`.

Cette documentation sert de base de reference pour relancer rapidement un nouveau projet d'identite numerique IDS a partir de la pile existante. Elle couvre les trois outils du dossier, leur role dans une Digital Public Infrastructure (DPI), les flux metier, les points techniques, les risques actuels et une recommandation claire pour la suite.

## 1. Resume executif

La stack actuelle IDS est une pile SSI/DIDComm complete pour emettre, stocker et verifier des justificatifs numeriques:

| Outil | Dossier | Role principal | Utilisateur cible |
| --- | --- | --- | --- |
| Backend agent / API | `eidStack-CMU` | Agent Credo serveur, API REST, emission, verification, schemas, credential definitions, liens courts, email | Equipe technique IDS, services emetteurs, services verificateurs |
| Dashboard web | `eid-sandbox-CMU` | Interface Next.js pour creer schemas, definitions, offres de credentials et demandes de preuve | Operateurs IDS, emetteurs, verificateurs |
| Wallet mobile | `e-IDapp_CMU` | Application React Native holder wallet pour recevoir, stocker, presenter et sauvegarder les credentials | Citoyens, etudiants, beneficiaires, agents terrain |

La pile fonctionne aujourd'hui comme une base solide de pilote: elle couvre le triangle Issuer / Holder / Verifier, utilise Credo, DIDComm, AnonCreds, Indy VDR, Askar, PostgreSQL, un dashboard operateur et un wallet mobile.

Recommandation IDS: conserver cette stack comme socle de demarrage pour les projets d'identite numerique, mais ne pas la considerer encore comme prete production DPI. Avant une reutilisation institutionnelle ou nationale, il faut durcir la securite, retirer les URLs et secrets hardcodes, ajouter authentification/autorisation, normaliser les deep links, mettre en place une gouvernance de confiance, clarifier la strategie de revocation et remplacer les dependances de test comme BCovrin/ngrok par des infrastructures controlees.

## 2. Portee de l'analyse

Inventaire principal parcouru:

| Zone | Volume observe | Type d'analyse |
| --- | --- | --- |
| `eidStack-CMU/src` + `prisma/schema.prisma` | environ 2 634 lignes | API NestJS, services Credo, Prisma, events, email, short URLs, config |
| `eid-sandbox-CMU/src` | environ 5 049 lignes | routes Next.js, hooks, API clients, dashboard, QR, email, proof UI |
| `e-IDapp_CMU/src` | environ 27 337 lignes TypeScript/TSX | agent mobile, wallet, proof, credentials, deep links, scan QR, backup, stockage local |
| Config backend | `package.json`, `.env.example`, `docker-compose.yml`, `entrypoint.sh`, Prisma | dependances, ports, variables, lancement |
| Config dashboard | `package.json`, `.env.example`, Next/Tailwind | dependances, variables publiques, routes |
| Config mobile | `package.json`, `.env.sample`, Android, iOS | dependances natives, schemes, permissions, variables |
| Sources externes | Credo, W3C VC/DID, DIDComm, AnonCreds, Askar, Indy VDR, World Bank DPI | positionnement standard et DPI |

Cette documentation ne remplace pas un audit de securite formel, mais elle donne une base technique realiste pour reprendre la stack, corriger ses ecarts et l'utiliser comme starter kit IDS.

## 3. Positionnement DPI

Une Digital Public Infrastructure repose generalement sur des briques partagees: identification numerique, paiements interoperables et echange securise de donnees. La stack IDS couvre principalement la brique identite numerique et echange de donnees verifiables:

- un emetteur publie des schemas et des definitions de justificatifs;
- un holder recoit un credential dans son wallet mobile;
- un verificateur demande une preuve selective;
- le holder partage uniquement les attributs necessaires;
- la verification s'appuie sur un registre verifiable et sur les preuves cryptographiques.

Dans le vocabulaire DPI, IDS peut jouer plusieurs roles:

| Role DPI / SSI | Interpretation dans IDS | Outil concerne |
| --- | --- | --- |
| Operateur de plateforme | Maintient l'infrastructure, les domaines, les agents, les politiques, les observabilites | `eidStack-CMU` |
| Emetteur | Cree les schemas, credential definitions et offres d'identifiants | `eidStack-CMU`, `eid-sandbox-CMU` |
| Verificateur | Cree des demandes de preuve et verifie les presentations | `eidStack-CMU`, `eid-sandbox-CMU` |
| Holder | Detient les credentials et autorise leur presentation | `e-IDapp_CMU` |
| Registre verifiable | Publie DID, schemas et credential definitions | BCovrin testnet aujourd'hui; registre IDS/production demain |
| Mediator DIDComm | Permet au wallet mobile de recevoir les messages DIDComm sans endpoint public entrant | Service mediator externe aujourd'hui |
| Console metier | Permet aux operateurs non techniques de piloter emission et verification | `eid-sandbox-CMU` |

## 4. Architecture globale

```text
                 +-------------------------------+
                 |        eid-sandbox-CMU        |
                 |  Dashboard Next.js operateur  |
                 +---------------+---------------+
                                 |
                                 | REST HTTPS
                                 v
                 +---------------+---------------+
                 |          eidStack-CMU          |
                 | NestJS API + Credo Agent      |
                 | Port API: 4000                |
                 | Port agent inbound: 3021      |
                 +-------+-----------+-----------+
                         |           |
            PostgreSQL   |           | DID / schemas / cred defs
        +----------------v--+        v
        | Prisma database   |  BCovrin / Indy ledger
        +-------------------+
                         |
                         | OOB URL, QR, email, short URL
                         v
                 +-------+-----------------------+
                 |        e-IDapp_CMU            |
                 | React Native holder wallet    |
                 | Credo mobile + Askar wallet   |
                 +-------+-----------------------+
                         |
                         | DIDComm via mediator
                         v
                 +-------+-----------------------+
                 | Mediator DIDComm externe      |
                 +-------------------------------+
```

Les echanges ne sont pas seulement HTTP. Le dashboard parle au backend via REST, mais l'echange credential/proof entre agent serveur et wallet passe par DIDComm, OOB invitations et mediator.

## 5. Les trois outils

### 5.1 `eidStack-CMU` - Backend agent, issuer et verifier

Technologies principales:

- NestJS 10 pour l'API REST;
- Credo `^0.5.17` pour l'agent SSI;
- AnonCreds pour credentials et preuves a divulgation selective;
- Indy VDR pour interagir avec le registre Indy/BCovrin;
- Aries Askar pour wallet/stockage cryptographique agent;
- Prisma 5 et PostgreSQL pour la persistance applicative;
- Swagger/OpenAPI pour la documentation API;
- Nodemailer et Handlebars pour l'envoi d'invitations par email;
- QRCode pour les invitations scannables.

Responsabilites:

- initialiser l'agent Credo serveur;
- enregistrer un DID issuer sur BCovrin;
- creer des schemas AnonCreds;
- creer des credential definitions;
- creer des offres de credentials via invitation OOB;
- creer des demandes de preuve;
- suivre les etats des credentials/proofs via les evenements Credo;
- stocker schemas, definitions, credentials, proofs et connexions dans PostgreSQL;
- generer des liens courts et QR codes;
- envoyer les invitations par email.

Fichiers structurants:

| Fichier | Role |
| --- | --- |
| `src/main.ts` | Bootstrap Nest, CORS, validation, Swagger, docs OpenAPI, logging |
| `src/app.module.ts` | Composition des modules backend |
| `src/config/config.service.ts` | Validation et acces aux variables d'environnement |
| `src/credo-agent/credo-agent.service.ts` | Initialisation Credo, DID, ledger, mediator, transports |
| `src/credo-agent/credo-events.service.ts` | Gestion des evenements connection, credential, proof |
| `src/issuance/issuance.service.ts` | Schemas, credential definitions, offres credential |
| `src/verification/verification.service.ts` | Demandes de preuve et statut proof |
| `src/connection/connection.service.ts` | Invitations de connexion |
| `src/short-url/short-url.service.ts` | Liens courts pour invitations longues |
| `src/email/email.service.ts` | Envoi email avec QR code |
| `prisma/schema.prisma` | Modele relationnel applicatif |

Points importants observes:

- `CredoAgentService` utilise un singleton agent en memoire. Cela simplifie le pilote, mais complique le scaling horizontal.
- Le DID issuer est enregistre sur BCovrin testnet via un seed et l'API publique BCovrin.
- Le backend expose un inbound transport HTTP sur `AGENT_PORT` et un outbound HTTP/WS.
- Le mediator est actuellement une URL externe hardcodee.
- Le service configure `ConnectionsModule` avec `autoAcceptConnections: true`.
- Les credentials/proofs utilisent les protocoles V2 et les formats AnonCreds / legacy Indy.
- Les evenements Credo mettent a jour les tables `Connection`, `Credential` et `Proof`.
- `CleanupService` supprime chaque jour les connexions non terminees.

API principale:

| Methode | Route | Usage |
| --- | --- | --- |
| `POST` | `/credo-agent/initAgent` | Initialise l'agent serveur |
| `POST` | `/credo-agent/receiveInvitation` | Recoit une invitation externe |
| `GET` | `/credo-agent/getIssuerDid` | Retourne le DID issuer |
| `GET` | `/credo-agent/getAgent` | Retourne une vue sanitisee de l'agent |
| `GET` | `/credo-agent/did` | Retourne le DID public |
| `POST` | `/connection/createInvitation` | Cree une invitation de connexion |
| `POST` | `/issuance/schemas` | Cree un schema AnonCreds |
| `GET` | `/issuance/listSchemas` | Liste tous les schemas |
| `GET` | `/issuance/schemas` | Liste paginee des schemas |
| `POST` | `/issuance/credential-definitions` | Cree une credential definition |
| `GET` | `/issuance/credential-definitions` | Liste paginee des credential definitions |
| `POST` | `/issuance/offer` | Cree une offre credential OOB |
| `GET` | `/issuance/offerStatus` | Consulte l'etat d'une offre |
| `POST` | `/verification/createProofRequest` | Cree une demande de preuve |
| `GET` | `/verification/proofStatus` | Consulte l'etat d'une preuve |
| `POST` | `/short-url/create` | Cree un lien court |
| `GET` | `/short-url/resolve` | Resout un code court |
| `GET` | `/short-url/s/:code` | Redirige vers l'URL originale |
| `POST` | `/email/send-invite-url` | Envoie une invitation par email |

Modele de donnees Prisma:

- `Connection`: trace les connexions DIDComm;
- `Schema`: schema AnonCreds local, lie aux attributs;
- `Attribute`: attributs d'un schema;
- `CredentialDefinition`: credential definition publiee sur registre;
- `Credential`: credential exchange suivi par l'API;
- `Proof`: proof exchange suivi par l'API;
- `ShortUrl`: mapping code court vers URL d'invitation.

Commandes utiles:

```bash
cd eidStack-CMU
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```

Le backend peut aussi etre lance via `docker-compose.yml` avec PostgreSQL 16 et l'application Node.

Variables critiques:

| Variable | Role |
| --- | --- |
| `DATABASE_URL` | Connexion PostgreSQL |
| `PORT` | Port API Nest, defaut 4000 |
| `AGENT_PUBLIC_URL` | URL publique de l'agent DIDComm |
| `API_BASE_URL` | URL publique API utilisee pour certains liens |
| `AGENT_PORT` | Port inbound Credo, defaut 3021 |
| `BCOVRIN_TESTNET_URL` | Genesis/registre de test |
| `INDY_NETWORK_NAMESPACE` | Namespace Indy, ex. `bcovrin:test` |
| `ISSUER_LABEL` | Label issuer dans invitations |
| `VERIFIER_LABEL` | Label verifier dans invitations |
| `CREDENTIAL_PROTOCOL_VERSION` | Version protocole credential |
| `MAIL_*` | SMTP et expediteur email |

### 5.2 `eid-sandbox-CMU` - Dashboard web operateur

Technologies principales:

- Next.js 16 et React 19;
- TypeScript;
- TanStack Query pour les appels API et le cache;
- React Hook Form et Zod pour formulaires;
- Tailwind CSS v4;
- Recharts, Lucide, Radix/shadcn-like UI.

Responsabilites:

- rediriger vers le dashboard;
- afficher une console operateur;
- creer des schemas;
- lister les schemas existants;
- creer des credential definitions;
- lister les credential definitions;
- creer une offre credential et afficher QR code;
- envoyer une invitation credential par email;
- creer une demande de preuve selective;
- afficher QR code de preuve;
- envoyer une invitation de verification par email;
- fournir une page publique `invite` qui ouvre l'application mobile via deep link.

Fichiers structurants:

| Fichier | Role |
| --- | --- |
| `src/utils/restClient.ts` | Client REST centralise vers `NEXT_PUBLIC_REST_URL` |
| `src/app/dashboard/page.tsx` | Tableau de bord |
| `src/app/dashboard/create-schema/page.tsx` | Creation schema |
| `src/app/dashboard/existing-schema/page.tsx` | Liste schemas |
| `src/app/dashboard/create-credential/page.tsx` | Creation credential definition |
| `src/app/dashboard/existing-credential/page.tsx` | Liste credential definitions |
| `src/app/dashboard/offer-credential/createCredentialOffer.tsx` | Offre credential, QR, polling statut |
| `src/app/dashboard/verify-credential/page.tsx` | Demande de preuve selective |
| `src/app/invite/invite.tsx` | Redirection web vers app mobile |
| `src/middleware.ts` | Middleware Next, authentification actuellement inactive |

Flux dashboard:

1. L'operateur ouvre `/dashboard`.
2. Il cree un schema avec nom, version et attributs.
3. Il cree une credential definition basee sur le schema.
4. Il cree une offre credential en renseignant les valeurs d'attributs.
5. Le dashboard affiche un QR code ou envoie un email.
6. Le wallet mobile scanne/recoit le lien.
7. Le dashboard poll l'API pour suivre l'etat de l'offre.
8. Pour la verification, l'operateur selectionne un schema, une credential definition et les attributs demandes.
9. Le backend cree une proof request OOB.
10. Le holder presente la preuve depuis le wallet.

Configuration:

```bash
cd eid-sandbox-CMU
pnpm install
pnpm dev
```

Variable principale:

| Variable | Role |
| --- | --- |
| `NEXT_PUBLIC_REST_URL` | URL publique de l'API `eidStack-CMU` |

Variables observees mais non presentes dans `.env.example`:

- `NEXT_PUBLIC_TRY_IT_YOURSELF_URL`;
- URL publique hardcodee utilisee pour les invitations email web.

Points importants observes:

- Le middleware d'authentification est commente: le dashboard est actuellement ouvert.
- Plusieurs statistiques du dashboard sont hardcodees.
- Les filtres search/status existent dans l'UI mais ne sont pas pleinement exploites cote backend.
- La route frontend proof utilise `createproofRequest` alors que le backend expose `createProofRequest`. Cela peut fonctionner selon la sensibilite a la casse de la couche HTTP, mais il faut uniformiser.
- Certains liens de navigation contiennent des chemins `dashboard/issuer/...` qui ne correspondent pas toujours aux routes existantes.

### 5.3 `e-IDapp_CMU` - Wallet mobile holder

Technologies principales:

- React Native 0.81;
- React 19;
- TypeScript;
- Credo React Native `^0.5.17`;
- `@credo-ts/react-hooks`, `@credo-ts/redux-store`;
- AnonCreds, Indy VDR, Askar en natif;
- WatermelonDB pour donnees locales;
- EncryptedStorage, Keychain, MMKV;
- Vision Camera et QR code scanner;
- React Navigation;
- chiffrement AES pour backup wallet.

Responsabilites:

- onboarding utilisateur;
- initialisation wallet/agent Credo mobile;
- reception d'invitations par QR code ou deep link;
- acceptation d'offres credential;
- stockage local des credentials;
- affichage des credentials et connexions;
- reception de demandes de preuve;
- selection automatique ou assistee des credentials pour preuve;
- presentation de preuves;
- gestion ZKP/proofs;
- backup et restore du wallet;
- verification PIN;
- affichage QR d'identite utilisateur.

Fichiers structurants:

| Fichier | Role |
| --- | --- |
| `src/App.tsx` | Providers globaux et permissions |
| `src/context/AgentProvider.tsx` | Pont React vers l'agent Credo |
| `src/services/CredoAgentService.ts` | Initialisation et orchestration agent mobile |
| `src/services/CredoEventListener.ts` | Evenements credential, proof, connection |
| `src/services/CredentialService.ts` | Lecture et mapping credentials |
| `src/services/ConnectionService.ts` | Gestion connexions |
| `src/services/ProofService.ts` | Proof requests, matching credentials, accept/decline |
| `src/services/DeepLinkService.ts` | Parsing deep links |
| `src/services/coreInvitationDecoder.ts` | Decodage OOB, short URL, type invitation |
| `src/hooks/useDeepLinkHandler.ts` | Gestion cold/warm deep links |
| `src/screens/ScanQRScreen.tsx` | Scan QR et modales d'action |
| `src/navigation/AppNavigator.tsx` | Navigation et linking |
| `src/storage/secureStorage.ts` | Donnees sensibles dans EncryptedStorage |
| `src/storage/localStorage.ts` | Donnees locales applicatives |
| `src/database/schema.ts` | Schema WatermelonDB |
| `src/services/wallet-backup/*` | Export/import wallet chiffre |

Fonctionnement agent mobile:

- cree ou recharge une configuration wallet stockee localement;
- utilise un wallet ID `polyid-<label>` et une cle aleatoire si aucune config n'existe;
- charge les genesis transactions via `GENESIS_URL`;
- configure le namespace Indy `bcovrin:test`;
- initialise Askar, Indy VDR, AnonCreds, Connections, Credentials, Proofs, Dids et OutOfBand;
- configure outbound HTTP/WS;
- n'expose pas d'inbound public, ce qui est normal pour mobile;
- utilise un mediator DIDComm quand disponible;
- accepte les offres credential et stocke les credentials;
- attend une action utilisateur pour les proof requests.

Stockage local:

| Stockage | Contenu |
| --- | --- |
| Askar wallet | Donnees agent, cles, records SSI |
| EncryptedStorage | PIN, wallet id/key, flags, mediator id |
| WatermelonDB | Users, credentials, connections, verifications |
| Fichiers `.afj/wallet/*` | SQLite wallet Askar utilise pour backup/restore |

Backup wallet:

- exporte les fichiers SQLite wallet;
- embarque wallet key et donnees utilisateur;
- chiffre une premiere couche avec une cle d'export;
- chiffre une deuxieme couche avec le PIN utilisateur;
- restaure les fichiers wallet puis reinitialise l'agent.

Configuration:

```bash
cd e-IDapp_CMU
npm install
npm start
npm run android
# ou
cd ios && pod install && cd ..
npm run ios
```

Variables principales:

| Variable | Role |
| --- | --- |
| `GENESIS_URL` | URL genesis Indy/BCovrin |
| `MEDIATOR_URL` | URL pour obtenir une invitation mediator |

Points importants observes:

- Android declare uniquement le scheme `polyid://`.
- Le navigateur mobile declare aussi `e-id://`, mais le parser accepte surtout `polyid://`.
- iOS ne declare pas encore clairement de scheme URL dans `Info.plist`.
- Plusieurs endpoints externes sont hardcodes: API utilisateur, API template, version control, mediator.
- Une cle API Biometrik est presente en dur dans la configuration mobile et doit etre retiree/rotatee.
- Des logs de debug exposent potentiellement invitations, proofs, headers et donnees sensibles.
- Le PIN est stocke dans un stockage chiffre, mais pas sous forme de hash applicatif.

## 6. Flux fonctionnels de bout en bout

### 6.1 Demarrage infrastructure

1. Lancer PostgreSQL.
2. Configurer `.env` backend.
3. Exposer une URL publique pour l'API et l'agent DIDComm.
4. Lancer `eidStack-CMU`.
5. Appeler `POST /credo-agent/initAgent`.
6. Le backend initialise Credo, cree/enregistre le DID issuer et configure les modules.
7. Lancer `eid-sandbox-CMU` avec `NEXT_PUBLIC_REST_URL`.
8. Lancer `e-IDapp_CMU` avec `GENESIS_URL` et `MEDIATOR_URL`.

### 6.2 Creation schema

1. Dashboard: l'operateur remplit nom, version, attributs.
2. Dashboard: `POST /issuance/schemas`.
3. Backend: appelle `agent.modules.anoncreds.registerSchema`.
4. Backend: stocke le schema et les attributs dans PostgreSQL.
5. Dashboard: rafraichit les listes.

### 6.3 Creation credential definition

1. Dashboard: selectionne un schema publie.
2. Dashboard: `POST /issuance/credential-definitions`.
3. Backend: appelle `agent.modules.anoncreds.registerCredentialDefinition`.
4. Backend: stocke la definition dans PostgreSQL.

### 6.4 Emission credential

1. Dashboard: selectionne schema et credential definition.
2. Dashboard: renseigne les valeurs d'attributs.
3. Dashboard: `POST /issuance/offer`.
4. Backend: cree une offre credential AnonCreds V2.
5. Backend: cree une invitation Out-of-Band sans handshake.
6. Backend: cree un lien court et un QR code.
7. Wallet: scanne le QR ou ouvre le deep link.
8. Wallet: decode l'invitation, recoit l'offre, l'utilisateur accepte.
9. Wallet: Credo envoie la request puis stocke le credential.
10. Backend: l'evenement Credo met a jour l'etat en base.
11. Dashboard: poll `/issuance/offerStatus`.

### 6.5 Verification / proof request

1. Dashboard: selectionne schema, credential definition et attributs demandes.
2. Dashboard: `POST /verification/createProofRequest`.
3. Backend: cree une proof request AnonCreds.
4. Backend: cree une invitation OOB, lien court et QR code.
5. Wallet: scanne/ouvre le lien.
6. Wallet: detecte les credentials compatibles.
7. Utilisateur: accepte ou refuse.
8. Wallet: envoie la presentation.
9. Backend: Credo verifie la presentation et met a jour `Proof`.
10. Dashboard: poll `/verification/proofStatus`.

### 6.6 Email invitation

1. Dashboard: ouvre le dialogue email.
2. Dashboard: appelle `/email/send-invite-url`.
3. Backend: genere un QR code et envoie un template email.
4. Le lien web invite ouvre `polyid://invite?...`.
5. Le mobile tente d'ouvrir l'app, sinon redirige vers store.

## 7. Recommandation claire pour IDS

IDS devrait transformer cette pile en "IDS eID Starter Kit": une base reutilisable pour construire rapidement des applications d'identite numerique, avec un backend agent, une console metier et un wallet holder.

Position recommandee:

- utiliser la stack actuelle pour demos, pilotes, preuves de concept et projets clients controles;
- garder Credo + DIDComm + AnonCreds comme coeur technique car la combinaison couvre issuance, verification, wallet mobile et divulgation selective;
- standardiser les templates de schemas pour les usages IDS: carte etudiant, attestation d'inscription, diplome, identite professionnelle, permis, certification, preuve d'age, preuve d'appartenance;
- produire un kit deployable avec `.env.example` complets, scripts de bootstrap, OpenAPI stable, seed data et documentation operateur;
- separer clairement les roles Issuer, Verifier et Platform Admin dans le dashboard;
- remplacer les services de test par des services IDS controles avant toute production.

Decision technique:

| Sujet | Recommandation |
| --- | --- |
| Backend | Garder NestJS + Credo, mais ajouter auth, multi-tenant, secret management et observabilite |
| Dashboard | Garder Next.js, remplacer les donnees hardcodees par des endpoints reels et ajouter RBAC |
| Wallet | Garder React Native + Credo, corriger deep links, stockage PIN, logs et configuration native iOS/Android |
| Registre | Ne pas utiliser BCovrin en production; definir un registre controle ou un DID method adapte |
| Mediator | Heberger un mediator IDS ou contractualiser un service fiable |
| Email / liens | Utiliser un domaine IDS unique, stable et securise |
| Secrets | Aucun secret dans le code ou dans l'app bundle; utiliser vault/CI secrets/config runtime |
| Revocation | Definir une strategie complete avant usage institutionnel |

Conclusion: la stack est pertinente et bien orientee, mais elle est encore au niveau sandbox avance. Elle peut devenir un socle DPI IDS si elle passe par une phase de durcissement produit et gouvernance.

## 8. Ecarts et risques a corriger

Priorite haute:

1. Secrets hardcodes: une cle API Biometrik est presente dans le code mobile; elle doit etre retiree, remplacee par une configuration securisee et rotatee.
2. Authentification absente: le dashboard a son middleware d'auth commente et l'API backend ne protege pas les operations sensibles.
3. URLs externes hardcodees: mediator, BCovrin genesis, API utilisateur, template API, dashboard invite et autres endpoints sont lies a des services externes.
4. Environnement de test: BCovrin, ngrok et services Render/Vercel ne constituent pas une base production DPI.
5. Logs sensibles: plusieurs logs affichent invitations, proof data, headers, statuts et informations potentiellement personnelles.
6. CORS permissif: `origin: true` accepte dynamiquement l'origine et doit etre restreint en production.
7. Pas de rate limiting visible sur les endpoints critiques.

Priorite moyenne:

1. Validation env incomplete: certaines variables utilisees par le code ne sont pas validees dans `ConfigService`.
2. Deep links incoherents: `polyid://` est supporte partiellement partout, `e-id://` est declare cote navigation mais pas partout dans le parsing ni en natif.
3. iOS deep links incomplets: `Info.plist` ne declare pas clairement le scheme de l'application.
4. Route proof incoherente: `createproofRequest` cote frontend vs `createProofRequest` cote backend.
5. Filtres dashboard partiels: search/status existent dans l'UI mais ne sont pas entierement pris en charge backend.
6. Cleanup agressif: suppression quotidienne de toutes les connexions non `completed`, ce qui peut supprimer des echanges encore legitimes.
7. Revocation incomplete: l'option `supportRevocation` existe mais la gestion complete des registres de revocation/tails/lifecycle n'est pas formalisee.
8. Agent singleton: le backend n'est pas pret pour multi-instance sans strategie de coordination.

Priorite basse mais importante:

1. Statistiques dashboard hardcodees.
2. Liens de navigation dashboard incoherents sur quelques chemins.
3. OpenAPI genere localement mais pas encore utilise pour generer un client type-safe.
4. PIN mobile stocke dans un stockage chiffre mais non derive sous forme de hash applicatif.
5. Backup wallet utilise une approche chiffree utile, mais devrait evoluer vers AEAD, KDF plus robuste et integration keystore/biometrie selon le niveau de risque.

## 9. Roadmap conseillee

### Phase 0 - Stabilisation immediate

- retirer et rotater tous les secrets presents dans le code;
- completer tous les `.env.example`;
- supprimer les logs sensibles;
- aligner les deep links sur un seul scheme officiel IDS;
- corriger la route `createProofRequest`;
- activer auth dashboard et API;
- limiter CORS aux domaines IDS;
- ajouter rate limit et validation stricte;
- rendre les URLs mediator, genesis, API et dashboard configurables;
- ajouter tests minimum sur issuance, verification et deep link decoding.

### Phase 1 - Starter kit reutilisable

- fournir un script `bootstrap` pour backend + DB + agent init;
- generer un client TypeScript depuis OpenAPI;
- harmoniser les types backend/frontend;
- creer des templates de schemas IDS;
- remplacer les donnees hardcodees dashboard par endpoints;
- documenter les operations: create schema, create cred def, issue, verify, revoke;
- ajouter CI pour lint, build, test;
- ajouter Docker/devcontainer complet pour chaque brique.

### Phase 2 - Produit IDS

- ajouter multi-tenant: organisations, issuers, verifiers, roles;
- ajouter RBAC et audit logs;
- gerer lifecycle complet credential: issuance, suspension, revocation, expiration;
- gerer branding par organisation;
- ajouter observabilite: traces, metrics, logs structures, alerting;
- separer les environnements dev/staging/prod;
- heberger un mediator controle IDS;
- definir une strategie DID/ledger production.

### Phase 3 - DPI readiness

- formaliser la gouvernance de confiance;
- definir politiques d'enrolement emetteurs/verificateurs;
- documenter protection des donnees, consentement, retention, droit d'acces;
- definir key custody, rotation, backup et HSM/keystore;
- prevoir interop avec normes nationales/regionales;
- auditer cryptographie, mobile, backend et infrastructure;
- tester resilience offline/low-connectivity si usage terrain.

## 10. Base de demarrage d'un nouveau projet

Checklist recommandee:

1. Copier les trois dossiers comme base de projet.
2. Choisir un nom produit et un scheme deep link unique, ex. `idsid://`.
3. Remplacer tous les labels, domaines et URLs hardcodes.
4. Creer `.env` backend a partir d'un `.env.example` complet.
5. Creer `.env` dashboard avec l'URL publique API.
6. Creer `.env` mobile avec genesis, mediator et endpoints API.
7. Lancer PostgreSQL et migrations Prisma.
8. Lancer le backend et appeler `/credo-agent/initAgent`.
9. Lancer le dashboard.
10. Lancer le wallet mobile.
11. Creer un schema test.
12. Creer une credential definition.
13. Emettre un credential par QR.
14. Scanner/accepter avec le wallet.
15. Creer une proof request.
16. Presenter la preuve depuis le wallet.
17. Verifier que le statut proof passe a `done` ou equivalent.
18. Activer auth, logs, secrets et domaines production avant livraison.

Definition of done minimale pour un projet IDS:

- un seul domaine public officiel pour API, dashboard et invitations;
- aucune cle secrete dans le code source;
- auth dashboard/API active;
- QR/deep link fonctionnels Android et iOS;
- schemas et credential definitions reproductibles;
- preuve selective testee avec au moins un credential;
- logs sans donnees sensibles;
- README projet mis a jour;
- build backend, dashboard et mobile valide.

## 11. Etat upgrade progressif - 30 mai 2026

Upgrade applique sans casser le fonctionnement existant:

| Zone | Niveau atteint | Validation |
| --- | --- | --- |
| Backend `eidStack-CMU` | Patch/minor Nest 10, Prisma 5, Apollo Server 4, Credo 0.5, Hyperledger AnonCreds/Indy VDR compatibles | `npm run build`, `npm test -- --runInBand`, `npm run test:e2e -- --runInBand`, smoke live `/credo-agent/initAgent` |
| Dashboard `eid-sandbox-CMU` | Patch/minor Next 16, React 19, Tailwind 4, React Query, Recharts, Zod, React Hook Form | `corepack pnpm lint`, `corepack pnpm build`, smoke HTTP `http://localhost:3000/dashboard` |
| Mobile `e-IDapp_CMU` | Dependances npm deja a jour dans la plage actuelle; patches natifs reappliques | `npm run postinstall`, `npm run lint`, `npm test -- --runInBand --silent` |

Services verifies apres upgrade:

| Service | Port | Etat |
| --- | --- | --- |
| API backend | `4000` | OK, retourne `issuerDid` |
| Agent inbound DIDComm | `3021` | OK, port ecoute |
| PostgreSQL principal | `5432` | OK, base principale utilisee |
| Dashboard Next.js | `3000` | OK, HTTP `200` |
| Metro React Native | `8081` | OK, `packager-status:running` |

Limite volontaire de l'upgrade:

- ne pas passer automatiquement a Nest 11 sans migration Express v5 et validation route par route;
- ne pas passer automatiquement a Prisma 7 sans migration Prisma config, generation client, changements CLI et verification des scripts DB;
- ne pas passer automatiquement a Apollo Server 5 sans verifier la compatibilite Nest GraphQL/Apollo et la version Node cible;
- ne pas passer automatiquement a Credo 0.7 / Hyperledger AnonCreds 0.4 / Indy VDR 0.3 sans migration SSI coordonnee backend + mobile;
- ne pas passer React Native/Credo mobile aux majors sans builds Android/iOS natifs reels.

Regle de suite: les patch/minor valides peuvent continuer dans cette branche. Les majors restants doivent etre traites comme chantiers de migration separes, chacun avec build, tests backend, tests dashboard, tests wallet, smoke DIDComm et validation native Android/iOS.

## 12. Sources officielles consultees

- OpenWallet Foundation Credo: https://openwallet.foundation/projects/credo/
- Credo TypeScript framework: https://github.com/openwallet-foundation/credo-ts
- Credo documentation: https://credo.js.org/guides
- Credo updating guide: https://credo.js.org/guides/updating
- W3C Verifiable Credentials Data Model: https://www.w3.org/TR/vc-data-model/
- W3C DID Core: https://www.w3.org/TR/did-core/
- DIDComm Messaging v2: https://identity.foundation/didcomm-messaging/spec/
- Hyperledger AnonCreds specification: https://hyperledger.github.io/anoncreds-spec/
- OpenWallet Aries Askar: https://github.com/openwallet-foundation/askar
- Hyperledger Indy VDR: https://github.com/hyperledger/indy-vdr
- NestJS migration guide: https://docs.nestjs.com/migration-guide
- Prisma 7 upgrade guide: https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7
- Apollo Server 4 to 5 migration guide: https://www.apollographql.com/docs/apollo-server/migration
- World Bank Digital Public Infrastructure and Services: https://www.worldbank.org/ext/en/topic/digital-and-ai/digital-public-infrastructure-and-services
- World Bank Global Digital Public Infrastructure Program: https://www.worldbank.org/en/results/2026/05/06/global-digital-public-infrastructure-program

## 13. Lecture rapide par role

Pour un developpeur backend:

- commencer par `eidStack-CMU/src/credo-agent/credo-agent.service.ts`;
- lire ensuite `issuance.service.ts`, `verification.service.ts`, `credo-events.service.ts`;
- verifier `prisma/schema.prisma`;
- comparer routes frontend/backend.

Pour un developpeur frontend:

- commencer par `eid-sandbox-CMU/src/utils/restClient.ts`;
- lire les pages dashboard `create-schema`, `create-credential`, `offer-credential`, `verify-credential`;
- corriger auth, routes, filtres et types.

Pour un developpeur mobile:

- commencer par `e-IDapp_CMU/src/services/CredoAgentService.ts`;
- lire `CredoEventListener.ts`, `ProofService.ts`, `CredentialService.ts`;
- lire `DeepLinkService.ts`, `coreInvitationDecoder.ts`, `ScanQRScreen.tsx`;
- verifier `AndroidManifest.xml` et `Info.plist`.

Pour un chef de projet IDS:

- retenir que la stack sait deja emettre et verifier;
- traiter le durcissement comme une phase obligatoire;
- standardiser les schemas metier avant de multiplier les projets;
- ne pas vendre BCovrin/ngrok/services externes comme une infrastructure production.
