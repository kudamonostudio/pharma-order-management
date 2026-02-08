"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLocation } from "@/app/actions/Store/Locations";
import { useRouter } from "next/navigation";

import { useStoresStore } from "@/app/zustand/storesStore";

interface CreateBranchModalProps {
  storeId: number;
  storeSlug: string;
}

export function CreateBranchModal({
  storeId,
  storeSlug,
}: CreateBranchModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = useStoresStore((state) => state.isCreateBranchModalOpen);
  const close = useStoresStore((state) => state.closeCreateBranchModal);

  const onOpenChange = (open: boolean) => {
    if (!open) close();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      await createLocation(formData);
      close();
      router.refresh();
    } catch (error) {
      console.error("Error creating branch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva sucursal</DialogTitle>
          <DialogDescription>
            Completa la información de la nueva sucursal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="storeId" value={storeId} />
          <input type="hidden" name="slug" value={storeSlug} />

          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Sucursal Centro"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico administrador *</Label>
            <Input
              id="email"
              name="email"
              placeholder="Ej: admin@sucursal.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              name="address"
              placeholder="Ej: Av. Principal 123"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefono *</Label>
            <Input id="phone" name="phone" placeholder="099 123 456" required />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear sucursal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
