"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Package, MessageCircle } from "lucide-react";

export type OrderTabValue = "products" | "messages";

interface OrderTabControlProps {
  value: OrderTabValue;
  onChange: (value: OrderTabValue) => void;
  hasUnreadMessages?: boolean;
}

export function OrderTabControl({ value, onChange, hasUnreadMessages = false }: OrderTabControlProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue) => {
        if (newValue) onChange(newValue as OrderTabValue);
      }}
      className="justify-start gap-2 bg-zinc-100 p-1 rounded-md w-fit"
    >
      <ToggleGroupItem
        value="products"
        aria-label="Productos"
        className={`transition-none cursor-pointer ${
          value === "products"
            ? "bg-white! text-black! hover:bg-white!"
            : "bg-transparent! text-zinc-400! hover:bg-transparent! hover:text-zinc-400!"
        }`}
      >
        <Package className="h-4 w-4 mr-2" />
        Productos
      </ToggleGroupItem>
      <ToggleGroupItem
        value="messages"
        aria-label="Mensajes"
        className={`transition-none cursor-pointer relative ${
          value === "messages"
            ? "bg-white! text-black! hover:bg-white!"
            : "bg-transparent! text-zinc-400! hover:bg-transparent! hover:text-zinc-400!"
        }`}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Mensajes
        {hasUnreadMessages && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
