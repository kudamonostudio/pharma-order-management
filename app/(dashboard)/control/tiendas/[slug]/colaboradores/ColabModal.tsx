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
import { Checkbox } from "@/components/ui/auth/checkbox";
/* import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; */
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Power } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteColabModal } from "./DeleteColabModal";
import { ToggleColabActiveModal } from "./ToggleColabActiveModal";
import {
  updateCollaborator,
  updateCollaboratorLocations,
} from "@/app/actions/Collaborators";
import { uploadCollaboratorImage } from "@/lib/supabase/client/uploadImage";
import { Branch } from "@/shared/types/collaborator";
import { useGenerateCode } from "@/app/(dashboard)/hooks/use-generate-code";
import Image from "next/image";
/* import { set } from "zod"; */

interface SimpleLocation {
  id: number;
  name: string;
}

export interface Collaborator {
  id: number;
  assignmentId: number;
  image: string;
  firstName: string;
  lastName: string;
  code: string | null;
  isActive: boolean;
  branches: Branch[];
}

interface ColabModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collaborator: Collaborator | null;
  storeSlug: string;
  storeId?: number;
  locations: SimpleLocation[];
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
    firstName: "",
    lastName: "",
    code: "",
  });

  const [selectedLocationIds, setSelectedLocationIds] = useState<number[]>([]);

  // Move hook call to component body
  const generateCode = useGenerateCode(5).generateCode;
  const createCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newCode = generateCode();
    setFormData({ ...formData, code: newCode });
  };

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
        firstName: collaborator.firstName,
        lastName: collaborator.lastName,
        code: collaborator.code ?? "",
      });

      // Get currently active location IDs
      const activeLocationIds = collaborator.branches
        .filter((branch) => branch.isActive)
        .map((branch) => branch.id);
      setSelectedLocationIds(activeLocationIds);
    }
  }, [collaborator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collaborator) return;
    setIsLoading(true);

    try {
      let imageUrl = collaborator.image;

      // Subir imagen si se seleccionó una nueva
      if (imageFile && storeId) {
        imageUrl = await uploadCollaboratorImage(
          storeId,
          collaborator.id,
          imageFile,
        );
        URL.revokeObjectURL(previewUrl as string);
      }

      await updateCollaborator(
        collaborator.id,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          code: formData.code !== "" ? formData.code : null,
          image: imageUrl,
        },
        storeSlug,
      );

      // Update location assignments if storeId is available
      if (storeId) {
        await updateCollaboratorLocations(
          collaborator.id,
          selectedLocationIds,
          storeId,
          storeSlug,
        );
      }

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating collaborator:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (locationId: number, checked: boolean) => {
    if (checked) {
      setSelectedLocationIds((prev) => [...prev, locationId]);
    } else {
      setSelectedLocationIds((prev) => prev.filter((id) => id !== locationId));
    }
  };

  if (!collaborator) return null;

  // const isActive = collaborator.branches.every(b => b.isActive === true);
  const isActive = collaborator.isActive;

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
                ? `Opciones para ${collaborator.firstName} ${collaborator.lastName}`
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
                  isActive ? "bg-gray-100" : "",
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
                  placeholder="Ej: Luis"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastname">Apellidos *</Label>
                <Input
                  id="edit-lastname"
                  placeholder="Ej: Pérez"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Código</Label>
                <Input
                  id="edit-code"
                  placeholder=""
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
                <Button title="test" size={"sm"} onClick={(e) => createCode(e)}>
                  Generar código
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Sucursales</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`location-${location.id}`}
                        checked={selectedLocationIds.includes(location.id)}
                        onCheckedChange={(checked) =>
                          handleLocationChange(location.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`location-${location.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {location.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-neutral-500">
                  Selecciona las sucursales donde trabaja el colaborador
                </p>
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
                      <Image
                        src={previewUrl}
                        alt="Vista previa"
                        className="mx-auto h-32 w-32 object-cover rounded-full"
                        width={128}
                        height={128}
                      />
                    )
                  ) : collaborator.image ? (
                    <Image
                      src={collaborator.image}
                      alt="Imagen actual"
                      className="mx-auto h-32 w-32 object-cover rounded-full"
                      width={128}
                      height={128}
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
