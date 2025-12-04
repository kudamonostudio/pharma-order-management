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
import { updateStore } from "@/app/actions/Store";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface ToggleStorePricesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  withPrices: boolean;
  onSuccess?: () => void;
}

export function ToggleStorePricesModal({
  open,
  onOpenChange,
  storeId,
  withPrices,
  onSuccess,
}: ToggleStorePricesModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("withPrices", String(!withPrices));

        await updateStore(storeId, formData);

        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error("Error toggling store prices:", error);
      }
    });
  };

  const actionText = withPrices ? "deshabilitar" : "habilitar";
  const ActionText = withPrices ? "Deshabilitar" : "Habilitar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ActionText} precios</DialogTitle>
          <DialogDescription>
            ¿Confirmas que quieres {actionText} los precios en esta tienda?
            {withPrices
              ? " Los precios no se mostrarán en el catálogo."
              : " Los precios se mostrarán en el catálogo."}
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
            variant={"default"}
            onClick={handleToggle}
            disabled={isPending}
          >
            {isPending
              ? withPrices
                ? "Deshabilitando..."
                : "Habilitando..."
              : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
