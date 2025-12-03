"use client";
import { useOrderStore } from "@/app/zustand/orderStore";
import StoreContainer from "../../components/StoreContainer";
import StoreLogo from "../../components/StoreLogo";
import { OrderDetailContent } from "./OrderDetailContent";
import { type OrderStatus as OrderStatusType } from "@/app/(dashboard)/control/tiendas/[slug]/constants";

// Esta página muestra la orden creada, el listado de productos, la sucursal y el estado de la orden
const Page = () => {
  const { order } =
    useOrderStore(); /* TODO: Esto debe quitarse, es la orden para la creacion */
  const mockOrder: {
    id: string;
    status: OrderStatusType;
    totalQuantity: number;
    items: Array<{ quantity: number }>;
    branch: { id: string; name: string };
    createdAt: Date;
  } = {
    id: "order_12345",
    status: "EN_PROCESO",
    createdAt: new Date(),
    branch: {
      id: "3",
      name: "Sucursal 1",
    },
    /* branchId: "3", */ // TODO: Obtener la sucursal desde supabase una vez implementadas las sucursales
    items: [
      {
        /* productId: "4", */ // TODO: Obtener el producto desde supabase una vez implementados los productos
        quantity: 3,
      },
      {
        /* productId: "5", */ // TODO: Obtener el producto desde supabase una vez implementados los productos
        quantity: 1,
      },
    ],
    totalQuantity: 4,
  };
  return (
    <StoreContainer>
      <div className="pt-12 pb-8 flex gap-4 items-center justify-center border-b">
        <StoreLogo logoUrl="https://i.pinimg.com/736x/c9/9d/0e/c99d0ec4d6f81c2e2592f41216d8fcd7.jpg" />
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Nombre de la tienda
        </h1>
      </div>
      <OrderDetailContent order={mockOrder} products={order} showBranchInfo={true} />
    </StoreContainer>
  );
};
export default Page;
