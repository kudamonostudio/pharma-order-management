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

interface ToggleStoreShippingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  withShipping: boolean;
  onSuccess?: () => void;
}

export function ToggleStoreShippingModal({
  open,
  onOpenChange,
  storeId,
  withShipping,
  onSuccess,
}: ToggleStoreShippingModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("withShipping", String(!withShipping));

        await updateStore(storeId, formData);

        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error("Error toggling store shipping:", error);
      }
    });
  };

  const actionText = withShipping ? "deshabilitar" : "habilitar";
  const ActionText = withShipping ? "Deshabilitar" : "Habilitar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ActionText} envíos</DialogTitle>
          <DialogDescription>
            ¿Confirmas que quieres {actionText} los envíos en esta tienda?
            {withShipping
              ? " Los clientes no podrán elegir envío al hacer su orden."
              : " Los clientes podrán indicar una dirección de envío al hacer su orden."}
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
              ? withShipping
                ? "Deshabilitando..."
                : "Habilitando..."
              : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
