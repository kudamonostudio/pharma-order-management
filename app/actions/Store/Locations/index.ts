"use server";
import { Location, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createLocation(formData: FormData) {
  const storeId = Number(formData.get("storeId"));
  const slug = (formData.get("slug") as string) || "";
  const name = (formData.get("name") as string) || "";
  const address = (formData.get("address") as string) || "";
  const phone = (formData.get("phone") as string) || null;
  const email = formData.get("email") as string;

  if (!storeId || !name || !address || !email) {
    throw new Error(`createLocation: missing fields ${JSON.stringify({ storeId, name, address, email })}`);
  }

  const existsEmail = await prisma.profile.findUnique({
    where: { email },
  });

  if(existsEmail) {
    throw new Error("Email already exists for another store as an admin");
  }

  const location = await prisma.location.create({
    data: {
      name,
      address,
      phone,
      storeId,
    },
  });

  if(email) {
    await createAdminLocation(email, storeId, location.id);
  }

  revalidatePath(`/control/tiendas/${slug}`);
}

async function createAdminLocation(email: string, storeId: number, locationId: number){
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  if (error || !data?.user) {
    console.error("Supabase Auth Error:", error);
    throw new Error("Error creating location admin user");
  }

  const userId = data.user.id;

  await prisma.profile.update({
    where: { id: userId },
    data: {
      role: Role.SUCURSAL_ADMIN,
      storeId,
      locationId,
    },
  });
}

export async function updateLocation(id: number, storeSlug: string, formData: FormData) {
  const data: Partial<Location> = {};
  
  if (formData.has("name")) data.name = formData.get("name") as string;
  if (formData.has("address")) data.address = formData.get("address") as string;
  if (formData.has("phone")) data.phone = formData.get("phone") as string | null;

  const location = await prisma.location.update({
    where: { id },
    data,
  });

  // Update admin email if provided
  if (formData.has("adminEmail")) {
    const adminEmail = formData.get("adminEmail") as string;
    if (adminEmail) {
      // Check if there's an existing admin for this location
      const existingAdmin = await prisma.profile.findFirst({
        where: {
          locationId: id,
          role: Role.SUCURSAL_ADMIN,
        },
      });

      if (existingAdmin) {
        // If email changed, invite new user
        if (existingAdmin.email !== adminEmail) {
          await createAdminLocation(adminEmail, location.storeId, id);
        }
      } else {
        // No existing admin, create new one
        await createAdminLocation(adminEmail, location.storeId, id);
      }
    }
  }

  revalidatePath(`/control/tiendas/${storeSlug}`);
  revalidatePath(`/control/tiendas/${storeSlug}/sucursales`);
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

  revalidatePath(`/control/tiendas/${storeSlug}/sucursales`);
  revalidatePath(`/control/tiendas/${storeSlug}/colaboradores`);
}
