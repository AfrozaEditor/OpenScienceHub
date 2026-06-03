import CredoAgentService from '../../src/services/CredoAgentService';
import { loadWalletConfig, saveWalletConfig, loadUserData } from '../../src/utils/localStorage';
import { fetchMediatorInvitation } from '../../src/services/mediator';

// Mock localStorage
jest.mock('../../src/utils/localStorage', () => ({
    loadWalletConfig: jest.fn(),
    saveWalletConfig: jest.fn(),
    loadUserData: jest.fn(),
    saveUserData: jest.fn(),
}));

// Mock mediator
jest.mock('../../src/services/mediator', () => ({
    fetchMediatorInvitation: jest.fn(),
}));

// Mock Credo core bridge
jest.mock('../../src/services/credoCore', () => {
    return {
        Agent: jest.fn().mockImplementation(() => ({
            initialize: jest.fn(),
            shutdown: jest.fn(),
            didcomm: {
                oob: { receiveInvitationFromUrl: jest.fn(), findById: jest.fn() },
                connections: { getAll: jest.fn() },
                credentials: { getAll: jest.fn(), acceptOffer: jest.fn() },
                proofs: { getAll: jest.fn() },
            },
            wallet: { isInitialized: true },
            dependencyManager: {
                resolve: jest.fn().mockImplementation(() => ({
                    getAll: jest.fn().mockResolvedValue([]),
                    delete: jest.fn(),
                }))
            },
            context: {},
            events: { on: jest.fn() }
        })),
        ConsoleLogger: jest.fn(),
        LogLevel: { Fatal: 'fatal' },
        CacheModule: jest.fn(),
        DidsModule: jest.fn(),
        InMemoryLruCache: jest.fn(),
    };
});

jest.mock('@credo-ts/askar', () => ({
    AskarModule: jest.fn().mockImplementation(() => ({})),
}));

// Mock indy-vdr and anoncreds
jest.mock('@credo-ts/indy-vdr', () => ({
    IndyVdrAnonCredsRegistry: jest.fn(),
    IndyVdrModule: jest.fn(),
}));

jest.mock('@credo-ts/anoncreds', () => ({
    AnonCredsModule: jest.fn(),
    AnonCredsDidCommCredentialFormatService: jest.fn(),
    LegacyIndyDidCommCredentialFormatService: jest.fn(),
    DidCommCredentialV1Protocol: jest.fn(),
    AnonCredsDidCommProofFormatService: jest.fn(),
    LegacyIndyDidCommProofFormatService: jest.fn(),
    DidCommProofV1Protocol: jest.fn(),
}));

jest.mock('../../src/services/credoAnoncreds', () => ({
    AnonCredsModule: jest.fn(),
    AnonCredsDidCommCredentialFormatService: jest.fn(),
    LegacyIndyDidCommCredentialFormatService: jest.fn(),
    DidCommCredentialV1Protocol: jest.fn(),
    AnonCredsDidCommProofFormatService: jest.fn(),
    LegacyIndyDidCommProofFormatService: jest.fn(),
    DidCommProofV1Protocol: jest.fn(),
}));

jest.mock('@credo-ts/didcomm', () => ({
    DidCommAutoAcceptCredential: { Never: 'never' },
    DidCommAutoAcceptProof: { Never: 'never' },
    DidCommCredentialV2Protocol: jest.fn(),
    DidCommHttpOutboundTransport: jest.fn(),
    DidCommMediationRepository: jest.fn(),
    DidCommMediatorPickupStrategy: { PickUpV2: 'PickUpV2' },
    DidCommModule: jest.fn(),
    DidCommProofV2Protocol: jest.fn(),
    DidCommWsOutboundTransport: jest.fn(),
}));

jest.mock('../../src/services/credoDidcomm', () => ({
    DidCommAutoAcceptCredential: { Never: 'never' },
    DidCommAutoAcceptProof: { Never: 'never' },
    DidCommCredentialV2Protocol: jest.fn(),
    DidCommHttpOutboundTransport: jest.fn(),
    DidCommMediationRepository: jest.fn(),
    DidCommMediatorPickupStrategy: { PickUpV2: 'PickUpV2' },
    DidCommModule: jest.fn(),
    DidCommProofV2Protocol: jest.fn(),
    DidCommWsOutboundTransport: jest.fn(),
}));

// Mock native bridges
jest.mock('@openwallet-foundation/askar-react-native', () => ({ askar: {} }));
jest.mock('@hyperledger/anoncreds-react-native', () => ({ anoncreds: {} }));
jest.mock('@hyperledger/indy-vdr-react-native', () => ({ indyVdr: {} }));

// Mock react-native dependencies
jest.mock('@credo-ts/react-native', () => ({
    agentDependencies: {},
}));

// Mock event listeners
jest.mock('../../src/services/CredoEventListener', () => ({
    setupCredentialEventListener: jest.fn(),
    setupProofEventListener: jest.fn(),
    setupConnectionEventListener: jest.fn(),
}));

describe('CredoAgentService', () => {
    let service: CredoAgentService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new CredoAgentService();
    });

    it('should initialize successfully with persisted config', async () => {
        (loadWalletConfig as jest.Mock).mockResolvedValue({ walletId: 'saved-id', walletKey: 'saved-key' });
        (fetchMediatorInvitation as jest.Mock).mockResolvedValue('https://mediator.com/invite');

        const result = await service.initialize();

        expect(result.success).toBe(true);
        expect(result.agentId).toBe('saved-id');
        expect(service.isAgentInitialized()).toBe(true);
    });

    it('should initialize successfully with new config if none persisted', async () => {
        (loadWalletConfig as jest.Mock).mockResolvedValue(null);
        (loadUserData as jest.Mock).mockResolvedValue({ name: 'New User' });

        const result = await service.initialize({ label: 'Test Label', pin: '1234' });

        expect(result.success).toBe(true);
        expect(saveWalletConfig).toHaveBeenCalled();
    });

    it('should handle initialization error', async () => {
        const { Agent } = require('../../src/services/credoCore');
        Agent.mockImplementationOnce(() => ({
            initialize: jest.fn().mockRejectedValue(new Error('Init failed')),
            registerOutboundTransport: jest.fn(),
            events: { on: jest.fn() }
        }));

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        await expect(service.initialize()).rejects.toThrow('Init failed');
        expect(service.isAgentInitialized()).toBe(false);

        consoleSpy.mockRestore();
    });

    it('should shutdown successfully', async () => {
        (loadWalletConfig as jest.Mock).mockResolvedValue({ walletId: 'id', walletKey: 'key' });
        await service.initialize();

        const agent = service.getAgent();
        await service.shutdown();

        expect(agent?.shutdown).toHaveBeenCalled();
        expect(service.isAgentInitialized()).toBe(false);
        expect(service.getAgent()).toBeNull();
    });

    it('should return wallet ready status', async () => {
        expect(await service.isWalletReady()).toBe(false);

        (loadWalletConfig as jest.Mock).mockResolvedValue({ walletId: 'id', walletKey: 'key' });
        await service.initialize();

        expect(await service.isWalletReady()).toBe(true);
    });
});
