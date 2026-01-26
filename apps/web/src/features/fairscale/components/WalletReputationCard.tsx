'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { useFairScale } from '../providers/FairScaleProvider';
import { FaWallet, FaSync, FaCopy } from 'react-icons/fa';
import { toast } from 'sonner';
import { truncateAddress, getAddressExplorerUrl } from '../config';

/**
 * Wallet Reputation Card Component
 * Displays connected wallet's FairScore and tier information
 */
export default function WalletReputationCard() {
    const { walletReputation, isLoading, refreshReputation } = useFairScale();
    const [copied, setCopied] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (!walletReputation) return null;

    const { address, fairScore, currentTier, nextTier, progressToNextTier } =
        walletReputation;

    const handleCopyAddress = async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        toast.success('Address copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshReputation();
        setIsRefreshing(false);
        toast.success('Reputation refreshed');
    };

    return (
        <div className="space-y-4">
            {/* Header with Wallet Address */}
            <div className="flex items-center justify-between p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <div className="flex items-center gap-3">
                    <FaWallet className="size-5 text-primary" />
                    <div>
                        <p className="text-xs text-light/50">Connected Wallet</p>
                        <p className="font-mono text-sm text-light">
                            {truncateAddress(address, 6)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleCopyAddress}
                        className={cn(
                            'p-2 h-auto',
                            'bg-transparent hover:bg-neutral-800',
                            'border-0',
                        )}
                    >
                        {copied ? (
                            <span className="text-xs text-green-500">Copied!</span>
                        ) : (
                            <FaCopy className="size-3 text-light/50" />
                        )}
                    </Button>
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={cn(
                            'p-2 h-auto',
                            'bg-transparent hover:bg-neutral-800',
                            'border-0',
                        )}
                    >
                        <FaSync
                            className={cn(
                                'size-3 text-light/50',
                                isRefreshing && 'animate-spin',
                            )}
                        />
                    </Button>
                </div>
            </div>

            {/* FairScore Display */}
            <div className="p-6 bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 border border-neutral-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-light/50 mb-1">Your FairScore</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-light">
                                {fairScore.score}
                            </span>
                            <span className="text-lg text-light/50">/1000</span>
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-center w-16 h-16 rounded-full text-3xl"
                        style={{ background: currentTier.gradient }}
                    >
                        {currentTier.icon}
                    </div>
                </div>

                {/* Tier Badge */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                        background: currentTier.gradient,
                        color: '#000',
                    }}
                >
                    <span>{currentTier.icon}</span>
                    <span>{currentTier.displayName} Tier</span>
                </div>

                {/* Progress to Next Tier */}
                {nextTier && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-light/50 mb-2">
                            <span>Progress to {nextTier.displayName}</span>
                            <span>{Math.round(progressToNextTier)}%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-500"
                                style={{
                                    width: `${progressToNextTier}%`,
                                    background: nextTier.gradient,
                                }}
                            />
                        </div>
                        <p className="text-xs text-light/40 mt-2">
                            {nextTier.minScore - fairScore.score} points to {nextTier.displayName}{' '}
                            tier
                        </p>
                    </div>
                )}

                {/* Badges */}
                {fairScore.badges.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-800">
                        <p className="text-xs text-light/50 mb-2">Badges</p>
                        <div className="flex flex-wrap gap-2">
                            {fairScore.badges.map((badge) => (
                                <span
                                    key={badge}
                                    className="px-3 py-1 bg-neutral-800/50 border border-neutral-700 rounded-full text-xs text-light/70"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
