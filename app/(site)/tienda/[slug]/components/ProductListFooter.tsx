"use client";
import { ShoppingCart, Ellipsis } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/app/zustand/orderStore";
import ConfirmOrderModal from "./ConfirmOrderModal";
import { useState, useEffect } from "react";

const ProductListFooter = () => {
  const { order, getOrderQuantity } = useOrderStore();
  const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const areProductsInOrder = isHydrated && getOrderQuantity() > 0;
  const emptyOrder = !isHydrated || getOrderQuantity() === 0;
  const moreThanThree = order.length > 3;

  const handleConfirmOrderOpen = () => {
    // Abrir el modal de confirmación de orden
    setConfirmOrderOpen(true);
  };

  return (
    <>
      <div className="min-h-24 md:h-24 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] border-t fixed bottom-0 left-0 flex">
        <div className="max-w-4xl mx-auto px-6 h-full flex justify-center items-center w-full">
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
                <div className="flex">
                  {order.slice(0, 3).map((item) => (
                    <Avatar
                      className="shadow-sm border-2 border-background w-12 h-12 sm:w-14 sm:h-14 -mr-4 sm:-mr-5 ring-1 ring-border"
                      key={item.id}
                    >
                      <AvatarImage
                        src={item.image || "/placeholder.svg"}
                        alt="Product Image"
                        className="rounded-full"
                      />
                      <AvatarFallback />
                    </Avatar>
                  ))}
                  {moreThanThree && (
                    <Avatar className="shadow-sm border-2 border-background w-12 h-12 sm:w-14 sm:h-14 bg-muted flex items-center justify-center ring-1 ring-border">
                      <Ellipsis
                        className="w-6 h-auto text-muted-foreground"
                        strokeWidth={2}
                      />
                    </Avatar>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-foreground">
                    {getOrderQuantity()}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                    {order.length === 1 ? "producto" : "productos"}
                  </span>
                </div>
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
      />
    </>
  );
};
export default ProductListFooter;
