"use client";

import { formatDate } from "@/app/(dashboard)/utils/dates";

interface Message {
  id: number;
  message: string;
  createdAt: Date;
}

interface ClientMessageListProps {
  messages: Message[];
  storeName: string;
}

export function ClientMessageList({ messages, storeName }: ClientMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Aún no hay mensajes para ti
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className="flex flex-col gap-1 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-emerald-700">
                {storeName}
              </span>
              <small className="text-muted-foreground text-xs">
                {formatDate(message.createdAt)}
              </small>
            </div>
            <p className="text-sm text-foreground">{message.message}</p>
          </div>
        );
      })}
    </div>
  );
}
