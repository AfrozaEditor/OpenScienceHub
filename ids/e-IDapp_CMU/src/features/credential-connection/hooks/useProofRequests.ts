import { useMemo, useEffect, useState, useRef } from 'react';
import { useAgent } from '../../../features/agent';
import { useConnections } from './useConnections';
import { getMatchingCredentialsForProofRequest } from '../../../services/ProofService';

const ProofState = {
    RequestReceived: 'request-received',
} as const;

export interface ProofRequestDisplayItem {
    id: string;
    title: string;
    subtitle: string;
    createdAt: string;
    state: string;
    connectionId?: string;
    matchingCredentialsCount?: number;
}

/**
 * Hook to fetch and format proof requests for display
 * Fetches Credo proof records directly from the active agent.
 */
export const useProofRequests = () => {
    const { agent, loading: agentLoading } = useAgent();
    const [ proofs, setProofs ] = useState<any[]>([]);
    const connections = useConnections(true); // Get all connections including mediators
    const [ matchingCredsCache, setMatchingCredsCache ] = useState<Record<string, number>>({});
    const [ loading, setLoading ] = useState(true);
    const previousProofIdsRef = useRef<string>('');

    useEffect(() => {
        let cancelled = false;

        const loadProofs = async () => {
            if (!agent || agentLoading) {
                if (!cancelled) setProofs([]);
                return;
            }

            try {
                const records = await (agent as any).proofs.getAll();
                if (!cancelled) {
                    setProofs(Array.isArray(records) ? records : []);
                }
            } catch (error) {
                console.error('Error loading proof records:', error);
                if (!cancelled) setProofs([]);
            }
        };

        loadProofs();
        const interval = setInterval(loadProofs, 2000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [ agent, agentLoading ]);

    // Filter for pending proof requests (request-received state)
    const pendingProofs = useMemo(() => {
        return proofs.filter((proof: any) => {
            const state = proof.state;
            return state === ProofState.RequestReceived || state === 'request-received';
        });
    }, [ proofs ]);

    // Create a stable string of proof IDs for comparison
    const pendingProofIds = useMemo(() => {
        return pendingProofs.map((p: any) => p.id).sort().join(',');
    }, [ pendingProofs ]);

    // Transform proofs to display format
    const proofRequests = useMemo(() => {
        if (!agent || agentLoading) {
            return [];
        }

        return pendingProofs.map((proof: any) => {
            // Get connection label from connections hook
            const connection = connections.find((conn: any) => conn.id === proof.connectionId);
            const connectionLabel = connection?.theirLabel || 'Unknown Verifier';

            // Get matching credentials count from cache or fetch if not cached
            const matchingCredentialsCount = matchingCredsCache[ proof.id ] || 0;

            return {
                id: proof.id,
                title: connectionLabel,
                subtitle: 'Requested a proof',
                createdAt: proof.createdAt
                    ? (typeof proof.createdAt === 'string' ? proof.createdAt : proof.createdAt.toISOString())
                    : new Date().toISOString(),
                state: proof.state,
                connectionId: proof.connectionId,
                matchingCredentialsCount,
            };
        }).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [ pendingProofs, connections, matchingCredsCache, agent, agentLoading ]);

    // Fetch matching credentials count for each proof request (async operation)
    // Use IDs string as dependency to avoid infinite loop from array reference changes
    useEffect(() => {
        // Only run if proof IDs actually changed (prevents infinite loop)
        if (previousProofIdsRef.current === pendingProofIds) {
            return;
        }

        // If agent is not available yet, keep loading state
        if (!agent) {
            // Only set loading to false if agent loading is also complete
            if (!agentLoading) {
                setLoading(false);
            }
            return;
        }

        // If no pending proofs, set loading to false immediately
        if (pendingProofs.length === 0) {
            setLoading(false);
            previousProofIdsRef.current = pendingProofIds;
            return;
        }

        // Update ref before async operation to prevent duplicate calls
        previousProofIdsRef.current = pendingProofIds;

        const fetchMatchingCreds = async () => {
            // Avoid setting state if the component unmounted or dependencies changed fast
            let mounted = true;

            try {
                const counts: Record<string, number> = {};

                await Promise.all(
                    pendingProofs.map(async (proof: any) => {
                        try {
                            const matchingCreds = await getMatchingCredentialsForProofRequest(agent, proof.id);
                            counts[ proof.id ] = matchingCreds.length;
                        } catch (error) {
                            console.error(`Error getting matching credentials for proof ${proof.id}:`, error);
                            counts[ proof.id ] = 0;
                        }
                    })
                );

                if (mounted) {
                    setMatchingCredsCache(counts);
                }
            } catch (error) {
                console.error('Error fetching matching credentials:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }

            return () => { mounted = false; };
        };

        fetchMatchingCreds();
    }, [ agent, agentLoading, pendingProofIds, pendingProofs ]);

    // Handle initial loading state - set loading to false when agent loading is complete
    useEffect(() => {
        if (!agentLoading) {
            // If no agent but loading is complete, or if we have agent and no pending proofs
            if (!agent || (agent && pendingProofs.length === 0)) {
                setLoading(false);
            }
        }
    }, [ agent, agentLoading, pendingProofs.length ]);

    return {
        proofRequests,
        loading: loading || agentLoading,
        error: null,
        refetch: () => {
            previousProofIdsRef.current = '';
        }
    };
};
