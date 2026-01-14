"use client";

import { HistoryEventCard } from "./HistoryEventCard";
import type { OrderHistoryItem } from "@/shared/types/order";
import { ReactNode } from "react";
import {
  getOrderStatusLabel,
  getOrderStatusColor,
  type OrderStatus as DashboardOrderStatus,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";

interface OrderHistoryListProps {
  history: OrderHistoryItem[];
}

// Status styling function based on order status colors
const getStatusClasses = (status: DashboardOrderStatus): string => {
  const baseClasses = "inline-block px-2 py-1 border text-xs font-semibold rounded-full";
  const statusColors = getOrderStatusColor(status);
  return `${baseClasses} ${statusColors}`;
};

const StatusBadge = ({ status }: { status: DashboardOrderStatus }) => {
  return (
    <span className={getStatusClasses(status)}>
      {getOrderStatusLabel(status)}
    </span>
  );
};

// Helper function to format assignment messages with styled names
const formatAssignmentMessage = (note: string): ReactNode => {
  // Check if it's an assignment change message
  const assignmentChangeMatch = note.match(/Asignación cambiada de (.+?) a (.+)/);
  if (assignmentChangeMatch) {
    const [, fromName, toName] = assignmentChangeMatch;
    return (
      <span>
        Asignación cambiada de <span className="font-medium">{fromName}</span> a <span className="font-medium">{toName}</span>
      </span>
    );
  }

  // Check if it's a new assignment message
  const newAssignmentMatch = note.match(/Orden asignada a (.+)/);
  if (newAssignmentMatch) {
    const [, name] = newAssignmentMatch;
    return (
      <span>
        Orden asignada a <span className="font-medium">{name}</span>
      </span>
    );
  }

  // Return original note if no match
  return note;
};

export function OrderHistoryList({ history }: OrderHistoryListProps) {
  if (!history || history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Sin actividad registrada luego de la creación.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {history.map((item) => {
        let label: string | ReactNode = item.note ?? "";

        if (item.fromStatus && item.toStatus) {
          const fromStatus = item.fromStatus as DashboardOrderStatus;
          const toStatus = item.toStatus as DashboardOrderStatus;

          label = (
            <span>
              Cambio de estado de: <StatusBadge status={fromStatus} /> a <StatusBadge status={toStatus} />
            </span>
          );
        } else if (typeof label === 'string') {
          // Format assignment messages with styled names
          label = formatAssignmentMessage(label);
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
