# LazorKit Passkey Wallet Integration

A production-ready implementation of LazorKit's passkey-based wallet infrastructure, demonstrating real-world usage of passkey authentication and gasless smart wallet transactions on Solana.

## Project Overview

This repository demonstrates a complete integration of LazorKit's passkey wallet technology into a Next.js application. The implementation showcases three core features: seedless wallet creation using WebAuthn biometrics, gasless transactions sponsored by a Paymaster service, and persistent sessions that work across devices and page refreshes.

The integration is built as an isolated feature module that can be easily added to or removed from any Next.js application. All code is fully typed with TypeScript and includes comprehensive inline documentation.

## Live Demo

Demo URL: [Your Vercel Deployment URL]

Note: The demo runs on Solana Devnet. No real funds are involved.

## Framework

Built with Next.js 15 (React) using TypeScript and Tailwind CSS.

## Quick Start Guide

### Prerequisites

Node.js 18 or higher

pnpm package manager

Git for version control

### Installation

Clone the repository:

```bash
git clone https://github.com/ayushshrivastv/NorthFall.git
cd NorthFall
```

Install dependencies:

```bash
pnpm install
```

### Environment Setup

No environment variables are required for the demo. The integration uses LazorKit's public Devnet infrastructure:

RPC URL: `https://api.devnet.solana.com`

Portal URL: `https://portal.lazor.sh`

Paymaster: `https://kora.devnet.lazorkit.com`

### Running the Example

Start the development server:

```bash
cd apps/web
pnpm dev
```

Open your browser to `http://localhost:3000`

Click "LazorKit" in the navigation bar to access the demo

Important: Passkey signing may fail on localhost due to origin restrictions. For full functionality, deploy to Vercel or another hosting platform with a real HTTPS domain.

### Deployment

Deploy to Vercel for production testing:

```bash
vercel deploy
```

The passkey authentication will work correctly on the deployed URL.

## Project Structure

```
apps/web/src/features/lazorkit-demo/
├── README.md                           # This file
├── config.ts                           # Configuration and utilities
├── providers/
│   └── LazorKitDemoProvider.tsx       # LazorKit context provider
├── components/
│   ├── LazorKitDemoModal.tsx          # Main modal container
│   ├── PasskeyWalletConnect.tsx       # Wallet creation UI
│   ├── GaslessTransactionDemo.tsx     # Transaction interface
│   ├── DemoFeatureShowcase.tsx        # Feature showcase panel
│   └── SessionPersistenceDemo.tsx     # Session management
└── hooks/
    └── useLazorKitDemo.ts             # Custom React hook
```

Integration points:

`apps/web/src/components/nav/Navbar.tsx` - Navigation button

`apps/web/app/layout.tsx` - Buffer polyfill for browser compatibility

`apps/web/src/components/utility/BufferPolyfill.tsx` - Polyfill component

## Tutorial 1: Creating a Passkey-Based Wallet

This tutorial demonstrates how to create a seedless wallet using WebAuthn biometric authentication.

### Overview

Traditional Solana wallets require users to manage 12-24 word seed phrases. LazorKit eliminates this by using passkeys stored in your device's Secure Enclave. The wallet is created and accessed through biometric authentication like FaceID, TouchID, or Windows Hello.

### Step 1: Set Up the LazorKit Provider

Wrap your application with the LazorKit provider to enable passkey functionality:

```tsx
// providers/LazorKitDemoProvider.tsx
import { LazorkitProvider } from '@lazorkit/wallet';

export function LazorKitDemoProvider({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com"
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

### Step 2: Create the Wallet Connection Component

Build a component that triggers passkey creation:

```tsx
// components/PasskeyWalletConnect.tsx
import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';

