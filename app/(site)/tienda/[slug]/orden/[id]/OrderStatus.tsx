import { Badge } from "@/components/ui/badge";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  type OrderStatus as OrderStatusType,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";

interface OrderStatusProps {
  status: OrderStatusType | string;
  isDelivery?: boolean;
}

export default function OrderStatus({ status, isDelivery = false }: OrderStatusProps) {
  return (
    <Badge className={`${getOrderStatusColor(status as OrderStatusType)} text-white text-base px-4 py-1.5`}>
      {getOrderStatusLabel(status as OrderStatusType, isDelivery)}
    </Badge>
  );
}
