'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { useLazorKitDemo } from '../hooks/useLazorKitDemo';
import { truncateAddress, getAddressExplorerUrl, LAZORKIT_CONFIG } from '../config';
import { FaFingerprint, FaWallet, FaExternalLinkAlt, FaCopy, FaFaucet } from 'react-icons/fa';
import { toast } from 'sonner';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

/**
 * Passkey Wallet Connection Component
 * Handles wallet creation, connection, and disconnection
 */
export default function PasskeyWalletConnect() {
    const { connect, disconnect, isConnected, isConnecting, wallet, handleError } =
        useLazorKitDemo();
    const [copied, setCopied] = useState(false);
    const [isAirdropping, setIsAirdropping] = useState(false);

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

    const requestAirdrop = async () => {
        if (!wallet?.smartWallet) {
            toast.error('Please connect wallet first');
            return;
        }

        setIsAirdropping(true);
        try {
            const connection = new Connection(LAZORKIT_CONFIG.rpcUrl, 'confirmed');
            const publicKey = new PublicKey(wallet.smartWallet);

            toast.info('Requesting 1 SOL from Devnet faucet...');

            // Request 1 SOL airdrop
            const signature = await connection.requestAirdrop(
                publicKey,
                1 * LAMPORTS_PER_SOL
            );

            // Wait for confirmation
            await connection.confirmTransaction(signature);

            toast.success('Airdrop successful! You received 1 SOL');
        } catch (error) {
            console.error('Airdrop error:', error);
            toast.error('Airdrop failed. Try again in a few seconds.');
        } finally {
            setIsAirdropping(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/30 border border-neutral-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            'w-2 h-2 rounded-full',
                            isConnected ? 'bg-green-500' : 'bg-neutral-600',
                        )}
                    />
                    <span className="text-xs md:text-sm text-light/70">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
                {isConnected && wallet?.smartWallet && (
                    <div className="flex items-center gap-2">
                        <a
                            href={getAddressExplorerUrl(wallet.smartWallet)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#14f195] hover:text-[#14f195]/80 transition-colors"
                        >
                            <FaExternalLinkAlt className="size-3" />
                        </a>
                    </div>
                )}
            </div>

            {/* Wallet Address Display */}
            {isConnected && wallet?.smartWallet ? (
                <div className="space-y-3">
                    <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-light/50 tracking-wide">Smart Wallet Address</span>
                            <Button
                                onClick={copyAddress}
                                className={cn(
                                    'p-1.5 h-auto',
                                    'bg-transparent hover:bg-neutral-800',
                                    'border-0',
                                )}
                            >
                                {copied ? (
                                    <span className="text-[10px] text-green-500">Copied!</span>
                                ) : (
                                    <FaCopy className="size-3 text-light/50" />
                                )}
                            </Button>
                        </div>
                        <div className="font-mono text-xs md:text-sm text-light break-all">
                            {wallet.smartWallet}
                        </div>
                        <div className="mt-2 text-[10px] text-light/40">
                            {truncateAddress(wallet.smartWallet, 8)}
                        </div>
                    </div>

                    {/* Airdrop Button */}
                    <Button
                        onClick={requestAirdrop}
                        disabled={isAirdropping}
                        className={cn(
                            'w-full flex items-center justify-center gap-2',
                            'px-4 py-3',
                            'text-sm font-medium',
                            'bg-[#14f195]/10 hover:bg-[#14f195]/20',
                            'border border-[#14f195]/30 rounded-lg',
                            'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                        )}
                    >
                        <FaFaucet className="size-4 text-[#14f195]" />
                        <span className="text-[#14f195]">
                            {isAirdropping ? 'Requesting...' : 'Get 1 SOL (Devnet Faucet)'}
                        </span>
                    </Button>

                    {/* Disconnect Button */}
                    <Button
                        onClick={handleDisconnect}
                        className={cn(
                            'w-full flex items-center justify-center gap-2',
                            'px-4 py-3',
                            'text-sm font-medium',
                            'bg-neutral-900 hover:bg-neutral-800',
                            'border border-neutral-700 rounded-lg',
                            'transition-all',
                        )}
                    >
                        <FaWallet className="size-4" />
                        <span className="text-light">Disconnect Wallet</span>
                    </Button>
                </div>
            ) : (
                /* Connect Button */
                <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className={cn(
                        'w-full flex items-center justify-center gap-2',
                        'px-4 py-5',
                        'text-sm font-medium',
                        'bg-primary hover:bg-primary/90',
                        'border-0 rounded-lg',
                        'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                >
                    <FaFingerprint className="size-5" />
                    <span className="text-white">
                        {isConnecting ? 'Connecting...' : 'Create Passkey Wallet'}
                    </span>
                </Button>
            )}

            {/* Info Text */}
            <div className="text-center">
                <p className="text-[10px] md:text-xs text-light/50 leading-relaxed">
                    {isConnected
                        ? 'Click "Get 1 SOL" to fund your wallet from the Devnet faucet'
                        : 'Click to create a wallet using FaceID, TouchID, or Windows Hello'}
                </p>
            </div>
        </div>
    );
}
