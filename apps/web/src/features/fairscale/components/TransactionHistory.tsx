'use client';

import { useFairScale } from '../providers/FairScaleProvider';
import { FiArrowUpRight, FiArrowDownLeft, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { FaGasPump, FaPercentage } from 'react-icons/fa';

interface Transaction {
    id: string;
    type: 'trade' | 'stake' | 'vote' | 'governance';
    title: string;
    amount?: string;
    timestamp: string;
    hash: string;
    reputationImpact?: number;
    benefitApplied?: string;
}

/**
 * Transaction History Component
 * Shows recent onchain activity with reputation benefits highlighted
 */
export default function TransactionHistory() {
    const { walletReputation } = useFairScale();

    // Mock recent transactions that show off reputation benefits
    // In a real app, this would come from an indexer or API
    const transactions: Transaction[] = [
        {
            id: 'tx1',
            type: 'trade',
            title: 'Market Order: SOL/USDC',
            amount: '$1,250.00',
            timestamp: '2 mins ago',
            hash: '5x9...k2P',
            reputationImpact: +2,
            benefitApplied: 'Fee Discount (25%)'
        },
        {
            id: 'tx2',
            type: 'governance',
            title: 'DAO Proposal Vote',
            amount: undefined,
            timestamp: '4 hours ago',
            hash: '9jL...p4m',
            reputationImpact: +5,
            benefitApplied: '2x Voting Weight'
        },
        {
            id: 'tx3',
            type: 'stake',
            title: 'Liquidity Provision',
            amount: '$5,000.00',
            timestamp: '1 day ago',
            hash: '3mN...v8R',
            reputationImpact: +10,
            benefitApplied: '1.5x Yield Boost'
        }
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'trade': return <FiArrowUpRight className="text-blue-400" />;
            case 'stake': return <FiRefreshCw className="text-[#9945FF]" />;
            case 'vote':
            case 'governance': return <FaGasPump className="text-green-400" />;
            default: return <FiArrowDownLeft />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-light mb-4 flex items-center justify-between">
                <span>Onchain Activity</span>
                <span className="text-[10px] text-light/40 font-normal">Recent interactions</span>
            </h3>

            <div className="space-y-4">
                {transactions.map((tx) => (
                    <div key={tx.id} className="relative pl-4 border-l border-neutral-800 last:border-0 pb-4 last:pb-0">
                        {/* Timeline dot */}
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-800 border-2 border-neutral-900" />

                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xs font-medium text-light flex items-center gap-2">
                                    {getIcon(tx.type)}
                                    {tx.title}
                                </h4>
                                <div className="text-[10px] text-light/50 mt-0.5 flex items-center gap-2">
                                    <span>{tx.timestamp}</span>
                                    <span>•</span>
                                    <a
                                        href={`https://solscan.io/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#9945FF] flex items-center gap-0.5"
                                    >
                                        {tx.hash} <FiExternalLink className="size-2" />
                                    </a>
                                </div>
                            </div>
                            {tx.amount && (
                                <span className="text-xs font-mono text-light/70">{tx.amount}</span>
                            )}
                        </div>

                        {/* Benefits highlight bubble */}
                        <div className="mt-2 flex gap-2">
                            {tx.benefitApplied && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#9945FF]/10 border border-[#9945FF]/20">
                                    <FaPercentage className="size-2 text-[#9945FF]" />
                                    <span className="text-[9px] text-[#9945FF] font-medium">
                                        {tx.benefitApplied}
                                    </span>
                                </div>
                            )}
                            {tx.reputationImpact && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                                    <span className="text-[9px] text-green-400 font-medium">
                                        FairScore +{tx.reputationImpact}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 text-center">
                <button className="text-xs text-light/40 hover:text-light transition-colors">
                    View full history on Solscan
                </button>
            </div>
        </div>
    );
}
