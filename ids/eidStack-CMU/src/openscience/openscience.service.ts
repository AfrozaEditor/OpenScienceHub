import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CredoAgentService } from '../credo-agent/credo-agent.service';
import { IssuanceService } from '../issuance/issuance.service';
import {
  BootstrapOpenScienceDto,
  IssueOpenScienceCredentialDto,
} from './dto/openscience.dto';

const DEFAULT_SCHEMA_NAME = 'ScientificWorkArchiveCredential';
const DEFAULT_SCHEMA_VERSION = '1.0';
const DEFAULT_CRED_DEF_TAG = 'openscience-hub-archive-v1';

const DEFAULT_ATTRIBUTES = [
  { attributeName: 'workId', schemaDataType: 'string', displayName: 'Work ID' },
  { attributeName: 'title', schemaDataType: 'string', displayName: 'Title' },
  { attributeName: 'author', schemaDataType: 'string', displayName: 'Author' },
  { attributeName: 'institution', schemaDataType: 'string', displayName: 'Institution' },
  { attributeName: 'department', schemaDataType: 'string', displayName: 'Department' },
  { attributeName: 'workType', schemaDataType: 'string', displayName: 'Work Type' },
  { attributeName: 'documentHash', schemaDataType: 'string', displayName: 'Document Hash' },
  { attributeName: 'academicStatus', schemaDataType: 'string', displayName: 'Academic Status' },
  { attributeName: 'issuedAt', schemaDataType: 'string', displayName: 'Issued At' },
];

@Injectable()
export class OpenScienceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly credoAgentService: CredoAgentService,
    private readonly issuanceService: IssuanceService,
  ) {}

  async bootstrap(input: BootstrapOpenScienceDto) {
    await this.credoAgentService.initializeAgent({
      walletId: input.walletId,
      walletKey: input.walletKey,
      endpoint: input.endpoint,
      label: input.label,
      seed: input.seed,
    });

    const issuerDid = this.credoAgentService.getIssuerDid();
    const schemaName = input.schemaName || DEFAULT_SCHEMA_NAME;
    const schemaVersion = input.schemaVersion || DEFAULT_SCHEMA_VERSION;
    const credentialDefinitionTag =
      input.credentialDefinitionTag || DEFAULT_CRED_DEF_TAG;

    let schema = await this.prisma.schema.findFirst({
      where: { name: schemaName, version: schemaVersion, issuerId: issuerDid },
    });

    let schemaId = schema?.schema_id;
    if (!schemaId) {
      const created = await this.issuanceService.createSchema({
        name: schemaName,
        version: schemaVersion,
        attributes: DEFAULT_ATTRIBUTES,
      });
      schemaId = created.schemaId;
      schema = await this.prisma.schema.findUnique({
        where: { schema_id: schemaId },
      });
    }

    let credDef =
      schema?.id !== undefined
        ? await this.prisma.credentialDefinition.findFirst({
            where: { schemaId: schema.id, name: credentialDefinitionTag },
          })
        : null;

    let credentialDefinitionId = credDef?.cred_def_id;
    if (!credentialDefinitionId) {
      const created = await this.issuanceService.createCredentialDefinition({
        schemaId,
        tag: credentialDefinitionTag,
        supportRevocation: false,
      });
      credentialDefinitionId = created.credDefId;
    }

    return {
      issuerDid,
      schemaId,
      credentialDefinitionId,
    };
  }

  async issueCredential(input: IssueOpenScienceCredentialDto) {
    if (!input.attributes?.length) {
      throw new BadRequestException('attributes are required');
    }

    const credDef = await this.prisma.credentialDefinition.findUnique({
      where: { cred_def_id: input.credentialDefinitionId },
    });
    if (!credDef) {
      throw new NotFoundException('credential definition not found');
    }

    const claims = Object.fromEntries(
      input.attributes.map((attribute) => [attribute.name, attribute.value]),
    );
    if (!claims.documentHash) {
      throw new BadRequestException('documentHash attribute is required');
    }

    const issuerDid = this.credoAgentService.getIssuerDid();
    const credentialId = `osh-cred-${randomUUID()}`;
    const state = 'done';

    const credential = await (this.prisma as any).openScienceCredential.create({
      data: {
        credentialId,
        issuerDid,
        credentialDefinitionId: input.credentialDefinitionId,
        workId: claims.workId || '',
        documentHash: claims.documentHash,
        state,
        claimsJson: claims,
        rawJson: {
          credentialAttributes: input.attributes,
          comment: input.comment || '',
        },
        comment: input.comment || '',
      },
    });

    return {
      credentialId: credential.credentialId,
      issuerDid: credential.issuerDid,
      credentialDefinitionId: credential.credentialDefinitionId,
      state: credential.state,
      credentialAttributes: input.attributes,
    };
  }

  async getCredentialStatus(credentialId: string) {
    const credential = await (this.prisma as any).openScienceCredential.findUnique({
      where: { credentialId },
    });
    if (!credential) {
      return {
        credentialId,
        status: 'not-found',
        valid: false,
      };
    }
    return {
      credentialId: credential.credentialId,
      status: credential.state,
      valid: !['revoked', 'abandoned', 'problem-report', 'not-found'].includes(
        credential.state,
      ),
      documentHash: credential.documentHash,
      issuerDid: credential.issuerDid,
      raw: credential,
    };
  }
}
