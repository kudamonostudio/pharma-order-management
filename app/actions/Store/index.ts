/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import crypto from "crypto";
import { generateSlug } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role, Store, OrderStatus } from "@prisma/client";
import {
  StoreWithOrdersParams,
  StoreWithOrdersResponse,
  OrderInStore,
} from "@/shared/types/store";
import { LIMIT_PER_PAGE } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createStore(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string | null;
  const email = formData.get("email") as string;
  let slug = generateSlug(name);

  if (!email) {
    throw new Error("Email admin is required");
  }

  const exists = await prisma.store.findUnique({
    where: { slug },
  });

  if (exists) {
    const hash = crypto.randomBytes(3).toString("hex");
    slug = `${slug}-${hash}`;
  }

  const existsEmail = await prisma.profile.findUnique({
    where: { email },
  });

  if(existsEmail) {
    throw new Error("Email already exists for another store as an admin");
  }

  const store = await prisma.store.create({
    data: {
      name,
      address,
      phone,
      slug,
    },
  });

  if(email) {
    await createAdminStore(email, store.id);
  }

  revalidatePath("/supremo");
  return store;
}

async function createAdminStore(email: string, storeId: number){
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  if (error || !data?.user) {
    console.error("Supabase Auth Error:", error);
    throw new Error("Error creating store admin user");
  }

  const userId = data.user.id;

  await prisma.profile.update({
    where: { id: userId },
    data: {
      role: Role.TIENDA_ADMIN,
      storeId,
    },
  });
}

export async function updateStore(id: number, formData: FormData) {
  const data: Partial<Store> = {};

  if (formData.has("name")) {
    const name = formData.get("name") as string;
    data.name = name;

    // Generar nuevo slug basado en el nuevo nombre
    let slug = generateSlug(name);

    // Verificar si el slug ya existe en otra tienda
    const exists = await prisma.store.findFirst({
      where: {
        slug,
        id: { not: id }, // Excluir la tienda actual
      },
    });

    if (exists) {
      const hash = crypto.randomBytes(3).toString("hex");
      slug = `${slug}-${hash}`;
    }

    data.slug = slug;
  }

  if (formData.has("address")) data.address = formData.get("address") as string;
  if (formData.has("phone"))
    data.phone = formData.get("phone") as string | null;
  if (formData.has("isActive"))
    data.isActive = formData.get("isActive") === "true";
  if (formData.has("withPrices"))
    data.withPrices = formData.get("withPrices") === "true";

  const updatedStore = await prisma.store.update({
    where: { id },
    data,
  });

  // Update admin email if provided
  if (formData.has("adminEmail")) {
    const adminEmail = formData.get("adminEmail") as string;
    if (adminEmail) {
      // Check if there's an existing admin for this store
      const existingAdmin = await prisma.profile.findFirst({
        where: {
          storeId: id,
          role: "TIENDA_ADMIN",
        },
      });

      if (existingAdmin) {
        // If email changed, we need to invite a new user
        if (existingAdmin.email !== adminEmail) {
          // Invite new admin via Supabase (sends confirmation email)
          await createAdminStore(adminEmail, id);
        }
        // If email is the same, no action needed
      } else {
        // No existing admin, create new one
        await createAdminStore(adminEmail, id);
      }
    }
  }

  revalidatePath("/supremo");

  return updatedStore;
}

export async function updateLogo(id: number, logoUrl: string) {
  const updatedStore = await prisma.store.update({
    where: { id },
    data: { logo: logoUrl },
  });

  return updatedStore;
}

export async function deleteStore(id: number) {
  await prisma.store.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/supremo");
}

export async function getStoreBySlug(slug: string) {
  if (!slug) return null;

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      locations: {
        where: { deletedAt: null },
        orderBy: { id: "desc" },
        include: {
          collaboratorAssignments: {
            where: {
              isActive: true,
            },
            include: {
              collaborator: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  image: true,
                  email: true,
                },
              },
            },
          },
          profile: {
            where: {
              role: "SUCURSAL_ADMIN",
            },
            select: {
              email: true,
            },
            take: 1,
          },
        },
      },
    },
  });

  return store;
}

export async function getStoreWithOrders(
  slug: string,
  params: StoreWithOrdersParams = {}
): Promise<StoreWithOrdersResponse | null> {
  if (!slug) return null;

  const { ordersPage = 1, ordersLimit = LIMIT_PER_PAGE, status } = params;

  const skip = (ordersPage - 1) * ordersLimit;

  // Handle both single status and array of statuses
  const statusWhere = status 
    ? Array.isArray(status) 
      ? { status: { in: status } }
      : { status }
    : {};

  const orderWhere = {
    ...statusWhere,
    ...(params.collaboratorId && { collaboratorId: params.collaboratorId }),
    ...(params.locationId && { locationId: params.locationId }),
  };

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      locations: {
        where: { deletedAt: null },
        select: { id: true, name: true },
      },
      orders: {
        where: orderWhere,
        skip,
        take: ordersLimit,
        select: {
          id: true,
          code: true,
          status: true,
          items: true,
          totalAmount: true,
          currency: true,
          createdAt: true,
          fullname: true,
          phoneContact: true,
          paymentMethodType: true,
          collaborator: {
            select: { id: true, firstName: true, lastName: true, image: true },
          },
          location: {
            select: { id: true, name: true },
          },
          messages: {
            select: {
              id: true,
              type: true,
              message: true,
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
            orderBy: {
              createdAt: "desc",
            },
          },
          orderHistories: {
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
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store) return null;

  const totalOrders = await prisma.order.count({
    where: {
      storeId: store.id,
      ...statusWhere,
      ...(params.collaboratorId && { collaboratorId: params.collaboratorId }),
      ...(params.locationId && { locationId: params.locationId }),
    },
  });

  const pendingOrdersCount = await prisma.order.count({
    where: {
      storeId: store.id,
      status: OrderStatus.PENDIENTE,
    },
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  const completedThisMonthCount = await prisma.order.count({
    where: {
      storeId: store.id,
      status: OrderStatus.ENTREGADA,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const orders = store.orders.map((order) => ({
    ...order,
    history: order.orderHistories,
    totalAmount: Number(order.totalAmount),
  }));

  // Enriquecer los items de las órdenes con los precios actuales de los productos
  const allProductIds = new Set<number>();
  orders.forEach(order => {
    if (Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        if (item.productId) {
          allProductIds.add(item.productId);
        }
      });
    }
  });

  // Obtener los precios actuales de todos los productos
  const currentPrices = await prisma.product.findMany({
    where: { id: { in: Array.from(allProductIds) } },
    select: { id: true, price: true },
  });

  const priceMap = new Map(currentPrices.map(p => [p.id, p.price ? Number(p.price) : null]));

  // Agregar los precios actuales a cada item
  const enrichedOrders = orders.map(order => ({
    ...order,
    items: Array.isArray(order.items)
      ? (order.items as Record<string, unknown>[]).map((item) => ({
          ...item,
          price: priceMap.get(item.productId as number) || null,
        }))
      : order.items,
  }));

  return {
    store: {
      ...store,
      orders: enrichedOrders as unknown as OrderInStore[],
    },
    ordersPagination: {
      total: totalOrders,
      page: Math.ceil(totalOrders / ordersLimit),
    },
    ordersStats: {
      pending: pendingOrdersCount,
      completedThisMonth: completedThisMonthCount,
    },
  };
}
