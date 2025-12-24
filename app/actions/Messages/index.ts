import { validateMessageContent } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { CreateOrderMessageData, OrderMessageResponse, UpdateOrderMessageData, UpdateOrderMessageResponse } from "@/shared/types/message";

export async function getOrderMessages(
  orderId: number
): Promise<OrderMessageResponse[] | null> {
  if (!orderId) return null;

  const messages = await prisma.message.findMany({
    where: {
      orderId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      type: true,
      orderId: true,
      collaboratorId: true,
      message: true,
      createdAt: true,
      updatedAt: true,
      collaborator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        }
      }
    }
  });

  return messages;
}

export async function createMessage(
  data: CreateOrderMessageData
): Promise<OrderMessageResponse> {
const { orderId, collaboratorId, message, type } = data;

  if (!orderId || !collaboratorId || !message) {
    throw new Error('Missing required fields');
  }

  const validatedMessage = validateMessageContent(message);

  const createdMessage = await prisma.message.create({
    data: {
      orderId,
      collaboratorId,
      message: validatedMessage,
      type,
    },
    select: {
      id: true,
      type: true,
      orderId: true,
      collaboratorId: true,
      message: true,
      createdAt: true,
      updatedAt: true,
      collaborator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
        },
      },
    },
  });
  return createdMessage;
}

export async function updateOrderMessage(
  data: UpdateOrderMessageData
): Promise<UpdateOrderMessageResponse> {
  const { messageId, message } = data;

  if (!messageId || !message.trim()) {
    throw new Error("Invalid message update data");
  }

  const validatedMessage = validateMessageContent(message);

  const updatedMessage = await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      message: validatedMessage,
    },
    select: {
      id: true,
      message: true,
      updatedAt: true,
    },
  });

  return updatedMessage;
}