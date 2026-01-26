import { useContext } from 'react';
import { useFairScale } from '../providers/FairScaleProvider';
import { ReputationTier, TierBenefits } from '../types';
import { canAccessMarket } from '../config';

/**
 * Hook for tier-based access control
 */
export function useTierAccess() {
    const { walletReputation } = useFairScale();

    const currentTier = walletReputation?.currentTier.name || 'bronze';

    const canAccessMarketById = (marketRequiredTier: ReputationTier): boolean => {
        return canAccessMarket(currentTier, marketRequiredTier);
    };

    const getTradingLimit = (): number => {
        return walletReputation?.currentTier.benefits.tradingLimit || 100;
    };

    const getFeeDiscount = (): number => {
        return walletReputation?.currentTier.benefits.feeDiscount || 0;
    };

    const getRewardMultiplier = (): number => {
        return walletReputation?.currentTier.benefits.rewardMultiplier || 1.0;
    };

    const hasEarlyAccess = (): boolean => {
        return walletReputation?.currentTier.benefits.earlyAccess || false;
    };

    const getTierBenefits = (): TierBenefits | null => {
        return walletReputation?.currentTier.benefits || null;
    };

    return {
        currentTier,
        canAccessMarket: canAccessMarketById,
        getTradingLimit,
        getFeeDiscount,
        getRewardMultiplier,
        hasEarlyAccess,
        getTierBenefits,
    };
}
