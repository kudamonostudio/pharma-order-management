"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { StoreProductItem } from "@/app/types/store";
import { useOrderStore } from "@/app/zustand/orderStore";

interface AddButtonProps {
  product: StoreProductItem;
}

const AddButton = ({ product }: AddButtonProps) => {
  const { order, addProduct, increment, decrement } = useOrderStore();

  const item = order.find((p) => p.id === product.id);
  const quantity = item ? item.quantity : 0;
  const containerStyle = "flex items-center gap-4 justify-end px-4";

  if (quantity === 0) {
    return (
      <div className={containerStyle}>
        <Button
          onClick={() => addProduct(product)}
          className="w-fit h-9 rounded-full bg-emerald-600 text-white shadow cursor-pointer hover:bg-emerald-500 hover:scale-105 transition-all font-normal"
        >
          Agregar a la orden
        </Button>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <Button
        onClick={() => decrement(product.id)}
        className="w-9 h-9 rounded-full bg-red-300 hover:bg-red-200 text-white cursor-pointer"
      >
        <Minus className="w-4 h-4" strokeWidth={1} />
      </Button>
      <h2 className="text-2xl w-6 text-center font-normal text-zinc-700">
        {quantity}
      </h2>
      <Button
        onClick={() => increment(product.id)}
        className="w-9 h-9 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
      >
        <Plus className="!size-7" strokeWidth={1} />
      </Button>
    </div>
  );
};

export default AddButton;
