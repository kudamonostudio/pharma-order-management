"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OrderDetailModalContent } from "./OrderDetailModalContent";
import { type OrderStatus as OrderStatusType } from "@/app/(dashboard)/control/tiendas/[slug]/constants";

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: string;
    status: OrderStatusType | string;
    createdAt: Date;
    branch: { id: string; name: string };
    profileId?: string | number | null;
  };
  products: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
  }>;
}

export function OrderDetailModal({
  open,
  onOpenChange,
  order,
  products,
}: OrderDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen w-full sm:max-w-4xl p-0 gap-0 border-none outline-none">
        <div className="bg-background h-full overflow-y-auto">
          <div className="min-h-full max-w-4xl mx-auto">
            <OrderDetailModalContent order={order} products={products} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
