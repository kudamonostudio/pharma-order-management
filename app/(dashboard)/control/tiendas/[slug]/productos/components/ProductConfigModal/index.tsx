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
import { Product } from "@prisma/client";
import { DeleteProductModal } from "./DeleteProductModal";
import { updateProduct } from "@/app/actions/Products";

interface ProductConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  storeSlug: string;
}

type ModalView = "menu" | "edit";

export function ProductConfigModal({
  open,
  onOpenChange,
  product,
  storeSlug,
}: ProductConfigModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ModalView>("menu");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    if (open) {
      setView("menu");
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsLoading(true);

    try {
      // const formDataToSend = new FormData();
      // formDataToSend.append("id", String(product.id));
      // formDataToSend.append("name", formData.name);
      // formDataToSend.append("price", formData.price);

      // await updateProduct(formDataToSend); // TODO

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating branch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {view === "menu" ? "Gestionar Product" : "Editar Producto"}
            </DialogTitle>
            <DialogDescription>
              {view === "menu"
                ? `Opciones para ${product.name}`
                : "Modifica la información del producto"}
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
                <Label htmlFor="edit-address">Precio</Label>
                <Input
                  id="edit-address"
                  placeholder="500"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
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

      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        productId={product.id}
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
