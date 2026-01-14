/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { toNumberOrNull } from "@/lib/helpers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCollaborator(formData: FormData) {
  const storeSlug = formData.get("storeSlug") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const storeId = toNumberOrNull(formData.get("storeId"));
  const locationId = toNumberOrNull(formData.get("locationId"));
  const code = formData.get("code") as string | null;

  if (!storeId || !firstName  || !lastName || !locationId) {
    throw new Error("Campos requeridos faltantes: storeId, firstName, lastName o locationId");
  }

  const collaborator = await prisma.collaborator.create({
    data: {
      firstName,
      lastName,
      code,
    },
  });

  await prisma.collaboratorAssignment.create({
    data: {
      collaboratorId: collaborator.id,
      storeId,
      locationId,
    },
  });

  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
  return collaborator.id;
}

export async function updateCollaboratorImage(id: number, url: string) {
  await prisma.collaborator.update({
    where: { id },
    data: { image: url },
  });
}

export async function updateCollaborator(
  collaboratorId: number,
  data: {
    firstName?: string;
    lastName?: string;
    image?: string;
    code?: string | null;
  },
  storeSlug?: string
) {
  await prisma.collaborator.update({
    where: { id: collaboratorId },
    data,
  });

  if (storeSlug) {
    revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
  } else {
    revalidatePath(`/control/tiendas`);
  }
}

export async function deleteCollaborator(id: number, storeSlug: string) {
  if (!id) {
    console.warn("deleteCollaborator: missing id");
    return;
  }

  await prisma.collaborator.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}

export async function toggleCollaboratorActive(
  collaboratorId: number,
  isActive: boolean,
  storeSlug: string
) {
  await prisma.collaborator.update({
    where: {
      id: collaboratorId
    },
    data: { isActive },
  });

  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}

// Obtener colaboradores de una tienda
export async function getCollaboratorsByStore(storeId: number, locationId?: number) {
  const collaboratorAssignments = await prisma.collaboratorAssignment.findMany({
    where: {
      storeId,
      ...(locationId && { locationId }),
      collaborator: {
        deletedAt: null,
      },
    },
    include: {
      collaborator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          code: true,
          image: true,
          isActive: true,
        },
      },
      location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Agrupar por collaboratorId
  const map = new Map<number, any>();

  for (const c of collaboratorAssignments) {
    const key = c.collaborator.id;

    if (!map.has(key)) {
      map.set(key, {
        collaboratorId: c.collaborator.id,
        firstName: c.collaborator.firstName ?? "Sin nombre",
        lastName: c.collaborator.lastName ?? "Sin apellidos",
        code: c.collaborator.code,
        image: c.collaborator.image,
        isActive: c.collaborator.isActive,
        branches: [],
      });
    }

    const entry = map.get(key)!;

    entry.branches.push({
      id: c.location?.id ?? 0,
      name: c.location?.name ?? "Sin sucursal",
      isActive: c.isActive,
    });
  }

  return Array.from(map.values());
}

// Obtener un colaborador por ID
export async function getCollaboratorById(id: string) {
  const collaborator = await prisma.profile.findUnique({
    where: { id },
    // include: {
    //   location: {
    //     select: {
    //       id: true,
    //       name: true,
    //     },
    //   },
    // },
  });

  if (!collaborator) return null;

  return {
    id: collaborator.id,
    name: collaborator.firstName ?? "",
    imageUrl: collaborator.imageUrl ?? "",
    email: collaborator.email,
    phone: collaborator.phone,
    isActive: collaborator.isActive,
    // branch: collaborator.location
    //   ? { id: collaborator.location.id, name: collaborator.location.name }
    //   : null,
  };
}

export async function updateCollaboratorLocations(
  collaboratorId: number,
  activeLocationIds: number[],
  storeId: number,
  storeSlug: string
) {
  console.log("updateCollaboratorLocations called with:", {
    collaboratorId,
    activeLocationIds,
    storeId,
    storeSlug
  });

  if (!collaboratorId || !storeId) {
    throw new Error("updateCollaboratorLocations: missing required parameters");
  }

  // Get existing assignments for this collaborator in this store
  const existingAssignments = await prisma.collaboratorAssignment.findMany({
    where: {
      collaboratorId,
      storeId,
    },
    select: { id: true, locationId: true, isActive: true },
  });

  console.log("existingAssignments:", existingAssignments);

  const activeSet = new Set(activeLocationIds);
  console.log("activeSet:", activeSet);

  const updatesToActivate: number[] = [];
  const updatesToDeactivate: number[] = [];
  const idsToInsert: number[] = [];

  // Analizar todos los registros existentes
  for (const assignment of existingAssignments) {
    const { locationId, isActive } = assignment;

    if (activeSet.has(locationId)) {
      // Debe estar activo
      if (!isActive) {
        // Existe pero estaba inactivo → activar
        updatesToActivate.push(locationId);
      }

      // Como ya está considerado, lo sacamos del Set para saber qué IDs son nuevos
      activeSet.delete(locationId);
    } else {
      // No está en los que vienen del cliente → debe desactivarse si está activo
      if (isActive) {
        updatesToDeactivate.push(locationId);
      }
    }
  }

  // Lo que queda en activeSet → son IDs que NO existen en assignments → insertar
  idsToInsert.push(...Array.from(activeSet));

  // Insertar nuevos registros
  if (idsToInsert.length > 0) {
    await prisma.collaboratorAssignment.createMany({
      data: idsToInsert.map((locationId) => ({
        locationId,
        collaboratorId,
        storeId,
        isActive: true,
      })),
    });
  }

  // Activar registros existentes que estaban inactivos
  if (updatesToActivate.length > 0) {
    await prisma.collaboratorAssignment.updateMany({
      where: {
        collaboratorId,
        storeId,
        locationId: { in: updatesToActivate },
      },
      data: { isActive: true },
    });
  }

  // Desactivar registros que ya no están seleccionados
  if (updatesToDeactivate.length > 0) {
    await prisma.collaboratorAssignment.updateMany({
      where: {
        collaboratorId,
        storeId,
        locationId: { in: updatesToDeactivate },
      },
      data: { isActive: false },
    });
  }

  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}
