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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCollaboratorStore } from "@/app/zustand/collaboratorStore";
import { useDropzone } from "react-dropzone";
import {
  createCollaborator,
  updateCollaboratorImage,
} from "@/app/actions/Collaborators";
import { uploadImage } from "@/lib/supabase/client/uploadImage";
import { useGenerateCode } from "@/app/(dashboard)/hooks/use-generate-code";

interface SimpleLocation {
  id: number;
  name: string;
}

interface CreateCollaboratorModalProps {
  storeId: number;
  storeSlug: string;
  locations: SimpleLocation[];
}

export function CreateCollaboratorModal({
  storeId,
  storeSlug,
  locations,
}: CreateCollaboratorModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [collaboratorImage, setCollaboratorImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isOpen = useCollaboratorStore(
    (state) => state.isCreateCollaboratorModalOpen
  );
  const close = useCollaboratorStore(
    (state) => state.closeCreateCollaboratorModal
  );

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("La imagen no puede pesar más de 1MB");
      return;
    }

    setCollaboratorImage(file);
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

  // Move hook call to component body
  const generateCode = useGenerateCode(5).generateCode;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const newCode = generateCode();
    formData.append("code", newCode);
    console.log(Array.from(formData.entries()));
    try {
      const newCollaboratorId = await createCollaborator(formData);
      if (!newCollaboratorId) throw new Error("No se creó el colaborador");

      if (collaboratorImage) {
        const filePath = `stores/${storeId}/collaborators/${newCollaboratorId}/${crypto.randomUUID()}-${
          collaboratorImage.name
        }`;
        const imageUrl = await uploadImage(filePath, collaboratorImage);
        await updateCollaboratorImage(newCollaboratorId, imageUrl);
        URL.revokeObjectURL(previewUrl as string);
      }

      close();
      router.refresh();
    } catch (error) {
      console.error("Error creating collaborator:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setCollaboratorImage(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Colaborador</DialogTitle>
          <DialogDescription>
            Completa la información del nuevo colaborador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="storeId" value={storeId} />
          <input type="hidden" name="storeSlug" value={storeSlug} />

          <div className="space-y-2">
            <Label htmlFor="firstName">Nombres *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Ej: Juan"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Ej: Pérez"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationId">Sucursal *</Label>
            <Select name="locationId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una sucursal" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={String(location.id)}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Imagen (opcional)</Label>

            <div
              {...getRootProps()}
              className="border border-dashed rounded-md p-4 cursor-pointer text-center text-sm text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            >
              <input {...getInputProps()} />
              {collaboratorImage ? (
                previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="mx-auto h-32 w-32 object-cover rounded-full"
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
              {isLoading ? "Creando..." : "Agregar Colaborador"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
