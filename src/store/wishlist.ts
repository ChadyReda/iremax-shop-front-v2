import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { productApi, wishlistApi } from '@/services'
import type { Product } from '@/types'

interface WishlistStore {
  items:    Product[]
  set:      (items: Product[]) => void
  toggle:   (product: Product) => void
  includes: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      set:   (items: Product[]) => set({ items }),
      toggle: async (product: Product) => {
        const exists = get().items.some((p) => p.id === product.id)
        if (exists) {
          await wishlistApi.remove(product.id)
          set({ items: get().items.filter((p) => p.id !== product.id) })
        } else {
          await wishlistApi.add(product.id)
          // Fetch full product details to ensure we have all data
          const fullProduct = await productApi.byId(product.id)
          set({ items: [...get().items, fullProduct] })
        }
      },
      includes: (productId: string) => get().items.some((p) => p.id === productId),
    }),
    { name: 'wishlist' }
  )
)