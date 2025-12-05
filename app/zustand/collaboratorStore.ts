import { create } from "zustand";

interface CollaboratorState {
  isCreateCollaboratorModalOpen: boolean;
  openCreateCollaboratorModal: () => void;
  closeCreateCollaboratorModal: () => void;
}

export const useCollaboratorStore = create<CollaboratorState>((set) => ({
  isCreateCollaboratorModalOpen: false,
  openCreateCollaboratorModal: () =>
    set({ isCreateCollaboratorModalOpen: true }),
  closeCreateCollaboratorModal: () =>
    set({ isCreateCollaboratorModalOpen: false }),
}));
