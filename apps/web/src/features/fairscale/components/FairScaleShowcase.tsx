'use client';

import { IoShieldCheckmark } from 'react-icons/io5';
import { SiSolana } from 'react-icons/si';
import AppLogo from '@/src/components/tickers/AppLogo';

/**
 * Left panel content for the FairScale modal
 * Showcases key features and branding
 */
export default function FairScaleFeatureShowcase() {
    return (
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />
            {/* Header */}
            <div className="relative z-10 flex items-start gap-2">
                <AppLogo className="text-sm" />
                <span className="text-light/50 text-xs">×</span>
                <div className="flex items-center gap-1.5">
                    <SiSolana className="text-light/70 size-4" />
                    <span className="text-light text-xs font-semibold tracking-wide">FairScale</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 space-y-4 md:space-y-6 text-left">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <IoShieldCheckmark className="text-light size-5" />
                        <h3 className="text-base md:text-2xl font-bold text-light tracking-wide">
                            Reputation Gating
                        </h3>
                    </div>
                    <p className="text-[8px] md:text-sm text-light/70 leading-relaxed max-w-[320px]">
                        Experience trust-based market access. Your onchain reputation unlocks
                        exclusive markets, better terms, and premium rewards.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-light/50 mt-1.5" />
                        <p className="text-[8px] md:text-xs text-light/60">
                            <span className="text-light font-semibold">Tiered Access</span> - Bronze to Platinum markets
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-light/50 mt-1.5" />
                        <p className="text-[8px] md:text-xs text-light/60">
                            <span className="text-light font-semibold">Dynamic Limits</span> - Higher scores, bigger positions
                        </p>
                    </div>
                    <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-light/50 mt-1.5" />
                        <p className="text-[8px] md:text-xs text-light/60">
                            <span className="text-light font-semibold">Reward Multipliers</span> - Up to 2x for VIPs
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="pt-2">
                    <p className="text-[8px] md:text-xs text-light/50 leading-relaxed">
                        Powered by{' '}
                        <a
                            href="https://fairscale.xyz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light hover:underline font-semibold"
                        >
                            FairScale
                        </a>{' '}
                        on Solana
                    </p>
                </div>
            </div>
        </div>
    );
}
