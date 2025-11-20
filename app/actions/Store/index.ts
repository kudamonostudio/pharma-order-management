// Vamos a usar server actions para el CUD (Create, Update, Delete), es decir, para mutaciones. Para el GET usaremos API routes.
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStore(formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string | null;
  const slug = formData.get("slug") as string;

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

export async function deleteStore(id: number) {
  await prisma.store.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/supremo");
}
