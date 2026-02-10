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

interface ToggleStoreLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  withLocation: boolean;
  onSuccess?: () => void;
}

export function ToggleStoreLocationModal({
  open,
  onOpenChange,
  storeId,
  withLocation,
  onSuccess,
}: ToggleStoreLocationModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("withLocation", String(!withLocation));

        await updateStore(storeId, formData);

        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error("Error toggling store location:", error);
      }
    });
  };

  const actionText = withLocation ? "deshabilitar" : "habilitar";
  const ActionText = withLocation ? "Deshabilitar" : "Habilitar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ActionText} retiro en sucursal</DialogTitle>
          <DialogDescription>
            ¿Confirmas que quieres {actionText} el retiro en sucursal en esta tienda?
            {withLocation
              ? " Los clientes no podrán elegir una sucursal de retiro al hacer su orden."
              : " Los clientes podrán seleccionar una sucursal de retiro al hacer su orden."}
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
              ? withLocation
                ? "Deshabilitando..."
                : "Habilitando..."
              : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
