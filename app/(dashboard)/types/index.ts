import { OrderStatus } from "@prisma/client";

export interface Store {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  address: string;
  phone: string | null;
  banner?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

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
