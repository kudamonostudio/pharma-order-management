"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Package, MessageCircle, User } from "lucide-react";

export type ModalControlValue =
  | "products"
  | "internal-messages"
  | "client-messages";

interface ModalControlProps {
  value: ModalControlValue;
  onChange: (value: ModalControlValue) => void;
}

export function ModalControl({ value, onChange }: ModalControlProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue) => {
        if (newValue) onChange(newValue as ModalControlValue);
      }}
      className="justify-start gap-2 bg-zinc-100 p-1 rounded-md w-fit"
    >
      <ToggleGroupItem
        value="products"
        aria-label="Productos"
        className={`transition-none cursor-pointer ${
          value === "products"
            ? "!bg-white !text-black hover:!bg-white"
            : "!bg-transparent !text-zinc-400 hover:!bg-transparent hover:!text-zinc-400"
        }`}
      >
        <Package className="h-4 w-4 mr-2" />
        Productos
      </ToggleGroupItem>
      <ToggleGroupItem
        value="internal-messages"
        aria-label="Mensajes internos"
        className={`transition-none cursor-pointer ${
          value === "internal-messages"
            ? "!bg-white !text-black hover:!bg-white"
            : "!bg-transparent !text-zinc-400 hover:!bg-transparent hover:!text-zinc-400"
        }`}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Mensajes internos {/* TODO: AGREGAR COMENTARIOS INTERNOS REALES */}
      </ToggleGroupItem>
      <ToggleGroupItem
        value="client-messages"
        aria-label="Mensajes al cliente"
        className={`transition-none cursor-pointer ${
          value === "client-messages"
            ? "!bg-white !text-black hover:!bg-white"
            : "!bg-transparent !text-zinc-400 hover:!bg-transparent hover:!text-zinc-400"
        }`}
      >
        <User className="h-4 w-4 mr-2" />
        Mensajes al cliente {/* TODO: AGREGAR COMENTARIOS AL CLIENTE REALES */}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
