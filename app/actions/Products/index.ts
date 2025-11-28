"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Crear producto
export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  brand?: string;
  unit?: string;
  sku?: string;
  stock?: number;
  categoryId?: number | null;
  storeId: number;
  locationId: number;
}) {
  await prisma.product.create({
    data,
  });

  revalidatePath(`/control/tiendas/${data.storeId}/productos`);
}

// Actualizar producto
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

  // puedes revalidar la ruta exacta o toda la lista
  revalidatePath(`/control/tiendas`);
}

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  const slug = (formData.get("slug") as string) || "";

  if (!id) {
    console.warn("deleteProduct: missing id");
    return;
  }

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/control/tiendas`);
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
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
}
