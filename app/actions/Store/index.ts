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

  await prisma.store.create({
    data: {
      name,
      address,
      phone,
      slug,
    },
  });

  revalidatePath("/supremo");
}

export async function updateStore(id: number, formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string | null;

  await prisma.store.update({
    where: { id },
    data: {
      name,
      address,
      phone,
    },
  });

  revalidatePath("/supremo");
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