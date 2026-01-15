'use client';

import { LazorKitDocsSection } from '@/src/types/lazorkit-docs-types';
import DocsHeading from '../ui/DocsHeading';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface ClientLazorKitContentProps {
    section: LazorKitDocsSection;
}

export default function ClientLazorKitContent({ section }: ClientLazorKitContentProps) {
    const router = useRouter();

    const renderContent = () => {
        switch (section) {
            case LazorKitDocsSection.OVERVIEW:
                return <OverviewSection />;
            case LazorKitDocsSection.INSTALLATION:
                return <InstallationSection />;
            case LazorKitDocsSection.CONFIGURATION:
                return <ConfigurationSection />;
            case LazorKitDocsSection.PASSKEY_WALLET:
                return <PasskeyWalletSection />;
            case LazorKitDocsSection.GASLESS_TRANSACTIONS:
                return <GaslessTransactionsSection />;
            case LazorKitDocsSection.SESSION_PERSISTENCE:
                return <SessionPersistenceSection />;
            case LazorKitDocsSection.API_REFERENCE:
                return <APIReferenceSection />;
            case LazorKitDocsSection.ERROR_HANDLING:
                return <ErrorHandlingSection />;
            case LazorKitDocsSection.BEST_PRACTICES:
                return <BestPracticesSection />;
            case LazorKitDocsSection.TROUBLESHOOTING:
                return <TroubleshootingSection />;
            default:
                return <OverviewSection />;
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-y-10 items-start text-left tracking-wide text-light/90 max-w-[80%] mx-auto">
            {renderContent()}
        </div>
    );
}

function OverviewSection() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-start w-full space-y-8">
            <div className="text-6xl text-left flex flex-col items-start justify-center">
                <DocsHeading firstText="LazorKit" secondText="Documentation" />
            </div>

            <div className="text-md text-light/70 tracking-wider max-w-[800px]">
                Complete technical documentation for integrating LazorKit passkey wallet technology
                into your Solana application. LazorKit provides seedless authentication, gasless
                transactions, and persistent sessions.
            </div>

            <div className="flex items-center gap-x-5">
                <Button
                    size={'lg'}
                    className="bg-primary hover:bg-black text-white"
                    onClick={() => router.push('/')}
                >
                    <span className="font-semibold">Try Demo</span>
                </Button>
                <Button
                    size={'lg'}
                    className="bg-black hover:bg-primary text-white border-0"
                    onClick={() => window.open('https://youtu.be/KPpSZQnQms4', '_blank')}
                >
                    <span className="font-semibold">Watch Demo Video</span>
                </Button>
                <Button
                    size={'lg'}
                    className="bg-black hover:bg-primary text-white border-0"
                    onClick={() => window.open('https://docs.lazorkit.com', '_blank')}
                >
                    <span className="font-semibold">Official Docs</span>
                </Button>
                <Button
                    size={'lg'}
                    className="bg-primary hover:bg-black text-white"
                    onClick={() => window.open('https://github.com/ayushshrivastv/NorthFall/tree/main/apps/web/src/features/lazorkit-demo', '_blank')}
                >
                    <span className="font-semibold">GitHub Implementation</span>
                </Button>
            </div>

            <div className="w-full space-y-6 mt-8">
                <h2 className="text-3xl font-bold text-light">What is LazorKit?</h2>
                <p className="text-light/70">
                    LazorKit is a passkey-based wallet infrastructure for Solana that eliminates seed
                    phrases and gas fees. Users create wallets using biometric authentication (FaceID,
                    TouchID, Windows Hello) and send transactions without holding SOL for fees.
                </p>

                <h3 className="text-2xl font-bold text-light mt-8">Core Features</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <FeatureCard
                        title="Passkey Authentication"
                        description="Create wallets using WebAuthn biometrics. No seed phrases to manage."
                    />
                    <FeatureCard
                        title="Gasless Transactions"
                        description="Send SOL without paying gas fees through Paymaster sponsorship."
                    />
                    <FeatureCard
                        title="Session Persistence"
                        description="Automatic wallet reconnection across page refreshes and devices."
                    />
                    <FeatureCard
                        title="Smart Wallets"
                        description="Program Derived Addresses with programmable logic and recovery."
                    />
                </div>

                <h3 className="text-2xl font-bold text-light mt-8">Architecture</h3>
                <pre className="bg-dark border border-neutral-800 rounded-lg p-4 text-sm text-light/80 overflow-x-auto">
                    {`lazorkit-demo/
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
    └── useLazorKitDemo.ts       # Custom hook`}
                </pre>
            </div>
        </div>
    );
}

