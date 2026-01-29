"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { MessageType } from "@prisma/client";
import { ConfirmCollaboratorCodeModal } from "../ConfirmCollaboratorCodeModal";
import { createOrderMessage } from "./actions";
import { useRouter } from "next/navigation";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
}

interface MessageInputProps {
  orderId: number;
  messageType: MessageType;
  availableCollaborators: Collaborator[];
}

const MessageInput = ({ orderId, messageType, availableCollaborators }: MessageInputProps) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    // Store the message and show code verification modal
    setPendingMessage(message.trim());
    setShowCodeModal(true);
  };

  const handleCodeConfirmed = async (confirmedByCollaboratorId: number) => {
    setIsLoading(true);
    
    try {
      await createOrderMessage(
        orderId,
        confirmedByCollaboratorId,
        pendingMessage,
        messageType
      );
      
      // Clear input and pending message after successful send
      setMessage("");
      setPendingMessage("");
      setShowCodeModal(false);
      
      // Refresh to update messages (same pattern as UpdateOrderStatusModal)
      router.refresh();
      
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-full"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="sm"
          disabled={!message.trim() || isLoading}
          className="rounded-full px-3 py-2"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <ConfirmCollaboratorCodeModal
        open={showCodeModal}
        onOpenChange={setShowCodeModal}
        availableCollaborators={availableCollaborators}
        collaboratorName="enviar el mensaje"
        onConfirm={handleCodeConfirmed}
      />
    </>
  );
};

export default MessageInput;