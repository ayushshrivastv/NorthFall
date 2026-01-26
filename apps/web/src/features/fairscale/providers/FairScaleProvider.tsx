'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
    FairScaleState,
    WalletReputation,
    FairScoreData,
    GatedMarket,
} from '../types';
import {
    getTierConfig,
    getNextTier,
    calculateProgressToNextTier,
    FAIRSCALE_MARKETS,
} from '../config';
import { fetchFairScore, refreshFairScore } from '../utils/fairscaleApi';

interface FairScaleContextValue extends FairScaleState {
    connectWallet: (address: string) => Promise<void>;
    disconnectWallet: () => void;
    refreshReputation: () => Promise<void>;
    updateMarketLockStatus: (userTier: string) => void;
}

const FairScaleContext = createContext<FairScaleContextValue | undefined>(
    undefined,
);

export const useFairScale = () => {
    const context = useContext(FairScaleContext);
    if (!context) {
        throw new Error('useFairScale must be used within FairScaleProvider');
    }
    return context;
};

interface FairScaleProviderProps {
    children: ReactNode;
}

export function FairScaleProvider({ children }: FairScaleProviderProps) {
    const [state, setState] = useState<FairScaleState>({
        isConnected: false,
        isLoading: false,
        error: null,
        walletReputation: null,
        markets: FAIRSCALE_MARKETS,
    });

    const connectWallet = useCallback(async (address: string) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            // Fetch FairScore
            const fairScore: FairScoreData = await fetchFairScore(address);

            // Get tier configuration
            const currentTier = getTierConfig(fairScore.tier);
            const nextTier = getNextTier(fairScore.tier);
            const progressToNextTier = calculateProgressToNextTier(
                fairScore.score,
                currentTier,
                nextTier,
            );

            const walletReputation: WalletReputation = {
                address,
                fairScore,
                currentTier,
                nextTier: nextTier || undefined,
                progressToNextTier,
            };

            setState((prev) => ({
                ...prev,
                isConnected: true,
                isLoading: false,
                walletReputation,
                markets: prev.markets.map((market) => ({
                    ...market,
                    isLocked: !canAccessMarket(fairScore.tier, market.requiredTier),
                })),
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to connect wallet',
            }));
        }
    }, []);

    const disconnectWallet = useCallback(() => {
        setState({
            isConnected: false,
            isLoading: false,
            error: null,
            walletReputation: null,
            markets: FAIRSCALE_MARKETS,
        });
    }, []);

    const refreshReputation = useCallback(async () => {
        if (!state.walletReputation) return;

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const fairScore = await refreshFairScore(state.walletReputation.address);

            const currentTier = getTierConfig(fairScore.tier);
            const nextTier = getNextTier(fairScore.tier);
            const progressToNextTier = calculateProgressToNextTier(
                fairScore.score,
                currentTier,
                nextTier,
            );

            setState((prev) => ({
                ...prev,
                isLoading: false,
                walletReputation: prev.walletReputation
                    ? {
                        ...prev.walletReputation,
                        fairScore,
                        currentTier,
                        nextTier: nextTier || undefined,
                        progressToNextTier,
                    }
                    : null,
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error:
                    error instanceof Error ? error.message : 'Failed to refresh reputation',
            }));
        }
    }, [state.walletReputation]);

    const updateMarketLockStatus = useCallback((userTier: string) => {
        setState((prev) => ({
            ...prev,
            markets: prev.markets.map((market) => ({
                ...market,
                isLocked: !canAccessMarket(userTier as any, market.requiredTier),
            })),
        }));
    }, []);

    const value: FairScaleContextValue = {
        ...state,
        connectWallet,
        disconnectWallet,
        refreshReputation,
        updateMarketLockStatus,
    };

    return (
        <FairScaleContext.Provider value={value}>
            {children}
        </FairScaleContext.Provider>
    );
}

// Helper function
function canAccessMarket(userTier: string, marketTier: string): boolean {
    const tierHierarchy = ['bronze', 'silver', 'gold', 'platinum'];
    const userIndex = tierHierarchy.indexOf(userTier);
    const marketIndex = tierHierarchy.indexOf(marketTier);
    return userIndex >= marketIndex;
}
