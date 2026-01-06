// import { Order } from "@prisma/client";
import { OrderInStore } from "@/shared/types/store";
import { OrderCard } from "./OrderCard";

interface Collaborator {
  id: number;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

interface OrderListProps {
  orders: OrderInStore[];
  storeSlug: string;
  availableCollaborators: Collaborator[];
  withPrices: boolean;
}

export function OrderList({
  orders,
  storeSlug,
  availableCollaborators,
  withPrices,
}: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          storeSlug={storeSlug}
          availableCollaborators={availableCollaborators}
          withPrices={withPrices}
        />
      ))}
    </div>
  );
}
