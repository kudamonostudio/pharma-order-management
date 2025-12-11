import { Collaborator, CollaboratorAssignment, OrderStatus } from "@prisma/client";

export interface AssignmentWithCollaborator extends CollaboratorAssignment {
  collaborator: Collaborator;
}

export interface LocationWithCollaborators extends Location {
  collaboratorAssignments: AssignmentWithCollaborator[];
}

// Store -> Orders

export interface StoreExtendedParams {
  includeOrders?: boolean;
}

export interface StoreExtended {
  id: number;
  name: string;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: string | null;
  slug: string;
  banner: string | null;
  logo: string | null;
  isActive: boolean;
  withPrices: boolean;
  orders?: OrderInStore[];
}

export interface OrderInStore {
  id: number;
  code: string;
  status: OrderStatus;
  createdAt: Date;
  collaborator: CollaboratorBasic | null;
  location: LocationBasic | null;
}

export interface CollaboratorBasic {
  id: number;
  firstName: string;
  lastName: string;
}

export interface LocationBasic {
  id: number;
  name: string;
}
