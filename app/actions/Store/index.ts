"use server";

import crypto from "crypto";
import { generateSlug } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Store } from "@prisma/client";

export async function createStore(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string | null;
  let slug = generateSlug(name);

  const exists = await prisma.store.findUnique({
    where: { slug },
  });

  if (exists) {
    const hash = crypto.randomBytes(3).toString("hex");
    slug = `${slug}-${hash}`;
  }

  const store = await prisma.store.create({
    data: {
      name,
      address,
      phone,
      slug,
    },
  });

  revalidatePath("/supremo");
  return store;
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
        },
      },
    },
  });

  return store;
}
