"use client";

import { useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteCollaborator } from "@/app/actions/Collaborators";

interface DeleteColabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId: number;
  storeSlug: string;
  onSuccess?: () => void;
}

export function DeleteColabModal({
  open,
  onOpenChange,
  collaboratorId,
  storeSlug,
  onSuccess,
}: DeleteColabModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCollaborator(collaboratorId, storeSlug);

        onOpenChange(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Error deleting collaborator:", error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            ¿Estás seguro que quieres eliminar este colaborador?
          </DialogTitle>
          <DialogDescription>
            Una vez eliminado no podrás revertir el cambio.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
