"use client";

import { useState } from "react";
import { PackageCheck, UserPen } from "lucide-react";
import {
  type OrderStatus as OrderStatusType,
  getOrderStatusColor,
} from "@/app/(dashboard)/control/tiendas/[slug]/constants";
import { OrderDetailModalProducts } from "../OrderDetailModalProducts";
import OrderStatusModal from "./OrderStatusModal";
import { formatDateTime } from "@/app/utils/dates";
import { OrderCollab } from "../../OrderCollab";
import { Separator } from "@/components/ui/separator";
import { ModalControl, type ModalControlValue } from "./ModalControl";
import { OrderInStore } from "@/shared/types/store";
import { MessageList } from "./Messages/MessageList";
import { Button } from "@/components/ui/button";
import { AssignCollaboratorToOrderModal } from "./AssignCollaboratorToOrderModal";
import { UpdateOrderStatusModal } from "./UpdateOrderStatusModal";
import { HistoryEventCard } from "./history/HistoryEventCard";
import { OrderHistoryList } from "./history/OrderHistoryList";
import MessageInput from "./Messages/MessageInput";
import { createOrderMessage } from "./Messages/actions";
import { MessageType } from "@prisma/client";
import { MessageBasic } from "@/shared/types/store";
import { LinkToOrder } from "../../../../../colaboradores/LinkToOrder";
import Image from "next/image";
import Link from "next/link";

interface AvailableCollaborator {
  id: number;
  code: string | null;
  firstName: string;
  lastName: string;
  image: string | null;
  isActive: boolean;
}

interface OrderDetailModalContentProps {
  order: OrderInStore;
  products: Array<{
    id: string;
    name: string;
    image?: string;
    quantity: number;
  }>;
  storeSlug: string;
  availableCollaborators: AvailableCollaborator[];
  withPrices: boolean;
  onOrderUpdated?: (orderId: number, newStatus: OrderStatusType) => void;
  onCollaboratorAssigned?: (orderId: number, collaboratorId: number) => void;
}

