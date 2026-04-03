import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { productApi, wishlistApi } from '@/services'
import type { Product } from '@/types'

interface WishlistStore {
  items:    Product[]
  set:      (items: Product[]) => void
  toggle:   (product: Product) => void
  includes: (productId: string) => boolean
  clear:    () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      set:   (items: Product[]) => set({ items }),
      toggle: async (product: Product) => {
        const id = product.id || product._id
        const exists = get().items.some((p) => (p.id || p._id) === id)
        if (exists) {
          await wishlistApi.remove(id)
          set({ items: get().items.filter((p) => (p.id || p._id) !== id) })
        } else {
          await wishlistApi.add(id)
          const fullProduct = await productApi.byId(id)
          set({ items: [...get().items, fullProduct] })
        }
      },
      includes: (productId: string) => get().items.some((p) => (p.id || p._id) === productId),
      clear:    () => set({ items: [] }),
    }),
    { name: 'wishlist' }
  )
)