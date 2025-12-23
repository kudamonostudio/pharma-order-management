"use client";

import { HistoryEventCard } from "./HistoryEventCard";
import type { OrderHistoryItem } from "@/shared/types/order";
import {
  getOrderStatusLabel,
  type OrderStatus as DashboardOrderStatus,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";

interface OrderHistoryListProps {
  history: OrderHistoryItem[];
}

export function OrderHistoryList({ history }: OrderHistoryListProps) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Sin actividad registrada luego de la creación.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {history.map((item) => {
        let label = item.note ?? "";

        if (item.fromStatus && item.toStatus) {
          const fromLabel = getOrderStatusLabel(
            item.fromStatus as DashboardOrderStatus
          );
          const toLabel = getOrderStatusLabel(
            item.toStatus as DashboardOrderStatus
          );

          label = `Cambio de estado de: ${fromLabel} a ${toLabel}`;
        }

        return (
          <HistoryEventCard
            key={item.id}
            label={label}
            date={item.createdAt}
            collaborator={item.collaborator}
          />
        );
      })}
    </div>
  );
}
