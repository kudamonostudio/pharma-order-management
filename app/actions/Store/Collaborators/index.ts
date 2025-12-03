"use server";

import { toNumberOrNull } from "@/lib/helpers";

export async function getCollaborators(locationId: number) {
  if (!locationId) return [];

  const collaborators = await prisma.collaborator.findMany({
    where: {
      locationId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return collaborators;
}

export async function createCollaborator(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const code = formData.get("code") as string | null; // opc
  const locationId = toNumberOrNull(formData.get("locationId")); // opc

  if (!firstName || !lastName) {
    throw new Error("Missing required fields: firstName or lastName");
  }

  const collaborator = await prisma.collaborator.create({
    data: {
      firstName,
      lastName,
      code,
      locationId,
    }
  });

  return collaborator.id;
}

export async function updateCollaboratorImage(id: number, url: string) {
  const updatedCollaborator = await prisma.collaborator.update({
    where: { id },
    data: { image: url },
  });

  return updatedCollaborator.id;
}

export async function updateCollaborator(
  id: number,
  data: {
    firstName?: string;
    lastName?: string;
    code?: string | null;
    phone?: string | null;
    email?: string | null;
    image?: string | null;
    locationId?: number | null;
  }
) {
  const collaborator = await prisma.collaborator.update({
    where: { id },
    data: {
      ...data,
    },
  });

  return collaborator;
}


export async function deleteCollaborator(id: number) {
  await prisma.collaborator.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}
