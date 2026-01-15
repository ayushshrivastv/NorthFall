# LazorKit Integration Documentation

Complete technical documentation for integrating LazorKit passkey wallet technology into your application.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Core Concepts](#core-concepts)
5. [API Reference](#api-reference)
6. [Components](#components)
7. [Error Handling](#error-handling)
8. [Code Examples](#code-examples)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Overview

LazorKit provides passkey-based wallet authentication for Solana applications. This integration demonstrates three core features:

**Passkey Authentication**: Create wallets using WebAuthn biometrics (FaceID, TouchID, Windows Hello) without seed phrases.

**Gasless Transactions**: Send SOL transfers without users paying gas fees through Paymaster sponsorship.

**Session Persistence**: Automatic wallet reconnection across page refreshes and device synchronization.

### Architecture

```
lazorkit-demo/
├── config.ts                    # Configuration and utilities
├── providers/
│   └── LazorKitDemoProvider.tsx # Context provider
├── components/
│   ├── LazorKitDemoModal.tsx    # Main container
│   ├── PasskeyWalletConnect.tsx # Wallet UI
│   ├── GaslessTransactionDemo.tsx # Transaction UI
│   ├── DemoFeatureShowcase.tsx  # Feature panel
│   └── SessionPersistenceDemo.tsx # Session UI
└── hooks/
    └── useLazorKitDemo.ts       # Custom hook
```

## Installation

### Dependencies

Install the required packages:

```bash
pnpm add @lazorkit/wallet @coral-xyz/anchor buffer
```

### Package Versions

```json
{
  "@lazorkit/wallet": "latest",
  "@coral-xyz/anchor": "^0.30.1",
  "buffer": "^6.0.3"
}
```

### Browser Polyfill

LazorKit requires the Node.js Buffer API in the browser. Create a polyfill component:

```tsx
// src/components/utility/BufferPolyfill.tsx
'use client';

import { useEffect } from 'react';

export default function BufferPolyfill() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Buffer) {
      window.Buffer = require('buffer').Buffer;
    }
  }, []);

  return null;
}
```

Add to your root layout:

```tsx
// app/layout.tsx
import BufferPolyfill from '@/src/components/utility/BufferPolyfill';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BufferPolyfill />
        {children}
      </body>
    </html>
  );
}
```

## Configuration

### Environment Configuration

Create a configuration file with all LazorKit settings:

```typescript
// config.ts
export const LAZORKIT_CONFIG = {
  /**
   * Solana RPC endpoint
   * Devnet: https://api.devnet.solana.com
   * Mainnet: https://api.mainnet-beta.solana.com
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
   * Default transaction amounts (in SOL)
   */
  demoAmounts: [0.01, 0.05, 0.1],

  /**
   * Demo recipient address
   */
  demoRecipient: '11111111111111111111111111111111',
} as const;
```

### Utility Functions

```typescript
/**
 * Get Solscan URL for a transaction
 */
export function getExplorerUrl(
  signature: string, 
  cluster: string = LAZORKIT_CONFIG.cluster
): string {
  return `https://solscan.io/tx/${signature}?cluster=${cluster}`;
}

/**
 * Get Solscan URL for an address
 */
export function getAddressExplorerUrl(
  address: string, 
  cluster: string = LAZORKIT_CONFIG.cluster
): string {
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
```

## Core Concepts

### Passkey Authentication

Passkeys use the WebAuthn standard to create hardware-bound credentials stored in your device's Secure Enclave. The private key never leaves the device.

**Key Benefits:**
- No seed phrases to manage
- Biometric authentication (FaceID/TouchID/Windows Hello)
- Hardware-level security
- Cross-device sync via platform services

### Smart Wallets

LazorKit creates Program Derived Addresses (PDAs) controlled by your passkey. These smart wallets support:
- Programmable account policies
- Recovery mechanisms
- Session keys
- Transaction batching

### Paymaster Service

The Paymaster sponsors transaction fees, enabling gasless transactions. Users sign transactions with their passkey, and the Paymaster pays the network fees.

## API Reference

### LazorKit Provider

Wrap your application with the LazorKit provider:

```tsx
import { LazorkitProvider } from '@lazorkit/wallet';

<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }}
>
  {children}
</LazorkitProvider>
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rpcUrl` | string | Yes | Solana RPC endpoint |
| `portalUrl` | string | Yes | LazorKit portal URL |
| `paymasterConfig` | object | Yes | Paymaster configuration |
| `children` | ReactNode | Yes | Child components |

### useWallet Hook

Access wallet functionality through the `useWallet` hook:

```tsx
import { useWallet } from '@lazorkit/wallet';

const {
  connect,
  disconnect,
  isConnected,
  isConnecting,
  wallet,
  smartWalletPubkey,
  signAndSendTransaction,
} = useWallet();
```

**Return Values:**

| Property | Type | Description |
|----------|------|-------------|
| `connect` | () => Promise<void> | Trigger passkey creation/connection |
| `disconnect` | () => Promise<void> | Disconnect wallet |
| `isConnected` | boolean | Connection status |
| `isConnecting` | boolean | Loading state |
| `wallet` | object | Wallet information |
| `wallet.smartWallet` | string | Smart wallet address |
| `smartWalletPubkey` | PublicKey | Solana PublicKey object |
| `signAndSendTransaction` | function | Sign and send transactions |

### signAndSendTransaction

Sign and send transactions with Paymaster support:

```tsx
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions?: {
    feeToken?: 'SOL' | 'USDC',
  },
});
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `instructions` | TransactionInstruction[] | Yes | Solana instructions |
| `transactionOptions` | object | No | Transaction options |
| `transactionOptions.feeToken` | string | No | Fee token (SOL/USDC) |

**Returns:** `Promise<string>` - Transaction signature

## Components

### Provider Component

```tsx
// providers/LazorKitDemoProvider.tsx
'use client';

import { LazorkitProvider } from '@lazorkit/wallet';
import { LAZORKIT_CONFIG } from '../config';
import { ReactNode } from 'react';

interface LazorKitDemoProviderProps {
  children: ReactNode;
}

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
```

### Custom Hook

```tsx
// hooks/useLazorKitDemo.ts
'use client';

import { useWallet } from '@lazorkit/wallet';
import { useState, useCallback } from 'react';

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
    console.error('LazorKit Error:', err);
  }, []);

  return {
    ...wallet,
    transactionHistory,
    error,
    addTransaction,
    clearError,
    handleError,
  };
}
```

### Wallet Connection Component

```tsx
// components/PasskeyWalletConnect.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { useLazorKitDemo } from '../hooks/useLazorKitDemo';
import { toast } from 'sonner';

export default function PasskeyWalletConnect() {
  const { connect, disconnect, isConnected, isConnecting, wallet, handleError } = 
    useLazorKitDemo();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      handleError(error);
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      handleError(error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const copyAddress = async () => {
    if (wallet?.smartWallet) {
      await navigator.clipboard.writeText(wallet.smartWallet);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Creating Wallet...' : 'Create Passkey Wallet'}
        </Button>
      ) : (
        <div>
          <p>Wallet Address: {wallet?.smartWallet}</p>
          <Button onClick={copyAddress}>
            {copied ? 'Copied!' : 'Copy Address'}
          </Button>
          <Button onClick={handleDisconnect}>Disconnect</Button>
        </div>
      )}
    </div>
  );
}
```

### Transaction Component

```tsx
// components/GaslessTransactionDemo.tsx
'use client';

import { useState } from 'react';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useLazorKitDemo } from '../hooks/useLazorKitDemo';
import { toast } from 'sonner';

export default function GaslessTransactionDemo() {
  const { 
    signAndSendTransaction, 
    smartWalletPubkey, 
    isConnected, 
    addTransaction, 
    handleError 
  } = useLazorKitDemo();
  
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState(0.01);
  const [isSending, setIsSending] = useState(false);
  const [lastSignature, setLastSignature] = useState<string | null>(null);

  const handleSendTransaction = async () => {
    if (!isConnected || !smartWalletPubkey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!recipient) {
      toast.error('Please enter a recipient address');
      return;
    }

    // Validate signAndSendTransaction is available
    if (!signAndSendTransaction) {
      toast.error('Wallet not fully initialized. Please reconnect.');
      console.error('signAndSendTransaction method not available');
      return;
    }

    setIsSending(true);
    setLastSignature(null);

    try {
      // Validate recipient address
      const recipientPubkey = new PublicKey(recipient);
      
      console.log('Sending transaction:', {
        from: smartWalletPubkey.toString(),
        to: recipientPubkey.toString(),
        amount: amount,
      });

      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      console.log('Transfer instruction created');

      // Sign and send with Paymaster
      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      console.log('Transaction signature:', signature);

      setLastSignature(signature);
      addTransaction(signature, amount);
      toast.success('Transaction sent successfully!');
    } catch (error) {
      console.error('Transaction error details:', error);
      handleError(error);
      
      // Provide specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Signing failed')) {
          toast.error('Transaction signing failed. Please try reconnecting your wallet.');
        } else if (error.message.includes('insufficient')) {
          toast.error('Insufficient balance. Click "Get 1 SOL" to fund your wallet.');
        } else {
          toast.error(`Transaction failed: ${error.message}`);
        }
      } else {
        toast.error('Transaction failed');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
        disabled={!isConnected}
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Amount in SOL"
        disabled={!isConnected}
      />
      <button onClick={handleSendTransaction} disabled={isSending || !isConnected}>
        {isSending ? 'Sending...' : 'Send SOL (Gasless)'}
      </button>
      
      {lastSignature && (
        <div>
          <p>Transaction Successful!</p>
          <a 
            href={`https://solscan.io/tx/${lastSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Solscan
          </a>
        </div>
      )}
    </div>
  );
}
```

## Error Handling

### Common Errors

**Origin Mismatch Error**

```
Error: origins don't match https://portal.lazor.sh http://localhost:3000
```

**Cause:** LazorKit portal doesn't allow localhost connections for security.

**Solution:** Deploy to a production URL (Vercel, Netlify) or use ngrok for local testing.

**Signing Failed Error**

```
Error: Signing failed
```

**Cause:** User cancelled biometric authentication or passkey not available.

**Solution:** Prompt user to try again or reconnect wallet.

**Insufficient Balance Error**

```
Error: Custom:1
```

**Cause:** Wallet doesn't have enough SOL to send transaction.

**Solution:** Request airdrop from Devnet faucet or fund wallet.

### Error Handling Pattern

```tsx
try {
  await someWalletOperation();
  toast.success('Operation successful');
} catch (error) {
  console.error('Operation failed:', error);
  
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('Signing failed')) {
      toast.error('Please authenticate with your biometrics');
    } else if (error.message.includes('insufficient')) {
      toast.error('Insufficient balance');
    } else if (error.message.includes('origins don't match')) {
      toast.error('Please use a deployed URL, not localhost');
    } else {
      toast.error(`Error: ${error.message}`);
    }
  } else {
    toast.error('An unknown error occurred');
  }
}
```

### Airdrop Error Handling

```tsx
const requestAirdrop = async (walletAddress: string) => {
  setIsAirdropping(true);
  try {
    const connection = new Connection(LAZORKIT_CONFIG.rpcUrl, 'confirmed');
    const publicKey = new PublicKey(walletAddress);
    
    toast.info('Requesting 1 SOL from Devnet faucet...');
    
    const signature = await connection.requestAirdrop(
      publicKey,
      1 * LAMPORTS_PER_SOL
    );
    
    await connection.confirmTransaction(signature);
    
    toast.success('Airdrop successful! You received 1 SOL');
  } catch (error) {
    console.error('Airdrop error:', error);
    
    if (error instanceof Error && error.message.includes('429')) {
      toast.error('Rate limit reached. Try again in a few minutes.');
    } else {
      toast.error('Airdrop failed. Try again later.');
    }
  } finally {
    setIsAirdropping(false);
  }
};
```

## Code Examples

### Complete Integration Example

```tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import { LazorKitDemoProvider } from '@/src/features/lazorkit-demo/providers/LazorKitDemoProvider';
import PasskeyWalletConnect from '@/src/features/lazorkit-demo/components/PasskeyWalletConnect';
import GaslessTransactionDemo from '@/src/features/lazorkit-demo/components/GaslessTransactionDemo';

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div>
      <button onClick={() => setShowDemo(true)}>
        Open LazorKit Demo
      </button>

      {showDemo && (
        <LazorKitDemoProvider>
          <div className="modal">
            <PasskeyWalletConnect />
            <GaslessTransactionDemo />
          </div>
        </LazorKitDemoProvider>
      )}
    </div>
  );
}
```

### Session Persistence Example

```tsx
import { useEffect } from 'react';
import { useWallet } from '@lazorkit/wallet';

