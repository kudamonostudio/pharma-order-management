"use client";
import { ShoppingCart, Ellipsis } from "lucide-react";
import { useOrderStore } from "./zustand/orderStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ProductListFooter = () => {
  const { order, getOrderQuantity } = useOrderStore();

  let areProductsInOrder = getOrderQuantity() > 0;
  let emptyOrder = getOrderQuantity() === 0;
  let moreThanThree = order.length > 3;

  return (
    <div className="min-h-24 md:h-24 w-full bg-white shadow-2xl border-t fixed bottom-0 left-0 flex">
      <div className="max-w-5xl m-auto px-8 h-full flex justify-center items-center w-full">
        {emptyOrder && (
          <>
            <h3 className="text-2xl text-zinc-700">La orden está vacía</h3>
            <ShoppingCart
              className="w-6 h-6 mt-1.5 ml-2 text-zinc-700"
              strokeWidth={1.25}
            />
          </>
        )}
        {areProductsInOrder && (
          <div className="flex flex-wrap gap-5 items-center relative justify-between w-full">
            <div className="flex items-center gap-6 sm:gap-12 ">
              <div className="flex">
                {order.slice(0, 3).map((item) => (
                  <Avatar className="shadow-lg border p-1 sm:w-10 sm:h-10 mr-[-15px] sm:mr-[-20px] bg-white">
                    <AvatarImage src={item.image} alt="Product Image" />
                    <AvatarFallback />
                  </Avatar>
                ))}
                {moreThanThree && (
                  <Avatar className="shadow-lg border p-1 sm:w-10 sm:h-10 mr-[-15px] sm:mr-[-30px] bg-white item-center flex justify-center">
                    <Ellipsis
                      className="w-9 h-auto text-zinc-500"
                      strokeWidth={2}
                    />
                  </Avatar>
                )}
              </div>
              <h3 className="md:text-xl text-zinc-700 flex gap-1.5 items-center">
                <span className="text-2xl">{getOrderQuantity()}</span>
                <span className="hidden sm:block">
                  {order.length === 1 ? "producto" : "productos"} en la orden
                </span>
              </h3>
            </div>
            <div className="lg:absolute md:right-0">
              <Button
                onClick={() => {}} //TODO: CONFIRMAR ORDER
                className="w-fit h-10 rounded-full bg-emerald-600 text-white font-normal shadow cursor-pointer hover:bg-emerald-500 hover:scale-105 transition-all"
              >
                Confirmar Orden
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductListFooter;
