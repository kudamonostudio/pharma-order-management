"use client";

import { useState } from "react";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../constants";
import { formatDate } from "@/app/(dashboard)/utils/dates";
import { OrderCollab } from "./OrderCollab";
import { mockCollaborators } from "@/app/mocks/collaborators";
import { OrderDetailModal } from "./OrderDetailModal/OrderDetailModal";
import { useOrderStore } from "@/app/zustand/orderStore";
import { OrderInStore } from "@/shared/types/store";

type OrderCardClientProps = {
  order: OrderInStore;
  isAdminSupremo: boolean;
};

export function OrderCardClient({
  order,
  isAdminSupremo,
}: OrderCardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { order: mockProducts } = useOrderStore();

  const mockCollab = mockCollaborators.find(
    (collab) => collab.id === Number(order.collaborator?.id)
  );

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
          {mockCollab ? (
            <OrderCollab collab={mockCollab} key={order.collaborator?.id} />
          ) : null}
          <div>
            <h3 className="text-accent-foreground">{order.code}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
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
        order={{
          id: order.code,
          status: order.status,
          createdAt: order.createdAt,
          branch: {
            id: String(order.location?.id),
            name: order.location?.name ?? '',
          },
          profileId: order.collaborator?.id,
        }}
        products={mockProducts}
      />
    </>
  );
}
