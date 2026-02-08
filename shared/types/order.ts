/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderStatus, PaymentMethodType } from "@prisma/client";

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
  page: number;
}

export interface UpdateOrderStatusData {
  id: number,
  status: OrderStatus,
  collaboratorId: number,
  prevCollaboratorId?: number,
}

export interface UpdatePaymentMethodTypeData {
  id: number,
  paymentMethodType: PaymentMethodType,
}

export interface OrderHistoryItem {
  id: number;
  orderId: number;
  collaborator: {
    id: number;
    firstName: string;
    lastName: string;
    image: string | null;
  } | null;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: Date;
}
