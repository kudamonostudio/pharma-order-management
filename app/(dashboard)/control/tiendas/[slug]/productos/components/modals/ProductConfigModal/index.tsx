"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
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
import { Textarea } from "@/components/ui/text-area";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Power } from "lucide-react";
import { Product } from "@prisma/client";
import { DeleteProductModal } from "./DeleteProductModal";
import { ToggleProductActiveModal } from "./ToggleProductActiveModal";
import { updateProduct, updateProductImage } from "@/app/actions/Products";
import { uploadProductImage } from "@/lib/supabase/client/uploadImage";
import { cn } from "@/lib/utils";

type ProductWithNumberPrice = Omit<Product, "price"> & { price: number };

interface ProductConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductWithNumberPrice | null;
  storeSlug: string;
  withPrices: boolean;
}

type ModalView = "menu" | "edit";

export function ProductConfigModal({
  open,
  onOpenChange,
  product,
  storeSlug,
  withPrices,
}: ProductConfigModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ModalView>("menu");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleActiveModalOpen, setIsToggleActiveModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("La imagen no puede pesar más de 1MB");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  useEffect(() => {
    if (open) {
      setView("menu");
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price.toString(),
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        description: formData.description || null,
        price: Number(formData.price),
      };

      await updateProduct(product.id, updateData);

      // Se sube la imagen directamente a supabase, luego se actualiza DB
      if (imageFile) {
        const imageUrl = await uploadProductImage(
          product.storeId,
          product.id,
          imageFile
        );
        await updateProductImage(product.id, imageUrl);
        URL.revokeObjectURL(previewUrl as string);
      }

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
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
              {view === "menu" ? "Gestionar Producto" : "Editar Producto"}
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

              {/* Opción 2: Inactivar/Activar */}
              <Button
                variant="outline"
                className={cn(
                  "justify-start gap-2 h-12",
                  product.isActive ? "bg-gray-100" : ""
                )}
                onClick={() => setIsToggleActiveModalOpen(true)}
              >
                <Power className="h-4 w-4" />
                {product.isActive ? "Inactivar producto" : "Activar producto"}
              </Button>

              {/* Opción 3: Eliminar */}
              <Button
                variant="destructive"
                className="justify-start gap-2 h-12"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar producto
              </Button>
            </div>
          ) : (
            /* Formulario de Edición */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  placeholder="Ej: Suavizante para Ropa 500ml"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              {withPrices && (
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Precio *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    placeholder="Ej: 2.50"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Escribe una descripción (opcional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Imagen</Label>
                <div
                  {...getRootProps()}
                  className="border border-dashed rounded-md p-4 cursor-pointer text-center text-sm text-neutral-600 hover:bg-neutral-50"
                >
                  <input {...getInputProps()} />
                  {imageFile ? (
                    previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="mx-auto h-32 w-32 object-cover rounded-md"
                      />
                    )
                  ) : product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt="Imagen actual"
                      className="mx-auto h-32 w-32 object-cover rounded-md"
                    />
                  ) : isDragActive ? (
                    <p>Suelta la imagen aquí…</p>
                  ) : (
                    <p>Arrastra una imagen o haz click para seleccionar</p>
                  )}
                </div>
                <p className="text-xs text-neutral-500">
                  Máx. 1MB — formatos permitidos: JPG, PNG, WEBP
                </p>
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

      <ToggleProductActiveModal
        open={isToggleActiveModalOpen}
        onOpenChange={setIsToggleActiveModalOpen}
        productId={product.id}
        isActive={product.isActive}
        onSuccess={() => {
          setIsToggleActiveModalOpen(false);
          onOpenChange(false);
          router.refresh();
        }}
      />
    </>
  );
}
