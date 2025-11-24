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

interface ToggleStoreActiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId: number;
  isActive: boolean;
  onSuccess?: () => void;
}

export function ToggleStoreActiveModal({
  open,
  onOpenChange,
  storeId,
  isActive,
  onSuccess,
}: ToggleStoreActiveModalProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("isActive", String(!isActive));
        
        await updateStore(storeId, formData);
        
        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        console.error("Error toggling store status:", error);
      }
    });
  };

  const actionText = isActive ? "inactivar" : "activar";
  const ActionText = isActive ? "Inactivar" : "Activar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ActionText} tienda</DialogTitle>
          <DialogDescription>
            ¿Confirmas que quieres {actionText} esta tienda?
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
            {isPending ? (isActive ? "Inactivando..." : "Activando...") : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
