"use client";

import { useState, useEffect } from "react";
import SelectedProducts from "../../components/SelectedProducts";
import OrderStatus from "./OrderStatus";
import { OrderTabControl, type OrderTabValue } from "./OrderTabControl";
import { ClientMessageList } from "./ClientMessageList";
import { Separator } from "@/components/ui/separator";
import { mapPaymentMethodLabel, type OrderStatus as OrderStatusType } from "@/app/(dashboard)/control/tiendas/[slug]/constants";
import { formatDateTime } from "@/app/utils/dates";
import { PaymentMethodType } from "@/app/(dashboard)/control/tiendas/[slug]/constants";

interface Message {
  id: number;
  message: string;
  createdAt: Date;
}

interface OrderDetailContentProps {
  order: {
    id: string;
    status: OrderStatusType | string;
    paymentMethodType: PaymentMethodType | null;
    createdAt: Date;
    branch: { id: string; name: string };
  };
  products: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
    price?: number;
  }>;
  messages: Message[];
  storeName: string;
  withPrices?: boolean;
  showBranchInfo?: boolean;
}

const getLastReadMessageKey = (orderId: string) => `lastReadMessage_${orderId}`;

export function OrderDetailContent({
  order,
  products,
  messages,
  storeName,
  withPrices = false,
  showBranchInfo = false,
}: OrderDetailContentProps) {
  const [activeTab, setActiveTab] = useState<OrderTabValue>("products");
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Calcular totales
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalAmount = withPrices
    ? products.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0)
    : 0;

  // Verificar mensajes no leídos al cargar
  useEffect(() => {
    if (messages.length === 0) {
      setHasUnreadMessages(false);
      return;
    }

    const lastReadId = localStorage.getItem(getLastReadMessageKey(order.id));
    const latestMessageId = messages[0]?.id;

    if (!lastReadId || Number(lastReadId) < latestMessageId) {
      setHasUnreadMessages(true);
    }
  }, [messages, order.id]);

  // Marcar como leído cuando se abre la pestaña de mensajes
  const handleTabChange = (tab: OrderTabValue) => {
    setActiveTab(tab);

    if (tab === "messages" && messages.length > 0) {
      const latestMessageId = messages[0]?.id;
      localStorage.setItem(
        getLastReadMessageKey(order.id),
        String(latestMessageId)
      );
      setHasUnreadMessages(false);
    }
  };

  return (
    <div className="flex flex-col py-8 gap-2">
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-normal text-gray-600">
            Detalles de la orden: #{order.id}
          </h1>
          {
            order.paymentMethodType && (
              <h2 className="text-xl font-normal text-gray-600">
                Método de pago: {mapPaymentMethodLabel(order.paymentMethodType)}
              </h2>
            )
          }
          
          <small>Creada el {formatDateTime(order.createdAt)}</small>
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

      <div className="flex flex-col gap-2 mt-4 mb-4">
        <Separator />
        <OrderTabControl
          value={activeTab}
          onChange={handleTabChange}
          hasUnreadMessages={hasUnreadMessages}
        />
      </div>

      {activeTab === "products" && (
        <>
          <SelectedProducts order={products} withPrices={withPrices} />

          {/* Footer con totales */}
          <div className="mt-6 pt-4">
            <Separator className="mb-4" />
            {withPrices ? (
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div className="sm:col-span-3 flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg">
                  <span className="text-lg font-medium text-foreground">
                    Total de productos
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {totalQuantity}
                  </span>
                </div>
                <div className="sm:col-span-2 flex items-center justify-between px-4 py-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-600">
                  <span className="text-xl text-foreground">
                    Total de la orden
                  </span>
                  <span className="text-xl font-medium text-emerald-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg">
                <span className="text-lg font-medium text-foreground">
                  Total de productos
                </span>
                <span className="text-2xl font-bold text-primary">
                  {totalQuantity}
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "messages" && (
        <ClientMessageList messages={messages} storeName={storeName} />
      )}
    </div>
  );
}
