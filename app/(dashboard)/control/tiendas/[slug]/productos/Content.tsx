"use client";

import Image from "next/image";
import { Product, Store } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { ProductConfigModal } from "./components/ProductConfigModal";
import { CreateProductButton } from "./components/CreateProductButton";
import { getProductsByStore } from "@/app/actions/Products";
import { LIMIT_PER_PAGE } from "@/lib/constants";
import { Loader } from "@/components/ui/loader";
import { EmptyState } from "@/components/ui/empty-state";

interface SucursalesContentProps {
  store: Store;
}

export default function ProductsContent({
  store,
}: SucursalesContentProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleEditClick = (branch: Product) => {
    setSelectedProduct(branch);
    setIsEditModalOpen(true);
  };

  const loadProducts = useCallback(async () => {
    setIsLoading(true);

    const { products, total, pages } = await getProductsByStore(
      store.id,
      currentPage,
      LIMIT_PER_PAGE
    );

    setProducts(products);
    setPages(pages);
    setIsLoading(false);
  }, [store.id, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4 justify-between sm:flex-row mb-4">
        <h1 className="font-bold text-2xl mb-6">Productos de {store.name}</h1>

        <CreateProductButton />
      </div>
      {isLoading && <Loader />}

      {!isLoading && (

        <div className="space-y-4">
          {products.length === 0 && <EmptyState text="No hay productos registrados." />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-xl shadow-sm p-4 bg-white hover:shadow-md transition"
              >
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-semibold line-clamp-1">{product.unit ? `${product.name} (${product.unit})` : product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Stock: {product.stock ?? 0}
                  </p>
                  <p className="text-sm text-blue-600/75">
                    {product.brand ?? ''}
                  </p>
                </div>
                {
                  product.price ? (
                    <p className="font-bold text-green-700 mt-2">
                      ${Number(product.price).toFixed(2)}
                    </p>
                    ) : (
                      <i className="text-sm text-green-700 mt-2">
                      Sin precio disponible
                    </i>
                    )
                }
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: pages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(p)}
                    className={`px-4 py-2 rounded-md border ${
                        p === currentPage
                          ? "bg-primary text-white"
                          : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          )}

        </div>
      )}

      <ProductConfigModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={selectedProduct}
        storeSlug={store.slug}
      />
    </div>
  );
}
