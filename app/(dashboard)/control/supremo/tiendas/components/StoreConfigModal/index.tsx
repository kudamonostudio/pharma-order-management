"use client";

import { useState, useEffect, useTransition } from "react";
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
import { updateStore } from "@/app/actions/Store";
import { useRouter } from "next/navigation";
import { Pencil, Power, Trash2 } from "lucide-react";
import { DeleteStoreModal } from "./DeleteStoreModal";
import { ToggleStoreActiveModal } from "./ToggleStoreActiveModal";
import { Store } from "@prisma/client";
import { cn } from "@/lib/utils";

interface StoreConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
}

type ModalView = "menu" | "edit";

export function StoreConfigModal({
  open,
  onOpenChange,
  store,
}: StoreConfigModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<ModalView>("menu");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleActiveModalOpen, setIsToggleActiveModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (open) {
      setView("menu");
    }
  }, [open]);

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        address: store.address || "",
        phone: store.phone || "",
      });
    }
  }, [store]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    startTransition(async () => {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("address", formData.address);
        formDataToSend.append("phone", formData.phone);

        await updateStore(store.id, formDataToSend);

        onOpenChange(false);
        router.refresh();
      } catch (error) {
        console.error("Error updating store:", error);
      }
    });
  };

  if (!store) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {view === "menu" ? "Gestionar Tienda" : "Editar Tienda"}
            </DialogTitle>
            <DialogDescription>
              {view === "menu"
                ? `Opciones para ${store.name}`
                : "Modifica la información de la tienda"}
            </DialogDescription>
          </DialogHeader>

          {view === "menu" ? (
            <div className="flex flex-col gap-3 py-4">
              {/* Opción 1: Editar */}
              <Button
                variant="outline"
                className="justify-start gap-2 h-12"
                onClick={() => setView("edit")}
              >
                <Pencil className="h-4 w-4" />
                Editar información
              </Button>

              {/* Opción 2: Inactivar/Activar */}
              <Button
                variant="outline"
                className={cn(
                  "justify-start gap-2 h-12",
                  store.isActive ? "bg-gray-100" : ""
                )}
                onClick={() => setIsToggleActiveModalOpen(true)}
              >
                <Power className="h-4 w-4" />
                {store.isActive ? "Inactivar tienda" : "Activar tienda"}
              </Button>

              {/* Opción 3: Eliminar */}
              <Button
                variant="destructive"
                className="justify-start gap-2 h-12"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar tienda
              </Button>
            </div>
          ) : (
            /* Formulario de Edición */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  placeholder="Ej: Farmacia Central"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Dirección</Label>
                <Input
                  id="edit-address"
                  placeholder="Ej: Av. Principal 123"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  placeholder="Ej: 999-111-222"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setView("menu")}
                  disabled={isPending}
                >
                  Atrás
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <DeleteStoreModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        storeId={store.id}
        onSuccess={() => {
          onOpenChange(false);
        }}
      />
      <ToggleStoreActiveModal
        open={isToggleActiveModalOpen}
        onOpenChange={setIsToggleActiveModalOpen}
        storeId={store.id}
        isActive={store.isActive}
        onSuccess={() => {
          onOpenChange(false);
        }}
      />
    </>
  );
}
