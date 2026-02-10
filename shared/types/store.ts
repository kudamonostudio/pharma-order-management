/* eslint-disable @typescript-eslint/no-explicit-any */
import { CollaboratorAssignment, MessageType, OrderStatus, PaymentMethodType } from "@prisma/client";
import { OrderHistoryItem } from "./order";

export interface CollaboratorBasicForAssignment {
  id: number;
  firstName: string;
  lastName: string;
  image: string | null;
  email?: string | null;
}

export interface AssignmentWithCollaborator extends CollaboratorAssignment {
  collaborator: CollaboratorBasicForAssignment;
}

export interface LocationWithCollaborators extends Location {
  collaboratorAssignments: AssignmentWithCollaborator[];
}

// Store -> Orders

export interface StoreWithOrdersParams {
  ordersPage?: number;
  ordersLimit?: number;
  status?: OrderStatus | OrderStatus[];
  collaboratorId?: number;
  locationId?: number;
}

export interface StoreWithOrders {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  slug: string;
  banner: string | null;
  logo: string | null;
  isActive: boolean;
  withPrices: boolean;
  orders?: OrderInStore[];
  locations?: LocationBasic[];
}

export interface StoreOrdersStats {
  pending: number;
  completedThisMonth: number;
}

export interface StoreWithOrdersResponse {
  store: StoreWithOrders;
  ordersPagination: {
    total: number;
    page: number;
  };
  ordersStats: StoreOrdersStats;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  image?: string;
  imageUrl?: string;
}

export interface OrderInStore {
  id: number;
  code: string | null;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  createdAt: Date;
  collaborator: CollaboratorBasic | null;
  location: LocationBasic | null;
  messages: MessageBasic[];
  history?: OrderHistoryItem[];
  fullname: string;
  phoneContact: string;
  paymentMethodType:  PaymentMethodType | null;
  shippingAddress: string | null;
}

export interface CollaboratorBasic {
  id: number;
  firstName: string;
  lastName: string;
  image?: string | null;
}

export interface LocationBasic {
  id: number;
  name: string;
}

export interface MessageBasic {
  id: number;
  type: MessageType;
  message: string;
  collaborator: CollaboratorBasic | null;
  createdAt: Date;
}
