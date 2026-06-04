import { OpenScienceService } from './openscience.service';

describe('OpenScienceService', () => {
  const defaultAttributes = [
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

  function buildService(overrides: Record<string, unknown> = {}) {
    const prisma = {
      schema: {
        findFirst: jest.fn().mockResolvedValue(null),
        findUnique: jest.fn(),
      },
      credentialDefinition: {
        findFirst: jest.fn().mockResolvedValue(null),
        findUnique: jest.fn().mockResolvedValue({ id: 77, cred_def_id: 'cred-def-123' }),
      },
      openScienceCredential: {
        create: jest.fn().mockImplementation(({ data }) =>
          Promise.resolve({
            id: 1,
            credentialId: data.credentialId,
            issuerDid: data.issuerDid,
            credentialDefinitionId: data.credentialDefinitionId,
            workId: data.workId,
            documentHash: data.documentHash,
            state: data.state,
            claimsJson: data.claimsJson,
          }),
        ),
        findUnique: jest.fn(),
      },
      ...overrides,
    } as any;

    const credoAgent = {
      initializeAgent: jest.fn().mockResolvedValue({ did: 'did:indy:bcovrin:test:issuer' }),
      getIssuerDid: jest.fn().mockReturnValue('did:indy:bcovrin:test:issuer'),
    } as any;

    const issuance = {
      createSchema: jest.fn().mockResolvedValue({
        schemaId: 'schema-123',
        issuerDid: 'did:indy:bcovrin:test:issuer',
      }),
      createCredentialDefinition: jest.fn().mockResolvedValue({
        credDefId: 'cred-def-123',
        issuerDid: 'did:indy:bcovrin:test:issuer',
      }),
    } as any;

    return { service: new OpenScienceService(prisma, credoAgent, issuance), prisma, credoAgent, issuance };
  }

  it('bootstraps issuer DID, schema, and credential definition idempotently', async () => {
    const { service, credoAgent, issuance } = buildService();

    const result = await service.bootstrap({
      walletId: 'openscience-wallet',
      walletKey: 'openscience-key',
      endpoint: 'http://localhost:3021',
      label: 'OpenScience Hub',
      seed: '00000000000000000000000000000001',
    });

    expect(credoAgent.initializeAgent).toHaveBeenCalledWith({
      walletId: 'openscience-wallet',
      walletKey: 'openscience-key',
      endpoint: 'http://localhost:3021',
      label: 'OpenScience Hub',
      seed: '00000000000000000000000000000001',
    });
    expect(issuance.createSchema).toHaveBeenCalledWith({
      name: 'ScientificWorkArchiveCredential',
      version: '1.0',
      attributes: defaultAttributes,
    });
    expect(issuance.createCredentialDefinition).toHaveBeenCalledWith({
      schemaId: 'schema-123',
      tag: 'openscience-hub-archive-v1',
      supportRevocation: false,
    });
    expect(result).toEqual({
      issuerDid: 'did:indy:bcovrin:test:issuer',
      schemaId: 'schema-123',
      credentialDefinitionId: 'cred-def-123',
    });
  });

  it('stores a custodian credential with normalized claims and done state', async () => {
    const { service } = buildService();

    const result = await service.issueCredential({
      credentialDefinitionId: 'cred-def-123',
      attributes: [
        { name: 'workId', value: 'OSH-2026-0001' },
        { name: 'documentHash', value: 'a'.repeat(64) },
      ],
      comment: 'ScientificWorkArchiveCredential',
    });

    expect(result.credentialId).toMatch(/^osh-cred-/);
    expect(result.issuerDid).toBe('did:indy:bcovrin:test:issuer');
    expect(result.credentialDefinitionId).toBe('cred-def-123');
    expect(result.state).toBe('done');
    expect(result.credentialAttributes).toEqual([
      { name: 'workId', value: 'OSH-2026-0001' },
      { name: 'documentHash', value: 'a'.repeat(64) },
    ]);
  });

  it('returns custodian credential status for verification', async () => {
    const { service, prisma } = buildService();
    prisma.openScienceCredential.findUnique.mockResolvedValue({
      credentialId: 'osh-cred-123',
      issuerDid: 'did:indy:bcovrin:test:issuer',
      credentialDefinitionId: 'cred-def-123',
      workId: 'OSH-2026-0001',
      documentHash: 'a'.repeat(64),
      state: 'done',
      claimsJson: {},
      rawJson: {},
    });

    const result = await service.getCredentialStatus('osh-cred-123');

    expect(result).toMatchObject({
      credentialId: 'osh-cred-123',
      status: 'done',
      valid: true,
      documentHash: 'a'.repeat(64),
      issuerDid: 'did:indy:bcovrin:test:issuer',
    });
  });
});
