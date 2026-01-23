import { getStoreWithOrders } from "@/app/actions/Store";
import { getCollaboratorsByStore } from "@/app/actions/Collaborators";
import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { OrdersPageContent } from "./components/OrdersPageContent";

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

  // Convert status to uppercase and handle comma-separated values
  const normalizedStatus = status 
    ? status.split(",").map(s => s.trim().toUpperCase()) 
    : undefined;

  // Force locationId filter for SUCURSAL_ADMIN (can only see their branch orders)
  let effectiveLocationId = locationId ? Number(locationId) : undefined;
  if (currentProfile?.role === 'SUCURSAL_ADMIN' && currentProfile.locationId) {
    effectiveLocationId = currentProfile.locationId;
  }

  const response = await getStoreWithOrders(slug, {
    status: normalizedStatus as any,
    collaboratorId: collaboratorId ? Number(collaboratorId) : undefined,
    locationId: effectiveLocationId,
    ordersLimit: 50,
    ordersPage: 1,
  });

  if (!response) {
    redirect("/supremo");
  }

  const { store } = response;

  // Get store locations for branch filtering (only fetch if user has permission)
  const canAccessBranchFilter = currentProfile?.role === 'ADMIN_SUPREMO' || currentProfile?.role === 'TIENDA_ADMIN';
  const isAdminSupremo = currentProfile?.role === 'ADMIN_SUPREMO';
  
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

      <OrdersPageContent
        orders={store.orders ?? []}
        storeSlug={slug}
        availableCollaborators={availableCollaborators}
        availableLocations={storeLocations}
        withPrices={store.withPrices}
        isAdminSupremo={isAdminSupremo}
        canAccessBranchFilter={canAccessBranchFilter}
        currentStatus={status}
        currentCollaboratorId={collaboratorId}
        currentLocationId={locationId}
      />
    </div>
  );
}
