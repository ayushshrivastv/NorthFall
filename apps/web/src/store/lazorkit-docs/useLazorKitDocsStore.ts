import { create } from 'zustand';
import { LazorKitDocsSection } from '@/src/types/lazorkit-docs-types';

interface LazorKitDocsStore {
    activeSection: LazorKitDocsSection;
    setActiveSection: (section: LazorKitDocsSection) => void;
}

export const useLazorKitDocsStore = create<LazorKitDocsStore>((set) => ({
    activeSection: LazorKitDocsSection.OVERVIEW,
    setActiveSection: (section) => set({ activeSection: section }),
}));
