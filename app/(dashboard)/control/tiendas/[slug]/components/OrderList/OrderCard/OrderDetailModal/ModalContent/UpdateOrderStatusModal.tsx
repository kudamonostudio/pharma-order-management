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
import { useRouter } from "next/navigation";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_LABELS_DELIVERY,
  ORDER_STATUS_COLORS,
  type OrderStatus as OrderStatusType,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";
import { ConfirmCollaboratorCodeModal } from "./ConfirmCollaboratorCodeModal";
import { updateOrderStatus } from "@/app/actions/Orders";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
}

interface UpdateOrderStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  orderCode: string | null;
  currentStatus: OrderStatusType;
  currentCollaboratorId?: number | null;
  availableCollaborators: Collaborator[];
  onOrderUpdated?: (orderId: number, newStatus: OrderStatusType) => void;
  isDelivery?: boolean;
}

const STATUS_OPTIONS: OrderStatusType[] = [
  "PENDIENTE",
  "EN_PROCESO",
  "LISTO_PARA_RETIRO",
  "ENTREGADA",
  "CANCELADA",
];

export function UpdateOrderStatusModal({
  open,
  onOpenChange,
  orderId,
  orderCode,
  currentStatus,
  currentCollaboratorId,
  availableCollaborators,
  onOrderUpdated,
  isDelivery = false,
}: UpdateOrderStatusModalProps) {
  const statusLabels = isDelivery ? ORDER_STATUS_LABELS_DELIVERY : ORDER_STATUS_LABELS;
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType>(currentStatus);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
      setShowCodeModal(false);
      setIsLoading(false);
    }
  }, [open, currentStatus]);

  const handleSelectStatus = (status: OrderStatusType) => {
    setSelectedStatus(status);
  };

  const handleConfirmClick = () => {
    if (!selectedStatus || selectedStatus === currentStatus) return;
    setShowCodeModal(true);
  };

  const handleCodeConfirmed = async (confirmedByCollaboratorId: number) => {
    if (!selectedStatus || selectedStatus === currentStatus) return;

    setIsLoading(true);
    try {
      await updateOrderStatus({
        id: orderId,
        status: selectedStatus,
        collaboratorId: confirmedByCollaboratorId,
        prevCollaboratorId: currentCollaboratorId ?? undefined,
      });
      
      // Notify parent after successful update
      onOrderUpdated?.(orderId, selectedStatus);
      
      // Close both modals
      setShowCodeModal(false);
      onOpenChange(false);
      
      // Refresh to update history
      router.refresh();
    } catch (error) {
      console.error("Error updating order status:", error);
      // Re-throw to show error in ConfirmCollaboratorCodeModal
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShowCodeModal(false);
      setIsLoading(false);
      setSelectedStatus(currentStatus);
    }
    onOpenChange(newOpen);
  };

  const hasChangedStatus = selectedStatus !== currentStatus;

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Actualizar estado</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo estado para la orden{" "}
              <span className="font-semibold">#{orderCode ?? orderId}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-100 overflow-y-auto space-y-2">
            {STATUS_OPTIONS.map((status) => {
              const isSelected = selectedStatus === status;
              const colorClasses = ORDER_STATUS_COLORS[status];

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSelectStatus(status)}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left w-full ${
                    isSelected
                      ? colorClasses
                      : "bg-muted/50 hover:bg-muted border-transparent"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {statusLabels[status]}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-semibold uppercase text-foreground">
                      Seleccionado
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleConfirmClick}
              disabled={isLoading || !hasChangedStatus}
            >
              Cambiar estado
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmCollaboratorCodeModal
        open={showCodeModal}
        onOpenChange={setShowCodeModal}
        availableCollaborators={availableCollaborators}
        collaboratorName="el cambio de estado"
        onConfirm={handleCodeConfirmed}
      />
    </>
  );
}
