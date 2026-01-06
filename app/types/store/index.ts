import { Prisma } from "@prisma/client";

export interface StoreProductItem {
  id: string;
  name: string;
  image: string;
  description: string;
  price?: number;
}

export type StoreLocation = Prisma.LocationGetPayload<{
  select: {
    id: true;
    name: true;
    address: true;
  };
}>;
