"use server";

import { toNullable } from "@/lib/helpers";
import {
  GetOrdersByStoreResponse,
  UpdateOrderStatusData,
  OrderHistoryItem,
  UpdatePaymentMethodTypeData,
} from "@/shared/types/order";
import { Order, OrderStatus, PaymentMethodType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createMessage } from "@/app/actions/Messages";

export async function createOrder(formData: FormData) {
  const storeSlug = formData.get("storeSlug") as string;

  // Obtener la tienda por slug
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
  });

  if (!store) {
    throw new Error("Tienda no encontrada");
  }

  const rawItems = JSON.parse(formData.get("items") as string) as Array<{
    productId: number;
    name: string;
    quantity: number;
  }>;

  // Obtener las imágenes de los productos (NO guardar precios)
  const productIds = rawItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, imageUrl: true },
  });

  const productImageMap = new Map(products.map((p) => [p.id, p.imageUrl]));

  // Añadir solo imageUrl a cada item
  const itemsWithImages = rawItems.map((item) => ({
    ...item,
    imageUrl: productImageMap.get(item.productId) || null,
  }));

  const locationIdRaw = formData.get("locationId");
  const shippingAddress = formData.get("shippingAddress") as string | null;

  const data = {
    fullname: toNullable(formData.get("fullname")) || "",
    phoneContact: toNullable(formData.get("phoneContact")) || "",
    locationId: locationIdRaw ? Number(locationIdRaw) : null,
    shippingAddress: shippingAddress || null,
    storeId: store.id,
    items: itemsWithImages,
    totalAmount: Number(formData.get("totalAmount")),
    currency: "UYU",
    status: "PENDIENTE" as OrderStatus,
    paymentMethodType: (formData.get("paymentMethod") as PaymentMethodType) || null,
  };

  const order = await prisma.order.create({
    data,
  });

  revalidatePath(`/control/${storeSlug}/orders`);
  return order.id;
}

export async function getOrdersByStore(
  storeId: number,
  page = 1,
  limit = 12,
  status?: OrderStatus
): Promise<GetOrdersByStoreResponse | null> {
  const skip = (page - 1) * limit;
  const store = await prisma.store.findUnique({
    where: { id: storeId },
  });

  if (!store) return null;

  const orderWhere: Prisma.OrderWhereInput = {
    storeId: store.id,
  };

  if (status) {
    orderWhere.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: orderWhere,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.order.count({
      where: orderWhere,
    }),
  ]);

  return {
    orders: orders.map((order: Order) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
    })),
    total,
    page: Math.ceil(total / limit),
  };
}

export async function updateOrderStatus(data: UpdateOrderStatusData) {
  const { id, status, collaboratorId, prevCollaboratorId } = data;
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
  });

  await prisma.orderHistory.create({
    data: {
      orderId: updatedOrder.id,
      collaboratorId,
      fromStatus: order.status,
      toStatus: status,
      prevCollaboratorId,
      note: "Actualizacion de Estado",
    },
  });

  // Enviar mensajes automáticos al cliente para cambios de estado específicos
  let messageText = "";
  const isDelivery = !!order.shippingAddress;
  
  if (order.status === "PENDIENTE" && status === "EN_PROCESO") {
    messageText = "Se comenzó a procesar la orden..";
  } else if (status === "LISTO_PARA_RETIRO") {
    messageText = isDelivery 
      ? "La orden está siendo enviada a destino!" 
      : "La orden está lista para retirar!";
  }

  if (messageText && collaboratorId) {
    try {
      await createMessage({
        orderId: updatedOrder.id,
        collaboratorId,
        message: messageText,
        type: "TO_CLIENT"
      });
    } catch (error) {
      console.error("Error al enviar mensaje automático:", error);
      // No fallar toda la operación si el envío de mensaje falla
    }
  }

  return updatedOrder.id;
}

export async function updatePaymentMethod(data: UpdatePaymentMethodTypeData) {
  const { id, paymentMethodType } = data;
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  await prisma.order.update({
    where: { id },
    data: { paymentMethodType },
  });
}

export async function getOrderHistory(
  orderId: number
): Promise<OrderHistoryItem[]> {
  if (!orderId) return [];

  const history = await prisma.orderHistory.findMany({
    where: { orderId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      orderId: true,
      fromStatus: true,
      toStatus: true,
      note: true,
      createdAt: true,
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

  return history as OrderHistoryItem[];
}

export async function assignCollaboratorToOrder(
  orderId: number,
  collaboratorId: number,
  storeSlug: string,
  whoChangedCollaboratorId: number
) {
  if (!orderId || !collaboratorId) {
    throw new Error(
      "assignCollaboratorToOrder: missing orderId or collaboratorId"
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      collaborator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("assignCollaboratorToOrder: order not found");
  }

  // Get the new collaborator info for the note
  const newCollaborator = await prisma.collaborator.findUnique({
    where: { id: collaboratorId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!newCollaborator) {
    throw new Error("assignCollaboratorToOrder: new collaborator not found");
  }

  // Update the order
  await prisma.order.update({
    where: { id: orderId },
    data: { collaboratorId },
  });

  // Create history entry for assignment change
  let note = "";
  if (order.collaborator) {
    note = `Asignación cambiada de ${order.collaborator.firstName} ${order.collaborator.lastName} a ${newCollaborator.firstName} ${newCollaborator.lastName}`;
  } else {
    note = `Orden asignada a ${newCollaborator.firstName} ${newCollaborator.lastName}`;
  }

  await prisma.orderHistory.create({
    data: {
      orderId: orderId,
      collaboratorId: whoChangedCollaboratorId,
      prevCollaboratorId: order.collaboratorId,
      fromStatus: null, // No status change
      toStatus: order.status, // Keep current status
      note: note,
    },
  });

  revalidatePath(`/control/${storeSlug}`);
  revalidatePath(`/control/tiendas/${storeSlug}`);
}
