"use client";
import { useOrderStore } from "@/app/zustand/orderStore";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function SelectedProducts() {
  const { order, getOrderQuantity } = useOrderStore();

  return (
    <div className="space-y-4">
      {/* Lista de productos */}
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {order.map((product) => (
          <Card
            key={product.id}
            className="p-4 bg-card border border-border rounded-lg"
          >
            <div className="flex items-center gap-4">
              {/* Imagen del producto */}
              <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nombre del producto */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground leading-tight">
                  {product.name}
                </h3>
              </div>

              {/* Cantidad */}
              <div className="flex-shrink-0 bg-emerald-600 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-white">
                  {product.quantity}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Separador */}
      <Separator className="my-4" />

      {/* Total */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg">
        <span className="text-lg font-semibold text-foreground">
          Total de productos
        </span>
        <span className="text-2xl font-bold text-primary">
          {getOrderQuantity()}
        </span>
      </div>
    </div>
  );
}

export default SelectedProducts;
