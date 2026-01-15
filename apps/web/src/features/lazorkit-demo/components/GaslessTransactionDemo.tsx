'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { useLazorKitDemo } from '../hooks/useLazorKitDemo';
import { LAZORKIT_CONFIG, getExplorerUrl } from '../config';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FaPaperPlane, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';

/**
 * Gasless Transaction Demo Component
 * Demonstrates sending SOL without paying gas fees via Paymaster
 */
export default function GaslessTransactionDemo() {
    const { signAndSendTransaction, smartWalletPubkey, isConnected, addTransaction, handleError } =
        useLazorKitDemo();
    const [recipient, setRecipient] = useState<string>(LAZORKIT_CONFIG.demoRecipient);
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

        // Check if signAndSendTransaction is available
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

            // Sign and send with gasless transaction (Paymaster pays fees)
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

            // Provide more specific error messages
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
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <FaPaperPlane className="text-primary size-4" />
                <h3 className="text-sm md:text-base font-semibold text-light tracking-wide">
                    Gasless Transaction
                </h3>
            </div>

            {/* Recipient Input */}
            <div className="space-y-2">
                <label className="text-xs text-light/70">Recipient Address</label>
                <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    disabled={!isConnected}
                    placeholder="Enter Solana address"
                    className={cn(
                        'w-full px-3 py-2',
                        'bg-neutral-900/50 border border-neutral-800',
                        'rounded-lg',
                        'text-xs md:text-sm text-light font-mono',
                        'placeholder:text-light/30',
                        'focus:outline-none focus:border-primary/50',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'transition-all',
                    )}
                />
            </div>

            {/* Amount Selection */}
            <div className="space-y-2">
                <label className="text-xs text-light/70">Amount (SOL)</label>
                <div className="grid grid-cols-3 gap-2">
                    {LAZORKIT_CONFIG.demoAmounts.map((amt) => (
                        <button
                            key={amt}
                            onClick={() => setAmount(amt)}
                            disabled={!isConnected}
                            className={cn(
                                'px-3 py-2 rounded-lg',
                                'text-xs font-medium',
                                'border transition-all',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                amount === amt
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-neutral-900/50 border-neutral-800 text-light/70 hover:border-neutral-700',
                            )}
                        >
                            {amt} SOL
                        </button>
                    ))}
                </div>
            </div>

            {/* Send Button */}
            <Button
                onClick={handleSendTransaction}
                disabled={!isConnected || isSending || !recipient}
                className={cn(
                    'w-full flex items-center justify-center gap-2',
                    'px-4 py-4',
                    'text-sm font-medium',
                    'bg-primary hover:bg-primary/90',
                    'border-0 rounded-lg',
                    'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
                )}
            >
                <FaPaperPlane className="size-4" />
                <span className="text-white">
                    {isSending ? 'Sending...' : `Send ${amount} SOL (Gasless)`}
                </span>
            </Button>

            {/* Transaction Result */}
            {lastSignature && (
                <div
                    className={cn(
                        'p-4 rounded-lg',
                        'bg-green-500/10 border border-green-500/30',
                        'space-y-2',
                    )}
                >
                    <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500 size-4" />
                        <span className="text-xs md:text-sm font-semibold text-green-500">
                            Transaction Successful
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-light/50 font-mono break-all">
                            {lastSignature.slice(0, 20)}...{lastSignature.slice(-20)}
                        </span>
                        <a
                            href={getExplorerUrl(lastSignature)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#14f195] hover:text-[#14f195]/80 transition-colors"
                        >
                            <FaExternalLinkAlt className="size-3" />
                        </a>
                    </div>
                    <p className="text-[10px] text-light/60">
                        ⛽ Gas fees paid by Paymaster - you paid nothing!
                    </p>
                </div>
            )}

            {/* Info */}
            {!isConnected && (
                <div className="text-center">
                    <p className="text-[10px] md:text-xs text-light/50">
                        Connect your wallet to send gasless transactions
                    </p>
                </div>
            )}
        </div>
    );
}
