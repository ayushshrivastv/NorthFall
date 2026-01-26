'use client';


import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { useFairScale } from '../providers/FairScaleProvider';
import { useWallet } from '@solana/wallet-adapter-react';
import { FaWallet } from 'react-icons/fa';
import { toast } from 'sonner';
import Image from 'next/image';
import WalletReputationCard from './WalletReputationCard';
import TierBenefitsDisplay from './TierBenefitsDisplay';
import ReputationGatedMarket from './ReputationGatedMarket';
import OpacityBackground from '@/src/components/utility/OpacityBackground';
import ShaderSplitPanel from '@/src/components/utility/ShaderSplitPanel';
import FairScaleShowcase from './FairScaleShowcase';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/tabs';
import OnchainVerificationBadge from './OnchainVerificationBadge';
import BenefitsComparison from './BenefitsComparison';

interface FairScaleModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Modal Content Component
 * Right panel content with tabs for different sections
 */
function ModalContent() {
    const { isConnected, connectWallet, disconnectWallet, markets, walletReputation, isLoading } =
        useFairScale();
    const { wallets, select, connect, wallet: solanaWallet, publicKey, disconnect } = useWallet();
    const [walletAddress, setWalletAddress] = useState('');
    const [showWalletSelection, setShowWalletSelection] = useState(false);

    // Loading animation state - must be declared unconditionally
    const [loadingStep, setLoadingStep] = useState(0);

    const loadingMessages = [
        "Connecting to FairScale API...",
        "Analyzing wallet activity...",
        "Extracting on-chain reputation...",
        "Calculating FairScore..."
    ];

    // Cycle through loading messages when loading
    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
        }, 1500); // Change message every 1.5 seconds

        return () => clearInterval(interval);
    }, [isLoading, loadingMessages.length]);

    const handleSolanaWalletConnect = async (walletName: string) => {
        try {
            const selectedWallet = wallets.find((w) => w.adapter.name === walletName);
            if (!selectedWallet) return;

            // Select the wallet first
            select(selectedWallet.adapter.name as any);

            // Small delay to ensure selection is processed
            await new Promise(resolve => setTimeout(resolve, 100));

            // Now connect
            await connect();

            // Check if we have a public key after connection
            if (publicKey) {
                await connectWallet(publicKey.toBase58());
                toast.success('Wallet connected successfully!');
                setShowWalletSelection(false);
            } else {
                toast.error('Wallet connected but no public key available');
            }
        } catch (error: any) {
            console.error('Wallet connection error:', error);
            if (error.message?.includes('User rejected')) {
                toast.error('Wallet connection rejected');
            } else {
                toast.error('Failed to connect wallet. Please try again.');
            }
        }
    };

    const handleConnect = async () => {
        if (!walletAddress.trim()) {
            toast.error('Please enter a wallet address');
            return;
        }

        try {
            await connectWallet(walletAddress);
            toast.success('Wallet connected successfully!');
        } catch (error) {
            toast.error('Failed to connect wallet');
        }
    };

    const handleDisconnect = async () => {
        disconnectWallet();
        setWalletAddress('');
        if (publicKey) {
            await disconnect();
        }
        toast.success('Wallet disconnected');
    };

    const handleTestWallet = async () => {
        const demoAddress = 'DEMO1234567890';
        setWalletAddress(demoAddress);
        await connectWallet(demoAddress);
        toast.success('Test wallet connected!');
    };

    // Show loading state while fetching FairScale data
    if (isLoading) {
        return (
            <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-6 py-12">
                <div className="flex flex-col items-center space-y-4">
                    {/* Animated FairScale Logo/Icon */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-[#9945FF]/10 flex items-center justify-center animate-pulse">
                            <FaWallet className="size-8 text-[#9945FF]" />
                        </div>
                        {/* Spinning border */}
                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#9945FF] animate-spin"></div>
                    </div>

                    {/* Loading text with cycling messages */}
                    <div className="text-center space-y-2 min-h-[80px]">
                        <h3 className="text-lg font-semibold text-light transition-all duration-300">
                            {loadingMessages[loadingStep]}
                        </h3>
                        <p className="text-xs text-light/50 max-w-[250px]">
                            Please wait while we fetch your reputation data from FairScale
                        </p>
                    </div>

                    {/* Loading steps animation */}
                    <div className="flex items-center gap-2 mt-4">
                        <div className="w-2 h-2 rounded-full bg-[#9945FF] animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-[#9945FF] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-[#9945FF] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex gap-1 mt-2">
                        {loadingMessages.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 w-8 rounded-full transition-all duration-300 ${index === loadingStep ? 'bg-[#9945FF]' : 'bg-neutral-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="relative z-10 w-full flex flex-col space-y-4 md:space-y-6">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-[#9945FF]/10 rounded-full">
                        <FaWallet className="size-6 text-[#9945FF]" />
                    </div>
                    <h3 className="text-lg font-semibold text-light mb-1">Connect Your Wallet</h3>
                    <p className="text-xs text-light/50">
                        {showWalletSelection
                            ? 'Select your Solana wallet'
                            : 'Connect your wallet to view your FairScore'}
                    </p>
                </div>

                {!showWalletSelection ? (
                    <div className="space-y-3 md:space-y-5">
                        <Button
                            onClick={() => setShowWalletSelection(true)}
                            className="w-full px-4 py-3 md:py-5 bg-[#0f0f0f] hover:bg-[#141414] border border-neutral-800 text-light rounded-[8px] font-medium"
                        >
                            Connect Wallet
                        </Button>
                        <Button
                            onClick={handleTestWallet}
                            className="w-full px-4 py-3 md:py-5 bg-[#0f0f0f] hover:bg-[#141414] border border-neutral-800 text-light rounded-[8px] font-medium"
                        >
                            Try Test Wallet
                        </Button>
                        <p className="text-[10px] text-center text-light/40">
                            {process.env.NEXT_PUBLIC_FAIRSCALE_API_KEY
                                ? 'Using FairScale API for real reputation data'
                                : 'Using FairScale API for reputation data'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2 md:space-y-3">
                        <div className="space-y-2">
                            {wallets.length > 0 ? (
                                wallets.map((w) => (
                                    <button
                                        key={w.adapter.name}
                                        onClick={() => handleSolanaWalletConnect(w.adapter.name)}
                                        className="w-full text-left py-3 md:py-5 px-4 md:px-6 rounded-[8px] bg-[#0f0f0f] hover:bg-[#141414] border border-neutral-800 transition duration-200 ease-in-out cursor-pointer flex justify-start items-center gap-x-3"
                                    >
                                        <Image
                                            src={w.adapter.icon}
                                            alt={w.adapter.name}
                                            width={20}
                                            height={20}
                                            className="rounded"
                                        />
                                        <span className="text-[#d4d8de] text-[8px] md:text-sm tracking-wide font-medium">{w.adapter.name}</span>
                                    </button>
                                ))
                            ) : (
                                <p className="text-xs text-light/50 text-center py-4">
                                    No Solana wallets detected. Please install Phantom or Solflare.
                                </p>
                            )}
                        </div>
                        <Button
                            onClick={() => setShowWalletSelection(false)}
                            className="w-full px-4 py-2 md:py-3 bg-[#0f0f0f] hover:bg-[#141414] border border-neutral-800 text-light rounded-[8px] text-sm"
                        >
                            Back
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative z-10 w-full flex flex-col space-y-4 md:space-y-6">
            {/* Tabs for different demo sections */}
            <Tabs defaultValue="reputation" className="w-full">
                <TabsList className="w-full bg-neutral-900/50 border border-neutral-800/50">
                    <TabsTrigger
                        value="reputation"
                        className="flex-1 data-[state=active]:bg-[#9945FF] data-[state=active]:text-white text-light/70 text-xs md:text-sm"
                    >
                        Reputation
                    </TabsTrigger>
                    <TabsTrigger
                        value="benefits"
                        className="flex-1 data-[state=active]:bg-[#9945FF] data-[state=active]:text-white text-light/70 text-xs md:text-sm"
                    >
                        Benefits
                    </TabsTrigger>
                    <TabsTrigger
                        value="markets"
                        className="flex-1 data-[state=active]:bg-[#9945FF] data-[state=active]:text-white text-light/70 text-xs md:text-sm"
                    >
                        Markets
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="reputation" className="mt-4 space-y-4">
                    <OnchainVerificationBadge
                        walletAddress={walletReputation?.address || ''}
                        lastUpdated={walletReputation?.fairScore.lastUpdated || new Date().toISOString()}
                    />
                    <WalletReputationCard />
                    <Button
                        onClick={handleDisconnect}
                        className="w-full px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-light rounded-lg"
                    >
                        Disconnect
                    </Button>
                </TabsContent>

                <TabsContent value="benefits" className="mt-4 space-y-4">
                    <BenefitsComparison />
                    <TierBenefitsDisplay />
                </TabsContent>

                <TabsContent value="markets" className="mt-4 space-y-4">
                    <h3 className="text-sm font-semibold text-light">Reputation-Gated Markets</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {markets.map((market) => (
                            <ReputationGatedMarket
                                key={market.id}
                                market={market}
                                userTier={walletReputation?.currentTier.name}
                            />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

/**
 * FairScale Modal
 * Main interface using ShaderSplitPanel layout
 */
export default function FairScaleModal({ isOpen, setIsOpen }: FairScaleModalProps) {
    if (!isOpen) return null;

    return (
        <OpacityBackground className="bg-darkest/70" onBackgroundClick={() => setIsOpen(false)}>
            <ShaderSplitPanel
                imageSrc="/images/template/fairscale-shader.png"
                leftChildren={<FairScaleShowcase />}
                rightChildren={<ModalContent />}
            />
        </OpacityBackground>
    );
}
