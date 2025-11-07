"use client";

import { getOrderStatusColor, getOrderStatusLabel, type OrderStatus } from "../constants";

interface Order {
  id: number;
  code: string;
  date: string;
  status: OrderStatus;
  total: number;
}

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className={`p-4 border-2 rounded-lg flex justify-between items-center transition-all hover:opacity-80 backdrop-blur-sm ${getOrderStatusColor(
            order.status
          )}`}
        >
          <div>
            <h3 className="font-semibold">{order.code}</h3>
            <p className="text-sm text-muted-foreground">{order.date}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">${order.total.toFixed(2)}</p>
            <p className="text-sm font-medium">{getOrderStatusLabel(order.status)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
