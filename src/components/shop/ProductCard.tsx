import { useWishlistStore } from '@/store/wishlist'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'
import type { Product } from '@/types'
import { fmt, primaryImage, discountPct } from '@/utils'
import { Stars } from '@/components/ui/Stars'
import { toast } from '@/components/ui/Toast'

interface Props {
  product: Product
  onAdd?: (p: Product) => void
  delay?: number
}

export function ProductCard({ product, onAdd, delay = 0 }: Props) {
  const wished  = useWishlistStore((s) => s.includes(product._id))
  const toggle  = useWishlistStore((s) => s.toggle)
  const img        = primaryImage(product)
  const disc       = discountPct(product)
  const stock      = product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0
  const outOfStock = stock === 0

  const handleWish = () => {
    toggle(product)
    toast(
      wished ? 'Removed from wishlist' : 'Added to wishlist ❤️',
      'info'
    )
  }

  return (
    <article
      className="group animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] mb-3">
        <Link to={`/products/${product.slug}`}>
          {img ? (
            <img
              src={img.url}
              alt={img.alt || product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={32} className="text-stone-300" />
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {disc > 0 && (
            <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              -{disc}%
            </span>
          )}
          {product.isNewArrival && !disc && (
            <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              New
            </span>
          )}
          {outOfStock && (
            <span className="bg-stone-400 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWish}
          className="absolute top-3 right-3 p-2 bg-white/80 transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart
            size={14}
            className={wished ? 'fill-red-500 text-red-500' : 'text-stone-400'}
          />
        </button>

        {/* Quick add */}
        {!outOfStock && onAdd && (
          <button
            onClick={() => onAdd(product)}
            className="absolute bottom-0 inset-x-0 bg-stone-900 text-white text-xs font-medium py-3 uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 hover:bg-brand-700"
          >
            <ShoppingBag size={12} /> Quick Add
          </button>
        )}
      </div>

      {/* Info */}
      <div>
        {product.category && (
          <p className="eyebrow mb-1 text-[10px]">{product.category.name}</p>
        )}
        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-medium text-stone-800 hover:text-stone-500 transition-colors line-clamp-2 leading-snug block mb-1.5"
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-900">
              {fmt(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-stone-400 line-through">
                {fmt(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.reviewCount > 0 && (
            <Stars
              rating={product.averageRating}
              count={product.reviewCount}
              size={11}
            />
          )}
        </div>
        {stock > 0 && stock <= 5 && (
          <p className="text-[11px] text-brand-600 font-medium mt-1">
            Only {stock} left
          </p>
        )}
      </div>
    </article>
  )
}