import { getStoreBySlug } from "@/app/actions/Store";
import { getCollaboratorsByStore } from "@/app/actions/Collaborators";
import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import ColaboradoresContent from "./Content";
import { prisma } from "@/lib/prisma";

export default async function ColaboradoresPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    locationId?: string;
  }>;
}) {
  const { slug } = await params;
  const { locationId } = await searchParams;

  // Get current user profile for role-based access control
  const currentProfile = await getCurrentProfile();

  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/supremo");
  }

  // Obtener las sucursales de la tienda
  const locations = await prisma.location.findMany({
    where: {
      storeId: store.id,
      deletedAt: null,
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  // Get branch filter access permission
  const canAccessBranchFilter = currentProfile?.role === 'ADMIN_SUPREMO' || currentProfile?.role === 'TIENDA_ADMIN';

  // Obtener colaboradores reales de la base de datos
  const collaborators = await getCollaboratorsByStore(
    store.id,
    locationId ? Number(locationId) : undefined
  );

  return (
    <ColaboradoresContent
      store={store}
      collaborators={collaborators}
      locations={locations}
      canAccessBranchFilter={canAccessBranchFilter}
      currentLocationId={locationId}
    />
  );
}
