"use client";

import { useState, useEffect } from "react";
import { OrderInStore } from "@/shared/types/store";
import { OrderCard } from "./OrderCard";
import { OrderStatus } from "@prisma/client";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

interface OrderListProps {
  orders: OrderInStore[];
  storeSlug: string;
  availableCollaborators: Collaborator[];
  withPrices: boolean;
  isAdminSupremo: boolean;
  onStatusFilterChange?: (newStatuses: string[]) => void;
}

export function OrderList({
  orders,
  storeSlug,
  availableCollaborators,
  withPrices,
  isAdminSupremo,
  onStatusFilterChange,
}: OrderListProps) {
  const [localOrders, setLocalOrders] = useState<OrderInStore[]>(orders);

  // Update local state when props change
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const handleOrderUpdated = (orderId: number, newStatus: string) => {
    // Find the old status before updating
    const order = localOrders.find(o => o.id === orderId);
    const oldStatus = order?.status;
    
    // Update local order state optimistically
    setLocalOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as OrderStatus }
          : order
      )
    );

    // Auto-aggregate filter: add new status to current filter
    if (oldStatus && oldStatus !== newStatus && onStatusFilterChange) {
      // Get current unique statuses from visible orders + new status
      const currentStatuses = Array.from(new Set([
        oldStatus,
        newStatus
      ]));
      onStatusFilterChange(currentStatuses);
    }
  };

  const handleCollaboratorAssigned = (orderId: number, collaboratorId: number) => {
    setLocalOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const assignedCollaborator = availableCollaborators.find(c => c.id === collaboratorId);
          return { 
            ...order, 
            collaborator: assignedCollaborator ? {
              id: assignedCollaborator.id,
              firstName: assignedCollaborator.firstName,
              lastName: assignedCollaborator.lastName,
              image: assignedCollaborator.image
            } : null
          };
        }
        return order;
      })
    );
  };

  return (
    <div className="space-y-4">
      {localOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          storeSlug={storeSlug}
          availableCollaborators={availableCollaborators}
          withPrices={withPrices}
          isAdminSupremo={isAdminSupremo}
          onOrderUpdated={handleOrderUpdated}
          onCollaboratorAssigned={handleCollaboratorAssigned}
        />
      ))}
    </div>
  );
}
