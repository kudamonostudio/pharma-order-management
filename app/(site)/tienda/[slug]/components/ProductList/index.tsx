"use client";
import { Card } from "@/components/ui/card";
import { Store, LayoutGrid, LayoutList, Search, X, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import AddButton from "../AddButton";
import type { StoreProductItem } from "@/app/types/store";
import { getStoreProducts } from "@/app/actions/Products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const PAGE_SIZE = 20;

interface ProductListProps {
  storeId: number;
  withPrices: boolean;
}

const ProductList = ({ storeId, withPrices }: ProductListProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [products, setProducts] = useState<StoreProductItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(
    async (pageNum: number, searchTerm: string, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const result = await getStoreProducts(
          storeId,
          pageNum,
          PAGE_SIZE,
          searchTerm || undefined
        );
        setProducts((prev) =>
          append ? [...prev, ...result.products] : result.products
        );
        setHasMore(result.hasMore);
        setPage(pageNum);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [storeId]
  );

  // Carga inicial
  useEffect(() => {
    fetchProducts(1, "", false);
  }, [fetchProducts]);

  const handleSearch = () => {
    fetchProducts(1, search, false);
  };

  const handleClearSearch = () => {
    setSearch("");
    fetchProducts(1, "", false);
  };

  const handleLoadMore = () => {
    fetchProducts(page + 1, search, true);
  };

  return (
    <div className="px-4 pt-8 pb-36">
      <div className="flex gap-2.5 mb-4 items-center justify-between">
        <div className="flex gap-2.5 items-center">
          <Store className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
          <h2 className="text-lg font-semibold text-foreground">
            Listado de Productos
          </h2>
        </div>

        <button
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className="hidden md:block p-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
          aria-label="Toggle view"
        >
          {viewMode === "grid" ? (
            <LayoutList className="w-5 h-5 text-muted-foreground" />
          ) : (
            <LayoutGrid className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Buscador de productos */}
      <div className="flex gap-2 mb-6 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          variant="outline"
          className="cursor-pointer"
        >
          Buscar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {search
            ? "No se encontraron productos para tu búsqueda."
            : "No hay productos disponibles."}
        </div>
      ) : (
        <>
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
                        {withPrices && product.price !== undefined && (
                          <p className="text-lg font-bold text-emerald-600 mt-2">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
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
                          {withPrices && product.price !== undefined && (
                            <p className="text-lg font-bold text-emerald-600">
                              ${product.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <AddButton product={product} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Botón Cargar más */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                disabled={isLoadingMore}
                className="cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  "Cargar más productos"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default ProductList;
