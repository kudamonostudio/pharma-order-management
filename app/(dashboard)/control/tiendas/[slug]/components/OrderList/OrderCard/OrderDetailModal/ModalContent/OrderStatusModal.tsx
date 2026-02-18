import { Badge } from "@/components/ui/badge";
import {
  getOrderStatusColor,
  getOrderStatusLabel,
  type OrderStatus as OrderStatusType,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";
import clsx from "clsx";

interface OrderStatusModalProps {
  status: OrderStatusType | string;
  variant?: "default" | "small";
  isDelivery?: boolean;
}

export default function OrderStatusModal({ status, variant = "default", isDelivery = false }: OrderStatusModalProps) {
  return (
    <Badge
      className={clsx(
        getOrderStatusColor(status as OrderStatusType),
        "text-white",
        variant === "small" ? "px-2 py-1 text-sm mt-0.5" : "px-4 py-1.5 text-base"
      )}
    >
      {getOrderStatusLabel(status as OrderStatusType, isDelivery)}
    </Badge>
  );
}
