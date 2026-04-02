import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Star } from 'lucide-react'
import { productApi, categoryApi } from '@/services'
import { ProductCard } from '@/components/shop/ProductCard'
import { Spinner } from '@/components/ui/Spinner'
import { useReveal } from '@/hooks/useReveal'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from '@/components/ui/Toast'



export default function HomePage() {
  const { data: featured, isLoading: lf } = useQuery({
    queryKey: ['featured'],
    queryFn:  () => productApi.featured(4),
  })

  const { data: newArr, isLoading: ln } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn:  () => productApi.newArrivals(4),
  })

  const { data: cats } = useQuery({
    queryKey: ['categories'],
    queryFn:  categoryApi.list,
  })

  useReveal()

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('orderSuccess') === '1') {
      toast('Your order has been placed! We will contact you soon 🎉', 'success')
      setSearchParams({})
    }
  }, [])

  return (
    <div>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative h-[92vh] min-h-[600px] overflow-hidden">
        <img
          src="/background-home.jpg"
          alt="IREMAX COLLECTION"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/50 to-stone-950/10" />
        <div className="relative h-full flex items-center">
          <div className="page w-full">
            <div className="max-w-2xl pl-0 md:pl-8 lg:pl-16">
              <p className="eyebrow text-stone-300 mb-5 animate-fade-up">
                New Collection — 2026
              </p>
              <h1
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white mb-6 animate-fade-up leading-[1.05]"
              >
                Each accessory 
                <br />
                <em className="text-brand-300 not-italic">is choosen by purpose</em>
              </h1>
              <p className="text-stone-300 text-base md:text-lg font-light leading-relaxed mb-8 animate-fade-up max-w-lg">
                Thoughtfully curated fashion and beauty for women who live with intention.
              </p>
              <div className="flex flex-wrap gap-3 animate-fade-up">
                <Link to="/shop" className="btn btn-brand btn-lg px-8 md:px-12">
                  Shop Collection
                </Link>
                <Link
                  to="/shop?newArrival=true"
                  className="btn btn-lg border border-white/30 text-white hover:bg-white/10 px-8 md:px-12"
                >
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────── */}
      <section className="bg-stone-900 text-stone-300 reveal">
        <div className="page py-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {[
              ['Free Shipping',   'On orders over $100'],
              ['Secure Checkout', 'SSL encrypted'],
              ['Quality Curated', 'Expert-selected'],
            ].map(([t, s]) => (
              <div key={t}>
                <p className="text-sm font-medium text-white">{t}</p>
                <p className="text-xs text-stone-500 mt-0.5">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────── */}
      <section className="page py-16 md:py-20 reveal">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="eyebrow mb-2">Browse by Category</p>
            <h2
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              className="text-3xl md:text-4xl font-normal"
            >
              Shop Your World
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            All categories <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {cats?.filter((c) => c.isActive).slice(0, 6).map((cat, i) => (
            <Link
              key={cat.id || cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-stone-100">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200">
                    <span className="text-stone-400 text-[10px] uppercase tracking-widest text-center px-2">
                      {cat.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                <p className="text-white text-xs md:text-sm font-semibold">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────── */}
      <section className="bg-stone-50 py-16 md:py-20 reveal">
        <div className="page">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p className="eyebrow mb-2">Hand-picked for you</p>
              <h2
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                className="text-3xl md:text-4xl font-normal"
              >
                Featured Pieces
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="hidden md:flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {lf ? (
            <Spinner full />
          ) : (
            <div className="product-grid">
              {featured?.map((p, i) => (
                <ProductCard key={p.id || p._id} product={p} delay={i * 80} />
              ))}
            </div>
          )}
          <div className="text-center mt-8 md:mt-10">
            <Link to="/shop" className="btn btn-outline">
              View Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL SPLIT ──────────────────────── */}
      <section className="grid md:grid-cols-2 min-h-[400px] md:min-h-[500px] reveal">
        <div className="relative overflow-hidden min-h-[250px] md:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=85"
            alt="Skincare"
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
        </div>
        <div className="bg-stone-900 text-white flex items-center p-8 md:p-12 lg:p-16">
          <div>
            <p className="eyebrow text-stone-400 mb-4">New in Beauty</p>
            <h2
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              className="text-3xl lg:text-4xl font-normal mb-5 leading-snug"
            >
              Your skin,
              <br />
              your ritual
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-xs">
              Curated skincare and makeup. Science-backed formulas. Real results.
            </p>
            <Link
              to="/shop?category=skincare"
              className="btn border border-stone-600 text-stone-200 hover:bg-stone-700 hover:border-stone-700"
            >
              Shop Skincare
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────── */}
      <section className="page py-16 md:py-20 reveal">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="eyebrow mb-2">Just landed</p>
            <h2
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              className="text-3xl md:text-4xl font-normal"
            >
              New Arrivals
            </h2>
          </div>
          <Link
            to="/shop?newArrival=true"
            className="hidden md:flex items-center gap-2 text-sm text-stone-500 hover:text-stone-900"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>
        {ln ? (
          <Spinner full />
        ) : (
          <div className="product-grid">
            {newArr?.map((p, i) => (
              <ProductCard key={p.id || p._id} product={p} delay={i * 80} />
            ))}
          </div>
        )}
        <div className="text-center mt-8 md:hidden">
          <Link to="/shop?newArrival=true" className="btn btn-outline btn-sm">
            See All New Arrivals
          </Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="bg-stone-950 py-16 md:py-20 text-white text-center reveal">
        <div className="page">
          <p className="eyebrow text-stone-500 mb-4">Limited time</p>
          <h2
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
            className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4"
          >
            15% off 
          </h2>
          <p className="text-stone-400 mb-8 text-sm">
            
            
          </p>
          <Link to="/register" className="btn btn-brand btn-lg">
            Create Account
          </Link>
        </div>
      </section>

    </div>
  )
}