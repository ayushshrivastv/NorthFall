'use client';

import { LazorkitProvider } from '@lazorkit/wallet';
import { LAZORKIT_CONFIG } from '../config';
import { ReactNode } from 'react';

interface LazorKitDemoProviderProps {
    children: ReactNode;
}

/**
 * LazorKit Demo Provider
 * 
 * Wraps the LazorkitProvider from @lazorkit/wallet with demo-specific configuration.
 * This provider is isolated and only active when the demo modal is open.
 */
export function LazorKitDemoProvider({ children }: LazorKitDemoProviderProps) {
    return (
        <LazorkitProvider
            rpcUrl={LAZORKIT_CONFIG.rpcUrl}
            portalUrl={LAZORKIT_CONFIG.portalUrl}
            paymasterConfig={LAZORKIT_CONFIG.paymasterConfig}
        >
            {children}
        </LazorkitProvider>
    );
}