function InstallationSection() {
    return (
        <DocSection title="Installation">
            <h3 className="text-2xl font-bold text-light">Dependencies</h3>
            <p className="text-light/70">Install the required packages:</p>
            <CodeBlock language="bash">
                {`pnpm add @lazorkit/wallet @coral-xyz/anchor buffer`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">Package Versions</h3>
            <CodeBlock language="json">
                {`{
  "@lazorkit/wallet": "latest",
  "@coral-xyz/anchor": "^0.30.1",
  "buffer": "^6.0.3"
}`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">Browser Polyfill</h3>
            <p className="text-light/70">
                LazorKit requires the Node.js Buffer API in the browser. Create a polyfill component:
            </p>
            <CodeBlock language="tsx">
                {`// src/components/utility/BufferPolyfill.tsx
'use client';

import { useEffect } from 'react';

export default function BufferPolyfill() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Buffer) {
      window.Buffer = require('buffer').Buffer;
    }
  }, []);

  return null;
}`}
            </CodeBlock>

            <p className="text-light/70 mt-4">Add to your root layout:</p>
            <CodeBlock language="tsx">
                {`// app/layout.tsx
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
}`}
            </CodeBlock>
        </DocSection>
    );
}

function ConfigurationSection() {
    return (
        <DocSection title="Configuration">
            <h3 className="text-2xl font-bold text-light">Environment Configuration</h3>
            <p className="text-light/70">Create a configuration file with all LazorKit settings:</p>
            <CodeBlock language="typescript">
                {`// config.ts
export const LAZORKIT_CONFIG = {
  rpcUrl: 'https://api.devnet.solana.com',
  portalUrl: 'https://portal.lazor.sh',
  paymasterConfig: {
    paymasterUrl: 'https://kora.devnet.lazorkit.com',
  },
  cluster: 'devnet' as const,
  demoAmounts: [0.01, 0.05, 0.1],
  demoRecipient: '11111111111111111111111111111111',
} as const;`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">Utility Functions</h3>
            <CodeBlock language="typescript">
                {`export function getExplorerUrl(signature: string, cluster: string = 'devnet'): string {
  return \`https://solscan.io/tx/\${signature}?cluster=\${cluster}\`;
}

export function getAddressExplorerUrl(address: string, cluster: string = 'devnet'): string {
  return \`https://solscan.io/address/\${address}?cluster=\${cluster}\`;
}

export function formatSOL(lamports: number): string {
  return (lamports / 1_000_000_000).toFixed(4);
}

export function truncateAddress(address: string, chars: number = 4): string {
  return \`\${address.slice(0, chars)}...\${address.slice(-chars)}\`;
}`}
            </CodeBlock>
        </DocSection>
    );
}

function PasskeyWalletSection() {
    return (
        <DocSection title="Passkey Wallet">
            <p className="text-light/70">
                Create a Solana wallet using your device's biometric authentication. No seed phrases to
                remember or store.
            </p>

            <h3 className="text-2xl font-bold text-light mt-8">How it Works</h3>
            <div className="bg-dark border border-neutral-800 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-light/70">
                    <li>Click "Create Passkey Wallet" in the LazorKit demo</li>
                    <li>Browser prompts for FaceID, TouchID, or Windows Hello</li>
                    <li>Authenticate with your biometrics</li>
                    <li>Smart wallet address is generated from your passkey</li>
                    <li>Same passkey always generates the same wallet address</li>
                </ol>
            </div>

            <h3 className="text-2xl font-bold text-light mt-8">Implementation</h3>
            <CodeBlock language="tsx">
                {`import { useWallet } from '@lazorkit/wallet';
import { useState } from 'react';

export default function PasskeyWalletConnect() {
  const { connect, disconnect, isConnected, wallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      toast.success('Wallet connected!');
    } catch (error) {
      console.error('Failed to connect:', error);
      toast.error('Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Creating...' : 'Create Passkey Wallet'}
        </button>
      ) : (
        <div>
          <p>Address: {wallet?.smartWallet}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">Security Benefits</h3>
            <ul className="list-disc list-inside space-y-2 text-light/70">
                <li>Hardware-bound credentials prevent key extraction</li>
                <li>Biometric authentication prevents unauthorized access</li>
                <li>No phishing risk since there are no seed phrases</li>
                <li>WebAuthn standard provides cross-platform compatibility</li>
            </ul>
        </DocSection>
    );
}

function GaslessTransactionsSection() {
    return (
        <DocSection title="Gasless Transactions">
            <p className="text-light/70">
                Send SOL transfers without the user paying gas fees. LazorKit's Paymaster service
                sponsors all transaction costs.
            </p>

            <h3 className="text-2xl font-bold text-light mt-8">Transaction Flow</h3>
            <div className="bg-dark border border-neutral-800 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-light/70">
                    <li>User enters recipient address and amount</li>
                    <li>Click "Send SOL (Gasless)"</li>
                    <li>User authenticates with passkey to sign</li>
                    <li>Paymaster sponsors the transaction fee</li>
                    <li>Transaction is submitted to Solana</li>
                    <li>User pays zero gas fees</li>
                </ol>
            </div>

            <h3 className="text-2xl font-bold text-light mt-8">Implementation</h3>
            <CodeBlock language="tsx">
                {`import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@lazorkit/wallet';

export default function GaslessTransactionDemo() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState(0.01);

  const handleSend = async () => {
    if (!isConnected || !smartWalletPubkey) return;

    try {
      const recipientPubkey = new PublicKey(recipient);
      
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports: amount * LAMPORTS_PER_SOL,
      });

      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      toast.success('Transaction successful!');
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed');
    }
  };

  return (
    <div>
      <input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
      <button onClick={handleSend}>Send SOL (Gasless)</button>
    </div>
  );
}`}
            </CodeBlock>
        </DocSection>
    );
}

function SessionPersistenceSection() {
    return (
        <DocSection title="Session Persistence">
            <p className="text-light/70">
                Wallet sessions persist across page refreshes and sync across devices. No need to
                reconnect manually.
            </p>

            <h3 className="text-2xl font-bold text-light mt-8">How it Works</h3>
            <p className="text-light/70">
                LazorKit uses WebAuthn credentials to automatically restore wallet sessions. When the
                component mounts, it checks for existing credentials and reconnects if found.
            </p>

            <h3 className="text-2xl font-bold text-light mt-8">Implementation</h3>
            <CodeBlock language="tsx">
                {`import { useEffect } from 'react';
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
}`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">Cross-Device Sync</h3>
            <p className="text-light/70">
                If passkey sync is enabled on your devices (iCloud Keychain, Google Password Manager),
                the same wallet can be accessed from multiple devices.
            </p>
        </DocSection>
    );
}

function APIReferenceSection() {
    return (
        <DocSection title="API Reference">
            <h3 className="text-2xl font-bold text-light">LazorKit Provider</h3>
            <CodeBlock language="tsx">
                {`import { LazorkitProvider } from '@lazorkit/wallet';

<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }}
>
  {children}
