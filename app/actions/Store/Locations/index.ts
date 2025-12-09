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

// export async function assignCollaboratorsToLocation(
//   locationId: number,
//   collaboratorIds: number[],
//   storeSlug: string
// ) {
//   if (!locationId) {
//     throw new Error("assignCollaboratorsToLocation: missing locationId");
//   }

//   // Obtener los colaboradores actualmente asignados a esta sucursal
//   const currentCollaborators = await prisma.profile.findMany({
//     where: {
//       locationId,
//       deletedAt: null,
//     },
//     select: { id: true },
//   });

//   const currentIds = new Set(currentCollaborators.map((c) => c.id));
//   const newIds = new Set(collaboratorIds);

//   // Colaboradores a quitar (están en current pero no en new)
//   const toRemove = currentCollaborators
//     .filter((c) => !newIds.has(c.id))
//     .map((c) => c.id);

//   // Colaboradores a agregar (están en new pero no en current)
//   const toAdd = collaboratorIds.filter((id) => !currentIds.has(id));

//   // Solo ejecutar si hay cambios
//   if (toRemove.length > 0) {
//     await prisma.profile.updateMany({
//       where: {
//         id: { in: toRemove },
//         deletedAt: null,
//       },
//       data: {
//         locationId: null,
//       },
//     });
//   }

//   if (toAdd.length > 0) {
//     await prisma.profile.updateMany({
//       where: {
//         id: { in: toAdd },
//         deletedAt: null,
//       },
//       data: {
//         locationId,
//       },
//     });
//   }

//   revalidatePath(`/control/tiendas/${storeSlug}/sucursales`);
//   revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
// }

export async function assignCollaboratorsToLocation(
  locationId: number,
  activeCollaboratorIds: number[],
  storeSlug: string
) {
  if (!locationId) {
    throw new Error("assignCollaboratorsToLocation: missing locationId");
  }

  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    throw new Error("assignCollaboratorsToLocation: location does not exist");
  }

  const existingAssignments = await prisma.collaboratorAssignment.findMany({
    where: {
      locationId,
    },
    select: { id: true, collaboratorId: true, isActive: true },
  });

  const activeSet = new Set(activeCollaboratorIds);

  const updatesToActivate: number[] = [];
  const updatesToDeactivate: number[] = [];
  const idsToInsert: number[] = [];


  // Analizar todos los registros existentes
  for (const assignment of existingAssignments) {
    const { collaboratorId, isActive } = assignment;

    if (activeSet.has(collaboratorId)) {
      // Debe estar activo
      if (!isActive) {
        // Existe pero estaba inactivo → activar
        updatesToActivate.push(collaboratorId);
      }

      // Como ya está considerado, lo sacamos del Set para saber qué IDs son nuevos
      activeSet.delete(collaboratorId);
    } else {
      // No está en los que vienen del cliente → debe desactivarse si está activo
      if (isActive) {
        updatesToDeactivate.push(collaboratorId);
      }
    }
  }

  // Lo que queda en activeSet → son IDs que NO existen en assignments → insertar
  idsToInsert.push(...Array.from(activeSet));

  // Insertar nuevos registros
  if (idsToInsert.length > 0) {
    await prisma.collaboratorAssignment.createMany({
      data: idsToInsert.map((id) => ({
        locationId,
        collaboratorId: id,
        storeId: location.storeId,
        isActive: true,
      })),
    });
  }

  // Activar registros existentes que estaban inactivos
  if (updatesToActivate.length > 0) {
    await prisma.collaboratorAssignment.updateMany({
      where: {
        locationId,
        collaboratorId: { in: updatesToActivate },
      },
      data: { isActive: true },
    });
  }

  // Desactivar registros que ya no están seleccionados
  if (updatesToDeactivate.length > 0) {
    await prisma.collaboratorAssignment.updateMany({
      where: {
        locationId,
        collaboratorId: { in: updatesToDeactivate },
      },
      data: { isActive: false },
    });
  }









  // const currentIds = new Set(currentAssignments.map((c) => c.collaboratorId));

  // const uniqueIncomingIds = Array.from(new Set(activeCollaboratorIds));

  // const idsToInsert = uniqueIncomingIds.filter((id) => !currentIds.has(id));


  // if (idsToInsert.length === 0) {
  //   return;
  // }

  // await prisma.collaboratorAssignment.createMany({
  //   data: idsToInsert.map((id) => ({
  //     locationId,
  //     collaboratorId: id,
  //     storeId: location.storeId,
  //   })),
  // });

  revalidatePath(`/control/tiendas/${storeSlug}/sucursales`);
  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}
