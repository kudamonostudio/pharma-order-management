// Vamos a usar server actions para el CUD (Create, Update, Delete), es decir, para mutaciones. Para el GET usaremos API routes.
"use server";
import { Location } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLocation(formData: FormData) {
  const storeId = Number(formData.get("storeId"));
  const slug = (formData.get("slug") as string) || "";
  const name = (formData.get("name") as string) || "";
  const address = (formData.get("address") as string) || "";
  const phone = (formData.get("phone") as string) || null;

  if (!storeId || !name || !address) {
    throw new Error(`createLocation: missing fields ${JSON.stringify({ storeId, name, address })}`);
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

export async function updateLocation(id: number, storeSlug: string, formData: FormData) {
  const data: Partial<Location> = {};
  
  if (formData.has("name")) data.name = formData.get("name") as string;
  if (formData.has("address")) data.address = formData.get("address") as string;
  if (formData.has("phone")) data.phone = formData.get("phone") as string | null;

  await prisma.location.update({
    where: { id },
    data,
  });

  revalidatePath(`/control/tiendas/${storeSlug}`);
}

export async function deleteLocation(id: number, storeSlug: string) {
  if (!id) {
    console.warn("deleteLocation: missing id");
    return;
  }

  await prisma.location.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/control/tiendas/${storeSlug}`);
}

export async function assignCollaboratorsToLocation(
  locationId: number,
  collaboratorIds: string[],
  storeSlug: string
) {
  if (!locationId) {
    throw new Error("assignCollaboratorsToLocation: missing locationId");
  }

  // Obtener los colaboradores actualmente asignados a esta sucursal
  const currentCollaborators = await prisma.profile.findMany({
    where: {
      locationId,
      deletedAt: null,
    },
    select: { id: true },
  });

  const currentIds = new Set(currentCollaborators.map((c) => c.id));
  const newIds = new Set(collaboratorIds);

  // Colaboradores a quitar (están en current pero no en new)
  const toRemove = currentCollaborators
    .filter((c) => !newIds.has(c.id))
    .map((c) => c.id);

  // Colaboradores a agregar (están en new pero no en current)
  const toAdd = collaboratorIds.filter((id) => !currentIds.has(id));

  // Solo ejecutar si hay cambios
  if (toRemove.length > 0) {
    await prisma.profile.updateMany({
      where: {
        id: { in: toRemove },
        deletedAt: null,
      },
      data: {
        locationId: null,
      },
    });
  }

  if (toAdd.length > 0) {
    await prisma.profile.updateMany({
      where: {
        id: { in: toAdd },
        deletedAt: null,
      },
      data: {
        locationId,
      },
    });
  }

  revalidatePath(`/control/tiendas/${storeSlug}/sucursales`);
  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}