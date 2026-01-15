'use client';

import { Dispatch, SetStateAction } from 'react';
import OpacityBackground from '@/src/components/utility/OpacityBackground';
import ShaderSplitPanel from '@/src/components/utility/ShaderSplitPanel';
import DemoFeatureShowcase from './DemoFeatureShowcase';
import PasskeyWalletConnect from './PasskeyWalletConnect';
import GaslessTransactionDemo from './GaslessTransactionDemo';
import SessionPersistenceDemo from './SessionPersistenceDemo';
import { LazorKitDemoProvider } from '../providers/LazorKitDemoProvider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/tabs';

interface LazorKitDemoModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

/**
 * Main LazorKit Demo Modal Component
 * Uses the same modal pattern as LoginModal for consistency
 */
function DemoContent() {
    return (
        <div className="relative z-10 w-full flex flex-col space-y-4 md:space-y-6">
            {/* Tabs for different demo sections */}
            <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="w-full bg-neutral-900/50 border border-neutral-800/50">
                    <TabsTrigger
                        value="wallet"
                        className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white text-light/70 text-xs md:text-sm"
                    >
                        Wallet
                    </TabsTrigger>
                    <TabsTrigger
                        value="transaction"
                        className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white text-light/70 text-xs md:text-sm"
                    >
                        Gasless TX
                    </TabsTrigger>
                    <TabsTrigger
                        value="session"
                        className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white text-light/70 text-xs md:text-sm"
                    >
                        Session
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wallet" className="mt-4">
                    <PasskeyWalletConnect />
                </TabsContent>

                <TabsContent value="transaction" className="mt-4">
                    <GaslessTransactionDemo />
                </TabsContent>

                <TabsContent value="session" className="mt-4">
                    <SessionPersistenceDemo />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function LazorKitDemoModal({ isOpen, setIsOpen }: LazorKitDemoModalProps) {
    if (!isOpen) return null;

    return (
        <LazorKitDemoProvider>
            <OpacityBackground className="bg-darkest/70" onBackgroundClick={() => setIsOpen(false)}>
                <ShaderSplitPanel
                    imageSrc="/images/template/login-shader.png"
                    leftChildren={<DemoFeatureShowcase />}
                    rightChildren={<DemoContent />}
                />
            </OpacityBackground>
        </LazorKitDemoProvider>
    );
}