export default function PasskeyWalletConnect() {
  const { connect, disconnect, isConnected, wallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      // Wallet created successfully
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Creating Wallet...' : 'Create Passkey Wallet'}
        </button>
      ) : (
        <div>
          <p>Wallet Address: {wallet?.smartWallet}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

### Step 3: Trigger Passkey Creation

When the user clicks "Create Passkey Wallet", the following happens:

The browser's WebAuthn API is invoked through LazorKit

The operating system prompts for biometric authentication

The user authenticates with FaceID, TouchID, or Windows Hello

A passkey is created and stored in the device's Secure Enclave

A smart wallet address (PDA) is generated from the passkey

The wallet address is returned and displayed to the user

### Step 4: Display Wallet Information

Once connected, display the wallet address and provide utility functions:

```tsx
{isConnected && wallet?.smartWallet && (
  <div>
    <p>Smart Wallet Address:</p>
    <code>{wallet.smartWallet}</code>
    <button onClick={() => navigator.clipboard.writeText(wallet.smartWallet)}>
      Copy Address
    </button>
    <a 
      href={`https://solscan.io/address/${wallet.smartWallet}?cluster=devnet`}
      target="_blank"
    >
      View on Solscan
    </a>
  </div>
)}
```

### Key Points

No seed phrases are generated or stored

The private key never leaves the device's Secure Enclave

Biometric authentication is required for all operations

The same passkey always generates the same wallet address

Passkeys can sync across devices via iCloud Keychain or Google Password Manager

### Security Benefits

Hardware-bound credentials prevent key extraction

Biometric authentication prevents unauthorized access

No phishing risk since there are no seed phrases to steal

WebAuthn standard provides cross-platform compatibility

## Tutorial 2: Sending Gasless Transactions

This tutorial demonstrates how to send SOL transfers without the user paying gas fees.

### Overview

Traditional Solana transactions require users to hold SOL for gas fees. LazorKit's Paymaster service sponsors these fees, enabling a completely gasless user experience. Users can send transactions by only signing with their passkey.

### Step 1: Fund the Wallet

Before sending transactions, the wallet needs SOL. For testing on Devnet, request an airdrop:

```tsx
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const requestAirdrop = async (walletAddress: string) => {
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const publicKey = new PublicKey(walletAddress);
  
  const signature = await connection.requestAirdrop(
    publicKey,
    1 * LAMPORTS_PER_SOL
  );
  
  await connection.confirmTransaction(signature);
  console.log('Airdrop successful!');
};
```

### Step 2: Create the Transaction Interface

Build a component for sending transactions:

```tsx
// components/GaslessTransactionDemo.tsx
import { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function GaslessTransactionDemo() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0.01);
  const [isSending, setIsSending] = useState(false);

  const handleSendTransaction = async () => {
    if (!isConnected || !smartWalletPubkey) return;
    
    setIsSending(true);
    try {
      // Validate recipient address
      const recipientPubkey = new PublicKey(recipient);
      
      // Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      });
      
      // Sign and send with Paymaster
      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });
      
      console.log('Transaction successful:', signature);
    } catch (error) {
      console.error('Transaction failed:', error);
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
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Amount in SOL"
      />
      <button onClick={handleSendTransaction} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send SOL (Gasless)'}
      </button>
    </div>
  );
}
```

### Step 3: Understanding the Transaction Flow

When the user clicks "Send SOL (Gasless)":

A standard Solana transfer instruction is created using SystemProgram

The instruction is passed to LazorKit's signAndSendTransaction method

The user is prompted for biometric authentication to sign the transaction

LazorKit submits the transaction to the Paymaster service

The Paymaster sponsors the transaction fee and submits to the network

The transaction is confirmed and the signature is returned

The user pays zero gas fees for the entire process

### Step 4: Display Transaction Results

Show the transaction signature and provide a link to the explorer:

```tsx
{signature && (
  <div>
    <p>Transaction Successful!</p>
    <p>Signature: {signature.slice(0, 20)}...{signature.slice(-20)}</p>
    <a 
      href={`https://solscan.io/tx/${signature}?cluster=devnet`}
      target="_blank"
    >
      View on Solscan
    </a>
    <p>Gas fees paid by Paymaster - you paid nothing!</p>
  </div>
)}
```

### Key Points

Users never need to hold SOL for gas fees

The Paymaster service sponsors all transaction costs

Biometric authentication is required to sign transactions

Standard Solana instructions work with the gasless flow

Transaction signatures can be verified on Solscan

### Paymaster Configuration

The Paymaster is configured in the LazorKit provider:

```tsx
paymasterConfig={{
  paymasterUrl: "https://kora.devnet.lazorkit.com"
}}
```

For production, you would use a mainnet Paymaster URL and potentially configure fee token preferences (SOL, USDC, etc.).

## Tutorial 3: Persisting Sessions Across Devices

This tutorial demonstrates how LazorKit maintains wallet sessions across page refreshes and devices.

### Overview

Traditional wallet extensions require users to reconnect after every page refresh. LazorKit uses WebAuthn credentials to automatically restore wallet sessions, providing a seamless experience similar to web2 authentication.

### Step 1: Implement Auto-Reconnect

The wallet automatically reconnects when the component mounts:

```tsx
import { useEffect } from 'react';
import { useWallet } from '@lazorkit/wallet';

