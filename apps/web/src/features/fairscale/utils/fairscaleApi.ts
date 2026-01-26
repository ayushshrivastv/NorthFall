import { FairScoreData, ReputationTier } from '../types';
import { getTierFromScore } from '../config';

/**
 * FairScale API Service
 * Integrates with FairScale API to fetch real reputation data
 */

const FAIRSCALE_API_KEY = process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY;
const FAIRSCALE_API_URL = process.env.NEXT_PUBLIC_FAIRSCALE_API_URL || 'https://api.fairscale.xyz';

// Fallback to mock data if API key is not available
const USE_MOCK_DATA = !FAIRSCALE_API_KEY;

// Simulate API delay for mock data
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate mock score based on wallet address (deterministic) - fallback only
const generateMockScore = (address: string): number => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor((hash % 1000) + 1);
};

// Mock badges based on tier - fallback only
const getMockBadges = (tier: ReputationTier): string[] => {
    const badgeMap: Record<ReputationTier, string[]> = {
        bronze: ['Early Adopter'],
        silver: ['Early Adopter', 'Active Trader'],
        gold: ['Early Adopter', 'Active Trader', 'Market Maker'],
        platinum: ['Early Adopter', 'Active Trader', 'Market Maker', 'VIP Member'],
    };
    return badgeMap[tier];
};

/**
 * Fetch FairScore from real FairScale API
 * @param address - Solana wallet address
 * @returns FairScoreData
 */
const fetchRealFairScore = async (address: string): Promise<FairScoreData> => {
    try {
        const response = await fetch(`${FAIRSCALE_API_URL}/api/v1/reputation/${address}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${FAIRSCALE_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`FairScale API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Map API response to our FairScoreData type
        const score = data.score || data.fairScore || 0;
        const tier = getTierFromScore(score);

        return {
            score,
            tier,
            badges: data.badges || getMockBadges(tier),
            socialSignals: {
                twitter: data.socialSignals?.twitter || false,
                discord: data.socialSignals?.discord || false,
                github: data.socialSignals?.github || false,
            },
            lastUpdated: data.lastUpdated || new Date().toISOString(),
        };
    } catch (error) {
        console.error('Error fetching real FairScore:', error);
        throw error;
    }
};

/**
 * Fetch mock FairScore (fallback)
 * @param address - Solana wallet address
 * @returns FairScoreData
 */
const fetchMockFairScore = async (address: string): Promise<FairScoreData> => {
    await delay(800);

    const score = generateMockScore(address);
    const tier = getTierFromScore(score);

    return {
        score,
        tier,
        badges: getMockBadges(tier),
        socialSignals: {
            twitter: score > 500,
            discord: score > 300,
            github: score > 600,
        },
        lastUpdated: new Date().toISOString(),
    };
};

/**
 * Fetch FairScore for a wallet address
 * Uses real API if available, falls back to mock data
 * @param address - Solana wallet address
 * @returns FairScoreData
 */
export const fetchFairScore = async (address: string): Promise<FairScoreData> => {
    // Ensure minimum 5 seconds loading time to show all loading messages
    const startTime = Date.now();
    const minLoadingTime = 5000; // 5 seconds

    if (USE_MOCK_DATA) {
        console.warn('FairScale API key not found, using mock data');
        const result = await fetchMockFairScore(address);

        // Ensure minimum loading time
        const elapsed = Date.now() - startTime;
        if (elapsed < minLoadingTime) {
            await delay(minLoadingTime - elapsed);
        }

        return result;
    }

    try {
        const result = await fetchRealFairScore(address);

        // Ensure minimum loading time even if API is fast
        const elapsed = Date.now() - startTime;
        if (elapsed < minLoadingTime) {
            await delay(minLoadingTime - elapsed);
        }

        return result;
    } catch (error) {
        console.error('Failed to fetch real FairScore, falling back to mock data:', error);
        const result = await fetchMockFairScore(address);

        // Ensure minimum loading time
        const elapsed = Date.now() - startTime;
        if (elapsed < minLoadingTime) {
            await delay(minLoadingTime - elapsed);
        }

        return result;
    }
};

/**
 * Refresh FairScore (re-fetch from API)
 * @param address - Solana wallet address
 * @returns Updated FairScoreData
 */
export const refreshFairScore = async (address: string): Promise<FairScoreData> => {
    return fetchFairScore(address);
};

/**
 * Check if FairScale API is available and healthy
 * @returns boolean indicating API availability
 */
export const checkApiHealth = async (): Promise<boolean> => {
    if (USE_MOCK_DATA) {
        return false;
    }

    try {
        const response = await fetch(`${FAIRSCALE_API_URL}/health`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${FAIRSCALE_API_KEY}`,
            },
        });
        return response.ok;
    } catch (error) {
        console.error('FairScale API health check failed:', error);
        return false;
    }
};
