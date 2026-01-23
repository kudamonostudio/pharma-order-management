"use client";

import { Calendar } from "lucide-react";
import { formatDateTime } from "@/app/utils/dates";
import { OrderCollab } from "../../../OrderCollab";
import { ReactNode } from "react";

interface HistoryEventCardCollaborator {
  id: number | string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
}

interface HistoryEventCardProps {
  label: string | ReactNode;
  date: Date | string | number;
  collaborator?: HistoryEventCardCollaborator | null;
}

export function HistoryEventCard({
  label,
  date,
  collaborator,
}: HistoryEventCardProps) {
  return (
    <div className="flex items-center justify-between gap-5 text-card-foreground border-b shadow-none! p-2 border-zinc-500/30 w-fit bg-zinc-50">
      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 mr-2 mt-0.5" />
        <div className="flex flex-col">
          <p className="text-sm">{label}</p>
          <small>{formatDateTime(date)}</small>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {collaborator && (
          <>
        <p className="italic">Actualizado por:</p>
            <OrderCollab
              collab={{
                id: collaborator.id,
                firstName: collaborator.firstName,
                lastName: collaborator.lastName,
                image: collaborator.image ?? null,
                variant: "small",
              }}
            />
            <p className="text-sm font-medium">
              {collaborator.firstName} {collaborator.lastName}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
