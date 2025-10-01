"use client";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/app/zustand/orderStore";
import type { StoreProductItem } from "@/app/types/store";

interface AddButtonProps {
  product: StoreProductItem;
}

const AddButton = ({ product }: AddButtonProps) => {
  const { order, addProduct, increment, decrement } = useOrderStore();

  const orderItem = order.find((item) => item.id === product.id);
  const quantity = orderItem?.quantity || 0;

  const handleAdd = () => {
    addProduct(product);
  };

  const handleIncrease = () => {
    increment(product.id);
  };

  const handleDecrease = () => {
    decrement(product.id);
  };

  if (quantity === 0) {
    return (
      <div className="flex justify-end mt-3">
        <Button
          onClick={handleAdd}
          size="sm"
          className="h-10 px-4 rounded-md text-sm font-medium shadow-sm hover:shadow transition-shadow  text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" strokeWidth={2} />
          Agregar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end mt-3">
      <div className="flex items-center gap-2 bg-muted rounded-md px-2 h-10 border">
        <Button
          onClick={handleDecrease}
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-sm hover:bg-gray-200 transition-colors cursor-pointer bg-gray-300"
        >
          <Minus className="w-4 h-4" strokeWidth={2} />
        </Button>
        <span className="text-base font-semibold text-foreground min-w-[28px] text-center">
          {quantity}
        </span>
        <Button
          onClick={handleIncrease}
          size="icon"
          className="h-7 w-7 rounded-sm transition-colors cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
};

export default AddButton;
