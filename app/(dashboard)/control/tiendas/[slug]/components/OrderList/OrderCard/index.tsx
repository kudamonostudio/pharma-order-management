import { OrderCardClient } from "./OrderCardClient";
import { OrderInStore } from "@/shared/types/store";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

type OrderCardProps = {
  order: OrderInStore;
  storeSlug: string;
  availableCollaborators: Collaborator[];
  withPrices: boolean;
  onOrderUpdated?: (orderId: number, newStatus: string) => void;
  onCollaboratorAssigned?: (orderId: number, collaboratorId: number) => void;
};

export const OrderCard = ({
  order,
  storeSlug,
  availableCollaborators,
  withPrices,
  onOrderUpdated,
  onCollaboratorAssigned,
}: OrderCardProps) => {
  return (
    <OrderCardClient
      order={order}
      storeSlug={storeSlug}
      availableCollaborators={availableCollaborators}
      withPrices={withPrices}
      onOrderUpdated={onOrderUpdated}
      onCollaboratorAssigned={onCollaboratorAssigned}
    />
  );
};
