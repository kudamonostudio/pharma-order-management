"use server";

import { createMessage } from "@/app/actions/Messages";
import { MessageType } from "@prisma/client";
import { OrderMessageResponse } from "@/shared/types/message";

export async function createOrderMessage(
  orderId: number,
  collaboratorId: number,
  message: string,
  type: MessageType
): Promise<OrderMessageResponse> {
  return await createMessage({
    orderId,
    collaboratorId,
    message,
    type,
  });
}
