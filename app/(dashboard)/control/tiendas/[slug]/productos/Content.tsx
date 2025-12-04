"use client";

import Image from "next/image";
import { Product, Store } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductConfigModal } from "./components/ProductConfigModal";
import { CreateProductButton } from "./components/CreateProductButton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

type ProductWithNumberPrice = Omit<Product, "price"> & { price: number };

interface ProductsContentProps {
  store: Store;
  initialProducts: ProductWithNumberPrice[];
  initialPages: number;
  initialPage: number;
}

export default function ProductsContent({
  store,
  initialProducts,
  initialPages,
  initialPage,
}: ProductsContentProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithNumberPrice | null>(null);

  const handleEditClick = (product: ProductWithNumberPrice) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    router.push(`/control/tiendas/${store.slug}/productos?page=${page}`);
  };

  return (
    <div className="px-8 py-4 w-full">
      <div className="flex flex-col gap-2 items-start mt-4 justify-between sm:flex-row mb-4">
        <h1 className="font-bold text-2xl mb-6">Productos de {store.name}</h1>

        <CreateProductButton />
      </div>

      <div className="space-y-4">
        {initialProducts.length === 0 && (
          <EmptyState text="No hay productos registrados." />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {initialProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-md shadow-sm bg-white hover:shadow-md transition flex flex-col"
            >
              <div className="w-full h-40 bg-gray-100 rounded-t-md flex items-center justify-center overflow-hidden relative">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 25vw, 16vw"
                    quality={75}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-gray-400">Sin imagen</span>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  )}
                  {store.withPrices && (
                    <p className="font-bold text-green-700 mt-2">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handleEditClick(product)}
                  className="w-full"
                >
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {initialPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: initialPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(p)}
                  className={`px-4 py-2 rounded-md border ${
                    p === initialPage
                      ? "bg-primary text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <ProductConfigModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        product={selectedProduct}
        storeSlug={store.slug}
        withPrices={store.withPrices}
      />
    </div>
  );
}
