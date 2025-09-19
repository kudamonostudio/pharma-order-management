"use client";
import { Card } from "@/components/ui/card";
import { Store } from "lucide-react";
import AddButton from "../AddButton";
import { StoreProductItem } from "@/app/types/store";

interface ProductListProps {
  products: StoreProductItem[];
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="p-8 mb-24">
      <div className="flex gap-2 mb-6 items-center">
        <Store className="w-5 h-5 mt-1" strokeWidth={1.25} />
        <h2 className="text-2xl">Listado de Productos</h2>
      </div>

      <div className="space-y-6 max-w-5xl">
        {products.map((product) => (
          <Card key={product.id} className="mb-2 px-2">
            <div className="flex items-center gap-6">
              {/* Product Image */}
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </h3>
                <div className="text-md text-gray-700 mb-1 max-w-xl">
                  <p className="line-clamp-3">{product.description}</p>
                </div>
              </div>

              {/* Actions */}
            </div>
            <AddButton product={product} />
          </Card>
        ))}
      </div>
    </div>
  );
};
export default ProductList;