</LazorkitProvider>`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">useWallet Hook</h3>
            <CodeBlock language="tsx">
                {`const {
  connect,              // () => Promise<void>
  disconnect,           // () => Promise<void>
  isConnected,          // boolean
  isConnecting,         // boolean
  wallet,               // { smartWallet: string }
  smartWalletPubkey,    // PublicKey
  signAndSendTransaction, // function
} = useWallet();`}
            </CodeBlock>

            <h3 className="text-2xl font-bold text-light mt-8">signAndSendTransaction</h3>
            <CodeBlock language="tsx">
                {`const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions?: {
    feeToken?: 'SOL' | 'USDC',
  },
});`}
            </CodeBlock>
        </DocSection>
    );
}

function ErrorHandlingSection() {
    return (
        <DocSection title="Error Handling">
            <h3 className="text-2xl font-bold text-light">Common Errors</h3>

            <div className="space-y-6 mt-4">
                <ErrorCard
                    title="Origin Mismatch"
                    error="origins don't match https://portal.lazor.sh http://localhost:3000"
                    cause="LazorKit portal doesn't allow localhost connections for security."
                    solution="Deploy to production (Vercel, Netlify) or use ngrok for local testing."
                />

                <ErrorCard
                    title="Signing Failed"
                    error="Error: Signing failed"
                    cause="User cancelled biometric authentication or passkey not available."
                    solution="Prompt user to try again or reconnect wallet."
                />

                <ErrorCard
                    title="Insufficient Balance"
                    error="Error: Custom:1"
                    cause="Wallet doesn't have enough SOL to send transaction."
                    solution="Request airdrop from Devnet faucet or fund wallet."
                />
            </div>

            <h3 className="text-2xl font-bold text-light mt-8">Error Handling Pattern</h3>
            <CodeBlock language="tsx">
                {`try {
  await someWalletOperation();
  toast.success('Operation successful');
} catch (error) {
  console.error('Operation failed:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('Signing failed')) {
      toast.error('Please authenticate with your biometrics');
    } else if (error.message.includes('insufficient')) {
      toast.error('Insufficient balance');
    } else if (error.message.includes('origins don\\'t match')) {
      toast.error('Please use a deployed URL, not localhost');
    } else {
      toast.error(\`Error: \${error.message}\`);
    }
  }
}`}
            </CodeBlock>
        </DocSection>
    );
}

function BestPracticesSection() {
    return (
        <DocSection title="Best Practices">
            <h3 className="text-2xl font-bold text-light">Security</h3>
            <ul className="list-disc list-inside space-y-2 text-light/70">
                <li>Never expose private keys - LazorKit handles all key management</li>
                <li>Always validate recipient addresses and amounts before transactions</li>
                <li>Use HTTPS in production - WebAuthn requires secure contexts</li>
            </ul>

            <h3 className="text-2xl font-bold text-light mt-8">Performance</h3>
            <ul className="list-disc list-inside space-y-2 text-light/70">
                <li>Lazy load the provider to reduce initial bundle size</li>
                <li>Debounce user inputs to prevent excessive validation calls</li>
                <li>Cache wallet state to avoid unnecessary re-renders</li>
            </ul>

            <h3 className="text-2xl font-bold text-light mt-8">User Experience</h3>
            <ul className="list-disc list-inside space-y-2 text-light/70">
                <li>Provide clear feedback for all operations (loading, success, error)</li>
                <li>Handle all edge cases (not connected, wallet initializing, etc.)</li>
                <li>Show transaction signatures with explorer links</li>
                <li>Display wallet balance and transaction history</li>
            </ul>

            <h3 className="text-2xl font-bold text-light mt-8">Input Validation</h3>
            <CodeBlock language="tsx">
                {`// Validate recipient address
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
                    problem="Passkey signing fails on localhost"
                    solution="Deploy to Vercel or use ngrok: npx ngrok http 3000"
                />

                <TroubleshootCard
                    problem="Buffer is not defined (hydration error)"
                    solution="Ensure BufferPolyfill is added to layout.tsx and runs client-side only"
                />

                <TroubleshootCard
                    problem="429 errors from Devnet faucet"
                    solution="Use alternative faucets (solfaucet.com) or wait 5-10 minutes between requests"
                />

                <TroubleshootCard
                    problem="Type errors with recipient state"
                    solution="Explicitly type state: const [recipient, setRecipient] = useState<string>('')"
                />

                <TroubleshootCard
                    problem="Module not found errors"
                    solution="Run: pnpm install && rm -rf .next && pnpm dev"
                />
            </div>

            <h3 className="text-2xl font-bold text-light mt-8">Additional Resources</h3>
            <ul className="list-disc list-inside space-y-2 text-light/70">
                <li>
                    <a
                        href="https://docs.lazorkit.com"
                        target="_blank"
                        className="text-primary hover:underline"
                    >
                        Official Documentation
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/lazor-kit/lazor-kit"
                        target="_blank"
                        className="text-primary hover:underline"
                    >
                        GitHub Repository
                    </a>
                </li>
                <li>
                    <a
                        href="https://www.npmjs.com/package/@lazorkit/wallet"
                        target="_blank"
                        className="text-primary hover:underline"
                    >
                        NPM Package
                    </a>
                </li>
            </ul>
        </DocSection>
    );
}

// Helper Components

function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-start w-full space-y-6">
            <div className="text-6xl text-left flex flex-col items-start justify-center">
                <DocsHeading firstText={title} secondText="Guide" />
            </div>
            <div className="w-full space-y-6">{children}</div>
        </div>
    );
}

function CodeBlock({ language, children }: { language: string; children: string }) {
    return (
        <pre className="bg-dark border border-neutral-800 rounded-lg p-4 text-sm text-light/80 overflow-x-auto">
            <code className={`language-${language}`}>{children}</code>
        </pre>
    );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-dark border border-neutral-800 rounded-lg p-4">
            <h4 className="text-light font-semibold mb-2">{title}</h4>
            <p className="text-sm text-light/70">{description}</p>
        </div>
    );
}

function ErrorCard({
    title,
    error,
    cause,
    solution,
}: {
    title: string;
    error: string;
    cause: string;
    solution: string;
}) {
    return (
        <div className="bg-dark border border-neutral-800 rounded-lg p-4">
            <h4 className="text-light font-semibold mb-2">{title}</h4>
            <p className="text-sm text-red-400 mb-2">Error: {error}</p>
            <p className="text-sm text-light/70 mb-1">
                <strong>Cause:</strong> {cause}
            </p>
            <p className="text-sm text-light/70">
                <strong>Solution:</strong> {solution}
            </p>
        </div>
    );
}

function TroubleshootCard({ problem, solution }: { problem: string; solution: string }) {
    return (
        <div className="bg-dark border border-neutral-800 rounded-lg p-4">
            <h4 className="text-light font-semibold mb-2">Problem: {problem}</h4>
            <p className="text-sm text-light/70">
                <strong>Solution:</strong> {solution}
            </p>
        </div>
    );
}
