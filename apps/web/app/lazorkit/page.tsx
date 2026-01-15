'use client';
import ClientLazorKitDocs from '@/src/components/lazorkit-docs/ClientLazorKitDocs';

export default function LazorKit() {
    return (
        <div className="w-full flex flex-col bg-darkest h-full relative items-center">
            <ClientLazorKitDocs />
        </div>
    );
}
