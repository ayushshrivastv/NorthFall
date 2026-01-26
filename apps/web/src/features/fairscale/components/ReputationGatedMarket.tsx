'use client';

import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { GatedMarket } from '../types';
import { TIER_CONFIGS } from '../config';
import { FaLock, FaUnlock, FaChartLine, FaClock } from 'react-icons/fa';
import { toast } from 'sonner';

interface ReputationGatedMarketProps {
    market: GatedMarket;
    userTier?: string;
}

/**
 * Reputation Gated Market Component
 * Displays a market with tier-based access control
 */
export default function ReputationGatedMarket({
    market,
    userTier = 'bronze',
}: ReputationGatedMarketProps) {
    const requiredTierConfig = TIER_CONFIGS[market.requiredTier];
    const isLocked = market.isLocked;

    const handleTrade = () => {
        if (isLocked) {
            toast.error(`Upgrade to ${requiredTierConfig.displayName} tier to access this market`);
        } else {
            toast.success('Trade executed!');
        }
    };

    return (
        <div
            className={cn(
                'p-5 rounded-lg border transition-all',
                isLocked
                    ? 'bg-neutral-900/30 border-neutral-800/50 opacity-60'
                    : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700',
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="text-base font-semibold text-light mb-1">{market.title}</h4>
                    <p className="text-xs text-light/50">{market.description}</p>
                </div>
                <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ml-3"
                    style={{
                        background: isLocked
                            ? '#333'
                            : `${requiredTierConfig.color}20`,
                        color: isLocked ? '#888' : requiredTierConfig.color,
                        border: `1px solid ${isLocked ? '#444' : requiredTierConfig.color}40`,
                    }}
                >
                    {isLocked ? <FaLock className="size-3" /> : <FaUnlock className="size-3" />}
                    <span>{requiredTierConfig.displayName}</span>
                </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Odds */}
                <div className="p-3 bg-neutral-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <FaChartLine className="size-3 text-green-500" />
                        <span className="text-xs text-light/50">Current Odds</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-green-500">
                            {market.currentOdds.yes}%
                        </span>
                        <span className="text-xs text-light/40">YES</span>
                    </div>
                </div>

                {/* Volume */}
                <div className="p-3 bg-neutral-800/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <FaClock className="size-3 text-blue-500" />
                        <span className="text-xs text-light/50">Volume</span>
                    </div>
                    <div className="text-lg font-bold text-light">
                        ${(market.volume / 1000).toFixed(0)}K
                    </div>
                </div>
            </div>

            {/* Deadline */}
            <div className="mb-4 text-xs text-light/40">
                Deadline: {new Date(market.deadline).toLocaleDateString()}
            </div>

            {/* Action Button */}
            <Button
                onClick={handleTrade}
                disabled={isLocked}
                className={cn(
                    'w-full flex items-center justify-center gap-2',
                    'px-4 py-3 text-sm font-medium rounded-lg',
                    'transition-all',
                    isLocked
                        ? 'bg-neutral-800/50 text-light/40 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary/90 text-white',
                )}
            >
                {isLocked ? (
                    <>
                        <FaLock className="size-4" />
                        <span>Locked - Upgrade to {requiredTierConfig.displayName}</span>
                    </>
                ) : (
                    <>
                        <FaChartLine className="size-4" />
                        <span>Trade Now</span>
                    </>
                )}
            </Button>

            {/* Locked Message with Requirements */}
            {isLocked && (
                <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                        <FaLock className="size-4 text-red-400 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-xs font-semibold text-red-400 mb-1">
                                Market Locked
                            </p>
                            <p className="text-xs text-light/60">
                                Requires {requiredTierConfig.icon} {requiredTierConfig.displayName} tier (Score: {requiredTierConfig.minScore}+)
                            </p>
                        </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-red-500/10">
                        <p className="text-[10px] text-light/50">
                            💡 Increase your onchain reputation to unlock this market
                        </p>
                    </div>
                </div>
            )}

            {/* Unlocked Success Message */}
            {!isLocked && (
                <div className="mt-3 p-2 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                        <FaUnlock className="size-3 text-green-400" />
                        <p className="text-xs text-green-400">
                            ✓ Unlocked with your {userTier} tier
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
