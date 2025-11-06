"use client";
import { useOrderStore } from "@/app/zustand/orderStore";
import SelectedProducts from "../../components/SelectedProducts";
import StoreContainer from "../../components/StoreContainer";
import StoreLogo from "../../components/StoreLogo";
import OrderStatus, { type OrderStatusVariant } from "./OrderStatus";

// Esta página muestra la orden creada, el listado de productos, la sucursal y el estado de la orden
const Page = () => {
  const { order } =
    useOrderStore(); /* TODO: Esto debe quitarse, es la orden para la creacion */
  const mockOrder: {
    id: string;
    status: OrderStatusVariant;
    totalQuantity: number;
    items: Array<{ quantity: number }>;
    branch: { id: string; name: string };
    createdAt?: Date;
  } = {
    id: "order_12345",
    status: "preparing",
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
      <div className="flex flex-col py-8 gap-2">
        <div className="flex justify-between">
          <div>
            <h1 className="text-xl font-normal text-gray-600">
              Detalles de la orden: #{mockOrder.id}
            </h1>
            <small>Creada el {mockOrder.createdAt?.toLocaleDateString()}</small>
          </div>
          {/* TODO: Cambiar el estado según la orden */}
          <div className="flex flex-col items-end">
            <OrderStatus status={mockOrder.status} />
            <h3 className="text-lg font-normal mt-4">
              Retira en la sucursal: {mockOrder.branch.name}
            </h3>
          </div>
        </div>
        <SelectedProducts order={order} />
        {/* TODO: Este componente debe recibir una orden como prop, en este caso los datos de la orden creada*/}
      </div>
    </StoreContainer>
  );
};
export default Page;
