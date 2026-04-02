import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, User, Menu, X, ChevronDown , Heart} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { authApi } from '@/services'
import { toast } from '@/components/ui/Toast'
import { useWishlistStore } from '@/store/wishlist'

const NAV = [
  { label: 'Shop All', href: '/shop' },
  {
    label: 'Clothing',
    children: [
      { label: 'Dresses',       href: '/shop?category=dresses' },
      { label: 'Tops & Blouses',href: '/shop?category=tops-blouses' },
      { label: 'Bottoms',       href: '/shop?category=bottoms' },
      { label: 'Pajamas',       href: '/shop?category=pajamas' },
    ],
  },
  {
    label: 'Beauty',
    children: [
      { label: 'Makeup',    href: '/shop?category=makeup' },
      { label: 'Skincare',  href: '/shop?category=skincare' },
      { label: 'Haircare',  href: '/shop?category=haircare' },
    ],
  },
  {
    label: 'Accessories',
    children: [
      { label: 'Bags & Handbags', href: '/shop?category=bags-and-handbags' },
      { label: 'Shoes',           href: '/shop?category=shoes' },
      { label: 'Accessories',     href: '/shop?category=accessories' },
    ],
  },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ]                   = useState('')
  const [scrolled, setScrolled]     = useState(false)
  const [drop, setDrop]             = useState<string | null>(null)

  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore()
  const itemCount = useCartStore((s) => s.itemCount())
  const openCart  = useCartStore((s) => s.open)
  const wishCount = useWishlistStore((s) => s.items.length)
  
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = async () => {
    await authApi.logout()
    logout()
    navigate('/')
    toast('Signed out', 'success')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      navigate(`/shop?search=${encodeURIComponent(q.trim())}`)
      setSearchOpen(false)
      setQ('')
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'border-b border-stone-100'
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-stone-900 text-stone-300 text-center py-2 text-[11px] tracking-widest uppercase">
       
      </div>

      <div className="page">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 -ml-2 text-stone-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500 }}
            className="text-2xl md:text-3xl tracking-[.12em] uppercase text-stone-900"
          >
            IREMAX
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDrop(item.label)}
                onMouseLeave={() => setDrop(null)}
              >
                {'children' in item ? (
                  <>
                    <button className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors">
                      {item.label}
                      <ChevronDown
                        size={13}
                        className={`transition-transform ${
                          drop === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {drop === item.label && (
                      <div className="absolute top-full left-0 mt-0 w-44 bg-white border border-stone-100 shadow-xl animate-fade-in py-2">
                        {item.children.map((c) => (
                          <Link
                            key={c.label}
                            to={c.href}
                            className="block px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                            onClick={() => setDrop(null)}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="text-sm text-stone-500 hover:text-stone-900 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <Search size={19} />
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2.5 text-stone-500 hover:text-stone-900 transition-colors">
                  <User size={19} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-stone-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 py-2">
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">Hello,</p>
                    <p className="text-sm font-semibold text-stone-900">{user?.firstName}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2.5 text-sm text-brand-600 font-medium hover:bg-stone-50">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50">
                    My Orders
                  </Link>
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-2.5 text-stone-500 hover:text-stone-900 transition-colors"
              >
                <User size={19} />
              </Link>
            )}
            <Link
              to="/wishlist"
              className="p-2.5 text-stone-500 hover:text-stone-900 transition-colors relative"
            >
              <Heart size={19} />
              {wishCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
                onClick={() => useCartStore.getState().open()}
                className="relative p-2.5 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-stone-100 py-4 animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl">
              <Search size={16} className="text-stone-400" />
              <input
                autoFocus
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 text-sm outline-none bg-transparent"
              />
              {q && (
                <button type="button" onClick={() => setQ('')}>
                  <X size={14} className="text-stone-400" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-stone-100 bg-white max-h-[80vh] overflow-y-auto">
          <div className="page py-5 space-y-1">
            {NAV.map((item) => (
              <div key={item.label}>
                {'children' in item ? (
                  <>
                    <p className="text-xs uppercase tracking-widest text-stone-400 font-medium mt-4 mb-2">
                      {item.label}
                    </p>
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        className="block py-1.5 text-sm text-stone-700"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="block py-1.5 text-sm font-medium text-stone-900"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="border-t border-stone-100 mt-4 pt-4">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="block py-1.5 text-sm text-brand-600 font-medium" onClick={() => setMobileOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="block py-1.5 text-sm text-stone-700" onClick={() => setMobileOpen(false)}>My Profile</Link>
                  <Link to="/orders"  className="block py-1.5 text-sm text-stone-700" onClick={() => setMobileOpen(false)}>My Orders</Link>
                  <button onClick={handleLogout} className="block py-1.5 text-sm text-red-600 w-full text-left">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="block py-1.5 text-sm text-stone-700" onClick={() => setMobileOpen(false)}>
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}