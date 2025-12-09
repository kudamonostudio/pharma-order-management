import { toNullable } from "@/lib/helpers";
import { GetOrdersByStoreResponse } from "@/shared/types/order";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createOrder(formData: FormData) {
  const storeSlug = formData.get("storeSlug");

  const data = {
    fullname: toNullable(formData.get("fullname")),
    phoneContact: toNullable(formData.get("phoneContact")),
    locationId: Number(formData.get("locationId")),
    collaboratorId: Number(formData.get("collaboratorId")),
    items: formData.get("items"),
    totalAmount: Number(formData.get("totalAmount")),
    currency: 'UYU',
  };

  const product = await prisma.product.create({
    data
  });

  revalidatePath(`/control/tiendas/${storeSlug}/orders`);
  return product.id;
}

export async function getOrdersByStore(
  storeId: number,
  page = 1,
  limit = 12,
  status?: OrderStatus,
) : Promise<GetOrdersByStoreResponse | null> {
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
      orderBy: { createdAt: 'desc' },
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
    pages: Math.ceil(total / limit),
  };
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
  collaboratorId: number,
) {
  const order = await prisma.order.findUnique({
    where: { id },
  });

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
    },
  });

  return updatedOrder.id;
}
