import { Injectable } from '@nestjs/common';
import { askar } from '@openwallet-foundation/askar-nodejs';
import axios from 'axios';
import type { Agent as CredoAgent, InitConfig } from '@credo-ts/core';

import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
import { CredoEventsService } from './credo-events.service';

dotenv.config();

@Injectable()
export class CredoAgentService {
  private agent: CredoAgent | null = null;
  private issuerDid: string | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: CredoEventsService,
  ) {}

  // ---------------------------------------------------------
  // INIT AGENT
  // ---------------------------------------------------------
  async initializeAgent(input: {
    walletId: string;
    walletKey: string;
    endpoint: string;
    label: string;
    seed: string;
  }) {
    if (this.agent) return this.agent;

    const { walletId, walletKey, endpoint, seed } = input;

    // Dynamic genesis load
    const genesisTxn = await axios
      .get('https://test.bcovrin.vonx.io/genesis')
      .then((r) => r.data);

    const [
      core,
      didcomm,
      node,
      askarModule,
      indyVdrModule,
      anoncredsModule,
      indyVdrNode,
      anoncredsNode,
    ] = await Promise.all([
      import('@credo-ts/core'),
      import('@credo-ts/didcomm'),
      import('@credo-ts/node'),
      import('@credo-ts/askar'),
      import('@credo-ts/indy-vdr'),
      import('@credo-ts/anoncreds'),
      import('@hyperledger/indy-vdr-nodejs'),
      import('@hyperledger/anoncreds-nodejs'),
    ]);

    const { Agent, ConsoleLogger, LogLevel, DidsModule } = core;
    const {
      DidCommCredentialV2Protocol,
      DidCommHttpOutboundTransport,
      DidCommModule,
      DidCommProofV2Protocol,
      DidCommWsOutboundTransport,
    } = didcomm;
    const { agentDependencies, DidCommHttpInboundTransport } = node;
    const { AskarModule } = askarModule;
    const {
      IndyVdrModule,
      IndyVdrAnonCredsRegistry,
      IndyVdrIndyDidRegistrar,
      IndyVdrIndyDidResolver,
    } = indyVdrModule;
    const {
      AnonCredsModule,
      LegacyIndyDidCommCredentialFormatService,
      LegacyIndyDidCommProofFormatService,
      AnonCredsDidCommCredentialFormatService,
      AnonCredsDidCommProofFormatService,
    } = anoncredsModule;

    const config: InitConfig = {
      logger: new ConsoleLogger(LogLevel.Info),
      allowInsecureHttpUrls:
        process.env.NODE_ENV !== 'production' ||
        process.env.CREDO_ALLOW_INSECURE_HTTP === 'true',
      autoUpdateStorageOnStartup: true,
    };

    const didsModule = new DidsModule({
      registrars: [new IndyVdrIndyDidRegistrar()],
      resolvers: [new IndyVdrIndyDidResolver()],
    });

    const disableDidComm =
      process.env.OPENSCIENCE_DISABLE_DIDCOMM === 'true';

    const modules: Record<string, any> = {
      indyVdr: new IndyVdrModule({
          indyVdr: indyVdrNode.indyVdr,
          networks: [
            {
              indyNamespace: process.env.INDY_NETWORK_NAMESPACE,
              genesisTransactions: genesisTxn.toString(),
              connectOnStartup: true,
              isProduction: false,
            },
          ],
        }),

      anoncreds: new AnonCredsModule({
          registries: [new IndyVdrAnonCredsRegistry()],
          anoncreds: anoncredsNode.anoncreds,
        }),

      askar: new AskarModule({
          askar,
          store: { id: walletId, key: walletKey },
        }),

      dids: didsModule,
    };

    if (!disableDidComm) {
      modules.didcomm = new DidCommModule({
          endpoints: [endpoint],
          transports: {
            inbound: [
              new DidCommHttpInboundTransport({
                port: parseInt(process.env.AGENT_PORT ?? '3021', 10),
              }),
            ],
            outbound: [
              new DidCommHttpOutboundTransport(),
              new DidCommWsOutboundTransport(),
            ],
          },
          connections: {
            autoAcceptConnections: true,
          },
          credentials: {
            credentialProtocols: [
              new DidCommCredentialV2Protocol({
                credentialFormats: [
                  new LegacyIndyDidCommCredentialFormatService(),
                  new AnonCredsDidCommCredentialFormatService(),
                ],
              }),
            ],
          },
          proofs: {
            proofProtocols: [
              new DidCommProofV2Protocol({
                proofFormats: [
                  new LegacyIndyDidCommProofFormatService(),
                  new AnonCredsDidCommProofFormatService(),
                ],
              }),
            ],
          },
        });
    }

    // Build agent
    const agent = new Agent({
      config,
      dependencies: agentDependencies,
      modules,
    });

    await agent.initialize();
    this.agent = agent;

    // DID Registration
    const did = await this.registerBcovrinDid(agent, seed);
    this.issuerDid = `did:indy:bcovrin:test:${did}`;
    console.log('✅ Credo Agent DID registered:', this.issuerDid);

    // ---------------------------------------------------------
    // AUTO MEDIATOR CONNECTION (NON-BLOCKING)
    // ---------------------------------------------------------
    const mediator = disableDidComm
      ? { connected: false, skipped: true, reason: 'DidComm disabled' }
      : await this.tryConnectToMediator(agent);

    // Register events (single call)
    this.eventsService.registerEventHandlers(agent);

    return { agent, did: this.issuerDid, mediator };
  }

  // ---------------------------------------------------------
  // AUTO CONNECT MEDIATOR
  // ---------------------------------------------------------
  private async tryConnectToMediator(agent: CredoAgent) {
    try {
      await this.connectToMediator(agent);
      return { connected: true };
    } catch (err: any) {
      const message = err?.message ?? String(err);
      console.warn(`⚠️ Mediator connection skipped: ${message}`);
      return { connected: false, error: message };
    }
  }

  private async connectToMediator(agent: CredoAgent) {
    console.log('🔗 Connecting to mediator...');

    const resp = await axios.post(
      'https://polyid-mediator.onrender.com/createMediatorInvitation',
    );

    const mediatorUrl = resp.data.url;

    const oob = await agent.didcomm.oob.receiveInvitationFromUrl(mediatorUrl);

    console.log('🎉 Agent connected to mediator automatically! ');
    return oob;
  }

  /**
   * Register a DID on the BCovrin test ledger using seed.
   */
  private async registerBcovrinDid(
    agent: CredoAgent,
    seed: string,
  ): Promise<string> {
    interface BcovrinResponse {
      did: string;
      verkey?: string;
    }
    try {
      const [{ TypedArrayEncoder, Kms }, { transformSeedToPrivateJwk }] =
        await Promise.all([import('@credo-ts/core'), import('@credo-ts/askar')]);

      const { privateJwk } = transformSeedToPrivateJwk({
        type: { kty: 'OKP', crv: 'Ed25519' },
        seed: TypedArrayEncoder.fromUtf8String(seed),
      });
      const publicJwk = Kms.publicJwkFromPrivateJwk(privateJwk);
      if (publicJwk.kty !== 'OKP' || publicJwk.crv !== 'Ed25519') {
        throw new Error('BCovrin DID registration requires an Ed25519 seed key.');
      }

      const publicKeyBytes = TypedArrayEncoder.fromBase64Url(publicJwk.x);
      const localDid = TypedArrayEncoder.toBase58(publicKeyBytes.slice(0, 16));
      const localVerkey = TypedArrayEncoder.toBase58(publicKeyBytes);
      const issuerDid = `did:indy:bcovrin:test:${localDid}`;
      privateJwk.kid = `${issuerDid}#verkey`;

      let keyId = privateJwk.kid;
      try {
        const importedKey = await agent.kms.importKey({ privateJwk });
        keyId = importedKey.keyId;
      } catch (err: any) {
        const message = err?.message ?? String(err);
        if (!message.toLowerCase().includes('exists')) {
          throw err;
        }
      }

      const response = await axios.post<BcovrinResponse>(
        process.env.BCOVRIN_TESTNET_URL,
        {
          role: 'ENDORSER',
          alias: 'eID-Backend-Agent', //agent.config.label,
          did: localDid,
          verkey: localVerkey,
        },
      );

      if (response.data && response.data.did) {
        if (response.data.did !== localDid) {
          throw new Error(
            `BCovrin registered DID ${response.data.did}, expected ${localDid}`,
          );
        }

        console.log(
          '✅ Credo Agent DID registered on BCovrin:',
          response.data.did,
        );

        // Link the deterministic BCovrin seed key to the did:indy #verkey.
        await agent.dids.import({
          did: issuerDid,
          overwrite: true,
          keys: [
            {
              kmsKeyId: keyId,
              didDocumentRelativeKeyId: '#verkey',
            },
          ],
        });

        return response.data.did;
      } else {
        throw new Error('Invalid response from BCovrin registration API');
      }
    } catch (err: any) {
      console.error('❌ Failed to register DID on BCovrin:', err.message);
      throw err;
    }
  }

  /**
   * Receive an OOB invitation (for connection)
   */
  async receiveInvitation(invitationUrl: string) {
    if (!this.agent) throw new Error('Agent not initialized');
    const res =
      await this.agent.didcomm.oob.receiveInvitationFromUrl(invitationUrl);
    return res;
  }

  getAgent() {
    if (!this.agent) throw new Error('Agent not initialized');
    return this.agent;
  }

  getIssuerDid() {
    if (!this.issuerDid) throw new Error('Issuer DID not set');
    return this.issuerDid;
  }
}
