// store/orderStore.ts
import { create } from "zustand";

interface StoreProductItem {
  id: string;
  name: string;
  image: string;
  description: string;
}

interface OrderProduct extends StoreProductItem {
  quantity: number;
}

interface OrderState {
  order: OrderProduct[];
  addProduct: (product: StoreProductItem) => void;
  removeProduct: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  getOrderQuantity: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  order:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("order") || "[]")
      : [],

  addProduct: (product) =>
    set((state) => {
      const exists = state.order.find((p) => p.id === product.id);
      let updatedOrder;

      if (exists) {
        updatedOrder = state.order.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        updatedOrder = [...state.order, { ...product, quantity: 1 }];
      }

      localStorage.setItem("order", JSON.stringify(updatedOrder));
      return { order: updatedOrder };
    }),

  removeProduct: (id) =>
    set((state) => {
      const updatedOrder = state.order.filter((p) => p.id !== id);
      localStorage.setItem("order", JSON.stringify(updatedOrder));
      return { order: updatedOrder };
    }),

  increment: (id) =>
    set((state) => {
      const updatedOrder = state.order.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p
      );
      localStorage.setItem("order", JSON.stringify(updatedOrder));
      return { order: updatedOrder };
    }),

  decrement: (id) =>
    set((state) => {
      const updatedOrder = state.order
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0);

      localStorage.setItem("order", JSON.stringify(updatedOrder));
      return { order: updatedOrder };
    }),
  getOrderQuantity: () => {
    const currentOrder = get().order;
    return currentOrder.reduce((total, item) => total + item.quantity, 0);
  },
}));
