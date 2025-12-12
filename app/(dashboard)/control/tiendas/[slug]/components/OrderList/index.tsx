// import { Order } from "@prisma/client";
import { OrderInStore } from "@/shared/types/store";
import { OrderCard } from "./OrderCard";

interface OrderListProps {
  orders: OrderInStore[];
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