export function OrderDetailModalContent({
  order,
  products,
  storeSlug,
  availableCollaborators,
  withPrices,
  onOrderUpdated,
  onCollaboratorAssigned,
}: OrderDetailModalContentProps) {
  const [controlValue, setControlValue] =
    useState<ModalControlValue>("products");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [messages, setMessages] = useState<MessageBasic[]>(
    order.messages || []
  );
  const statusColor = getOrderStatusColor(order.status as OrderStatusType);
  const collaborator = order.collaborator;

  const handleMessageSent = async (messageData: {
    message: string;
    orderId: number;
    collaboratorId: number;
    type: MessageType;
  }) => {
    try {
      const newMessage = await createOrderMessage(
        messageData.orderId,
        messageData.collaboratorId,
        messageData.message,
        messageData.type
      );

      // Convert OrderMessageResponse to MessageBasic format and add to the list
      const messageBasic: MessageBasic = {
        id: newMessage.id,
        type: newMessage.type,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
        collaborator: {
          id: newMessage.collaborator.id,
          firstName: newMessage.collaborator.firstName,
          lastName: newMessage.collaborator.lastName,
          image: newMessage.collaborator.image,
        },
      };

      // Add new message to the list (prepend since messages are sorted by newest first)
      setMessages((prevMessages) => [messageBasic, ...prevMessages]);
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  console.log("@@Order", { order });

  return (
    <div className="flex flex-col ">
      <div className={`w-full h-4 ${statusColor}`} />
      <div className="flex flex-col p-8 gap-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 items-center">
              <h1 className="text-2xl font-bold text-accent-foreground/85">
                #{order.code ?? order.id}
              </h1>
              <OrderStatusModal status={order.status} variant="small" />
              <LinkToOrder store={storeSlug} orderId={order.id} />
            </div>
            <span className="text-sm">
              Creada el {formatDateTime(order.createdAt)}
            </span>
            <h3 className="text-base font-normal">
              Retira en la sucursal:{" "}
              <span className="text-accent-foreground font-medium">
                {order.location?.name ?? "Sin asignar"}
              </span>
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm">
                Cliente:{" "}
                <span className="text-accent-foreground font-medium">
                 {order.fullname}
                </span>
              </p>
              <Link
                  href={`https://wa.me/+598${order.phoneContact}?text=Hola%20${order.fullname}!%20Tu orden está lista para retirar, ${order.location?.name}. Gracias!`}
                  className="flex gap-1 hover:scale-110 transition-transform duration-200"
                  target="_blank"
                >
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Image 
                  src="/whatsapp.svg" 
                  alt="WhatsApp" 
                  width={24} 
                  height={24}
                  className="h-5 w-5"
                />
                <p>{order.phoneContact}</p>
              </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end gap-6">
            {/* <OrderStatusModal status={order.status} variant="small"/> */}
            <Button
              variant={"outline"}
              onClick={() => {
                if (order.collaborator) {
                  setIsUpdateStatusModalOpen(true);
                } else {
                  setIsAssignModalOpen(true);
                }
              }}
            >
              {order.collaborator ? (
                <>
                  Actualizar estado
                  <PackageCheck className="h-6 w-6" />
                </>
              ) : (
                <>
                  Asignar colaborador
                  <UserPen className="h-6 w-6" />
                </>
              )}
            </Button>
            <div className="flex items-center gap-2">
              {collaborator && (
                <OrderCollab collab={collaborator} key={collaborator.id} />
              )}
              <div>
                {collaborator?.firstName && (
                  <p className="text-sm">Gestiona:</p>
                )}
                {collaborator && (
                  <>
                    <span className="text-accent-foreground font-medium text-center">
                      {collaborator.firstName} {collaborator.lastName}
                    </span>
                    {order.status !== "ENTREGADA" && (
                      <small
                        className="underline block cursor-pointer"
                        onClick={() => setIsAssignModalOpen(true)}
                      >
                        Cambiar
                      </small>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4 mb-4">
          <Separator />
          <ModalControl value={controlValue} onChange={setControlValue} />
        </div>
        {controlValue === "products" && (
          <OrderDetailModalProducts
            order={order.items}
            withPrices={withPrices}
          />
        )}
        <div
          className={controlValue === "internal-messages" ? "block" : "hidden"}
        >
          <MessageList messages={messages} type="INTERN" />
        </div>
        <div
          className={controlValue === "client-messages" ? "block" : "hidden"}
        >
          <MessageList messages={messages} type="TO_CLIENT" />
        </div>
        <div className={controlValue === "history" ? "block" : "hidden"}>
          <div className="flex flex-col gap-2">
            <HistoryEventCard label="Orden creada" date={order.createdAt} />
            <OrderHistoryList history={order.history ?? []} />
          </div>
        </div>
      </div>

      {/* Fixed Footer for Products - only show when viewing products with prices */}
      {controlValue === "products" &&
        withPrices &&
        (() => {
          const totalQuantity = order.items.reduce(
            (sum: number, product: any) => sum + (product.quantity || 0),
            0
          );
          const totalAmount = order.items.reduce(
            (sum: number, product: any) => {
              const price = product.price || 0;
              return sum + price * (product.quantity || 0);
            },
            0
          );

          return (
            <div className="fixed w-full bottom-0 bg-background p-4">
              <div className="max-w-4xl mx-auto">
                <Separator className="mb-4" />
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-3 flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg">
                    <span className="text-lg font-medium text-foreground">
                      Total de productos
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {totalQuantity}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between px-4 py-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-600">
                    <span className="text-xl text-foreground">
                      Total de la orden
                    </span>
                    <span className="text-xl font-medium text-emerald-600">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Fixed Message Input Footer - only show when viewing messages */}
      {(controlValue === "internal-messages" ||
        controlValue === "client-messages") && (
        <div className="fixed w-full bottom-0 bg-background border-t p-4">
          <MessageInput
            orderId={order.id}
            messageType={
              controlValue === "internal-messages" ? "INTERN" : "TO_CLIENT"
            }
            availableCollaborators={availableCollaborators}
            onMessageSent={handleMessageSent}
          />
        </div>
      )}

      <AssignCollaboratorToOrderModal
        open={isAssignModalOpen}
        onOpenChange={setIsAssignModalOpen}
        orderId={order.id}
        orderCode={order.code}
        storeSlug={storeSlug}
        locationId={order.location?.id ?? null}
        currentCollaboratorId={order.collaborator?.id}
        availableCollaborators={availableCollaborators}
        onCollaboratorAssigned={onCollaboratorAssigned}
      />
      {order.collaborator && (
        <UpdateOrderStatusModal
          open={isUpdateStatusModalOpen}
          onOpenChange={setIsUpdateStatusModalOpen}
          orderId={order.id}
          orderCode={order.code}
          currentStatus={order.status as OrderStatusType}
          currentCollaboratorId={order.collaborator?.id}
          availableCollaborators={availableCollaborators}
          onOrderUpdated={onOrderUpdated}
        />
      )}
    </div>
  );
}
