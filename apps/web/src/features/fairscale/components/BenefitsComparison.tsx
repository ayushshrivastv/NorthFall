'use client';

import { useFairScale } from '../providers/FairScaleProvider';
import { FiTrendingUp, FiDollarSign, FiPercent, FiUnlock } from 'react-icons/fi';

/**
 * Dynamic Benefits Comparison
 * Shows what user has now vs what they'd get at next tier
 */
export default function BenefitsComparison() {
    const { walletReputation } = useFairScale();

    if (!walletReputation) return null;

    const { currentTier, nextTier } = walletReputation;

    // Calculate benefits based on tier
    const getBenefits = (tierName: string) => {
        const benefits = {
            bronze: {
                tradingLimit: '$5,000',
                rewardMultiplier: '1.0x',
                feeDiscount: '0%',
                marketsAccess: '3/12',
            },
            silver: {
                tradingLimit: '$10,000',
                rewardMultiplier: '1.25x',
                feeDiscount: '10%',
                marketsAccess: '6/12',
            },
            gold: {
                tradingLimit: '$25,000',
                rewardMultiplier: '1.5x',
                feeDiscount: '25%',
                marketsAccess: '9/12',
            },
            platinum: {
                tradingLimit: '$100,000',
                rewardMultiplier: '2.0x',
                feeDiscount: '50%',
                marketsAccess: '12/12',
            },
        };
        return benefits[tierName as keyof typeof benefits] || benefits.bronze;
    };

    const currentBenefits = getBenefits(currentTier.name);
    const nextBenefits = nextTier ? getBenefits(nextTier.name) : null;

    const BenefitRow = ({
        icon: Icon,
        label,
        current,
        next
    }: {
        icon: any;
        label: string;
        current: string;
        next: string | null;
    }) => (
        <div className="flex items-center justify-between py-2 border-b border-light/5 last:border-0">
            <div className="flex items-center gap-2">
                <Icon className="text-[#9945FF] size-4" />
                <span className="text-xs text-light/70">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-light">{current}</span>
                {next && (
                    <>
                        <span className="text-light/30">→</span>
                        <span className="text-sm font-semibold text-[#9945FF]">{next}</span>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Current Benefits */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-light mb-3 flex items-center gap-2">
                    <span className="text-[#9945FF]">●</span>
                    Your Current Benefits ({currentTier.name})
                </h3>
                <div className="space-y-1">
                    <BenefitRow
                        icon={FiDollarSign}
                        label="Trading Limit"
                        current={currentBenefits.tradingLimit}
                        next={nextBenefits?.tradingLimit || null}
                    />
                    <BenefitRow
                        icon={FiTrendingUp}
                        label="Reward Multiplier"
                        current={currentBenefits.rewardMultiplier}
                        next={nextBenefits?.rewardMultiplier || null}
                    />
                    <BenefitRow
                        icon={FiPercent}
                        label="Fee Discount"
                        current={currentBenefits.feeDiscount}
                        next={nextBenefits?.feeDiscount || null}
                    />
                    <BenefitRow
                        icon={FiUnlock}
                        label="Markets Access"
                        current={currentBenefits.marketsAccess}
                        next={nextBenefits?.marketsAccess || null}
                    />
                </div>
            </div>

            {/* Upgrade Preview */}
            {nextTier && (
                <div className="bg-gradient-to-br from-[#9945FF]/10 to-transparent border border-[#9945FF]/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-light">
                            Unlock {nextTier.name} Benefits
                        </h3>
                        <span className="text-xs text-[#9945FF] font-medium">
                            +{nextTier.minScore - walletReputation.fairScore.score} points needed
                        </span>
                    </div>
                    <p className="text-xs text-light/60">
                        Increase your onchain activity to unlock higher trading limits, better rewards, and access to all premium markets.
                    </p>
                </div>
            )}

            {/* Value Unlocked */}
            <div className="bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20 rounded-lg p-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-light/70">Total Value Unlocked</span>
                    <span className="text-sm font-bold text-green-400">$450+</span>
                </div>
                <p className="text-[10px] text-light/50 mt-1">
                    Estimated savings from fee discounts and extra rewards
                </p>
            </div>
        </div>
    );
}
