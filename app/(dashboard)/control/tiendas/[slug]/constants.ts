// Order status types
export type OrderStatus =
  | "ENTREGADA"
  | "PENDIENTE"
  | "CANCELADA"
  | "EN_PROCESO"
  | "LISTO_PARA_RETIRO";

// Order status display names
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ENTREGADA: "Entregada",
  PENDIENTE: "Pendiente",
  CANCELADA: "Cancelada",
  EN_PROCESO: "En Proceso",
  LISTO_PARA_RETIRO: "Listo para retiro",
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
export const getOrderStatusLabel = (status: OrderStatus): string => {
  return ORDER_STATUS_LABELS[status] || status;
};
