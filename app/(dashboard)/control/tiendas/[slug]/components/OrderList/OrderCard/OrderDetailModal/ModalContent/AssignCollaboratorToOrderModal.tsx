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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { assignCollaboratorToOrder } from "@/app/actions/Orders";
import { ConfirmCollaboratorCodeModal } from "./ConfirmCollaboratorCodeModal";

interface AvailableCollaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

interface AssignCollaboratorToOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  orderCode: string | null;
  storeSlug: string;
  locationId: number | null;
  currentCollaboratorId?: number | null;
  availableCollaborators: AvailableCollaborator[];
  onCollaboratorAssigned?: (orderId: number, collaboratorId: number) => void;
}

export function AssignCollaboratorToOrderModal({
  open,
  onOpenChange,
  orderId,
  orderCode,
  storeSlug,
  locationId,
  currentCollaboratorId,
  availableCollaborators,
  onCollaboratorAssigned,
}: AssignCollaboratorToOrderModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Inicializar con el colaborador actual si existe
  useEffect(() => {
    if (open) {
      setSelectedId(currentCollaboratorId || null);
    }
  }, [open, currentCollaboratorId]);

  const handleSelect = (collaboratorId: number) => {
    setSelectedId(collaboratorId === selectedId ? null : collaboratorId);
  };

  const handleConfirmClick = () => {
    if (!selectedId) return;
    setShowCodeModal(true);
  };

  const handleCodeConfirmed = async (confirmedByCollaboratorId: number) => {
    if (!selectedId) return;

    setIsLoading(true);
    try {
      await assignCollaboratorToOrder(orderId, selectedId, storeSlug, confirmedByCollaboratorId);
      
      // Notify parent after successful update
      onCollaboratorAssigned?.(orderId, selectedId);
      
      // Close the code modal - main order modal stays open
      setShowCodeModal(false);
      
      // Refresh to update history without closing modal
      router.refresh();
    } catch (error) {
      console.error("Error assigning collaborator to order:", error);
      // Re-throw to show error in ConfirmCollaboratorCodeModal
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const filteredCollaborators = locationId
    ? availableCollaborators
    : availableCollaborators;

  const selectedCollaborator = selectedId
    ? availableCollaborators.find((c) => c.id === selectedId)
    : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Asignar Colaborador</DialogTitle>
            <DialogDescription>
              Selecciona el colaborador que gestionará la orden{" "}
              <span className="font-semibold">#{orderCode ?? orderId}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-[400px] overflow-y-auto">
            {filteredCollaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No hay colaboradores disponibles para esta sucursal.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredCollaborators.map((collaborator) => {
                  const isSelected = selectedId === collaborator.id;
                  return (
                    <button
                      key={collaborator.id}
                      type="button"
                      onClick={() => handleSelect(collaborator.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isSelected
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={collaborator.image || undefined}
                          alt={`${collaborator.firstName} ${collaborator.lastName}`}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {getInitials(
                            collaborator.firstName,
                            collaborator.lastName
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-sm font-medium">
                          {collaborator.firstName} {collaborator.lastName}
                        </span>
                        {!collaborator.isActive && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm mt-1">
                            Inactivo
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="ml-auto">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
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
            <Button
              onClick={handleConfirmClick}
              disabled={isLoading || !selectedId}
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedCollaborator && (
        <ConfirmCollaboratorCodeModal
          open={showCodeModal}
          onOpenChange={setShowCodeModal}
          availableCollaborators={availableCollaborators}
          collaboratorName={`${selectedCollaborator.firstName} ${selectedCollaborator.lastName}`}
          onConfirm={handleCodeConfirmed}
        />
      )}
    </>
  );
}
