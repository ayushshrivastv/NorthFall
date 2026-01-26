'use client';

import { FairScaleDocsSection } from '@/src/types/fairscale-docs-types';
import DocsHeading from '../ui/DocsHeading';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface ClientFairScaleContentProps {
    section: FairScaleDocsSection;
}

export default function ClientFairScaleContent({ section }: ClientFairScaleContentProps) {
    const router = useRouter();

    const renderContent = () => {
        switch (section) {
            case FairScaleDocsSection.OVERVIEW:
                return <OverviewSection />;
            case FairScaleDocsSection.INTEGRATION:
                return <IntegrationSection />;
            case FairScaleDocsSection.CONFIGURATION:
                return <ConfigurationSection />;
            case FairScaleDocsSection.REPUTATION_SCORING:
                return <ReputationScoringSection />;
            case FairScaleDocsSection.MARKET_GATING:
                return <MarketGatingSection />;
            case FairScaleDocsSection.TIERS_AND_REWARDS:
                return <TiersAndRewardsSection />;
            case FairScaleDocsSection.API_REFERENCE:
                return <APIReferenceSection />;
            case FairScaleDocsSection.TROUBLESHOOTING:
                return <TroubleshootingSection />;
            default:
                return <OverviewSection />;
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-y-16 items-start text-left tracking-wide text-light/90 max-w-[85%] mx-auto py-8">
            {renderContent()}
        </div>
    );
}

function OverviewSection() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-start w-full space-y-8">
            <div className="text-6xl text-left flex flex-col items-start justify-center">
                <DocsHeading firstText="FairScale" secondText="Documentation" />
            </div>

            <div className="text-base text-light/80 tracking-wide max-w-[900px] leading-relaxed">
                Empower your Solana application with onchain reputation. FairScale analyzes wallet
                activity to assign credit scores, enabling tiered access, dynamic limits, and
                reward multipliers for your users.
            </div>

            <div className="flex items-center gap-x-5">
                <Button
                    size={'lg'}
                    className="bg-[#9945FF] hover:bg-black text-white"
                    onClick={() => router.push('/')}
                >
                    <span className="font-semibold">Try Demo</span>
                </Button>
                <Button
                    size={'lg'}
                    className="bg-black hover:bg-[#9945FF] text-white border-0"
                    onClick={() => window.open('https://fairscale.xyz', '_blank')}
                >
                    <span className="font-semibold">Official Website</span>
                </Button>
                <Button
                    size={'lg'}
                    className="bg-[#9945FF] hover:bg-black text-white"
                    onClick={() => window.open('https://github.com/ayushshrivastv/NorthFall/tree/main/apps/web/src/features/fairscale', '_blank')}
                >
                    <span className="font-semibold">GitHub Implementation</span>
                </Button>
            </div>

            <div className="w-full space-y-6 mt-8">
                <h2 className="text-3xl font-bold text-light">Why FairScale?</h2>
                <p className="text-light/70">
                    Traditional DeFi treats every wallet the same. FairScale brings merit-based access to onchain markets,
                    allowing protocols to trust their users based on verifiable onchain history.
                </p>

                <h3 className="text-2xl font-bold text-light mt-12 mb-6">Key Capabilities</h3>
                <div className="grid grid-cols-2 gap-6 mt-4">
                    <FeatureCard
                        title="Onchain Credit Scoring"
                        description="Reputation scores derived from transaction history, asset holding time, and protocol interactions."
                    />
                    <FeatureCard
                        title="Market Gating"
                        description="Restrict access to high-risk or premium markets based on user reputation tiers."
                    />
                    <FeatureCard
                        title="Dynamic Limits"
                        description="Automatically adjust position limits and leverage based on trust scores."
                    />
                    <FeatureCard
                        title="Reward Multipliers"
                        description="Incentivize good behavior with automated yield boosts for high-reputation users."
                    />
                </div>

                <h3 className="text-2xl font-bold text-light mt-12 mb-6">Architecture</h3>
                <pre className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-neutral-800/50 rounded-lg p-6 text-sm text-light/80 overflow-x-auto">
                    {`fairscale/
├── config.ts                    # Tier thresholds and market configs
├── providers/
│   └── FairScaleProvider.tsx    # Global reputation state provider
├── components/
│   ├── FairScaleModal.tsx       # Main reputation interface
│   ├── OnchainVerificationBadge.tsx # Blockchain proof badge
│   ├── ReputationGatedMarket.tsx # Gated market component
│   ├── TransactionHistory.tsx   # Activity log with benefits
│   └── BenefitsComparison.tsx   # Tier upgrade visualization
├── hooks/
│   └── useTierAccess.ts         # Custom hook for gating logic
└── utils/
    └── fairscaleApi.ts          # API integration layer`}
                </pre>
            </div>
        </div>
    );
}

