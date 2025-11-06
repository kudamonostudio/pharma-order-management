"use client";
import { useOrderStore } from "@/app/zustand/orderStore";
import { Card } from "@/components/ui/card";

function SelectedProducts() {
  const { order } = useOrderStore();

  return (
    <div className="space-y-4 relative h-full">
      {/* Lista de productos */}
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {order.map((product) => (
          <Card
            key={product.id}
            className="p-4 bg-card !border-b-1 border-0 !shadow-none rounded-none max-w-lg"
          >
            <div className="flex items-center gap-4 min-w-md justify-between">
              {/* Cantidad */}
              <div className="flex-shrink-0 bg-emerald-600 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-white">
                  {product.quantity}
                </span>
              </div>

              {/* Nombre del producto */}
              <div className="flex-1 min-w-0 text-center">
                <h3 className="text-lg font-semibold text-foreground leading-tight">
                  {product.name}
                </h3>
              </div>

              {/* Imagen del producto */}
              <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
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
    </div>
  );
}

export default SelectedProducts;
