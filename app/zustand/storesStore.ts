import { create } from 'zustand';

interface StoresState {
  isCreateBranchModalOpen: boolean;
  openCreateBranchModal: () => void;
  closeCreateBranchModal: () => void;
}

export const useStoresStore = create<StoresState>((set) => ({
  isCreateBranchModalOpen: false,
  openCreateBranchModal: () => set({ isCreateBranchModalOpen: true }),
  closeCreateBranchModal: () => set({ isCreateBranchModalOpen: false }),
}));
