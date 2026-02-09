"use client";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/app/zustand/orderStore";
import ConfirmOrderModal from "./ConfirmOrderModal";
import { useState, useEffect } from "react";
import { ShowAvatars } from "@/components/show-avatars";
import { StoreLocation } from "@/app/types/store";

interface ProductListFooterProps {
  storeId: number;
  storeName: string;
  storeLogo: string;
  locations: StoreLocation[];
  storeSlug: string;
  withPrices: boolean;
}

const ProductListFooter = ({ storeId, storeName, storeLogo, locations, storeSlug, withPrices }: ProductListFooterProps) => {
  const { order, getOrderQuantity, getOrderTotal, setStoreId } = useOrderStore();
  const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setStoreId(storeId);
    // Pequeño delay para asegurar que el store se actualizó
    setTimeout(() => setIsHydrated(true), 0);
  }, [storeId, setStoreId]);

  const areProductsInOrder = isHydrated && getOrderQuantity() > 0;
  const emptyOrder = isHydrated && getOrderQuantity() === 0;
  const isLoading = !isHydrated;

  const handleConfirmOrderOpen = () => {
    // Abrir el modal de confirmación de orden
    setConfirmOrderOpen(true);
  };

  return (
    <>
      <div className="min-h-24 md:h-24 w-full bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.05)] border-t fixed bottom-0 left-0 flex">
        <div className="max-w-4xl mx-auto px-4 md:px-6 flex justify-center items-center w-full">
          {isLoading && (
            <div className="flex items-center gap-2.5">
              <ShoppingCart
                className="w-5 h-5 text-muted-foreground animate-pulse"
                strokeWidth={2}
              />
              <h3 className="text-sm font-medium text-muted-foreground">
                Cargando orden...
              </h3>
            </div>
          )}
          {emptyOrder && (
            <div className="flex items-center gap-2.5">
              <ShoppingCart
                className="w-5 h-5 text-muted-foreground"
                strokeWidth={2}
              />
              <h3 className="text-sm font-medium text-muted-foreground">
                La orden está vacía
              </h3>
            </div>
          )}
          {areProductsInOrder && (
            <div className="flex flex-wrap gap-4 items-center relative justify-between w-full">
              <div className="flex items-center gap-6 sm:gap-8">
                <ShowAvatars items={order} type="product" />
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-foreground">
                    {getOrderQuantity()}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                    {order.length === 1 ? "producto" : "productos"}
                  </span>
                </div>
                {withPrices && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg md:text-2xl font-semibold text-emerald-600">
                      ${getOrderTotal().toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              <div className="lg:absolute md:right-0">
                <Button
                  onClick={handleConfirmOrderOpen}
                  className="h-10 px-6 rounded-md text-sm font-medium shadow-sm hover:shadow transition-shadow cursor-pointer text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Confirmar Orden
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmOrderModal
        open={confirmOrderOpen}
        onOpenChange={setConfirmOrderOpen}
        storeId={storeId}
        storeName={storeName}
        storeLogo={storeLogo}
        locations={locations}
        storeSlug={storeSlug}
        withPrices={withPrices}
      />
    </>
  );
};
export default ProductListFooter;