function IntegrationSection() {
    return (
        <DocSection title="Integration">
            <h3 className="text-2xl font-bold text-light mt-12 mb-4">API Setup</h3>
            <p className="text-light/80 leading-relaxed">
                FairScale is integrated via a lightweight API wrapper. No heavy SDKs required.
            </p>

            <h3 className="text-2xl font-bold text-light mt-8">Basic Component Structure</h3>
            <CodeBlock language="tsx">
                {`// 1. Wrap your app with the provider
import { FairScaleProvider } from '@/src/features/fairscale/providers/FairScaleProvider';

export default function Layout({ children }) {
  return (
    <FairScaleProvider>
      {children}
    </FairScaleProvider>
  );
}

// 2. Use the hook in your components
import { useFairScale } from '@/src/features/fairscale/providers/FairScaleProvider';

export function UserProfile() {
  const { walletReputation, isLoading } = useFairScale();
  
  if (isLoading) return <div>Calculating Score...</div>;
  
  return (
    <div>
      <h1>Tier: {walletReputation?.currentTier.name}</h1>
      <p>Score: {walletReputation?.fairScore.score}</p>
    </div>
  );
}`}
            </CodeBlock>
        </DocSection>
    );
}

function ConfigurationSection() {
    return (
        <DocSection title="Configuration">
            <h3 className="text-2xl font-bold text-light">Environment Variables</h3>
            <p className="text-light/70">Add these to your `.env.local` file:</p>
            <CodeBlock language="bash">
                {`NEXT_PUBLIC_FAIRSCALE_API_KEY=your_api_key_here
NEXT_PUBLIC_FAIRSCALE_API_URL=https://api.fairscale.xyz
NEXT_PUBLIC_FAIRSCALE_PROGRAM_ID=fairScaLe1111111111111111111111111111111111`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">Tier Configuration</h3>
            <p className="text-light/70">Define your tier thresholds in `config.ts`:</p>
            <CodeBlock language="typescript">
                {`export const TIER_CONFIGS: Record<ReputationTier, TierConfig> = {
    bronze: {
        name: 'bronze',
        displayName: 'Bronze',
        minScore: 0,
        color: '#CD7F32',
        icon: '🥉',
        benefits: ['Basic market access']
    },
    silver: {
        name: 'silver',
        displayName: 'Silver',
        minScore: 300,
        color: '#C0C0C0',
        icon: '🥈',
        benefits: ['10% fee discount', 'Higher limits']
    },
    gold: {
        name: 'gold',
        displayName: 'Gold',
        minScore: 600,
        color: '#FFD700',
        icon: '🥇',
        benefits: ['25% fee discount', 'Priority support']
    },
    platinum: {
        name: 'platinum',
        displayName: 'Platinum',
        minScore: 900,
        color: '#E5E4E2',
        icon: '👑',
        benefits: ['50% fee discount', 'VIP status']
    }
};`}
            </CodeBlock>
        </DocSection>
    );
}

function ReputationScoringSection() {
    return (
        <DocSection title="Reputation Scoring">
            <p className="text-light/70">
                FairScale calculates a **FairScore** (0-1000) based on onchain activity.
                The scoring algorithm considers multiple factors to build a comprehensive trust profile.
            </p>

            <h3 className="text-2xl font-bold text-light mt-8">Scoring Factors</h3>
            <div className="space-y-4 mt-4">
                <FeatureCard
                    title="Transaction History"
                    description="Consistency, volume, and longevity of wallet activity."
                />
                <FeatureCard
                    title="Asset Holding"
                    description="Duration of holding key assets (preventing wash trading)."
                />
                <FeatureCard
                    title="Protocol Interactions"
                    description="Diversity of interactions with verified DeFi protocols."
                />
                <FeatureCard
                    title="Liquidations & Health"
                    description="History of maintaining healthy collateral ratios."
                />
            </div>
        </DocSection>
    );
}

function MarketGatingSection() {
    return (
        <DocSection title="Market Gating">
            <p className="text-light/70">
                Protect your markets by restricting access based on user reputation.
                This is crucial for high-leverage products, new listings, or VIP pools.
            </p>

            <h3 className="text-2xl font-bold text-light mt-8">Implementation</h3>
            <CodeBlock language="tsx">
                {`import { useFairScale } from '../providers/FairScaleProvider';

export function HighLeverageMarket() {
  const { walletReputation } = useFairScale();
  const REQUIRED_SCORE = 700; // Gold Tier
  
  const isEligible = walletReputation?.fairScore.score >= REQUIRED_SCORE;
  
  if (!isEligible) {
    return (
      <LockedMarketOverlay 
        requiredScore={REQUIRED_SCORE} 
        currentScore={walletReputation?.fairScore.score}
      />
    );
  }
  
  return <TradingInterface leverage={50} />;
}`}
            </CodeBlock>
        </DocSection>
    );
}

function TiersAndRewardsSection() {
    return (
        <DocSection title="Tiers & Rewards">
            <h3 className="text-2xl font-bold text-light">Dynamic Benefits</h3>
            <p className="text-light/70 mb-6">
                Map specific onchain benefits to reputation tiers to incentivize good behavior.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800">
                    <h4 className="text-[#9945FF] font-bold mb-2">Trading Limits</h4>
                    <ul className="text-sm text-light/70 space-y-2">
                        <li>🥉 Bronze: $5,000</li>
                        <li>🥈 Silver: $25,000</li>
                        <li>🥇 Gold: $100,000</li>
                        <li>👑 Platinum: Unlimited</li>
                    </ul>
                </div>
                <div className="p-6 rounded-lg bg-neutral-900 border border-neutral-800">
                    <h4 className="text-[#9945FF] font-bold mb-2">Fee Discounts</h4>
                    <ul className="text-sm text-light/70 space-y-2">
                        <li>🥉 Bronze: 0%</li>
                        <li>🥈 Silver: 10%</li>
                        <li>🥇 Gold: 25%</li>
                        <li>👑 Platinum: 50%</li>
                    </ul>
                </div>
            </div>
        </DocSection>
    );
}

function APIReferenceSection() {
    return (
        <DocSection title="API Reference">
            <h3 className="text-2xl font-bold text-light">useFairScale Hook</h3>
            <CodeBlock language="typescript">
                {`const {
  isConnected,        // boolean: is wallet connected
  isLoading,          // boolean: is fetching score
  walletReputation,   // object: detailed reputation data
  connectWallet,      // (address) => Promise<void>
  refreshReputation,  // () => Promise<void>
} = useFairScale();`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">WalletReputation Object</h3>
            <CodeBlock language="typescript">
                {`interface WalletReputation {
  address: string;
  fairScore: {
    score: number;      // 0-1000
    tier: string;       // 'bronze' | 'silver' | ...
    lastUpdated: string; // ISO date
    badges: string[];
  };
  currentTier: TierConfig;
  nextTier?: TierConfig;
  progressToNextTier: number; // 0-100
}`}
            </CodeBlock>
        </DocSection>
    );
}

function TroubleshootingSection() {
    return (
        <DocSection title="Troubleshooting">
            <div className="space-y-6">
                <TroubleshootCard
                    problem="API returns 401 Unauthorized"
                    solution="Check that NEXT_PUBLIC_FAIRSCALE_API_KEY is properly set in your .env.local file."
                />
                <TroubleshootCard
                    problem="Score shows as 0 for new wallets"
                    solution="New wallets with no history start at 0. Send some transactions on Solana mainnet to build history."
                />
                <TroubleshootCard
                    problem="Onchain verification link fails"
                    solution="Ensure NEXT_PUBLIC_FAIRSCALE_PROGRAM_ID is set to the correct program address for the current environment (devnet/mainnet)."
                />
            </div>
        </DocSection>
    );
}

// Helper Components (Shared)

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-start w-full space-y-8">
            <div className="text-6xl text-left flex flex-col items-start justify-center">
                <DocsHeading firstText={title} secondText="Guide" />
            </div>
            <div className="w-full space-y-8">{children}</div>
        </div>
    );
}

function CodeBlock({ language, children }: { language: string; children: string }) {
    return (
        <pre className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-neutral-800/50 rounded-lg p-6 text-sm text-light/80 overflow-x-auto">
            <code className={`language-${language}`}>{children}</code>
        </pre>
    );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="group relative bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-sm border border-neutral-800/50 hover:border-[#9945FF]/30 rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#9945FF]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            <div className="relative z-10">
                <h4 className="text-light font-semibold mb-3 text-lg">{title}</h4>
                <p className="text-sm text-light/70 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function TroubleshootCard({ problem, solution }: { problem: string; solution: string }) {
    return (
        <div className="group relative bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 backdrop-blur-sm border border-neutral-800/50 hover:border-[#9945FF]/30 rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#9945FF]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#9945FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            <div className="relative z-10">
                <h4 className="text-light font-semibold mb-3 text-lg">Problem: {problem}</h4>
                <p className="text-sm text-light/70 leading-relaxed">
                    <strong>Solution:</strong> {solution}
                </p>
            </div>
        </div>
    );
}
