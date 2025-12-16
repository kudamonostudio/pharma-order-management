/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collaborator, CollaboratorAssignment, MessageType, OrderStatus } from "@prisma/client";

export interface AssignmentWithCollaborator extends CollaboratorAssignment {
  collaborator: Collaborator;
}

export interface LocationWithCollaborators extends Location {
  collaboratorAssignments: AssignmentWithCollaborator[];
}

// Store -> Orders

export interface StoreWithOrdersParams {
  ordersPage?: number;
  ordersLimit?: number;
  status?: OrderStatus;
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
}

export interface StoreWithOrdersResponse {
  store: StoreWithOrders;
  ordersPagination: {
    total: number;
    page: number;
  }
}

export interface OrderInStore {
  id: number;
  code: string | null;
  status: OrderStatus;
  items: any; // JSON
  totalAmount: number;
  currency: string;
  createdAt: Date;
  collaborator: CollaboratorBasic | null;
  location: LocationBasic | null;
  messages: MessageBasic[];
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
