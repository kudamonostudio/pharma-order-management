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
import { createStore, updateLogo } from "@/app/actions/Store";
import { useRouter } from "next/navigation";
import { uploadStoreLogo } from "@/lib/supabase/client/uploadImage";
import Image from "next/image";

interface CreateStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoreModal({
  open,
  onOpenChange,
}: CreateStoreModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    image: "",
    email: "",
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("La imagen no puede pesar más de 1MB");
      return;
    }

    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("phone", formData.phone);
      if(formData.email !== "") {
        formDataToSend.append("email", formData.email);
      }

      const newStore = await createStore(formDataToSend);

      if (!newStore?.id) throw new Error("No se creó la tienda");

      // Se sube la imagen directamente a supabase, luego de actualiza DB
      if (logoFile) {
        const logoUrl = await uploadStoreLogo(newStore.id, logoFile);
        await updateLogo(newStore.id, logoUrl);
        URL.revokeObjectURL(previewUrl as string);
      }

      setFormData({
        name: "",
        address: "",
        phone: "",
        image: "",
        email: "",
      });
      setLogoFile(null);
      setPreviewUrl(null);

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating store:", error);
      // TODO: Mostrar error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
      setLogoFile(null);
    }
  }, [open]);

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
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico administrador</Label>
            <Input
              id="email"
              placeholder="Ej: admin@tienda.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          {/* TODO: MOSTRAR IMAGEN SI YA TIENE UNA IMAGEN PARA PODER CAMBIARLA */}
          <div className="space-y-2">
            <Label>Logo (opcional)</Label>

            <div
              {...getRootProps()}
              className="border border-dashed rounded-md p-4 cursor-pointer text-center text-sm text-neutral-600 hover:bg-neutral-50"
            >
              <input {...getInputProps()} />
              {logoFile ? (
                previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Vista previa"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                    width={128}
                    height={128}
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
              {isLoading ? "Creando..." : "Crear tienda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
