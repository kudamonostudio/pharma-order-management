"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Location } from "@prisma/client";
import { updateLocation } from "@/app/actions/Store/Locations";
import { DeleteBranchModal } from "./DeleteBranchModal";

interface BranchConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Location | null;
  storeSlug: string;
}

type ModalView = "menu" | "edit";

export function BranchConfigModal({
  open,
  onOpenChange,
  branch,
  storeSlug,
}: BranchConfigModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ModalView>("menu");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    if (branch) {
      setFormData({
        name: branch.name,
        address: branch.address,
        phone: branch.phone || "",
      });
    }
  }, [branch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("phone", formData.phone);

      await updateLocation(branch.id, storeSlug, formDataToSend);

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating branch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!branch) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {view === "menu" ? "Gestionar Sucursal" : "Editar Sucursal"}
            </DialogTitle>
            <DialogDescription>
              {view === "menu"
                ? `Opciones para ${branch.name}`
                : "Modifica la información de la sucursal"}
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

              {/* Opción 2: Eliminar */}
              <Button
                variant="destructive"
                className="justify-start gap-2 h-12"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar sucursal
              </Button>
            </div>
          ) : (
            /* Formulario de Edición */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  placeholder="Ej: Sucursal Centro"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Dirección *</Label>
                <Input
                  id="edit-address"
                  placeholder="Ej: Av. Principal 123"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
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
                  variant="outline"
                  onClick={() => setView("menu")}
                  disabled={isLoading}
                >
                  Volver
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <DeleteBranchModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        branchId={branch.id}
        storeSlug={storeSlug}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          onOpenChange(false);
          router.refresh();
        }}
      />
    </>
  );
}
