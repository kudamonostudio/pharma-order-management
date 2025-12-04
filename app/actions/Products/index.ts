"use server";

import { toNullable, toNumberOrNull } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const priceRaw = formData.get("price");
  const storeSlug = formData.get("storeSlug");

  const data = {
    name: toNullable(formData.get("name")) ?? "",
    description: toNullable(formData.get("description")),
    price: priceRaw ? Number(priceRaw) : 0,
    brand: toNullable(formData.get("brand")),
    unit: toNullable(formData.get("unit")),
    sku: toNullable(formData.get("sku")),
    stock: toNumberOrNull(formData.get("stock")),
    storeId: Number(formData.get("storeId")),
  };

  if (!data.storeId || !data.name) {
    throw new Error("Missing required fields: storeId or name");
  }

  const product = await prisma.product.create({
    data
  });

  revalidatePath(`/control/tiendas/${storeSlug}/productos`);
  return product.id;
}

export async function updateProductImage(id: number, url: string) {
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { imageUrl: url },
  });

  return updatedProduct.id;
}

export async function updateProduct(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    brand?: string;
    unit?: string;
    sku?: string;
    stock?: number;
    categoryId?: number | null;
    isActive?: boolean;
  }
) {
  await prisma.product.update({
    where: { id },
    data,
  });

  revalidatePath(`/control/tiendas`);
}

export async function deleteProduct(id: number, storeSlug: string) {
  if (!id) {
    console.warn("deleteProduct: missing id");
    return;
  }

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/control/tiendas/${storeSlug}/productos`);
}

// Obtener productos de una tienda
export async function getProductsByStore(storeId: number, page = 1, limit = 12) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        storeId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.product.count({
      where: {
        storeId,
        deletedAt: null,
      },
    }),
  ]);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}

// Obtener store con productos (optimizado - una sola operación)
export async function getStoreWithProducts(slug: string, page = 1, limit = 12) {
  const skip = (page - 1) * limit;

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      locations: {
        where: { deletedAt: null },
        orderBy: { id: "desc" },
      },
    },
  });

  if (!store) return null;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        storeId: store.id,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.product.count({
      where: {
        storeId: store.id,
        deletedAt: null,
      },
    }),
  ]);

  return {
    store,
    products: products.map(p => ({
      ...p,
      price: Number(p.price),
    })),
    total,
    pages: Math.ceil(total / limit),
  };
}
