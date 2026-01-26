'use client';

import { useFairScale } from '../providers/FairScaleProvider';
import { TIER_CONFIGS } from '../config';
import { ReputationTier } from '../types';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

/**
 * Tier Benefits Display Component
 * Shows comparison of benefits across all tiers
 */
export default function TierBenefitsDisplay() {
    const { walletReputation } = useFairScale();
    const currentTierName = walletReputation?.currentTier.name || 'bronze';

    const tiers: ReputationTier[] = ['bronze', 'silver', 'gold', 'platinum'];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-light">Tier Benefits</h3>

            {/* Benefits Comparison Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-800">
                            <th className="text-left p-3 text-xs text-light/50">Benefit</th>
                            {tiers.map((tier) => {
                                const config = TIER_CONFIGS[tier];
                                const isCurrent = tier === currentTierName;
                                return (
                                    <th
                                        key={tier}
                                        className="p-3 text-center"
                                        style={{
                                            background: isCurrent
                                                ? `${config.color}20`
                                                : 'transparent',
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-xl">{config.icon}</span>
                                            <span
                                                className="text-xs font-semibold"
                                                style={{
                                                    color: isCurrent ? config.color : '#888',
                                                }}
                                            >
                                                {config.displayName}
                                            </span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Trading Limit */}
                        <tr className="border-b border-neutral-800/50">
                            <td className="p-3 text-sm text-light/70">Trading Limit</td>
                            {tiers.map((tier) => {
                                const config = TIER_CONFIGS[tier];
                                const isCurrent = tier === currentTierName;
                                return (
                                    <td
                                        key={tier}
                                        className="p-3 text-center text-sm"
                                        style={{
                                            background: isCurrent
                                                ? `${config.color}10`
                                                : 'transparent',
                                            color: isCurrent ? config.color : '#aaa',
                                        }}
                                    >
                                        ${config.benefits.tradingLimit.toLocaleString()}
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Fee Discount */}
                        <tr className="border-b border-neutral-800/50">
                            <td className="p-3 text-sm text-light/70">Fee Discount</td>
                            {tiers.map((tier) => {
                                const config = TIER_CONFIGS[tier];
                                const isCurrent = tier === currentTierName;
                                return (
                                    <td
                                        key={tier}
                                        className="p-3 text-center text-sm"
                                        style={{
                                            background: isCurrent
                                                ? `${config.color}10`
                                                : 'transparent',
                                            color: isCurrent ? config.color : '#aaa',
                                        }}
                                    >
                                        {config.benefits.feeDiscount}%
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Reward Multiplier */}
                        <tr className="border-b border-neutral-800/50">
                            <td className="p-3 text-sm text-light/70">Reward Multiplier</td>
                            {tiers.map((tier) => {
                                const config = TIER_CONFIGS[tier];
                                const isCurrent = tier === currentTierName;
                                return (
                                    <td
                                        key={tier}
                                        className="p-3 text-center text-sm"
                                        style={{
                                            background: isCurrent
                                                ? `${config.color}10`
                                                : 'transparent',
                                            color: isCurrent ? config.color : '#aaa',
                                        }}
                                    >
                                        {config.benefits.rewardMultiplier}x
                                    </td>
                                );
                            })}
                        </tr>

                        {/* Early Access */}
                        <tr className="border-b border-neutral-800/50">
                            <td className="p-3 text-sm text-light/70">Early Access</td>
                            {tiers.map((tier) => {
                                const config = TIER_CONFIGS[tier];
                                const isCurrent = tier === currentTierName;
                                const hasAccess = config.benefits.earlyAccess;
                                return (
                                    <td
                                        key={tier}
                                        className="p-3 text-center"
                                        style={{
                                            background: isCurrent
                                                ? `${config.color}10`
                                                : 'transparent',
                                        }}
                                    >
                                        {hasAccess ? (
                                            <FaCheckCircle
                                                className="inline size-4"
                                                style={{
                                                    color: isCurrent ? config.color : '#4ade80',
                                                }}
                                            />
                                        ) : (
                                            <FaTimesCircle className="inline size-4 text-neutral-600" />
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Current Tier Special Perks */}
            {walletReputation && (
                <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                    <h4 className="text-sm font-semibold text-light mb-3">
                        Your {walletReputation.currentTier.displayName} Tier Perks
                    </h4>
                    <ul className="space-y-2">
                        {walletReputation.currentTier.benefits.specialPerks.map((perk) => (
                            <li
                                key={perk}
                                className="flex items-start gap-2 text-sm text-light/70"
                            >
                                <FaCheckCircle
                                    className="size-4 mt-0.5 flex-shrink-0"
                                    style={{ color: walletReputation.currentTier.color }}
                                />
                                <span>{perk}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
