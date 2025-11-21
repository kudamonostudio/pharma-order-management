// Vamos a usar server actions para el CUD (Create, Update, Delete), es decir, para mutaciones. Para el GET usaremos API routes.
"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLocation(formData: FormData) {
  const storeId = Number(formData.get("storeId"));
  const slug = (formData.get("slug") as string) || "";
  const name = (formData.get("name") as string) || "";
  const address = (formData.get("address") as string) || "";
  const phone = (formData.get("phone") as string) || null;

  if (!storeId || !name || !address) {
    // puedes arrojar un Error si quieres manejarlo en UI o logs
    console.warn("createLocation: missing fields", { storeId, name, address });
    return;
  }

  await prisma.location.create({
    data: {
      name,
      address,
      phone,
      storeId,
    },
  });

  revalidatePath(`/control/tiendas/${slug}`);
}

export async function updateLocation(formData: FormData) {
  const id = Number(formData.get("id"));
  const slug = (formData.get("slug") as string) || "";
  const name = (formData.get("name") as string) || "";
  const address = (formData.get("address") as string) || "";
  const phone = (formData.get("phone") as string) || null;

  if (!id || !name || !address) {
    console.warn("updateLocation: missing fields", { id, name, address });
    return;
  }

  await prisma.location.update({
    where: { id },
    data: {
      name,
      address,
      phone,
    },
  });

  revalidatePath(`/control/tiendas/${slug}`);
}

export async function deleteLocation(formData: FormData) {
  const id = Number(formData.get("id"));
  const slug = (formData.get("slug") as string) || "";

  if (!id) {
    console.warn("deleteLocation: missing id");
    return;
  }

  await prisma.location.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/control/tiendas/${slug}`);
}