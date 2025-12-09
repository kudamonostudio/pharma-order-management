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
import { toggleCollaboratorActive } from "@/app/actions/Collaborators";

interface ToggleColabActiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: number;
  isActive: boolean;
  storeSlug: string;
  onSuccess?: () => void;
}

export function ToggleColabActiveModal({
  open,
  onOpenChange,
  assignmentId,
  isActive,
  storeSlug,
  onSuccess,
}: ToggleColabActiveModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await toggleCollaboratorActive(assignmentId, !isActive, storeSlug);

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
