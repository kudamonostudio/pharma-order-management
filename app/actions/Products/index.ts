"use server";

import { serialize, toNullable, toNumberOrNull } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const priceRaw = formData.get("price");
  const storeSlug = formData.get("storeSlug");

  if (!priceRaw) {
    throw new Error("Price is required");
  }

  const data = {
    name: toNullable(formData.get("name")) ?? "",
    description: toNullable(formData.get("description")),
    price: String(priceRaw),
    brand: toNullable(formData.get("brand")),
    unit: toNullable(formData.get("unit")),
    sku: toNullable(formData.get("sku")),
    stock: toNumberOrNull(formData.get("stock")),
    // categoryId: toNumberOrNull(formData.get("categoryId")), // opc
    // locationId: toNumberOrNull(formData.get("locationId")),// opc
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
        isActive: true,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.product.count({
      where: {
        storeId,
        isActive: true,
        deletedAt: null,
      },
    }),
  ]);

  return {
    products: serialize(products),
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}
