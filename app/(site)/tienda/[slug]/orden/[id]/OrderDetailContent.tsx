"use client";

import SelectedProducts from "../../components/SelectedProducts";
import OrderStatus from "./OrderStatus";
import { type OrderStatus as OrderStatusType } from "@/app/(dashboard)/control/tiendas/[slug]/constants";

interface OrderDetailContentProps {
  order: {
    id: string;
    status: OrderStatusType | string;
    createdAt: Date;
    branch: { id: string; name: string };
  };
  products: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
  }>;
  showBranchInfo?: boolean;
}

export function OrderDetailContent({ order, products, showBranchInfo = false }: OrderDetailContentProps) {
  return (
    <div className="flex flex-col py-8 gap-2">
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-normal text-gray-600">
            Detalles de la orden: #{order.id}
          </h1>
          <small>Creada el {order.createdAt.toLocaleDateString()}</small>
        </div>
        <div className="flex flex-col items-end">
          <OrderStatus status={order.status} />
          {showBranchInfo && (
            <h3 className="text-lg font-normal mt-4">
              Retira en la sucursal: {order.branch.name}
            </h3>
          )}
        </div>
      </div>
      <SelectedProducts order={products} />
    </div>
  );
}
