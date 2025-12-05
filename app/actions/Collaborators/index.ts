"use server";

import { toNullable, toNumberOrNull } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCollaborator(formData: FormData) {
  const storeSlug = formData.get("storeSlug") as string;

  const data = {
    name: toNullable(formData.get("name")) ?? "",
    storeId: toNumberOrNull(formData.get("storeId")),
    locationId: toNumberOrNull(formData.get("locationId")),
  };

  if (!data.storeId || !data.name || !data.locationId) {
    throw new Error("Campos requeridos faltantes: storeId, name o locationId");
  }

  // Crear un ID para colaboradores sin cuenta de autenticación
  const newUserId = crypto.randomUUID();

  // Crear perfil de colaborador
  const collaborator = await prisma.profile.create({
    data: {
      id: newUserId,
      name: data.name,
      storeId: data.storeId,
      locationId: data.locationId,
      role: "COLABORADOR",
      isActive: true,
    },
  });

  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
  return collaborator.id;
}

export async function updateCollaboratorImage(id: string, url: string) {
  const updatedCollaborator = await prisma.profile.update({
    where: { id },
    data: { imageUrl: url },
  });

  return updatedCollaborator.id;
}

export async function updateCollaborator(
  id: string,
  data: {
    name?: string;
    locationId?: number | null;
    imageUrl?: string;
    isActive?: boolean;
    phone?: string;
  },
  storeSlug?: string
) {
  await prisma.profile.update({
    where: { id },
    data,
  });

  if (storeSlug) {
    revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
  } else {
    revalidatePath(`/control/tiendas`);
  }
}

export async function deleteCollaborator(id: string, storeSlug: string) {
  if (!id) {
    console.warn("deleteCollaborator: missing id");
    return;
  }

  await prisma.profile.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}

export async function toggleCollaboratorActive(
  id: string,
  isActive: boolean,
  storeSlug: string
) {
  await prisma.profile.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}

// Obtener colaboradores de una tienda
export async function getCollaboratorsByStore(storeId: number) {
  const collaborators = await prisma.profile.findMany({
    where: {
      storeId,
      deletedAt: null,
      role: "COLABORADOR",
    },
    include: {
      location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return collaborators.map((c) => ({
    id: c.id,
    name: c.name ?? "Sin nombre",
    imageUrl: c.imageUrl ?? "",
    isActive: c.isActive,
    branch: c.location
      ? { id: c.location.id, name: c.location.name }
      : { id: 0, name: "Sin sucursal" },
  }));
}

// Obtener un colaborador por ID
export async function getCollaboratorById(id: string) {
  const collaborator = await prisma.profile.findUnique({
    where: { id },
    include: {
      location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!collaborator) return null;

  return {
    id: collaborator.id,
    name: collaborator.name ?? "",
    imageUrl: collaborator.imageUrl ?? "",
    email: collaborator.email,
    phone: collaborator.phone,
    isActive: collaborator.isActive,
    branch: collaborator.location
      ? { id: collaborator.location.id, name: collaborator.location.name }
      : null,
  };
}
