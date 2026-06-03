import { useEffect, useMemo, useState } from 'react';
import { useAgent } from '../../../features/agent';
import { useConnections } from './useConnections';

const ProofState = {
    RequestReceived: 'request-received',
    PresentationSent: 'presentation-sent',
    Done: 'done',
} as const;

export interface ProofHistoryItem {
    id: string;
    title: string;
    subtitle: string;
    createdAt: string;
    state: string;
    connectionId?: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed' | 'failed';
    statusText: string;
    isCompleted: boolean;
}

/**
 * Hook to fetch and format all proof requests including history
 * Shows pending, completed, declined, and failed proofs
 */
export const useProofHistory = () => {
    const { agent, loading: agentLoading } = useAgent();
    const [ proofs, setProofs ] = useState<any[]>([]);
    const connections = useConnections(true); // Get all connections including mediators

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
                console.error('Error loading proof history:', error);
                if (!cancelled) setProofs([]);
            }
        };

        loadProofs();
        const interval = setInterval(loadProofs, 3000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [ agent, agentLoading ]);

    // Transform all proofs to display format with status
    const proofHistory = useMemo(() => {
        return proofs.map((proof: any) => {
            // Get connection label from connections hook
            const connection = connections.find((conn: any) => conn.id === proof.connectionId);
            const connectionLabel = connection?.theirLabel || 'Unknown Verifier';

            // Determine status and display text based on proof state
            let status: ProofHistoryItem['status'] = 'pending';
            let statusText = 'Unknown';
            let isCompleted = false;

            switch (proof.state) {
                case ProofState.RequestReceived:
                case 'request-received':
                    status = 'pending';
                    statusText = 'Waiting for Response';
                    break;
                
                case ProofState.PresentationSent:
                case 'presentation-sent':
                    status = 'accepted';
                    statusText = 'Proof Sent';
                    break;
                
                case ProofState.Done:
                case 'done':
                    status = 'completed';
                    statusText = 'Completed';
                    isCompleted = true;
                    break;
                
                case 'declined':
                case 'abandoned':
                    status = 'declined';
                    statusText = 'Declined';
                    isCompleted = true;
                    break;
                
                default:
                    // Handle any other states
                    if (proof.state?.includes('error') || proof.state?.includes('failed')) {
                        status = 'failed';
                        statusText = 'Failed';
                        isCompleted = true;
                    } else {
                        status = 'pending';
                        statusText = proof.state || 'Unknown Status';
                    }
            }

            return {
                id: proof.id,
                title: connectionLabel,
                subtitle: 'Proof Request',
                createdAt: proof.createdAt
                    ? (typeof proof.createdAt === 'string' ? proof.createdAt : proof.createdAt.toISOString())
                    : new Date().toISOString(),
                state: proof.state,
                connectionId: proof.connectionId,
                status,
                statusText,
                isCompleted,
            };
        }).sort(
            // Sort by creation date (newest first)
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [proofs, connections]);

    // Filter functions for different views
    const pendingProofs = useMemo(() => {
        return proofHistory.filter(proof => proof.status === 'pending');
    }, [proofHistory]);

    const completedProofs = useMemo(() => {
        return proofHistory.filter(proof => proof.isCompleted);
    }, [proofHistory]);

    const acceptedProofs = useMemo(() => {
        return proofHistory.filter(proof => proof.status === 'accepted' || proof.status === 'completed');
    }, [proofHistory]);

    const declinedProofs = useMemo(() => {
        return proofHistory.filter(proof => proof.status === 'declined');
    }, [proofHistory]);

    return {
        // All proofs with status
        allProofs: proofHistory,
        
        // Filtered views
        pendingProofs,
        completedProofs, 
        acceptedProofs,
        declinedProofs,
        
        // Summary counts
        totalCount: proofHistory.length,
        pendingCount: pendingProofs.length,
        completedCount: completedProofs.length,
        acceptedCount: acceptedProofs.length,
        declinedCount: declinedProofs.length,
    };
};
