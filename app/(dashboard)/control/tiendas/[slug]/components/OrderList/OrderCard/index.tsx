// import { Order } from "@prisma/client";
import { getCurrentProfile } from "@/lib/auth/session";
import { OrderCardClient } from "./OrderCardClient";
import { OrderInStore } from "@/shared/types/store";

interface Collaborator {
  id: number;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

type OrderCardProps = {
  order: OrderInStore;
  storeSlug: string;
  availableCollaborators: Collaborator[];
};

export const OrderCard = async ({
  order,
  storeSlug,
  availableCollaborators,
}: OrderCardProps) => {
  const profile = await getCurrentProfile();
  const isAdminSupremo = profile?.role === "ADMIN_SUPREMO";

  return (
    <OrderCardClient
      order={order}
      isAdminSupremo={isAdminSupremo}
      storeSlug={storeSlug}
      availableCollaborators={availableCollaborators}
    />
  );
};
