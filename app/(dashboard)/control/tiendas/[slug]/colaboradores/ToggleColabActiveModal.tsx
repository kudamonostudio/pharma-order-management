"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface ToggleColabActiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId: number;
  isActive: boolean;
  onSuccess?: () => void;
}

export function ToggleColabActiveModal({
  open,
  onOpenChange,
  collaboratorId,
  isActive,
  onSuccess,
}: ToggleColabActiveModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        // TODO: Implementar updateCollaborator action cuando existan datos reales
        // await updateCollaborator(collaboratorId, { isActive: !isActive });
        console.log("Toggling colaborador:", collaboratorId, "-> isActive:", !isActive);

        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error("Error toggling collaborator active status:", error);
      }
    });
  };

  const actionText = isActive ? "inactivar" : "activar";
  const ActionText = isActive ? "Inactivar" : "Activar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ActionText} colaborador</DialogTitle>
          <DialogDescription>
            ¿Confirmas que quieres {actionText} este colaborador?
            {isActive
              ? " El colaborador no podrá acceder al sistema."
              : " El colaborador podrá acceder al sistema."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggle}
            disabled={isPending}
          >
            {isPending
              ? isActive
                ? "Inactivando..."
                : "Activando..."
              : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
