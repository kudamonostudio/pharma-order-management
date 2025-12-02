import { Order } from "@prisma/client";
import { getOrderStatusColor, getOrderStatusLabel } from "../../../constants";
import { formatDate } from "@/app/(dashboard)/utils/dates";
import { OrderCollab } from "./OrderCollab";
import { mockCollaborators } from "@/app/mocks/collaborators";
import { getCurrentProfile } from "@/lib/auth/session";

type OrderCardProps = {
  order: Order;
};

export const OrderCard = async ({ order }: OrderCardProps) => {
  const profile = await getCurrentProfile();
  const isAdminSupremo = profile?.role === "ADMIN_SUPREMO";

  const mockCollab = mockCollaborators.find(
    (collab) => collab.id === Number(order.profileId)
  );
  return (
    <div
      key={order.id}
      className={`p-4 border-2 rounded-lg flex justify-between items-center transition-all hover:cursor-pointer hover:opacity-90 backdrop-blur-sm ${getOrderStatusColor(
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
      {isAdminSupremo && <p>{order.branch.name}</p>}{" "}
      {/* TODO: CAMBIAR ESTO POR DATA VERDADERA */}
      <div className="text-right">
        <p className="text-sm font-medium">
          {getOrderStatusLabel(order.status)}
        </p>
      </div>
    </div>
  );
};
