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
import { deleteProduct } from "@/app/actions/Products";

interface DeleteBranchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  storeSlug: string;
  onSuccess?: () => void;
}

export function DeleteProductModal({
  open,
  onOpenChange,
  productId,
  storeSlug,
  onSuccess,
}: DeleteBranchModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", String(productId));
        // formData.append("slug", storeSlug);

        await deleteProduct(formData);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Error deleting branch:", error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            ¿Estás seguro que quieres eliminar esta sucursal?
          </DialogTitle>
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
