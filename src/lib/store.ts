import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === item.productId);
        let newItems: CartItem[];
        if (existing) {
          newItems = items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          newItems = [...items, { ...item, id: crypto.randomUUID() }];
        }
        set({ items: newItems, total: computeTotal(newItems) });
      },
      removeItem: (productId) => {
        const newItems = get().items.filter(
          (i) => i.productId !== productId
        );
        set({ items: newItems, total: computeTotal(newItems) });
      },
      updateQuantity: (productId, quantity) => {
        const newItems = get().items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        set({ items: newItems, total: computeTotal(newItems) });
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    { name: "cart-storage" }
  )
);

interface WishlistStore {
  items: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const items = get().items;
        set({
          items: items.includes(productId)
            ? items.filter((i) => i !== productId)
            : [...items, productId],
        });
      },
      has: (productId) => get().items.includes(productId),
    }),
    { name: "wishlist-storage" }
  )
);
