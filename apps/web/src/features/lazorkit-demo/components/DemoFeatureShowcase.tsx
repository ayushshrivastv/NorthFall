'use client';

import { IoSparkles } from 'react-icons/io5';
import { SiSolana } from 'react-icons/si';
import AppLogo from '@/src/components/tickers/AppLogo';

/**
 * Left panel content for the LazorKit modal
 * Showcases key features and branding
 */
export default function DemoFeatureShowcase() {
    return (
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
            {/* Header */}
            <div className="flex items-start gap-2">
                <AppLogo className="text-sm" />
                <span className="text-light/50 text-xs">×</span>
                <div className="flex items-center gap-1.5">
                    <SiSolana className="text-[#14f195] size-4" />
                    <span className="text-light text-xs font-semibold tracking-wide">LazorKit</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 md:space-y-6 text-left">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <IoSparkles className="text-primary size-5" />
                        <h3 className="text-base md:text-2xl font-bold text-light tracking-wide">
                            Passkey Wallet
                        </h3>
                    </div>
                    <p className="text-[8px] md:text-sm text-light/70 leading-relaxed max-w-[320px]">
                        Experience the future of Solana wallets. No seed phrases, no gas fees, just seamless
                        authentication with your biometrics.
                    </p>
                </div>

                {/* Footer Info */}
                <div className="pt-2">
                    <p className="text-[8px] md:text-xs text-light/50 leading-relaxed">
                        Powered by{' '}
                        <a
                            href="https://docs.lazorkit.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#14f195] hover:underline"
                        >
                            LazorKit
                        </a>{' '}
                        on Solana Devnet
                    </p>
                </div>
            </div>
        </div>
    );
}
