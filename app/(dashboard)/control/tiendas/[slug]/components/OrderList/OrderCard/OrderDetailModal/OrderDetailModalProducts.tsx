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
    <>
      <h2 className="text-lg font-medium text-accent-foreground/95 pb-2">
        Productos de la orden:
      </h2>
      <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Lista de productos */}
        {order.map((product) => (
          <Card
            key={product.id}
            className="p-2 border-gray-200 shadow-none! max-w-lg bg-zinc-100 m-0"
          >
            <div className="flex items-center gap-4 justify-between">
              {/* Imagen del producto */}
              <div className="relative w-14 h-14 shrink-0 bg-linear-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nombre del producto */}
              <div className="flex-1 min-w-0 text-center">
                <h3 className="text-base text-foreground leading-tight">
                  {product.name}
                </h3>
              </div>
              {/* Cantidad */}
              <div className="shrink-0 text-center justify-center rounded-full flex flex-col">
                <small>cant.</small>
                <span className="text-2xl font-bold ">{product.quantity}</span>
              </div>
              {/* TODO: AGREGAR PRECIO EN CASO DE QUE SEAN PRODUCTOS CON PRECIO */}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
