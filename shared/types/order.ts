/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderStatus } from "@prisma/client";

export interface StoreOrder {
  id: number;
  fullname: string;
  phoneContact: string;
  status: OrderStatus;
  locationId: number | null;
  storeId: number | null;
  collaboratorId: number | null;
  items: any; // JSON
  totalAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetOrdersByStoreResponse {
  orders: StoreOrder[];
  total: number;
  pages: number;
}
