import { TierConfig, ReputationTier, GatedMarket } from './types';

/**
 * FairScale Configuration
 * Contains tier definitions, API settings, and demo data
 */

// Tier Configurations
export const TIER_CONFIGS: Record<ReputationTier, TierConfig> = {
    bronze: {
        name: 'bronze',
        displayName: 'Bronze',
        minScore: 0,
        maxScore: 299,
        color: '#CD7F32',
        gradient: 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
        icon: '🥉',
        benefits: {
            tradingLimit: 100,
            feeDiscount: 0,
            rewardMultiplier: 1.0,
            earlyAccess: false,
            specialPerks: ['Access to basic markets', 'Standard support'],
        },
    },
    silver: {
        name: 'silver',
        displayName: 'Silver',
        minScore: 300,
        maxScore: 599,
        color: '#C0C0C0',
        gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
        icon: '🥈',
        benefits: {
            tradingLimit: 500,
            feeDiscount: 10,
            rewardMultiplier: 1.25,
            earlyAccess: false,
            specialPerks: [
                'Access to most markets',
                'Priority support',
                '10% fee discount',
            ],
        },
    },
    gold: {
        name: 'gold',
        displayName: 'Gold',
        minScore: 600,
        maxScore: 849,
        color: '#FFD700',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        icon: '🥇',
        benefits: {
            tradingLimit: 2000,
            feeDiscount: 25,
            rewardMultiplier: 1.5,
            earlyAccess: true,
            specialPerks: [
                'Access to all markets',
                'Early access to new markets',
                '25% fee discount',
                'VIP support',
            ],
        },
    },
    platinum: {
        name: 'platinum',
        displayName: 'Platinum',
        minScore: 850,
        maxScore: 1000,
        color: '#E5E4E2',
        gradient: 'linear-gradient(135deg, #E5E4E2 0%, #B9B9B9 100%)',
        icon: '💎',
        benefits: {
            tradingLimit: 10000,
            feeDiscount: 50,
            rewardMultiplier: 2.0,
            earlyAccess: true,
            specialPerks: [
                'Access to VIP-only markets',
                'Exclusive early access',
                '50% fee discount',
                'Dedicated account manager',
                'Custom market requests',
            ],
        },
    },
};

// API Configuration
export const FAIRSCALE_CONFIG = {
    apiUrl: process.env.NEXT_PUBLIC_FAIRSCALE_API_URL || 'https://api.fairscale.xyz',
    apiKey: process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY || '',
    network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
    rpcUrl:
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        'https://api.mainnet-beta.solana.com',
};

// Helper Functions
export const getTierFromScore = (score: number): ReputationTier => {
    if (score >= 850) return 'platinum';
    if (score >= 600) return 'gold';
    if (score >= 300) return 'silver';
    return 'bronze';
};

export const getTierConfig = (tier: ReputationTier): TierConfig => {
    return TIER_CONFIGS[tier];
};

export const getNextTier = (currentTier: ReputationTier): TierConfig | null => {
    const tiers: ReputationTier[] = ['bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    if (currentIndex === tiers.length - 1) return null;
    return TIER_CONFIGS[tiers[currentIndex + 1]];
};

export const calculateProgressToNextTier = (
    score: number,
    currentTier: TierConfig,
    nextTier: TierConfig | null,
): number => {
    if (!nextTier) return 100;
    const range = nextTier.minScore - currentTier.minScore;
    const progress = score - currentTier.minScore;
    return Math.min(100, Math.max(0, (progress / range) * 100));
};

export const truncateAddress = (address: string, chars = 4): string => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const getAddressExplorerUrl = (address: string): string => {
    const network = FAIRSCALE_CONFIG.network === 'mainnet-beta' ? '' : '?cluster=devnet';
    return `https://solscan.io/account/${address}${network}`;
};

// Markets Data
export const FAIRSCALE_MARKETS: GatedMarket[] = [
    {
        id: 'market-1',
        title: 'Will Anthropic raise Series D by Q2 2026?',
        description: 'Prediction market on Anthropic securing Series D funding',
        requiredTier: 'bronze',
        currentOdds: { yes: 65, no: 35 },
        volume: 125000,
        deadline: '2026-06-30',
        isLocked: false,
    },
    {
        id: 'market-2',
        title: 'Will OpenAI reach $5B ARR by EOY 2026?',
        description: 'Market on OpenAI revenue milestone achievement',
        requiredTier: 'silver',
        currentOdds: { yes: 72, no: 28 },
        volume: 450000,
        deadline: '2026-12-31',
        isLocked: false,
    },
    {
        id: 'market-3',
        title: 'Will Perplexity launch enterprise tier by Q3 2026?',
        description: 'Prediction on Perplexity product launch timeline',
        requiredTier: 'gold',
        currentOdds: { yes: 58, no: 42 },
        volume: 890000,
        deadline: '2026-09-30',
        isLocked: false,
    },
    {
        id: 'market-4',
        title: 'Will Figure AI achieve humanoid robot production by 2027?',
        description: 'VIP market on Figure AI manufacturing milestone',
        requiredTier: 'platinum',
        currentOdds: { yes: 45, no: 55 },
        volume: 1500000,
        deadline: '2027-12-31',
        isLocked: false,
    },
];

export const canAccessMarket = (
    userTier: ReputationTier,
    marketTier: ReputationTier,
): boolean => {
    const tierHierarchy: ReputationTier[] = ['bronze', 'silver', 'gold', 'platinum'];
    const userIndex = tierHierarchy.indexOf(userTier);
    const marketIndex = tierHierarchy.indexOf(marketTier);
    return userIndex >= marketIndex;
};
