import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ShopifyProduct } from "@/lib/shopify";

interface WishlistStore {
  items: ShopifyProduct[];
  toggle: (p: ShopifyProduct) => boolean;
  has: (handle: string) => boolean;
  remove: (handle: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) => {
        const exists = get().has(p.node.handle);
        set({ items: exists ? get().items.filter((i) => i.node.handle !== p.node.handle) : [...get().items, p] });
        return !exists;
      },
      has: (handle) => get().items.some((i) => i.node.handle === handle),
      remove: (handle) => set({ items: get().items.filter((i) => i.node.handle !== handle) }),
    }),
    { name: "celestia-wishlist", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
