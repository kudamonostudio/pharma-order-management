import { getStoreWithOrders } from "@/app/actions/Store";
import { getCollaboratorsByStore } from "@/app/actions/Collaborators";
import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { OrderList } from "../components/OrderList";
import { OrdersFilters } from "./components/OrdersFilters";

interface OrdenesPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    status?: string;
    collaboratorId?: string;
    locationId?: string;
  }>;
}

export default async function OrdenesPage({
  params,
  searchParams,
}: OrdenesPageProps) {
  const { slug } = await params;
  const { status, collaboratorId, locationId } = await searchParams;

  // Get current user profile for role-based access control
  const currentProfile = await getCurrentProfile();

  // Convert status to uppercase to match Prisma OrderStatus enum
  const normalizedStatus = status ? status.toUpperCase() : undefined;

  const response = await getStoreWithOrders(slug, {
    status: normalizedStatus as any,
    collaboratorId: collaboratorId ? Number(collaboratorId) : undefined,
    locationId: locationId ? Number(locationId) : undefined,
    ordersLimit: 50,
    ordersPage: 1,
  });

  if (!response) {
    redirect("/supremo");
  }

  const { store } = response;

  // Get store locations for branch filtering (only fetch if user has permission)
  const canAccessBranchFilter = currentProfile?.role === 'ADMIN_SUPREMO' || currentProfile?.role === 'TIENDA_ADMIN';
  
  const storeLocations = canAccessBranchFilter ? store.locations || [] : [];

  const collaboratorsData = await getCollaboratorsByStore(store.id);
  const availableCollaborators = collaboratorsData.map((c) => ({
    id: c.collaboratorId,
    firstName: c.firstName,
    lastName: c.lastName,
    code: c.code,
    image: c.image,
    isActive: c.isActive,
  }));

  return (
    <div className="px-8 py-4 w-full max-w-5xl">
      <h1 className="font-medium text-2xl mb-6">Órdenes</h1>

      <div className="mb-6">
        <OrdersFilters
          storeSlug={slug}
          availableCollaborators={availableCollaborators}
          availableLocations={storeLocations}
          currentStatus={status}
          currentCollaboratorId={collaboratorId}
          currentLocationId={locationId}
          canAccessBranchFilter={canAccessBranchFilter}
        />
      </div>

      <section className="latest-orders">
        {store.orders?.length ? (
          <OrderList
            orders={store.orders ?? []}
            storeSlug={slug}
            availableCollaborators={availableCollaborators}
            withPrices={store.withPrices}
          />
        ) : (
          <p className="italic mx-2">No hay resultados para estos filtros</p>
        )}
      </section>
    </div>
  );
}
