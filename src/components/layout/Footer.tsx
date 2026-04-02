import { Link } from 'react-router-dom'
import { Instagram, Phone, Mail, MapPin } from 'lucide-react'

const LINKS = {
  Shop: [
    { label: 'New Arrivals',   href: '/shop?newArrival=true' },
    { label: 'Clothing',       href: '/shop?category=clothing' },
    { label: 'Beauty',         href: '/shop?category=makeup' },
    { label: 'Accessories',    href: '/shop?category=accessories' },
    { label: 'Pajamas',        href: '/shop?category=pajamas' },
  ],
  Help: [
    { label: 'How to Order',   href: '#' },
    { label: 'Shipping Info',  href: '#' },
    { label: 'Returns',        href: '#' },
    { label: 'Size Guide',     href: '#' },
    { label: 'Contact Us',     href: '#' },
  ],
  Company: [
    { label: 'About IREMAX',    href: '#' },
    { label: 'Our Story',      href: '#' },
    { label: 'Sustainability',  href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">

      {/* Main footer */}
      <div className="page py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2">
            <Link
              to="/"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
              className="text-2xl text-white tracking-[.12em] uppercase"
            >
              Remax
            </Link>
            <p className="mt-4 text-sm text-stone-500 max-w-xs leading-relaxed">
              Accessoires
            </p>

            {/* Contact info */}
            <div className="mt-5 space-y-2">
              <a
                href="https://wa.me/212600000000"
                className="flex items-center gap-2 text-sm text-stone-500 hover:text-white transition-colors"
              >
                <Phone size={14} />
                +212 6 69 99 82 38
              </a>
              <a
                href="mailto:contact@elara.ma"
                className="flex items-center gap-2 text-sm text-stone-500 hover:text-white transition-colors"
              >
                
              </a>
              <div className="w-full h-48 mt-4">
                <iframe
                  className="w-full h-full rounded-md"
                  src="https://maps.google.com/maps?q=Rue%20bachir%20laalej%20n%2013%20boulevard%20abdelmoumen,%20Casablanca,%20Morocco%2022000&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  frameBorder="0"
                  scrolling="no"
                ></iframe>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/moroccoremax/' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-stone-700 flex items-center justify-center text-stone-500 hover:text-white hover:border-stone-400 transition-colors"
                  target='blank'
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs uppercase tracking-widest text-stone-300 font-semibold mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.href}
                      className="text-sm text-stone-500 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-stone-800 mt-14 pt-10">
          <div className="flex flex-col md:flex-row justify-between gap-6 items-center">
            <div>
              <h4
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
                className="text-xl text-white mb-1"
              >
                Restez inspirée
              </h4>
              <p className="text-sm text-stone-500">
                Nouveautés, guides de style et offres exclusives.
              </p>
            </div>
            <form
              className="flex w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 md:w-64 px-4 py-3 bg-stone-900 border border-stone-700 text-sm text-white placeholder-stone-500 outline-none focus:border-stone-400"
              />
              <button className="px-5 py-3 bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors whitespace-nowrap">
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-900 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-stone-700">
          <p>© {new Date().getFullYear()} Elara. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Paiement à la livraison</span>
            <span>•</span>
            <span>Livraison au Maroc</span>
            <span>•</span>
            <span>Retours gratuits</span>
          </div>
        </div>
      </div>

    </footer>
  )
}