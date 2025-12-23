"use server";

import { toNullable } from "@/lib/helpers";
import {
  GetOrdersByStoreResponse,
  UpdateOrderStatusData,
  OrderHistoryItem,
} from "@/shared/types/order";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

  // Obtener las imágenes de los productos
  const productIds = rawItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, imageUrl: true },
  });

  const productImageMap = new Map(products.map((p) => [p.id, p.imageUrl]));

  // Añadir imageUrl a cada item
  const itemsWithImages = rawItems.map((item) => ({
    ...item,
    imageUrl: productImageMap.get(item.productId) || null,
  }));

  const data = {
    fullname: toNullable(formData.get("fullname")) || "",
    phoneContact: toNullable(formData.get("phoneContact")) || "",
    locationId: Number(formData.get("locationId")),
    storeId: store.id,
    items: itemsWithImages,
    totalAmount: Number(formData.get("totalAmount")),
    currency: "UYU",
    status: "PENDIENTE" as OrderStatus,
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

  return updatedOrder.id;
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
  storeSlug: string
) {
  if (!orderId || !collaboratorId) {
    throw new Error(
      "assignCollaboratorToOrder: missing orderId or collaboratorId"
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("assignCollaboratorToOrder: order not found");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { collaboratorId },
  });

  revalidatePath(`/control/${storeSlug}`);
  revalidatePath(`/control/tiendas/${storeSlug}`);
}
