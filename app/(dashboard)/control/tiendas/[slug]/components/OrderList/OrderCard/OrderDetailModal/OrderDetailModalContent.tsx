"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import {
  type OrderStatus as OrderStatusType,
  getOrderStatusColor,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";
import { OrderDetailModalProducts } from "./OrderDetailModalProducts";
import OrderStatusModal from "./OrderStatusModal";
import { formatDate } from "@/app/(dashboard)/utils/dates";
import { OrderCollab } from "../OrderCollab";
import { mockCollaborators } from "@/app/mocks/collaborators";
import { Separator } from "@/components/ui/separator";
import { ModalControl, type ModalControlValue } from "./ModalControl";

interface OrderDetailModalContentProps {
  order: {
    id: string;
    status: OrderStatusType | string;
    createdAt: Date;
    branch: { id: string; name: string };
    profileId?: string | number | null;
  };
  products: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
  }>;
}

export function OrderDetailModalContent({
  order,
  products,
}: OrderDetailModalContentProps) {
  const [controlValue, setControlValue] =
    useState<ModalControlValue>("products");
  const statusColor = getOrderStatusColor(order.status as OrderStatusType);
  const mockCollab = mockCollaborators.find(
    (collab) => collab.id === Number(order.profileId)
  );

  return (
    <div className="flex flex-col ">
      <div className={`w-full h-4 ${statusColor}`} />
      <div className="flex flex-col p-8 gap-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-accent-foreground/85">
              #{order.id}
            </h1>
            <span className="text-sm">
              Creada el {formatDate(order.createdAt)}
            </span>
            <h3 className="text-base font-normal">
              Retira en la sucursal:{" "}
              <span className="text-accent-foreground font-medium">
                {order.branch.name}
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
            <OrderStatusModal status={order.status} />
            <div className="flex items-center gap-2">
              {mockCollab && (
                <OrderCollab collab={mockCollab} key={order.profileId} />
              )}
              <div>
                {mockCollab?.name && <p className="text-sm">Gestiona:</p>}
                <span className="text-accent-foreground font-medium text-center">
                  {mockCollab?.name || "Sin asignar"}{" "}
                  {/* TODO: CREAR BOTON DE GESTIONAR ORDEN - CAMBIAR ESTADO */}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 mb-4">
          <Separator />
          <ModalControl value={controlValue} onChange={setControlValue} />
        </div>
        {controlValue === "products" && (
          <OrderDetailModalProducts order={products} />
        )}
        {controlValue === "internal-messages" && (
          <div className="py-8 text-center text-muted-foreground">
            Mensajes internos
          </div>
        )}
        {controlValue === "client-messages" && (
          <div className="py-8 text-center text-muted-foreground">
            Mensajes al cliente
          </div>
        )}
      </div>
    </div>
  );
}
