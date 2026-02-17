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
import { KeyRound, Pencil, Trash2, Users } from "lucide-react";
import { Location } from "@prisma/client";
import { updateLocation } from "@/app/actions/Store/Locations";
import { DeleteBranchModal } from "./DeleteBranchModal";
import { AssignCollaboratorsModal } from "./AssignCollaboratorsModal";
import { AssignmentWithCollaborator } from "@/shared/types/store";
import { Branch } from "@/shared/types/collaborator";
/* import { useUserStore } from "@/app/zustand/userStore"; */

interface Collaborator {
  collaboratorId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
  branches: Branch[];
}

/* interface SimpleCollaborator {
  id: string;
  name: string | null;
  imageUrl: string | null;
} */

interface LocationWithCollaborators extends Location {
  collaboratorAssignments: AssignmentWithCollaborator[];
  profile?: { email: string | null }[];
}

interface BranchConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: LocationWithCollaborators | null;
  storeSlug: string;
  allCollaborators: Collaborator[];
}

type ModalView = "menu" | "edit" | "password";

export function BranchConfigModal({
  open,
  onOpenChange,
  branch,
  storeSlug,
  allCollaborators,
}: BranchConfigModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<ModalView>("menu");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignCollaboratorsModalOpen, setIsAssignCollaboratorsModalOpen] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    adminEmail: "",
  });
  const [newPassword, setNewPassword] = useState("");

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
        adminEmail: branch.profile?.[0]?.email || "",
      });
      setNewPassword("");
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
      formDataToSend.append("adminEmail", formData.adminEmail);

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
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {view === "menu"
                ? "Gestionar Sucursal"
                : view === "edit"
                  ? "Editar Sucursal"
                  : "Actualizar Contraseña"}
            </DialogTitle>
            <DialogDescription>
              {view === "menu"
                ? `Opciones para ${branch.name}`
                : view === "edit"
                  ? "Modifica la información de la sucursal"
                  : "Establece una nueva contraseña para la sucursal"}
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

              {/* Opción 2: Asignar Colaboradores */}
              <Button
                variant="outline"
                className="justify-start gap-2 h-12"
                onClick={() => setIsAssignCollaboratorsModalOpen(true)}
              >
                <Users className="h-4 w-4" />
                Asignar Colaboradores
              </Button>

              {/* Opción 3: Actualizar Contraseña */}
              <Button
                variant="outline"
                className="justify-start gap-2 h-12"
                onClick={() => {
                  setNewPassword("");
                  setView("password");
                }}
              >
                <KeyRound className="h-4 w-4" />
                Actualizar Contraseña
              </Button>

              {/* Opción 4: Eliminar */}
              <Button
                variant="destructive"
                className="justify-start gap-2 h-12"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar sucursal
              </Button>
            </div>
          ) : view === "password" ? (
            /* Formulario de Contraseña */
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!branch) return;
                setIsLoading(true);
                try {
                  const fd = new FormData();
                  fd.append("adminEmail", formData.adminEmail);
                  fd.append("adminPassword", newPassword);
                  await updateLocation(branch.id, storeSlug, fd);
                  setNewPassword("");
                  setView("menu");
                } catch (error) {
                  console.error("Error updating password:", error);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="update-password">Nueva contraseña</Label>
                <Input
                  id="update-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
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
                  {isLoading ? "Guardando..." : "Actualizar contraseña"}
                </Button>
              </div>
            </form>
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

              {/* Email del Administrador - Solo Admin Supremo y Admin Tienda */}
              <div className="space-y-2">
                <Label htmlFor="edit-admin-email">Email de la sucursal</Label>
                <Input
                  id="edit-admin-email"
                  type="email"
                  placeholder="Ej: colaborador@tienda.com"
                  value={formData.adminEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, adminEmail: e.target.value })
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
      <AssignCollaboratorsModal
        open={isAssignCollaboratorsModalOpen}
        onOpenChange={setIsAssignCollaboratorsModalOpen}
        locationId={branch.id}
        locationName={branch.name}
        storeSlug={storeSlug}
        assignedCollaborators={branch.collaboratorAssignments}
        allCollaborators={allCollaborators}
      />
    </>
  );
}
