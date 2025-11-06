import { Badge } from "@/components/ui/badge";

export type OrderStatusVariant = "created" | "preparing" | "ready" | "delivered" | "cancelled";

interface OrderStatusProps {
  status: OrderStatusVariant;
}

const statusConfig = {
  created: {
    label: "Orden Creada",
    className: "bg-orange-500 hover:bg-orange-600 text-white text-base px-4 py-1.5",
  },
  preparing: {
    label: "En Preparación",
    className: "bg-blue-500 hover:bg-blue-600 text-white text-base px-4 py-1.5",
  },
  ready: {
    label: "Lista para Retiro",
    className: "bg-emerald-600 hover:bg-emerald-700 text-white text-base px-4 py-1.5",
  },
  delivered: {
    label: "Entregada",
    className: "bg-gray-500 hover:bg-gray-600 text-white text-base px-4 py-1.5",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-gray-500 hover:bg-gray-600 text-white text-base px-4 py-1.5",
  },
};

export default function OrderStatus({ status }: OrderStatusProps) {
  const config = statusConfig[status] || statusConfig.created;

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
}
