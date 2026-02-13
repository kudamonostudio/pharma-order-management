"use server";

import * as XLSX from "xlsx";
import { MIN_DIGITS_FOR_SEARCH } from "@/lib/constants";
import { toNullable, toNumberOrNull } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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

// Obtener productos paginados para la tienda pública
export async function getStoreProducts(
  storeId: number,
  page = 1,
  pageSize = 20,
  search?: string
) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {
    storeId,
    isActive: true,
    deletedAt: null,
  };

  if (search && search.trim().length >= MIN_DIGITS_FOR_SEARCH) {
    where.name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        imageUrl: true,
        description: true,
        price: true,
      },
      orderBy: { name: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => ({
      id: p.id.toString(),
      name: p.name,
      image: p.imageUrl || "",
      description: p.description || "",
      price: p.price ? Number(p.price) : undefined,
    })),
    hasMore: skip + products.length < total,
  };
}

// Obtener store con productos (optimizado - una sola operación)
export async function getStoreWithProducts(
  slug: string,
  page = 1,
  limit = 12,
  search?: string
) {

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

  const productWhere: Prisma.ProductWhereInput = {
    storeId: store.id,
    deletedAt: null,
  };


  if (search && search.trim().length >= MIN_DIGITS_FOR_SEARCH) {
    productWhere.name = {
      contains: search.trim(),
      mode: 'insensitive',
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: productWhere,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),

    prisma.product.count({
      where: productWhere,
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

export async function importProductsFromExcel(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const slug = formData.get("slug") as string;

    if (!file) {
      return { success: false, message: "Archivo no encontrado" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      header: 1, // array format (so header optional)
      blankrows: false,
    });

    if (rows.length === 0) {
      return { success: false, message: "El archivo está vacío" };
    }

    // Detectar si tiene header
    const firstRow = rows[0];
    const hasHeader =
      typeof firstRow[0] === "string" &&
      firstRow[0].toLowerCase().includes("nombre");

    const dataRows = hasHeader ? rows.slice(1) : rows;

    const store = await prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      return { success: false, message: "Tienda no encontrada" };
    }

    const productsToCreate = [];

    for (const row of dataRows) {
      const name = row[0]?.toString().trim();

      if (!name) {
        return {
          success: false,
          message:
            "Hay productos sin nombre. Corrige el archivo y vuelve a intentarlo.",
        };
      }

      productsToCreate.push({
        name,
        description: row[1] || null,
        price: row[2] ? Number(row[2]) : null,
        storeId: store.id,
      });
    }

    if (productsToCreate.length === 0) {
      return {
        success: false,
        message: "El archivo no contiene productos para importar.",
      };
    }

    await prisma.product.createMany({
      data: productsToCreate,
    });

    return {
      success: true,
      count: productsToCreate.length,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error procesando el archivo",
    };
  }
}
