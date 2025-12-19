"use client";

import { useState } from "react";
import { PackageCheck, Phone, UserPen } from "lucide-react";
import {
  type OrderStatus as OrderStatusType,
  getOrderStatusColor,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";
import { OrderDetailModalProducts } from "../OrderDetailModalProducts";
import OrderStatusModal from "./OrderStatusModal";
import { formatDate } from "@/app/(dashboard)/utils/dates";
import { OrderCollab } from "../../OrderCollab";
import { Separator } from "@/components/ui/separator";
import { ModalControl, type ModalControlValue } from "./ModalControl";
import { OrderInStore } from "@/shared/types/store";
import { MessageList } from "./Messages/MessageList";
import { Button } from "@/components/ui/button";
import { AssignCollaboratorToOrderModal } from "./AssignCollaboratorToOrderModal";

interface AvailableCollaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

interface OrderDetailModalContentProps {
  order: OrderInStore;
  products: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
  }>;
  storeSlug: string;
  availableCollaborators: AvailableCollaborator[];
}

export function OrderDetailModalContent({
  order,
  products,
  storeSlug,
  availableCollaborators,
}: OrderDetailModalContentProps) {
  const [controlValue, setControlValue] =
    useState<ModalControlValue>("products");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const statusColor = getOrderStatusColor(order.status as OrderStatusType);
  const collaborator = order.collaborator;

  console.log("@@Order", { order });

  return (
    <div className="flex flex-col ">
      <div className={`w-full h-4 ${statusColor}`} />
      <div className="flex flex-col p-8 gap-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 items-center">
              <h1 className="text-2xl font-bold text-accent-foreground/85">
                #{order.code ?? order.id}
              </h1>
              <OrderStatusModal status={order.status} variant="small" />
            </div>
            <span className="text-sm">
              Creada el {formatDate(order.createdAt)}
            </span>
            <h3 className="text-base font-normal">
              Retira en la sucursal:{" "}
              <span className="text-accent-foreground font-medium">
                {order.location?.name ?? "Sin asignar"}
              </span>
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm">
                Cliente:{" "}
                <span className="text-accent-foreground font-medium">
                  John Doe
                </span>
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <p>+59899123345</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-6">
            {/* <OrderStatusModal status={order.status} variant="small"/> */}
            <Button
              variant={"outline"}
              onClick={() => {
                if (!order.collaborator) {
                  setIsAssignModalOpen(true);
                }
              }}
            >
              {order.collaborator ? (
                <>
                  Actualizar estado
                  <PackageCheck className="h-6 w-6" />
                </>
              ) : (
                <>
                  Asignar colaborador
                  <UserPen className="h-6 w-6" />
                </>
              )}
            </Button>
            <div className="flex items-center gap-2">
              {collaborator && (
                <OrderCollab collab={collaborator} key={collaborator.id} />
              )}
              <div>
                {collaborator?.firstName && (
                  <p className="text-sm">Gestiona:</p>
                )}
                {collaborator && (
                  <>
                    <span className="text-accent-foreground font-medium text-center">
                      {collaborator.firstName} {collaborator.lastName}
                    </span>
                    <small
                      className="underline block cursor-pointer"
                      onClick={() => setIsAssignModalOpen(true)}
                    >
                      Cambiar
                    </small>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 mb-4">
          <Separator />
          <ModalControl value={controlValue} onChange={setControlValue} />
        </div>
        {controlValue === "products" && (
          <OrderDetailModalProducts order={order.items} />
        )}
        <div
          className={controlValue === "internal-messages" ? "block" : "hidden"}
        >
          <MessageList messages={order.messages} type="INTERN" />
        </div>
        <div
          className={controlValue === "client-messages" ? "block" : "hidden"}
        >
          <MessageList messages={order.messages} type="TO_CLIENT" />
        </div>
      </div>

      <AssignCollaboratorToOrderModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        orderId={order.id}
        orderCode={order.code}
        storeSlug={storeSlug}
        locationId={order.location?.id ?? null}
        currentCollaboratorId={order.collaborator?.id}
        availableCollaborators={availableCollaborators}
      />
    </div>
  );
}
