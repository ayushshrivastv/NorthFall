/**
 * LazorKit Demo Configuration
 * 
 * This file contains all configuration for the LazorKit passkey wallet demo.
 * All settings use Solana Devnet and LazorKit's test infrastructure.
 */

export const LAZORKIT_CONFIG = {
    /**
     * Solana RPC endpoint (Devnet)
     */
    rpcUrl: 'https://api.devnet.solana.com',

    /**
     * LazorKit Portal URL for passkey management
     */
    portalUrl: 'https://portal.lazor.sh',

    /**
     * Paymaster configuration for gasless transactions
     */
    paymasterConfig: {
        paymasterUrl: 'https://kora.devnet.lazorkit.com',
    },

    /**
     * Solana cluster for explorer links
     */
    cluster: 'devnet' as const,

    /**
     * Default transaction amounts for demo (in SOL)
     */
    demoAmounts: [0.01, 0.05, 0.1],

    /**
     * Demo recipient address (for testing)
     * This is a valid Devnet address for demonstration purposes
     */
    demoRecipient: '11111111111111111111111111111111',
} as const;

/**
 * Get Solscan URL for a transaction
 */
export function getExplorerUrl(signature: string, cluster: string = LAZORKIT_CONFIG.cluster): string {
    return `https://solscan.io/tx/${signature}?cluster=${cluster}`;
}

/**
 * Get Solscan URL for an address
 */
export function getAddressExplorerUrl(address: string, cluster: string = LAZORKIT_CONFIG.cluster): string {
    return `https://solscan.io/address/${address}?cluster=${cluster}`;
}

/**
 * Format SOL amount for display
 */
export function formatSOL(lamports: number): string {
    return (lamports / 1_000_000_000).toFixed(4);
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
