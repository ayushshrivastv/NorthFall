/**
 * FairScale Types
 * Type definitions for reputation scoring and tier system
 */

export type ReputationTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface FairScoreData {
    score: number; // 0-1000
    tier: ReputationTier;
    badges: string[];
    socialSignals?: {
        twitter?: boolean;
        discord?: boolean;
        github?: boolean;
    };
    lastUpdated: string;
}

export interface TierBenefits {
    tradingLimit: number; // USD
    feeDiscount: number; // percentage (0-100)
    rewardMultiplier: number; // multiplier (1.0x - 2.0x)
    earlyAccess: boolean;
    specialPerks: string[];
}

export interface TierConfig {
    name: ReputationTier;
    displayName: string;
    minScore: number;
    maxScore: number;
    color: string;
    gradient: string;
    benefits: TierBenefits;
    icon: string;
}

export interface WalletReputation {
    address: string;
    fairScore: FairScoreData;
    currentTier: TierConfig;
    nextTier?: TierConfig;
    progressToNextTier: number; // percentage (0-100)
}

export interface GatedMarket {
    id: string;
    title: string;
    description: string;
    requiredTier: ReputationTier;
    currentOdds: {
        yes: number;
        no: number;
    };
    volume: number;
    deadline: string;
    isLocked: boolean;
}

export interface FairScaleState {
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    walletReputation: WalletReputation | null;
    markets: GatedMarket[];
}
