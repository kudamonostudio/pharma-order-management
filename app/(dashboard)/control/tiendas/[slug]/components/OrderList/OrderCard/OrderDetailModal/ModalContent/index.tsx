"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OrderDetailModalContent } from "./OrderDetailModalContent";
import { OrderInStore } from "@/shared/types/store";

interface Collaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderInStore;
  products: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
  }>;
  storeSlug: string;
  availableCollaborators: Collaborator[];
  withPrices: boolean;
  onOrderUpdated?: (orderId: number, newStatus: string) => void;
  onCollaboratorAssigned?: (orderId: number, collaboratorId: number) => void;
}

export function OrderDetailModal({
  open,
  onOpenChange,
  order,
  products,
  storeSlug,
  availableCollaborators,
  withPrices,
  onOrderUpdated,
  onCollaboratorAssigned,
}: OrderDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen w-full sm:max-w-4xl p-0 gap-0 border-none outline-none">
        <div className="bg-background h-full overflow-y-auto">
          <div className="min-h-full max-w-4xl mx-auto">
            <OrderDetailModalContent
              order={order}
              products={products}
              storeSlug={storeSlug}
              availableCollaborators={availableCollaborators}
              withPrices={withPrices}
              onOrderUpdated={onOrderUpdated}
              onCollaboratorAssigned={onCollaboratorAssigned}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
