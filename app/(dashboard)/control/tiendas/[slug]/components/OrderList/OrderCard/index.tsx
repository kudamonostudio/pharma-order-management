import { Order } from "@prisma/client";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../constants";
import { formatDate } from "@/app/(dashboard)/utils/dates";
import { OrderCollab } from "./OrderCollab";
import { mockCollaborators } from "@/app/mocks/collaborators";

type OrderCardProps = {
  order: Order;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const mockCollab = mockCollaborators.find(
    (collab) => collab.id === Number(order.profileId)
  );
  return (
    <div
      key={order.id}
      className={`p-4 border-2 rounded-lg flex justify-between items-center transition-all hover:opacity-80 backdrop-blur-sm ${getOrderStatusColor(
        order.status
      )}`}
    >
      <div className="flex gap-3 items-center">
        {mockCollab ? (
          <OrderCollab collab={mockCollab} key={order.profileId} />
        ) : null}
        <div>
          <h3 className="text-accent-foreground">{order.orderCode}</h3>
          {
            <p className="text-sm text-muted-foreground">
              {formatDate(order.date)}
            </p>
          }
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">
          {getOrderStatusLabel(order.status)}
        </p>
      </div>
    </div>
  );
};
