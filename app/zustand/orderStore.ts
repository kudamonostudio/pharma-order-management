// store/orderStore.ts
import { create } from "zustand";

interface StoreProductItem {
  id: string;
  name: string;
  image: string;
  description: string;
  price?: number;
}

interface OrderProduct extends StoreProductItem {
  quantity: number;
}

interface OrderState {
  order: OrderProduct[];
  currentStoreId: number | null;
  setStoreId: (storeId: number) => void;
  addProduct: (product: StoreProductItem) => void;
  removeProduct: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  getOrderQuantity: () => number;
  getOrderTotal: () => number;
  clearOrder: () => void;
}

const getStoreOrderKey = (storeId: number) => `order_store_${storeId}`;

const getOrderForStore = (storeId: number): OrderProduct[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(getStoreOrderKey(storeId));
  return stored ? JSON.parse(stored) : [];
};

const saveOrderForStore = (storeId: number, order: OrderProduct[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(getStoreOrderKey(storeId), JSON.stringify(order));
};

export const useOrderStore = create<OrderState>((set, get) => ({
  order: [],
  currentStoreId: null,

  setStoreId: (storeId) =>
    set(() => {
      const order = getOrderForStore(storeId);
      return { currentStoreId: storeId, order };
    }),

  addProduct: (product) =>
    set((state) => {
      if (!state.currentStoreId) return state;

      const exists = state.order.find((p) => p.id === product.id);
      let updatedOrder;

      if (exists) {
        updatedOrder = state.order.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        updatedOrder = [...state.order, { ...product, quantity: 1 }];
      }

      saveOrderForStore(state.currentStoreId, updatedOrder);
      return { order: updatedOrder };
    }),

  removeProduct: (id) =>
    set((state) => {
      if (!state.currentStoreId) return state;

      const updatedOrder = state.order.filter((p) => p.id !== id);
      saveOrderForStore(state.currentStoreId, updatedOrder);
      return { order: updatedOrder };
    }),

  increment: (id) =>
    set((state) => {
      if (!state.currentStoreId) return state;

      const updatedOrder = state.order.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p
      );
      saveOrderForStore(state.currentStoreId, updatedOrder);
      return { order: updatedOrder };
    }),

  decrement: (id) =>
    set((state) => {
      if (!state.currentStoreId) return state;

      const updatedOrder = state.order
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0);

      saveOrderForStore(state.currentStoreId, updatedOrder);
      return { order: updatedOrder };
    }),

  getOrderQuantity: () => {
    const currentOrder = get().order;
    return currentOrder.reduce((total, item) => total + item.quantity, 0);
  },

  getOrderTotal: () => {
    const currentOrder = get().order;
    return currentOrder.reduce((total, item) => {
      const price = item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  },

  clearOrder: () =>
    set((state) => {
      if (!state.currentStoreId) return state;

      saveOrderForStore(state.currentStoreId, []);
      return { order: [] };
    }),
}));
