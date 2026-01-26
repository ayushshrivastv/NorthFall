'use client';

import { SiSolana } from 'react-icons/si';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { HiExternalLink } from 'react-icons/hi';

interface OnchainVerificationBadgeProps {
    walletAddress: string;
    lastUpdated: string;
}

/**
 * Onchain Verification Badge
 * Shows that the FairScore is verified on Solana blockchain
 */
export default function OnchainVerificationBadge({
    walletAddress,
    lastUpdated
}: OnchainVerificationBadgeProps) {
    // FairScale program ID on Solana
    const FAIRSCALE_PROGRAM_ID = 'fairScaLe1111111111111111111111111111111111';
    const explorerUrl = `https://solscan.io/account/${walletAddress}`;
    const contractUrl = `https://solscan.io/account/${FAIRSCALE_PROGRAM_ID}`;

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const updated = new Date(timestamp);
        const diffMs = now.getTime() - updated.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="bg-gradient-to-br from-[#9945FF]/5 to-transparent border border-[#9945FF]/20 rounded-lg p-3 md:p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#9945FF]/10">
                        <IoCheckmarkCircle className="text-[#9945FF] size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xs md:text-sm font-semibold text-light">
                                Verified Onchain
                            </h4>
                            <SiSolana className="text-[#9945FF] size-3 md:size-4" />
                        </div>
                        <p className="text-[10px] md:text-xs text-light/50">
                            Last updated: {getTimeAgo(lastUpdated)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Explorer Links */}
            <div className="mt-3 pt-3 border-t border-light/5 space-y-2">
                <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 text-[10px] md:text-xs text-light/70 hover:text-[#9945FF] transition-colors group"
                >
                    <span>View wallet on Solscan</span>
                    <HiExternalLink className="size-3 md:size-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Only show contract link if using real FairScale program ID */}
                {process.env.NEXT_PUBLIC_FAIRSCALE_PROGRAM_ID && (
                    <a
                        href={`https://solscan.io/account/${process.env.NEXT_PUBLIC_FAIRSCALE_PROGRAM_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 text-[10px] md:text-xs text-light/70 hover:text-[#9945FF] transition-colors group"
                    >
                        <span>View FairScale contract on Solscan</span>
                        <HiExternalLink className="size-3 md:size-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                )}
            </div>

            {/* Trust Indicator */}
            <div className="mt-3 pt-3 border-t border-light/5">
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-light/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#9945FF] to-purple-400 w-full animate-pulse" />
                    </div>
                    <span className="text-[10px] text-light/50">Blockchain Verified</span>
                </div>
            </div>
        </div>
    );
}
