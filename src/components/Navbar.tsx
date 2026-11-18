import { useEffect, useRef, useState } from 'react'
import { Link } from '@/lib/router'
import { useAuth } from '@/lib/auth'
import { Logo } from './Logo'
import { UserCircleIcon } from './Icons'

export const links = [
  { label: 'Home', to: '/' },
  { label: 'Auctions', to: '/auctions' },
  { label: 'Live Bidding', to: '/live-bidding' },
  { label: 'Direct Offers', to: '/offers' },
  { label: 'Map', to: '/map' },
  { label: 'List Property', to: '/list-property' },
]

interface NavbarProps {
  /** Current route, used to highlight the active item. */
  active: string
  /** @deprecated The header is now one design on every page (kept so old call sites compile). */
  variant?: string
}

/**
 * The one header used on every public page. Measurements come from the Figma "Header" component:
 * 1360×72 white pill, 1px #e9e9e9 stroke, radius 32, 32px side padding, 8% shadow,
 * 220px brand block, tabs with 8px gap / 8×16 padding / radius 8 (active #194b3f, Poppins 14),
 * and a 155×36 outlined pill for Login / Register (or avatar + "Welcome, …" when signed in).
 */
export function Navbar({ active }: NavbarProps) {
  const { user, logout } = useAuth()
  const [menu, setMenu] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const isActive = (to: string) => (to === '/' ? active === '/' : active.startsWith(to))

  useEffect(() => {
    if (!menu) return
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menu])

  const first = user?.fullName.split(' ')[0]
  const initials = user?.fullName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="relative z-30 px-4 pt-8 sm:px-6">
      <header className="mx-auto flex h-[72px] w-full max-w-[1360px] items-center justify-between gap-4 rounded-[32px] border border-[#e9e9e9] bg-white px-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <Link to="/" aria-label="Emazadak home" className="flex w-[220px] shrink-0 items-center">
          <Logo />
        </Link>

        <nav className="flex items-center gap-2" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              aria-current={isActive(l.to) ? 'page' : undefined}
              className={`rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                isActive(l.to) ? 'bg-brand font-semibold text-white' : 'font-medium text-ink hover:bg-brand-50 hover:text-brand'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div ref={box} className="relative flex w-[220px] shrink-0 justify-end">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menu}
                className="flex items-center gap-2.5"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                  {initials}
                </span>
                <span className="text-xs font-semibold text-ink">Welcome, {first}</span>
              </button>
              {menu && (
                <div role="menu" className="absolute top-12 right-0 w-56 rounded-xl border border-[#e9e9e9] bg-white p-2 shadow-lg">
                  <div className="border-b border-black/5 px-3 py-2">
                    <p className="truncate text-xs font-semibold text-ink">{user.fullName}</p>
                    <p className="truncate text-[11px] text-muted">{user.email}</p>
                    <p className="mt-1 text-[10px] font-medium text-gold-dark">
                      {user.verification === 'verified' ? 'Verified bidder' : 'Verification pending'}
                    </p>
                  </div>
                  <Link role="menuitem" to="/live-bidding" onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 text-xs text-ink hover:bg-brand-50">
                    My live bids
                  </Link>
                  <Link role="menuitem" to="/offers" onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2 text-xs text-ink hover:bg-brand-50">
                    Direct offers
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      logout()
                      setMenu(false)
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/signin"
              className="flex h-9 w-[155px] items-center justify-center gap-2 rounded-full border border-brand text-xs font-semibold text-brand transition-colors hover:bg-brand-50"
            >
              <UserCircleIcon width={16} height={16} className="text-ink" />
              Login / Register
            </Link>
          )}
        </div>
      </header>
    </div>
  )
}
