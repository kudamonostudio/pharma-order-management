import { OrderStatus, Store } from "@prisma/client";

// Re-export Store from Prisma for convenience
export type { Store };

export interface User {
  name: string;
  email: string;
  role: "ADMIN_SUPREMO" | "ADMIN_DE_TIENDA" | "COLABORADOR";
}

export interface Order {
  id: number;
  code: string;
  date: string;
  status: OrderStatus;
}
