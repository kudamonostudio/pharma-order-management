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
import { updateStore } from "@/app/actions/Store";
import { useRouter } from "next/navigation";

interface Store {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
}

interface EditStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
}

export function EditStoreModal({ open, onOpenChange, store }: EditStoreModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        address: store.address || "",
        phone: store.phone || "",
      });
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;
    
    setIsLoading(true);
    
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar tienda</DialogTitle>
          <DialogDescription>
            Modifica la información de la tienda
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nombre *</Label>
            <Input
              id="edit-name"
              placeholder="Ej: Farmacia Central"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-address">Dirección</Label>
            <Input
              id="edit-address"
              placeholder="Ej: Av. Principal 123"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">Teléfono</Label>
            <Input
              id="edit-phone"
              placeholder="Ej: 999-111-222"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
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
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
