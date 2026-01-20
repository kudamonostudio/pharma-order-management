"use client";

import { useState } from "react";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../constants";
import { formatDateTime } from "@/app/utils/dates";
import { OrderCollab } from "./OrderCollab";
import { OrderDetailModal } from "./OrderDetailModal/ModalContent";
import { useOrderStore } from "@/app/zustand/orderStore";
import { OrderInStore } from "@/shared/types/store";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

type OrderCardClientProps = {
  order: OrderInStore;
  isAdminSupremo: boolean;
  storeSlug: string;
  availableCollaborators: Collaborator[];
  withPrices: boolean;
};

export function OrderCardClient({
  order,
  isAdminSupremo,
  storeSlug,
  availableCollaborators,
  withPrices,
}: OrderCardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { order: mockProducts } = useOrderStore();

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`p-4 border-2 rounded-lg flex justify-between items-center transition-all hover:cursor-pointer hover:opacity-90 backdrop-blur-sm ${getOrderStatusColor(
          order.status
        )}`}
      >
        <div className="flex gap-3 items-center">
          {order.collaborator ? (
            <OrderCollab
              collab={order.collaborator}
              key={order.collaborator?.id}
            />
          ) : null}
          <div>
            <h3 className="text-accent-foreground">
              #ORD-{order.code ?? order.id}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>
        {isAdminSupremo && <p>{order.location?.name}</p>}
        <div className="text-right">
          <p className="text-sm font-medium">
            {getOrderStatusLabel(order.status)}
          </p>
        </div>
      </div>

      <OrderDetailModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        order={order}
        products={mockProducts}
        storeSlug={storeSlug}
        availableCollaborators={availableCollaborators}
        withPrices={withPrices}
      />
    </>
  );
}
