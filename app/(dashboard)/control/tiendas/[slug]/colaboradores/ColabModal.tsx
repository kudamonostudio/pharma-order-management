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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteColabModal } from "./DeleteColabModal";
import { ToggleColabActiveModal } from "./ToggleColabActiveModal";
import { updateCollaborator } from "@/app/actions/Collaborators";
import { uploadCollaboratorImage } from "@/lib/supabase/client/uploadImage";

export interface Branch {
  id: number;
  name: string;
}

export interface Collaborator {
  id: string;
  imageUrl: string;
  name: string;
  isActive?: boolean;
  branch: Branch;
}

interface ColabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator | null;
  storeSlug: string;
  storeId?: number;
  locations: Branch[];
}

type ModalView = "menu" | "edit";

export function ColabModal({
  open,
  onOpenChange,
  collaborator,
  storeSlug,
  storeId,
  locations,
}: ColabModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ModalView>("menu");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleActiveModalOpen, setIsToggleActiveModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
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
    if (collaborator) {
      setFormData({
        name: collaborator.name,
        branchId: collaborator.branch.id.toString(),
      });
    }
  }, [collaborator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collaborator) return;
    setIsLoading(true);

    try {
      let imageUrl = collaborator.imageUrl;

      // Subir imagen si se seleccionó una nueva
      if (imageFile && storeId) {
        imageUrl = await uploadCollaboratorImage(
          storeId,
          collaborator.id,
          imageFile
        );
        URL.revokeObjectURL(previewUrl as string);
      }

      await updateCollaborator(
        collaborator.id,
        {
          name: formData.name,
          locationId: Number(formData.branchId),
          imageUrl,
        },
        storeSlug
      );

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating collaborator:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!collaborator) return null;

  const isActive = collaborator.isActive ?? true;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {view === "menu" ? "Gestionar Colaborador" : "Editar Colaborador"}
            </DialogTitle>
            <DialogDescription>
              {view === "menu"
                ? `Opciones para ${collaborator.name}`
                : "Modifica la información del colaborador"}
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
                  isActive ? "bg-gray-100" : ""
                )}
                onClick={() => setIsToggleActiveModalOpen(true)}
              >
                <Power className="h-4 w-4" />
                {isActive ? "Inactivar colaborador" : "Activar colaborador"}
              </Button>

              {/* Opción 3: Eliminar */}
              <Button
                variant="destructive"
                className="justify-start gap-2 h-12"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar colaborador
              </Button>
            </div>
          ) : (
            /* Formulario de Edición */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-branch">Sucursal *</Label>
                <Select
                  value={formData.branchId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, branchId: value })
                  }
                >
                  <SelectTrigger id="edit-branch">
                    <SelectValue placeholder="Selecciona una sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem
                        key={location.id}
                        value={location.id.toString()}
                      >
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                        className="mx-auto h-32 w-32 object-cover rounded-full"
                      />
                    )
                  ) : collaborator.imageUrl ? (
                    <img
                      src={collaborator.imageUrl}
                      alt="Imagen actual"
                      className="mx-auto h-32 w-32 object-cover rounded-full"
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

      <DeleteColabModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        collaboratorId={collaborator.id}
        storeSlug={storeSlug}
        onSuccess={() => {
          setIsDeleteModalOpen(false);
          onOpenChange(false);
          router.refresh();
        }}
      />

      <ToggleColabActiveModal
        open={isToggleActiveModalOpen}
        onOpenChange={setIsToggleActiveModalOpen}
        collaboratorId={collaborator.id}
        isActive={isActive}
        storeSlug={storeSlug}
        onSuccess={() => {
          setIsToggleActiveModalOpen(false);
          onOpenChange(false);
          router.refresh();
        }}
      />
    </>
  );
}
