'use client';

import { useWallet } from '@lazorkit/wallet';
import { useState, useCallback } from 'react';

/**
 * Custom hook for LazorKit demo functionality
 * Wraps useWallet from @lazorkit/wallet with demo-specific state and utilities
 */
export function useLazorKitDemo() {
    const wallet = useWallet();
    const [transactionHistory, setTransactionHistory] = useState<
        Array<{ signature: string; timestamp: number; amount: number }>
    >([]);
    const [error, setError] = useState<string | null>(null);

    const addTransaction = useCallback((signature: string, amount: number) => {
        setTransactionHistory((prev) => [
            { signature, timestamp: Date.now(), amount },
            ...prev,
        ]);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const handleError = useCallback((err: unknown) => {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(message);
        console.error('LazorKit Demo Error:', err);
    }, []);

    return {
        // Wallet state from LazorKit
        ...wallet,

        // Demo-specific state
        transactionHistory,
        error,

        // Demo-specific utilities
        addTransaction,
        clearError,
        handleError,
    };
}
