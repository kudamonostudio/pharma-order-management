// Order status types
export type OrderStatus =
  | "ENTREGADA"
  | "PENDIENTE"
  | "CANCELADA"
  | "EN_PROCESO"
  | "LISTO_PARA_RETIRO";

export type PaymentMethodType =
  | "WITH_CARD"
  | "WITH_CASH"
  | "EITHER";

export const paymentMethodOptions = [
  { value: "WITH_CARD", label: "Tarjeta" },
  { value: "WITH_CASH", label: "Efectivo" },
  { value: "EITHER", label: "Cualquiera" },
];

// Order status display names (pickup - retiro en sucursal)
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ENTREGADA: "Entregada",
  PENDIENTE: "Pendiente",
  CANCELADA: "Cancelada",
  EN_PROCESO: "En Proceso",
  LISTO_PARA_RETIRO: "Listo para retiro",
};

// Order status display names (delivery - envío)
export const ORDER_STATUS_LABELS_DELIVERY: Record<OrderStatus, string> = {
  ENTREGADA: "Enviado",
  PENDIENTE: "Pendiente",
  CANCELADA: "Cancelada",
  EN_PROCESO: "En Proceso",
  LISTO_PARA_RETIRO: "Enviando a destino",
};

// Order status colors
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  ENTREGADA: "bg-emerald-500/55 border-emerald-400/70",
  PENDIENTE: "bg-orange-400/55 border-orange-400/70",
  CANCELADA: "bg-gray-500/40 border-gray-500/60",
  EN_PROCESO: "bg-blue-400/55 border-blue-400/70",
  LISTO_PARA_RETIRO: "bg-purple-400/55 border-purple-400/70",
};

// Helper function to get status color
export const getOrderStatusColor = (status: OrderStatus): string => {
  return ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.CANCELADA;
};

// Helper function to get status label
export const getOrderStatusLabel = (status: OrderStatus, isDelivery = false): string => {
  const labels = isDelivery ? ORDER_STATUS_LABELS_DELIVERY : ORDER_STATUS_LABELS;
  return labels[status] || status;
};

export function mapPaymentMethodLabel(
  value?: string | null
): string {
  if (!value) return "—";

  return (
    paymentMethodOptions.find((opt) => opt.value === value)?.label ?? value
  );
}
