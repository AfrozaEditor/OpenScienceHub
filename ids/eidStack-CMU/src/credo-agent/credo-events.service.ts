import { Injectable } from '@nestjs/common';
import type { Agent } from '@credo-ts/core';

import { PrismaService } from 'src/prisma/prisma.service';
import { lastOutOfBandId } from 'src/connection/connection-state.store';

const DidCommConnectionEventTypes = {
  DidCommConnectionStateChanged: 'ConnectionStateChanged',
} as const;

const DidCommCredentialEventTypes = {
  DidCommCredentialStateChanged: 'DidCommCredentialStateChanged',
} as const;

const DidCommProofEventTypes = {
  ProofStateChanged: 'DidCommProofStateChanged',
} as const;

const DidCommDidExchangeState = {
  Completed: 'completed',
} as const;

const DidCommCredentialState = {
  RequestReceived: 'request-received',
  CredentialIssued: 'credential-issued',
  Done: 'done',
} as const;

type CredoEvent<Payload> = {
  type: string;
  metadata: { contextCorrelationId: string } & Record<string, unknown>;
  payload: Payload;
};

type DidCommConnectionStateChangedEvent = CredoEvent<{
  connectionRecord: any;
}>;

type DidCommCredentialStateChangedEvent = CredoEvent<{
  credentialExchangeRecord: any;
}>;

type DidCommProofStateChangedEvent = CredoEvent<{
  proofRecord: any;
}>;

@Injectable()
export class CredoEventsService {
  constructor(private readonly prisma: PrismaService) {}

  // -----------------------------------------------------------------------
  // Register all event listeners
  // -----------------------------------------------------------------------
  registerEventHandlers(agent: Agent) {
    agent.events.on<DidCommConnectionStateChangedEvent>(
      DidCommConnectionEventTypes.DidCommConnectionStateChanged,
      (event) => this.handleConnection(event),
    );

    agent.events.on<DidCommCredentialStateChangedEvent>(
      DidCommCredentialEventTypes.DidCommCredentialStateChanged,
      (event) => this.handleCredential(agent, event),
    );

    agent.events.on<DidCommProofStateChangedEvent>(
      DidCommProofEventTypes.ProofStateChanged,
      (event) => this.handleProof(agent, event),
    );

    console.log('🔔 All Credo event handlers registered.');
  }

  // -----------------------------------------------------------------------
  // CONNECTION HANDLER
  // -----------------------------------------------------------------------
  private async handleConnection(event: DidCommConnectionStateChangedEvent) {
    const record = event.payload.connectionRecord;
    console.log('🔄 Connection Event:', record.state);

    // ❌ Skip mediator connections (label starts with "mediator-invite-")
    const isMediator = record.theirLabel?.startsWith('mediator-invite-');

    if (!isMediator) {
      const existing = await this.prisma.connection.findUnique({
        where: { connectionId: record.id },
      });

      if (!existing) {
        await this.prisma.connection.create({
          data: {
            connectionId: record.id,
            outOfBandId: record.outOfBandId ?? '',
            status: record.state,
            orgDid: record.did ?? '',
            holderDid: record.theirDid ?? '',
          },
        });
        console.log('🆕 New connection saved.');
      } else {
        await this.prisma.connection.update({
          where: { connectionId: record.id },
          data: {
            status: record.state,
            orgDid: record.did ?? existing.orgDid,
            holderDid: record.theirDid ?? existing.holderDid,
            updateDate: new Date(),
          },
        });
        console.log('🔁 Connection updated.');
      }
    }

    if (
      record.outOfBandId === lastOutOfBandId &&
      record.state === DidCommDidExchangeState.Completed
    ) {
      console.log('🎉 Connection established with mobile agent!');
    }
  }

  // -----------------------------------------------------------------------
  // CREDENTIAL HANDLER
  // -----------------------------------------------------------------------
  private async handleCredential(
    agent: Agent,
    event: DidCommCredentialStateChangedEvent,
  ) {
    const record = event.payload.credentialExchangeRecord;
    console.log('📜 Credential Event:', record.state);

    const existing = await this.prisma.credential.findFirst({
      where: { credExId: record.id },
    });

    if (existing) {
      await this.prisma.credential.updateMany({
        where: { credExId: record.id },
        data: {
          credentialState: record.state,
          threadId: record.threadId ?? existing.threadId,
        },
      });
      console.log('🔁 Credential updated.');
    }

    if (record.state === DidCommCredentialState.RequestReceived) {
      const latest = await agent.didcomm.credentials.findById(record.id);
      if (!latest) return;

      if (
        latest.state !== DidCommCredentialState.CredentialIssued &&
        latest.state !== DidCommCredentialState.Done
      ) {
        await agent.didcomm.credentials.acceptRequest({
          credentialExchangeRecordId: record.id,
        });

        console.log('🎉 Credential issued.');
      }
    }
  }

  // -----------------------------------------------------------------------
  // PROOF HANDLER
  // -----------------------------------------------------------------------
  private async handleProof(
    agent: Agent,
    event: DidCommProofStateChangedEvent,
  ) {
    const record = event.payload.proofRecord;
    console.log('📄 Proof Event:', record.state);

    await this.prisma.proof.updateMany({
      where: { proofRecordId: record.id },
      data: {
        state: record.state,
        threadDid: record.threadId,
        holderDid: record.connectionId ?? '',
        updateDate: new Date(),
      },
    });

    switch (record.state) {
      case 'presentation-received':
        const verified = await agent.didcomm.proofs.acceptPresentation({
          proofExchangeRecordId: record.id,
        });
        console.log('🟢 Proof verified:', verified.isVerified);
        break;

      case 'done':
        console.log('🎉 Proof exchange completed.');
        break;

      case 'declined':
        console.log('❌ Proof request declined.');
        break;

      default:
        console.log('ℹ️ Other proof state:', record.state);
    }
  }
}
