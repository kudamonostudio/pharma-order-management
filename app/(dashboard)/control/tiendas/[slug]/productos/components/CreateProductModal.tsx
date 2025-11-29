"use client";

import { useEffect, useState } from "react";
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

import { useProductStore } from "@/app/zustand/productStore";
import { createProduct, updateProductImage } from "@/app/actions/Products";
import { Textarea } from "@/components/ui/text-area";
import { useDropzone } from "react-dropzone";
import { uploadImage } from "@/lib/supabase/client/uploadImage";

interface CreateProductModalProps {
  storeId: number;
  storeSlug: string;
}

export function CreateProductModal({
  storeId,
  storeSlug,
}: CreateProductModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isOpen = useProductStore((state) => state.isCreateProductModalOpen);
  const close = useProductStore((state) => state.closeCreateProductModal);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("La imagen no puede pesar más de 1MB");
      return;
    }

    setProductImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const onOpenChange = (open: boolean) => {
    if (!open) close();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const newProductId = await createProduct(formData);
      if (!newProductId) throw new Error("No se creó la tienda");

      if (productImage) {
        const path = `stores/${storeId}/products/${newProductId}/${crypto.randomUUID()}-${productImage.name}`;
        const logoUrl = await uploadImage(path, productImage);
        await updateProductImage(newProductId, logoUrl);
        URL.revokeObjectURL(previewUrl as string);
      }

      close();
      router.refresh();
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setProductImage(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
          <DialogDescription>
            Completa la información del nuevo producto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* REQUIRED */}
          <input type="hidden" name="storeId" value={storeId} />
          <input type="hidden" name="storeSlug" value={storeSlug} />

          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej: Gaseosa 500ml"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              name="price"
              placeholder="Ej: 2.50"
              required
            />
          </div>

          {/* OPTIONAL */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Opcional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input id="brand" name="brand" placeholder="Opcional" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unidad</Label>
            <Input
              id="unit"
              name="unit"
              placeholder="Ej: kg, litro, paquete"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" name="sku" placeholder="Opcional" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              name="stock"
              placeholder="Ej: 100"
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="categoryId">Categoría</Label>
            <Input
              id="categoryId"
              type="number"
              name="categoryId"
              placeholder="ID categoría (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">Sucursal</Label>
            <Input
              id="locationId"
              type="number"
              name="locationId"
              placeholder="ID ubicación (opcional)"
            />
          </div> */}

          <div className="space-y-2">
            <Label>Imagen</Label>

            <div
              {...getRootProps()}
              className="border border-dashed rounded-md p-4 cursor-pointer text-center text-sm text-neutral-600 hover:bg-neutral-50"
            >
              <input {...getInputProps()} />
              {productImage ? (
                previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                )
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
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
