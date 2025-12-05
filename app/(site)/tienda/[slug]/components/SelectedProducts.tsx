"use client";
import Image from "next/image";
import { useOrderStore } from "@/app/zustand/orderStore";
import { Card } from "@/components/ui/card";

function SelectedProducts({ order }: { order: Array<{
  id: string;
  name: string;
  image?: string;
  quantity: number;
}> }) {
  /*   const { order } = useOrderStore(); */

  return (
    <div className="space-y-3 pr-2">
      {/* Lista de productos */}
      {order.map((product) => (
        <Card
          key={product.id}
          className="p-4 bg-card border-b! border-dashed border-0 shadow-none! rounded-none max-w-lg"
        >
          <div className="flex items-center gap-4 min-w-md justify-between">
            {/* Cantidad */}
            <div className="shrink-0 bg-zinc-800 rounded-full px-4 py-2">
              <span className="text-2xl font-bold text-white">
                {product.quantity}
              </span>
            </div>

            {/* Nombre del producto */}
            <div className="flex-1 min-w-0 text-center">
              <h3 className="text-lg text-foreground leading-tight">
                {product.name}
              </h3>
            </div>

            {/* Imagen del producto */}
            <div className="relative w-20 h-20 shrink-0 bg-linear-to-br from-muted to-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="relative w-1/2 h-1/2">
                  <Image
                    src="/product-placeholder.webp"
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default SelectedProducts;
