// Vamos a usar server actions para el CUD (Create, Update, Delete), es decir, para mutaciones. Para el GET usaremos API routes.
"use server";

import crypto from "crypto";
import { generateSlug } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  const data: any = {};
  
  if (formData.has("name")) data.name = formData.get("name") as string;
  if (formData.has("address")) data.address = formData.get("address") as string;
  if (formData.has("phone")) data.phone = formData.get("phone") as string | null;
  if (formData.has("isActive")) data.isActive = formData.get("isActive") === "true";

  await prisma.store.update({
    where: { id },
    data,
  });

  revalidatePath("/supremo");
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
      },
    },
  });

  return store;
}