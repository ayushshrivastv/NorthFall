import { PlanMessage } from '@northfall/types';
import { create } from 'zustand';

interface EditPlanStore {
    message: PlanMessage | null;
    setMessage: (message: PlanMessage) => void;
}

export const useEditPlanStore = create<EditPlanStore>((set) => ({
    message: null,
    setMessage: (message: PlanMessage) => set({ message }),
}));
