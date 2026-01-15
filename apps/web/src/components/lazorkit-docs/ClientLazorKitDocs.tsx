'use client';
import { useState } from 'react';
import ClientLazorKitContent from './ClientLazorKitContent';
import ClientLazorKitSidebar from './ClientLazorKitSidebar';
import { LazorKitDocsSection } from '@/src/types/lazorkit-docs-types';
import { useLazorKitDocsStore } from '@/src/store/lazorkit-docs/useLazorKitDocsStore';

export default function ClientLazorKitDocs() {
    const { activeSection, setActiveSection } = useLazorKitDocsStore();
    const [_activeIndex, setActiveIndex] = useState<number>(0);

    function switchSection(index: number, section: LazorKitDocsSection) {
        setActiveIndex(index);
        setActiveSection(section);
    }

    return (
        <div className="relative min-h-screen h-full w-full grid grid-cols-[20%_80%] pb-20">
            <div className="relative">
                <ClientLazorKitSidebar switchSection={switchSection} />
            </div>
            <div className="w-full pt-18">
                <ClientLazorKitContent section={activeSection} />
            </div>
        </div>
    );
}
