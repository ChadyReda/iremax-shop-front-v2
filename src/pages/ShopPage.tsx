import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, X } from 'lucide-react'
import { productApi, categoryApi } from '@/services'
import { ProductCard } from '@/components/shop/ProductCard'
import { Pager } from '@/components/ui/Pagination'
import { Spinner } from '@/components/ui/Spinner'
import { Empty } from '@/components/ui/Empty'
import { ShoppingBag } from 'lucide-react'
import type { ProductFilters } from '@/types'

interface FiltersProps {
  cats?: { _id: string; name: string; slug: string }[]
  hasFilters: boolean
  clearAll: () => void
  category?: string
  set: (k: string, v: string | null) => void
  price: { min: number | undefined; max: number | undefined }
  setPrice: React.Dispatch<React.SetStateAction<{ min: number | undefined; max: number | undefined }>>
  sizes: string[]
  toggleSize: (s: string) => void
  params: URLSearchParams
}

function Filters({ cats, hasFilters, clearAll, category, set, price, setPrice, sizes, toggleSize, params }: FiltersProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-700">
          Filter
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-stone-400 hover:text-brand-600 flex items-center gap-1"
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="label mb-3">Category</p>
        <div className="space-y-1">
          <button
            onClick={() => set('category', null)}
            className={`block text-sm py-1 w-full text-left ${
              !category ? 'text-stone-900 font-medium' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            All Products
          </button>
          {cats?.map((c) => (
            <button
              key={c._id}
              onClick={() => set('category', c.slug === category ? null : c.slug)}
              className={`block text-sm py-1 w-full text-left ${
                c.slug === category
                  ? 'text-stone-900 font-medium'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="label mb-3">Price Range</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={price.min || ''}
            onChange={(e) => setPrice({ ...price, min: Number(e.target.value) || undefined })}
            className="input w-full text-sm py-2"
          />
          <span className="text-stone-400 text-sm">–</span>
          <input
            type="number"
            placeholder="Max"
            value={price.max || ''}
            onChange={(e) => setPrice({ ...price, max: Number(e.target.value) || undefined })}
            className="input w-full text-sm py-2"
          />
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="label mb-3">Size</p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                sizes.includes(s)
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'border-stone-200 text-stone-600 hover:border-stone-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Quick filters */}
      <div>
        <p className="label mb-3">Quick Filters</p>
        <div className="space-y-2">
          {[
            ['featured',   'Featured Only'],
            ['newArrival', 'New Arrivals'],
          ].map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={params.get(k) === 'true'}
                onChange={(e) => set(k, e.target.checked ? 'true' : null)}
                className="w-4 h-4 border-stone-300"
              />
              <span className="text-sm text-stone-600">{l}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '37', '38', '39', '40']

const SORTS = [
  { v: 'newest',     l: 'Newest' },
  { v: 'popular',    l: 'Most Popular' },
  { v: 'rating',     l: 'Top Rated' },
  { v: 'price_asc',  l: 'Price ↑' },
  { v: 'price_desc', l: 'Price ↓' },
]

export default function ShopPage() {
  const [params, setParams] = useSearchParams()
  const [sidebar, setSidebar] = useState(false)

  const get = (k: string) => params.get(k) || undefined

  const category   = get('category')
  const search     = get('search')
  const sort       = (get('sort') || 'newest') as ProductFilters['sort']
  const page       = parseInt(params.get('page') || '1')
  const featured   = params.get('featured') === 'true'
  const newArrival = params.get('newArrival') === 'true'
  const sizes      = params.get('sizes')?.split(',').filter(Boolean) ?? []
  const minPrice   = params.get('minPrice') ? Number(params.get('minPrice')) : undefined
  const maxPrice   = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined



  const filters: ProductFilters = {
    category,
    search,
    sort,
    page,
    limit: 20,
    featured:   featured   || undefined,
    newArrival: newArrival || undefined,
    sizes:      sizes.length ? sizes : undefined,
    minPrice,
    maxPrice,
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey:        ['products', filters],
    queryFn:         () => productApi.list(filters),
    placeholderData: (p) => p,
  })

  const { data: cats } = useQuery({
    queryKey: ['categories'],
    queryFn:  categoryApi.list,
  })

  const [price, setPrice] = useState({ min: minPrice, max: maxPrice })

  useEffect(() => {
    setPrice({ min: minPrice, max: maxPrice })
  }, [minPrice, maxPrice])

  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    v ? n.set(k, v) : n.delete(k)
    n.delete('page')
    setParams(n)
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (price.min !== minPrice) set('minPrice', price.min ? String(price.min) : null)
      if (price.max !== maxPrice) set('maxPrice', price.max ? String(price.max) : null)
    }, 700) // Debounce delay

    return () => clearTimeout(handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price])

  const toggleSize = (s: string) => {
    const arr = new Set(sizes)
    arr.has(s) ? arr.delete(s) : arr.add(s)
    set('sizes', arr.size ? [...arr].join(',') : null)
  }

  const clearAll = () => {
    const n = new URLSearchParams()
    if (sort !== 'newest') n.set('sort', sort as string)
    setParams(n)
  }

  const hasFilters = !!(
    search || category || minPrice || maxPrice ||
    sizes.length || featured || newArrival
  )

  const title = search
    ? `"${search}"`
    : category
    ? cats?.find((c) => c.slug === category)?.name || category
    : featured    ? 'Featured'
    : newArrival  ? 'New Arrivals'
    : 'All Products'



  return (
    <div className="page py-10">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            className="text-3xl font-normal"
          >
            {title}
          </h1>
          {data && (
            <p className="text-sm text-stone-400 mt-1">
              {data.pagination.total} products
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebar(!sidebar)}
            className="lg:hidden btn btn-outline btn-sm gap-2"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => set('sort', e.target.value)}
            className="input py-2 text-sm w-40 appearance-none"
          >
            {SORTS.map((s) => (
              <option key={s.v} value={s.v}>{s.l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <Filters {...{ cats, hasFilters, clearAll, category, set, price, setPrice, sizes, toggleSize, params }} />
        </aside>

        {/* Mobile sidebar */}
        {sidebar && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
              onClick={() => setSidebar(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-6 overflow-y-auto lg:hidden animate-fade-up">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium text-stone-900">Filters</h2>
                <button onClick={() => setSidebar(false)}>
                  <X size={18} />
                </button>
              </div>
              <Filters {...{ cats, hasFilters, clearAll, category, set, price, setPrice, sizes, toggleSize, params }} />
            </div>
          </>
        )}

        {/* Products */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <Spinner full />
          ) : !data?.data.length ? (
            <Empty
              icon={<ShoppingBag size={44} />}
              title="No products found"
              desc="Try adjusting your filters or search terms."
              action={
                <button onClick={clearAll} className="btn btn-outline btn-sm">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <div
                className={`transition-opacity duration-200 ${
                  isFetching ? 'opacity-60' : ''
                } product-grid`}
              >
                {data.data.map((p, i) => (
                  <ProductCard key={p.id} product={p} delay={i * 40} />
                ))}
              </div>
              {data.pagination && (
                <Pager
                  p={data.pagination}
                  onChange={(n) => set('page', String(n))}
                />
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}