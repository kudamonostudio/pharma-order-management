"use client";
import Image from "next/image";
import { Card } from "@/components/ui/card";

function SelectedProducts({
  order,
  withPrices,
}: {
  order: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
    price?: number;
  }>;
  withPrices: boolean;
}) {
  return (
    <div className="space-y-3 pr-2">
      {/* Lista de productos */}
      {order.map((product, index) => {
        const subtotal =
          product.price && withPrices ? product.price * product.quantity : 0;

        const isLastItem = index === order.length - 1;

        return (
          <Card
            key={product.id}
            className={`p-4 bg-card ${
              !isLastItem ? "border-b!" : ""
            } border-dashed border-0 shadow-none! rounded-none`}
          >
            <div className="flex items-center gap-4 min-w-md justify-between">
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
              {/* Nombre del producto y precio */}
              <div className="flex-1 min-w-0 text-center">
                <h3 className="text-lg text-foreground leading-tight">
                  {product.name}
                </h3>
                {withPrices && product.price !== undefined && (
                  <div className="mt-1 space-y-0.5">
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} c/u
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              {/* Cantidad */}
              <div className="shrink-0 bg-zinc-800 rounded-full px-4 py-2">
                <span className="text-2xl font-bold text-white">
                  X {product.quantity}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default SelectedProducts;
