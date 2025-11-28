import { create } from 'zustand';

interface ProductState {
  isCreateProductModalOpen: boolean;
  openCreateProductModal: () => void;
  closeCreateProductModal: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  isCreateProductModalOpen: false,
  openCreateProductModal: () => set({ isCreateProductModalOpen: true }),
  closeCreateProductModal: () => set({ isCreateProductModalOpen: false }),
}));
