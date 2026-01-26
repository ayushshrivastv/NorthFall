'use client';
import { useState } from 'react';
import ClientFairScaleContent from './ClientFairScaleContent';
import ClientFairScaleSidebar from './ClientFairScaleSidebar';
import { FairScaleDocsSection } from '@/src/types/fairscale-docs-types';
import { useFairScaleDocsStore } from '@/src/store/fairscale-docs/useFairScaleDocsStore';

export default function ClientFairScaleDocs() {
    const { activeSection, setActiveSection } = useFairScaleDocsStore();
    const [_activeIndex, setActiveIndex] = useState<number>(0);

    function switchSection(index: number, section: FairScaleDocsSection) {
        setActiveIndex(index);
        setActiveSection(section);
    }

    return (
        <div className="relative min-h-screen h-full w-full grid grid-cols-[20%_80%] pb-20">
            <div className="relative">
                <ClientFairScaleSidebar switchSection={switchSection} />
            </div>
            <div className="w-full pt-18">
                <ClientFairScaleContent section={activeSection} />
            </div>
        </div>
    );
}
