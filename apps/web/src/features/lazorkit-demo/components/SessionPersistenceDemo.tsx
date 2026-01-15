'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { useLazorKitDemo } from '../hooks/useLazorKitDemo';
import { FaSync, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'sonner';

/**
 * Session Persistence Demo Component
 * Demonstrates automatic reconnection and session management
 */
export default function SessionPersistenceDemo() {
    const { isConnected, wallet } = useLazorKitDemo();
    const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (isConnected && !sessionStartTime) {
            setSessionStartTime(Date.now());
        } else if (!isConnected) {
            setSessionStartTime(null);
            setElapsedTime(0);
        }
    }, [isConnected, sessionStartTime]);

    useEffect(() => {
        if (!sessionStartTime) return;

        const interval = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionStartTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTestReconnection = () => {
        toast.info('Refreshing page to test auto-reconnect...');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <FaSync className="text-[#9e83ff] size-4" />
                <h3 className="text-sm md:text-base font-semibold text-light tracking-wide">
                    Session Persistence
                </h3>
            </div>

            {/* Session Status */}
            <div
                className={cn(
                    'p-4 rounded-lg border',
                    isConnected
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-neutral-900/30 border-neutral-800/50',
                )}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {isConnected ? (
                            <FaCheckCircle className="text-green-500 size-4" />
                        ) : (
                            <FaClock className="text-light/50 size-4" />
                        )}
                        <span className="text-xs md:text-sm font-semibold text-light">
                            {isConnected ? 'Session Active' : 'No Active Session'}
                        </span>
                    </div>
                    {isConnected && (
                        <span className="text-xs text-light/50 font-mono">{formatTime(elapsedTime)}</span>
                    )}
                </div>

                {isConnected && wallet?.smartWallet && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] md:text-xs">
                            <span className="text-light/50">Wallet</span>
                            <span className="text-light font-mono">
                                {wallet.smartWallet.slice(0, 8)}...{wallet.smartWallet.slice(-8)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] md:text-xs">
                            <span className="text-light/50">Auth Method</span>
                            <span className="text-light">WebAuthn Passkey</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Features */}
            <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-neutral-900/30 border border-neutral-800/50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#14f195] mt-1.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-light mb-1">Auto-Reconnect</h4>
                        <p className="text-[10px] text-light/60 leading-relaxed">
                            Your wallet automatically reconnects when you return to the page
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-neutral-900/30 border border-neutral-800/50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9e83ff] mt-1.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-light mb-1">Cross-Device Sync</h4>
                        <p className="text-[10px] text-light/60 leading-relaxed">
                            Passkeys sync via iCloud Keychain (iOS/Mac) or platform-specific mechanisms
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-neutral-900/30 border border-neutral-800/50 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <div className="flex-1">
                        <h4 className="text-xs font-semibold text-light mb-1">Secure Storage</h4>
                        <p className="text-[10px] text-light/60 leading-relaxed">
                            Credentials stored in device Secure Enclave, never exposed to JavaScript
                        </p>
                    </div>
                </div>
            </div>

            {/* Test Button */}
            {isConnected && (
                <Button
                    onClick={handleTestReconnection}
                    className={cn(
                        'w-full flex items-center justify-center gap-2',
                        'px-4 py-3',
                        'text-sm font-medium',
                        'bg-neutral-900 hover:bg-neutral-800',
                        'border border-neutral-700 rounded-lg',
                        'transition-all',
                    )}
                >
                    <FaSync className="size-4" />
                    <span className="text-light">Test Auto-Reconnect</span>
                </Button>
            )}

            {/* Info */}
            <div className="text-center">
                <p className="text-[10px] md:text-xs text-light/50 leading-relaxed">
                    {isConnected
                        ? 'Refresh the page to see your wallet reconnect automatically'
                        : 'Connect your wallet to test session persistence'}
                </p>
            </div>
        </div>
    );
}
