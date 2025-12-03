import { Order } from "@prisma/client";
import { getCurrentProfile } from "@/lib/auth/session";
import { OrderCardClient } from "./OrderCardClient";

type OrderCardProps = {
  order: Order;
};

export const OrderCard = async ({ order }: OrderCardProps) => {
  const profile = await getCurrentProfile();
  const isAdminSupremo = profile?.role === "ADMIN_SUPREMO";

  return <OrderCardClient order={order} isAdminSupremo={isAdminSupremo} />;
};
