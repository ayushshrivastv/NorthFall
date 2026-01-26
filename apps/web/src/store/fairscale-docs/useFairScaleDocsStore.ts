import { create } from 'zustand';
import { FairScaleDocsSection } from '@/src/types/fairscale-docs-types';

interface FairScaleDocsStore {
    activeSection: FairScaleDocsSection;
    setActiveSection: (section: FairScaleDocsSection) => void;
}

export const useFairScaleDocsStore = create<FairScaleDocsStore>((set) => ({
    activeSection: FairScaleDocsSection.OVERVIEW,
    setActiveSection: (section) => set({ activeSection: section }),
}));
