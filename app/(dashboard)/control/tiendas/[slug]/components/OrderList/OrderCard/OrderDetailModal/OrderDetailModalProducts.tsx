"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function OrderDetailModalProducts({
  order,
  withPrices,
}: {
  order: Array<{
    id: string;
    name: string;
    image?: string;
    imageUrl?: string;
    quantity: number;
    price?: number;
  }>;
  withPrices: boolean;
}) {
  /*   const { order } = useOrderStore(); */

  return (
    <>
      <h2 className="text-lg font-medium text-accent-foreground/95 pb-2">
        Productos de la orden:
      </h2>
      <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Lista de productos */}
        {order.map((product, index) => {
          const productImage = product.image || product.imageUrl;
          const subtotal =
            product.price && withPrices ? product.price * product.quantity : 0;

          return (
            <Card
              key={`${product.id}-${index}`}
              className="p-2 border-gray-200 shadow-none! max-w-lg bg-zinc-100 m-0"
            >
              <div className="flex items-center gap-4 justify-between">
                {/* Imagen del producto */}
                <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-zinc-200 flex items-center justify-center">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/product-placeholder.webp"
                      alt={product.name}
                      width={24}
                      height={32}
                      className="object-contain"
                    />
                  )}
                </div>

                {/* Nombre del producto y precio */}
                <div className="flex-1 min-w-0 text-center">
                  <h3 className="text-base text-foreground leading-tight">
                    {product.name}
                  </h3>
                  {withPrices && product.price !== undefined && (
                    <div className="mt-1">
                      <p className="text-xs text-muted-foreground">
                        ${product.price.toFixed(2)} c/u
                      </p>
                      <p className="text-sm font-bold text-emerald-600">
                        ${subtotal.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                {/* Cantidad */}
                <div className="shrink-0 text-center justify-center rounded-full flex flex-col">
                  <small>cant.</small>
                  <span className="text-2xl font-bold ">
                    {product.quantity}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