export default function SessionPersistenceDemo() {
  const { isConnected, wallet } = useWallet();

  useEffect(() => {
    if (isConnected && wallet?.smartWallet) {
      console.log('Session restored automatically');
      console.log('Wallet address:', wallet.smartWallet);
      
      // Session is active - wallet reconnected automatically
      // No user action required
    }
  }, [isConnected, wallet]);

  return (
    <div>
      {isConnected ? (
        <p>Session Active: {wallet?.smartWallet}</p>
      ) : (
        <p>No active session</p>
      )}
    </div>
  );
}
```

### Transaction History Example

```tsx
import { useLazorKitDemo } from '../hooks/useLazorKitDemo';
import { getExplorerUrl } from '../config';

export default function TransactionHistory() {
  const { transactionHistory } = useLazorKitDemo();

  return (
    <div>
      <h3>Transaction History</h3>
      {transactionHistory.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <ul>
          {transactionHistory.map((tx) => (
            <li key={tx.signature}>
              <a 
                href={getExplorerUrl(tx.signature)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tx.amount} SOL - {new Date(tx.timestamp).toLocaleString()}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Best Practices

### Security

**Never expose private keys:** LazorKit handles all key management. Never attempt to extract or store private keys.

**Validate all inputs:** Always validate recipient addresses and amounts before creating transactions.

```tsx
// Validate recipient address
try {
  const recipientPubkey = new PublicKey(recipient);
} catch (error) {
  toast.error('Invalid Solana address');
  return;
}

// Validate amount
if (amount <= 0) {
  toast.error('Amount must be greater than 0');
  return;
}
```

**Use HTTPS in production:** LazorKit requires HTTPS for WebAuthn to work properly.

### Performance

**Lazy load the provider:** Only load LazorKit when needed to reduce initial bundle size.

```tsx
const LazorKitDemoProvider = dynamic(
  () => import('@/src/features/lazorkit-demo/providers/LazorKitDemoProvider'),
  { ssr: false }
);
```

**Debounce user inputs:** Prevent excessive validation calls.

```tsx
const debouncedRecipient = useDebounce(recipient, 500);

useEffect(() => {
  if (debouncedRecipient) {
    validateAddress(debouncedRecipient);
  }
}, [debouncedRecipient]);
```

### User Experience

**Provide clear feedback:** Always inform users about what's happening.

```tsx
// Loading states
{isConnecting && <Spinner />}
{isSending && <p>Signing transaction with your passkey...</p>}

// Success states
{isConnected && <p>✓ Wallet connected</p>}
{lastSignature && <p>✓ Transaction successful</p>}

// Error states
{error && <p className="error">{error}</p>}
```

**Handle edge cases:** Account for all possible states.

```tsx
if (!isConnected) {
  return <p>Please connect your wallet first</p>;
}

if (!smartWalletPubkey) {
  return <p>Wallet initializing...</p>;
}

if (!signAndSendTransaction) {
  return <p>Wallet not ready. Please reconnect.</p>;
}
```

## Troubleshooting

### Localhost Issues

**Problem:** Passkey signing fails on localhost

**Solution:** Deploy to Vercel or use ngrok:

```bash
npx ngrok http 3000
```

Then access via the ngrok HTTPS URL.

### Hydration Errors

**Problem:** Buffer is not defined

**Solution:** Ensure BufferPolyfill is added to layout.tsx and runs client-side only.

### Airdrop Rate Limits

**Problem:** 429 errors from Devnet faucet

**Solution:** Use alternative faucets:
- https://solfaucet.com
- https://faucet.quicknode.com/solana/devnet
- Wait 5-10 minutes between requests

### TypeScript Errors

**Problem:** Type errors with recipient state

**Solution:** Explicitly type state variables:

```tsx
const [recipient, setRecipient] = useState<string>('');
```

### Build Errors

**Problem:** Module not found errors

**Solution:** Ensure all dependencies are installed:

```bash
pnpm install
```

Clear Next.js cache:

```bash
rm -rf .next
pnpm dev
```

## Additional Resources

Official Documentation: https://docs.lazorkit.com

GitHub Repository: https://github.com/lazor-kit/lazor-kit

NPM Package: https://www.npmjs.com/package/@lazorkit/wallet

WebAuthn Specification: https://www.w3.org/TR/webauthn-2

Solana Documentation: https://docs.solana.com

Solscan Explorer: https://solscan.io
