"use client";

import { useState, useTransition } from "react";
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
import { createStore } from "@/app/actions/Store";
import { useRouter } from "next/navigation";

interface CreateStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoreModal({
  open,
  onOpenChange,
}: CreateStoreModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    /* image: "", */
    /* TODO: AGREGAR CUANDO ESTE LA IMAGEN EN EL SCHEMA DE TIENDA */
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("slug", generateSlug(formData.name));

        await createStore(formDataToSend);

        onOpenChange(false);

        setFormData({
          name: "",
          address: "",
          phone: "",
          /* image: "", */
          /* TODO: AGREGAR CUANDO ESTE LA IMAGEN EN EL SCHEMA DE TIENDA */
        });

        // Refresh para ver los cambios
        router.refresh();
      } catch (error) {
        console.error("Error creating store:", error);
        // TODO: Mostrar error al usuario (puedes usar toast)
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nueva tienda</DialogTitle>
          <DialogDescription>
            Completa la información de la nueva tienda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              placeholder="Ej: Farmacia Central"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              placeholder="Ej: Av. Principal 123"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              placeholder="Ej: 999-111-222"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="image">URL de imagen</Label>
            <Input
              id="image"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div> */}{" "}
          {/* TODO: AGREGAR CUANDO ESTE LA IMAGEN EN EL SCHEMA DE TIENDA */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear tienda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
