import { MessageType } from "@prisma/client";
import { MessageBasic } from "@/shared/types/store";
import { MessageCard } from "./MessageCard";

interface MessageListProps {
  messages: MessageBasic[];
  type: MessageType;
  emptyMessage?: string;
}

export const MessageList = ({
  messages,
  type,
  emptyMessage = "Aún no hay mensajes aquí",
}: MessageListProps) => {
  const filteredMessages = messages.filter((message) => message.type === type);

  if (filteredMessages.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {filteredMessages.map((message, index) => (
        <MessageCard key={message.id} message={message} index={index} />
      ))}
    </div>
  );
};
