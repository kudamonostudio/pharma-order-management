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
import { updateProduct } from "@/app/actions/Products";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface ToggleProductActiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  isActive: boolean;
  onSuccess?: () => void;
}

export function ToggleProductActiveModal({
  open,
  onOpenChange,
  productId,
  isActive,
  onSuccess,
}: ToggleProductActiveModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        await updateProduct(productId, { isActive: !isActive });

        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error("Error toggling product active status:", error);
      }
    });
  };

  const actionText = isActive ? "inactivar" : "activar";
  const ActionText = isActive ? "Inactivar" : "Activar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ActionText} producto</DialogTitle>
          <DialogDescription>
            ¿Confirmas que quieres {actionText} este producto?
            {isActive
              ? " El producto no se mostrará en el catálogo."
              : " El producto se mostrará en el catálogo."}
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