export default function SessionPersistenceDemo() {
  const { isConnected, wallet } = useWallet();

  useEffect(() => {
    if (isConnected && wallet?.smartWallet) {
      console.log('Session restored automatically');
      console.log('Wallet address:', wallet.smartWallet);
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

### Step 2: Test Session Persistence

To verify session persistence:

Create a passkey wallet and note the address

Refresh the page or close and reopen the browser

The wallet automatically reconnects with the same address

No re-authentication is required

The session is restored from the device's passkey storage

### Step 3: Cross-Device Synchronization

If passkey sync is enabled on your devices:

Create a wallet on Device A (e.g., MacBook with TouchID)

Enable iCloud Keychain or Google Password Manager sync

Open the application on Device B (e.g., iPhone with FaceID)

The passkey is available and the wallet can be accessed

Authenticate with Device B's biometrics to use the same wallet

### Implementation Details

Session persistence works through WebAuthn credential storage:

```tsx
// The LazorKit SDK handles session restoration automatically
// When the provider mounts, it checks for existing credentials
// If found, the wallet is reconnected without user interaction

const { isConnected, wallet } = useWallet();

// isConnected will be true if a valid session exists
// wallet.smartWallet will contain the same address as before
```

### Key Points

Sessions persist across page refreshes automatically

No manual reconnection is required

WebAuthn credentials sync via platform services (iCloud, Google)

The same wallet can be accessed from multiple devices

Session security is maintained through device-bound credentials

### Testing Session Persistence

Create a test component:

```tsx
export default function SessionTest() {
  const { isConnected, wallet } = useWallet();
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const testReconnect = () => {
    window.location.reload();
  };

  return (
    <div>
      <p>Session Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Session Duration: {sessionTime} seconds</p>
      <button onClick={testReconnect}>Test Auto-Reconnect</button>
    </div>
  );
}
```

Click "Test Auto-Reconnect" to refresh the page and verify the wallet reconnects automatically.

## SDK Installation and Configuration

### Install Dependencies

```bash
pnpm add @lazorkit/wallet @coral-xyz/anchor buffer
```

### Configure Buffer Polyfill

Create a polyfill component for browser compatibility:

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

Add to your layout:

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

### Configure LazorKit Provider

Wrap your application with the provider:

```tsx
import { LazorkitProvider } from '@lazorkit/wallet';

export default function App({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com"
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

## Code Documentation

All components include comprehensive inline comments:

Configuration files document all settings and their purposes

React components explain state management and user interactions

Utility functions include parameter descriptions and return types

TypeScript interfaces define all data structures

Error handling is documented with expected failure cases

## Removal Instructions

To remove this integration:

Delete the feature folder: `rm -rf apps/web/src/features/lazorkit-demo`

Remove Buffer polyfill: `rm apps/web/src/components/utility/BufferPolyfill.tsx`

Remove navigation integration from `apps/web/src/components/nav/Navbar.tsx`

Remove polyfill from `apps/web/app/layout.tsx`

Uninstall dependencies: `pnpm remove @lazorkit/wallet @coral-xyz/anchor buffer`

## Official Resources

LazorKit Website: https://lazorkit.com

LazorKit Documentation: https://docs.lazorkit.com

LazorKit GitHub: https://github.com/lazor-kit

LazorKit NPM Package: https://www.npmjs.com/package/@lazorkit/wallet

WebAuthn Specification: https://www.w3.org/TR/webauthn-2

Solana Documentation: https://docs.solana.com

Solscan Explorer: https://solscan.io

## Technology Stack

Framework: Next.js 15 with React 18

Language: TypeScript 5

Styling: Tailwind CSS

Blockchain: Solana (Devnet)

Wallet SDK: LazorKit Passkey Wallet

Authentication: WebAuthn API
