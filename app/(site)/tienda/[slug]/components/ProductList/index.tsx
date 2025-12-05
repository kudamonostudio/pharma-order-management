"use client";
import { Card } from "@/components/ui/card";
import { Store, LayoutGrid, LayoutList } from "lucide-react";
import { useState } from "react";
import AddButton from "../AddButton";
import type { StoreProductItem } from "@/app/types/store";
import Image from "next/image";

interface ProductListProps {
  products: StoreProductItem[];
}

const ProductList = ({ products }: ProductListProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  return (
    <div className="px-4 py-8 mb-32">
      <div className="flex gap-2.5 mb-6 items-center justify-between">
        <div className="flex gap-2.5 items-center">
          <Store className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
          <h2 className="text-lg font-semibold text-foreground">
            Listado de Productos
          </h2>
        </div>

        <button
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className="p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
          aria-label="Toggle view"
        >
          {viewMode === "grid" ? (
            <LayoutList className="w-5 h-5 text-muted-foreground" />
          ) : (
            <LayoutGrid className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {viewMode === "grid" ? (
        // Grid View (New Vertical Design)
        <div className="grid grid-cols-3 gap-4 max-w-4xl mb-2">
          {products.map((product) => {
            const isPlaceholder = !product.image;
            return (
              <Card
                key={product.id}
                className="p-0 bg-card hover:shadow-lg transition-all duration-300 border border-border rounded-2xl overflow-hidden group"
              >
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden rounded-t-2xl flex items-center justify-center">
                  <Image
                    src={product.image || "/product-placeholder.webp"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={75}
                    className={
                      isPlaceholder
                        ? "object-contain p-8"
                        : "object-cover group-hover:scale-110 transition-transform duration-500"
                    }
                  />
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1.5 leading-tight line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <AddButton product={product} />
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        // List View (Original Horizontal Design)
        <div className="space-y-3 max-w-2xl">
          {products.map((product) => {
            const isPlaceholder = !product.image;
            return (
              <Card
                key={product.id}
                className="p-0 bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="flex gap-4 p-3">
                  <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={product.image || "/product-placeholder.webp"}
                      alt={product.name}
                      fill
                      sizes="96px"
                      quality={75}
                      className={
                        isPlaceholder ? "object-contain p-8" : "object-cover"
                      }
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-base font-semibold text-foreground mb-1 leading-tight line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                        {product.description}
                      </p>
                    </div>
                    <AddButton product={product} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ProductList;
