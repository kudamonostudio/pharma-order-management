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
import { deleteStore } from "@/app/actions/Store";

interface DeleteStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  onSuccess?: () => void;
}

export function DeleteStoreModal({
  open,
  onOpenChange,
  storeId,
  onSuccess,
}: DeleteStoreModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteStore(storeId);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Error deleting store:", error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>¿Estás seguro que quieres eliminar esta tienda?</DialogTitle>
          <DialogDescription>
            Una vez eliminada no podrás revertir el cambio.
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