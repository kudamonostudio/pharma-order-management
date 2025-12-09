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
import { Checkbox } from "@/components/ui/auth/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { assignCollaboratorsToLocation } from "@/app/actions/Store/Locations";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AssignmentWithCollaborator } from "@/shared/types/store";
import { Branch } from "@/shared/types/collaborator";

// interface Collaborator {
//   id: string;
//   name: string | null;
//   imageUrl: string | null;
//   isActive: boolean;
//   branch: { id: number; name: string };
// }

interface Collaborator {
  collaboratorId: number;
  firstName: string;
  lastName: string;
  image: string | null;
  branches: Branch[];
}

interface SimpleCollaborator {
  id: string;
  name: string | null;
  imageUrl: string | null;
}

interface AssignCollaboratorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationId: number;
  locationName: string;
  storeSlug: string;
  assignedCollaborators: AssignmentWithCollaborator[];
  allCollaborators: Collaborator[];
}

export function AssignCollaboratorsModal({
  open,
  onOpenChange,
  locationId,
  locationName,
  storeSlug,
  assignedCollaborators,
  allCollaborators,
}: AssignCollaboratorsModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Inicializar con los colaboradores ya asignados
  useEffect(() => {
    if (open) {
      const assignedIds = new Set(assignedCollaborators.map((c) => c.collaboratorId));
      setSelectedIds(assignedIds);
    }
  }, [open, assignedCollaborators]);

  const handleToggle = (collaboratorId: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(collaboratorId)) {
        newSet.delete(collaboratorId);
      } else {
        newSet.add(collaboratorId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await assignCollaboratorsToLocation(
        locationId,
        Array.from(selectedIds),
        storeSlug
      );

      // console.log('@@@');
      // console.log({
      //   locationId,
      //   selectedIds: Array.from(selectedIds),
      //   storeSlug
      // });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error assigning collaborators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const CollaboratorInfo = ({ collaborator }: { collaborator: Collaborator }) => {
    const branch = collaborator.branches.find(b => b.id === locationId);
    const info = branch ? branch.name : null;
    if (!info) return null;
    return (
      <span className="font-normal text-muted-foreground"> — {info}</span>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Colaboradores</DialogTitle>
          <DialogDescription>
            Selecciona los colaboradores que trabajarán en <span className="font-semibold">{locationName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 max-h-[400px] overflow-y-auto">
          {allCollaborators.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay colaboradores en esta tienda.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {allCollaborators.map((collaborator) => {
                const isSelected = selectedIds.has(collaborator.collaboratorId);
                const currentLocation = collaborator.branches.find(b => b.id === locationId);
                return (
                  <label
                    key={collaborator.collaboratorId}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleToggle(collaborator.collaboratorId)}
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={collaborator.image || undefined}
                        alt={collaborator.firstName || "Colaborador"}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {getInitials(collaborator.firstName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium">
                        {collaborator.firstName || "Sin nombre"}
                        <CollaboratorInfo
                          collaborator={collaborator}
                        />
                      </span>
                      {!currentLocation?.isActive && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm">
                          Inactivo
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
