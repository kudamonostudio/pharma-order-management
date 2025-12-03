"use client";

import { useState } from "react";
import { Order } from "@prisma/client";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../constants";
import { formatDate } from "@/app/(dashboard)/utils/dates";
import { OrderCollab } from "./OrderCollab";
import { mockCollaborators } from "@/app/mocks/collaborators";
import { OrderDetailModal } from "../../OrderDetailModal/OrderDetailModal";
import { useOrderStore } from "@/app/zustand/orderStore";

type OrderCardClientProps = {
  order: Order;
  isAdminSupremo: boolean;
};

export function OrderCardClient({ order, isAdminSupremo }: OrderCardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { order: mockProducts } = useOrderStore();

  const mockCollab = mockCollaborators.find(
    (collab) => collab.id === Number(order.profileId)
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
            <OrderCollab collab={mockCollab} key={order.profileId} />
          ) : null}
          <div>
            <h3 className="text-accent-foreground">{order.orderCode}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.date)}
            </p>
          </div>
        </div>
        {isAdminSupremo && <p>{order.branch.name}</p>}
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
          id: "order_12345",
          status: order.status,
          createdAt: new Date(),
          branch: {
            id: "3",
            name: "Sucursal 1",
          },
        }}
        products={mockProducts}
      />
    </>
  );
}
