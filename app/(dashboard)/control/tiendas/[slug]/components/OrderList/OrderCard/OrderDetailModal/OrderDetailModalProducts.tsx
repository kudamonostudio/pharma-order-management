"use client";
import { Card } from "@/components/ui/card";

export function OrderDetailModalProducts({
  order,
}: {
  order: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
  }>;
}) {
  /*   const { order } = useOrderStore(); */

  return (
    <div className="space-y-3 pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Lista de productos */}
      {order.map((product) => (
        <Card
          key={product.id}
          className="p-2 bg-card border-b! border-dashed border-0 shadow-none! rounded-none max-w-lg"
        >
          <div className="flex items-center gap-4 justify-between">
            {/* Cantidad */}
            <div className="shrink-0 bg-blue-400 py-2 px-4 text-center rounded-full">
              <span className="text-xl font-bold text-white">
                {product.quantity}
              </span>
            </div>

            {/* Nombre del producto */}
            <div className="flex-1 min-w-0 text-center">
              <h3 className="text-base text-foreground leading-tight">
                {product.name}
              </h3>
            </div>

            {/* Imagen del producto */}
            <div className="relative w-20 h-20 shrink-0 bg-linear-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
