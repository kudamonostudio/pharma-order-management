"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCollaboratorStore } from "@/app/zustand/collaboratorStore";

export function CreateCollaboratorButton() {
  const openCreateCollaboratorModal = useCollaboratorStore(
    (state) => state.openCreateCollaboratorModal
  );

  return (
    <Button onClick={openCreateCollaboratorModal}>
      <Plus className="w-4 h-4 mr-2" />
      Agregar Colaborador
    </Button>
  );
}
