"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OrderDetailModalContent } from "./OrderDetailModalContent";
import { OrderInStore } from "@/shared/types/store";

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
