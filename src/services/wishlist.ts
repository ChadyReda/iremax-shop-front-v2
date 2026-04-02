import { api } from './api'
import type { Product, ApiRes } from '../types'

export const wishlistApi = {
  get: async () => {
    const res = await api.get<ApiRes<Product[]>>('/wishlist')
    return res.data.data
  },

  add: async (productId: string) => {
    const res = await api.post<ApiRes<any>>(`/wishlist/${productId}`)
    return res.data
  },

  remove: async (productId: string) => {
    const res = await api.delete<ApiRes<any>>(`/wishlist/${productId}`)
    return res.data
  },
}