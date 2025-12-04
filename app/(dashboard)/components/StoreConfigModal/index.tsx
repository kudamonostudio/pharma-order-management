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
import { updateStore } from "@/app/actions/Store";
import { useRouter } from "next/navigation";
import { Pencil, Power, Trash2, DollarSign } from "lucide-react";
import { updateLogo } from "@/app/actions/Store";
import { DeleteStoreModal } from "./DeleteStoreModal";
import { ToggleStoreActiveModal } from "./ToggleStoreActiveModal";
import { ToggleStorePricesModal } from "./ToggleStorePricesModal";
import { Store } from "@prisma/client";
import { cn } from "@/lib/utils";
import { uploadStoreLogo } from "@/lib/supabase/client/uploadImage";

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
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ModalView>("menu");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleActiveModalOpen, setIsToggleActiveModalOpen] = useState(false);
  const [isTogglePricesModalOpen, setIsTogglePricesModalOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
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

  useEffect(() => {
    if (open) {
      setView("menu");
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
      setLogoFile(null);
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

      // Se sube la imagen directamente a supabase, luego de actualiza DB
      if (logoFile) {
        const logoUrl = await uploadStoreLogo(store.id, logoFile);
        await updateLogo(store.id, logoUrl);
        URL.revokeObjectURL(previewUrl as string);
      }

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating store:", error);
    } finally {
      setIsLoading(false);
    }
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
              {/* Habilitar/Deshabilitar Precios */}
              <Button
                variant="outline"
                className="justify-start gap-2 h-12"
                onClick={() => setIsTogglePricesModalOpen(true)}
              >
                <DollarSign className="h-4 w-4" />
                {store.withPrices
                  ? "Deshabilitar precios"
                  : "Habilitar precios"}
              </Button>
              {/* Editar */}
              <Button
                variant="outline"
                className="justify-start gap-2 h-12"
                onClick={() => setView("edit")}
              >
                <Pencil className="h-4 w-4" />
                Editar información
              </Button>

              {/* Inactivar/Activar */}
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

              {/* Eliminar */}
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

              <div className="space-y-2">
                <Label>Logo (opcional)</Label>
                <div
                  {...getRootProps()}
                  className="border border-dashed rounded-md p-4 cursor-pointer text-center text-sm text-neutral-600 hover:bg-neutral-50"
                >
                  <input {...getInputProps()} />
                  {logoFile ? (
                    previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="mx-auto h-32 w-32 object-cover rounded-md"
                      />
                    )
                  ) : store.logo ? (
                    <img
                      src={store.logo}
                      alt="Logo actual"
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

      <DeleteStoreModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        storeId={store.id}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          onOpenChange(false);
          router.refresh();
        }}
      />

      <ToggleStoreActiveModal
        open={isToggleActiveModalOpen}
        onOpenChange={setIsToggleActiveModalOpen}
        storeId={store.id}
        isActive={store.isActive}
        onSuccess={() => {
          setIsToggleActiveModalOpen(false);
          onOpenChange(false);
          router.refresh();
        }}
      />

      <ToggleStorePricesModal
        open={isTogglePricesModalOpen}
        onOpenChange={setIsTogglePricesModalOpen}
        storeId={store.id}
        withPrices={store.withPrices}
        onSuccess={() => {
          setIsTogglePricesModalOpen(false);
          onOpenChange(false);
          router.refresh();
        }}
      />
    </>
  );
}
