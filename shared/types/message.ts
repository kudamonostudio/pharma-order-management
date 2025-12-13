import { MessageType } from "@prisma/client";

export interface SimpleCollaborator {
  id: number;
  firstName: string;
  lastName: string;
}

export interface OrderMessageResponse {
  id: number;
  type: MessageType;
  orderId: number;
  collaboratorId: number;
  message: string;
  collaborator: SimpleCollaborator;
  createdAt: Date;
  updatedAt?: Date;
};

export interface CreateOrderMessageData {
  orderId: number;
  collaboratorId: number;
  message: string;
  type: MessageType;
};

export interface UpdateOrderMessageResponse {
  id: number;
  message: string;
  updatedAt: Date;
};

export interface UpdateOrderMessageData {
  messageId: number;
  message: string;
};
