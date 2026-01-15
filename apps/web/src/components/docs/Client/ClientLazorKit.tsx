'use client';

import { Button } from '../../ui/button';
import { FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import SafariBrowser from '../../ui/SafariBrowser';
import { useState } from 'react';
import { motion } from 'framer-motion';
import DocsHeading from '../../ui/DocsHeading';
import { LazorKitSubContent } from '@/src/types/docs-types';
import { useRouter } from 'next/navigation';

const lazorKitPoints = [
    {
        id: LazorKitSubContent.PASSKEY_WALLET,
        title: 'Passkey Wallet',
        description: 'Create seedless wallets using WebAuthn biometrics.',
        image: '/images/demo-1.jpg',
    },
    {
        id: LazorKitSubContent.GASLESS_TRANSACTIONS,
        title: 'Gasless Transactions',
        description: 'Send SOL without paying gas fees via Paymaster.',
        image: '/images/demo-2.jpg',
    },
    {
        id: LazorKitSubContent.SESSION_PERSISTENCE,
        title: 'Session Persistence',
        description: 'Auto-reconnect across devices and page refreshes.',
        image: '/images/demo-3.jpg',
    },
];

export default function ClientLazorKit() {
    const [activeImage, setActiveImage] = useState<string | null>('/images/demo-2.jpg');
    const router = useRouter();

    return (
        <div className="w-full h-full flex flex-col gap-y-10 items-start text-left tracking-wide text-light/90 max-w-[80%] mx-auto">
            <div className="flex flex-col items-start w-full">
                <div className="grid grid-cols-[60%_40%] w-full ">
                    <div className="">
                        <div className="text-6xl text-left flex flex-col items-start justify-center">
                            <DocsHeading firstText="LazorKit" secondText="Integration" />
                        </div>

                        <div className="text-md text-light/70 tracking-wider max-w-[600px] mt-6">
                            LazorKit brings passkey-based wallet authentication to Solana. Create
                            seedless wallets using biometrics, send gasless transactions, and enjoy
                            persistent sessions across devices. No seed phrases, no gas fees, just
                            seamless Web3 authentication.
                        </div>
                    </div>
                    <div className="relative flex-1 w-full h-full">
                        <Image
                            src="/images/svgs/monkey.svg"
                            fill
                            unoptimized
                            alt="lazorkit-image"
                            className="rounded-2 object-cover invert scale-125 sepia-[0.3] hue-rotate-[280deg] saturate-[10]"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-x-5 mt-6">
                    <Button size={'lg'} onClick={() => router.push('/')}>
                        <span className="font-semibold">Try LazorKit Demo</span>
                    </Button>
                    <Button
                        size={'lg'}
                        className="flex items-center justify-center gap-x-2 bg-light hover:bg-light/70 text-dark"
                        onClick={() => window.open('https://docs.lazorkit.com', '_blank')}
                    >
                        <span className="font-semibold">Official Docs</span>
                        <FaChevronRight strokeWidth={0.1} />
                    </Button>
                </div>

                <div className="w-full flex gap-x-5 mt-6">
                    {lazorKitPoints.map((point, index) => (
                        <FeatureCard
                            id={point.id}
                            key={point.title}
                            delay={index / 10}
                            heading={point.title}
                            description={point.description}
                            onMouseEnter={() => setActiveImage(point.image)}
                        />
                    ))}
                </div>
            </div>

            <SafariBrowser className="" url="northfall.vercel.app" imageSrc={activeImage!} />

            <div className="w-full space-y-8 mt-8">
                <section id={LazorKitSubContent.OVERVIEW} className="scroll-mt-24">
                    <h2 className="text-3xl font-bold text-light mb-4">Overview</h2>
                    <div className="text-light/70 space-y-4">
                        <p>
                            LazorKit is integrated into NorthFall as a demonstration of next-generation
                            wallet technology for Solana. The integration showcases three core features
                            that dramatically improve the user experience.
                        </p>
                        <p>
                            Traditional Solana wallets require users to manage 12-24 word seed phrases,
                            hold SOL for gas fees, and manually reconnect after every page refresh.
                            LazorKit eliminates all of these friction points.
                        </p>
                    </div>
                </section>

                <section id={LazorKitSubContent.PASSKEY_WALLET} className="scroll-mt-24">
                    <h2 className="text-3xl font-bold text-light mb-4">Passkey Wallet Creation</h2>
                    <div className="text-light/70 space-y-4">
                        <p>
                            Create a Solana wallet using your device's biometric authentication. No seed
                            phrases to remember or store. Private keys are secured in your device's
                            Secure Enclave and never leave the hardware.
                        </p>
                        <div className="bg-dark border border-neutral-800 rounded-lg p-4 mt-4">
                            <h3 className="text-light font-semibold mb-2">How it works:</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Click "Create Passkey Wallet" in the LazorKit demo</li>
                                <li>Browser prompts for FaceID, TouchID, or Windows Hello</li>
                                <li>Authenticate with your biometrics</li>
                                <li>Smart wallet address is generated from your passkey</li>
                                <li>Same passkey always generates the same wallet address</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id={LazorKitSubContent.GASLESS_TRANSACTIONS} className="scroll-mt-24">
                    <h2 className="text-3xl font-bold text-light mb-4">Gasless Transactions</h2>
                    <div className="text-light/70 space-y-4">
                        <p>
                            Send SOL transfers without holding SOL for gas fees. LazorKit's Paymaster
                            service sponsors all transaction costs, enabling a completely gasless user
                            experience.
                        </p>
                        <div className="bg-dark border border-neutral-800 rounded-lg p-4 mt-4">
                            <h3 className="text-light font-semibold mb-2">Transaction flow:</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Enter recipient address and amount</li>
                                <li>Click "Send SOL (Gasless)"</li>
                                <li>Authenticate with your passkey to sign</li>
                                <li>Paymaster sponsors the transaction fee</li>
                                <li>Transaction is submitted to Solana Devnet</li>
                                <li>You pay zero gas fees</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section id={LazorKitSubContent.SESSION_PERSISTENCE} className="scroll-mt-24">
                    <h2 className="text-3xl font-bold text-light mb-4">Session Persistence</h2>
                    <div className="text-light/70 space-y-4">
                        <p>
                            Wallet sessions persist across page refreshes and sync across devices. No
                            need to reconnect manually. WebAuthn credentials are stored securely and
                            restore your session automatically.
                        </p>
                        <div className="bg-dark border border-neutral-800 rounded-lg p-4 mt-4">
                            <h3 className="text-light font-semibold mb-2">Session features:</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Automatic reconnection on page refresh</li>
                                <li>Cross-device sync via iCloud Keychain or Google Password Manager</li>
                                <li>No re-authentication required for active sessions</li>
                                <li>Same wallet accessible from multiple devices</li>
                                <li>Device-bound credentials for security</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="bg-dark border border-neutral-800 rounded-lg p-6 mt-8">
                    <h3 className="text-2xl font-bold text-light mb-4">Try it yourself</h3>
                    <p className="text-light/70 mb-4">
                        The LazorKit integration is live on NorthFall. Click the "LazorKit" button in
                        the navigation bar to access the demo and experience passkey authentication
                        firsthand.
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push('/')}>
                            <span className="font-semibold">Open Demo</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    'https://github.com/ayushshrivastv/NorthFall/tree/main/apps/web/src/features/lazorkit-demo',
                                    '_blank',
                                )
                            }
                        >
                            <span className="font-semibold">View Code</span>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    heading: string;
    description: string;
    icon?: React.ReactElement;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    id?: string | undefined;
    delay: number;
}

function FeatureCard({
    heading,
    description,
    icon,
    id,
    delay = 0,
    onMouseEnter,
    onMouseLeave,
}: FeatureCardProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.2, ease: 'easeOut' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex flex-col max-w-60 items-start gap-y-1 rounded-md border border-neutral-700 bg-dark 
                 px-3 py-2 text-left text-light/80 select-none scroll-mt-24
                 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_10px_2px_rgba(20,241,149,0.2)]"
        >
            <div className="flex items-center gap-x-1.5">
                {icon}
                <span className="font-semibold tracking-wide text-md">{heading}</span>
            </div>
            <p className="text-sm text-light/60 tracking-wide">{description}</p>
        </motion.section>
    );
}
