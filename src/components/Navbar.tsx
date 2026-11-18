import { useEffect, useRef, useState } from 'react'
import { Link } from '@/lib/router'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
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
  /** @deprecated The header is one design on every page (kept so old call sites compile). */
  variant?: string
}

function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n()
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      aria-label={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
      className={`flex h-9 items-center justify-center rounded-full border border-black/10 px-3.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand ${className}`}
    >
      {lang === 'en' ? 'عربي' : 'EN'}
    </button>
  )
}

/**
 * The one header used on every public page. Desktop measurements come from the Figma "Header" component:
 * 1360×72 white pill, 1px #e9e9e9 stroke, radius 32, 32px side padding, 8% shadow, tabs 8/16 padding with radius 8
 * (active #194b3f), 155×36 outlined Login / Register pill. Below 1280px the tabs collapse into a menu.
 */
export function Navbar({ active }: NavbarProps) {
  const { user, logout } = useAuth()
  const { t } = useI18n()
  const [menu, setMenu] = useState(false)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const isActive = (to: string) => (to === '/' ? active === '/' : active.startsWith(to))

  useEffect(() => {
    setOpen(false)
    setMenu(false)
  }, [active])

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
    <div className="relative z-30 px-3 pt-4 sm:px-6 sm:pt-8">
      <header className="mx-auto flex h-16 w-full max-w-[1360px] items-center justify-between gap-3 rounded-[32px] border border-[#e9e9e9] bg-white px-4 shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:h-[72px] sm:px-8">
        <Link to="/" aria-label="Emazadak home" className="flex shrink-0 items-center xl:w-[220px]">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-2 xl:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              aria-current={isActive(l.to) ? 'page' : undefined}
              className={`rounded-lg px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 ${
                isActive(l.to) ? 'bg-brand font-semibold text-white' : 'font-medium text-ink hover:-translate-y-px hover:bg-brand-50 hover:text-brand'
              }`}
            >
              {t(l.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 xl:w-[300px]">
          <LangSwitch className="hidden sm:flex" />
          <div ref={box} className="relative hidden xl:block">
            {user ? (
              <>
                <button type="button" onClick={() => setMenu((v) => !v)} aria-haspopup="menu" aria-expanded={menu} className="flex items-center gap-2.5">
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">{initials}</span>
                  <span className="text-xs font-semibold text-ink">{t('Welcome, {name}', { name: first ?? '' })}</span>
                </button>
                {menu && (
                  <div role="menu" className="animate-pop-in absolute end-0 top-12 w-56 rounded-xl border border-[#e9e9e9] bg-white p-2 shadow-lg">
                    <AccountMenu onDone={() => setMenu(false)} logout={logout} />
                  </div>
                )}
              </>
            ) : (
              <Link to="/signin" className="flex h-9 w-[155px] items-center justify-center gap-2 rounded-full border border-brand text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
                <UserCircleIcon width={16} height={16} />
                {t('Login / Register')}
              </Link>
            )}
          </div>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 flex-col items-center justify-center gap-[5px] rounded-full border border-black/10 xl:hidden"
          >
            <span className={`h-0.5 w-5 rounded bg-ink transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-0.5 w-5 rounded bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-5 rounded bg-ink transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </header>

      {open && (
        <div className="animate-slide-down mx-auto mt-2 max-w-[1360px] rounded-3xl border border-[#e9e9e9] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.14)] xl:hidden">
          <nav aria-label="Mobile" className="grid gap-1">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`rounded-xl px-4 py-3 text-[15px] ${isActive(l.to) ? 'bg-brand font-semibold text-white' : 'font-medium text-ink active:bg-brand-50'}`}
              >
                {t(l.label)}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center gap-2 border-t border-black/5 pt-3">
            <LangSwitch className="sm:hidden" />
            {user ? (
              <div className="flex-1">
                <p className="px-2 text-sm font-semibold text-ink">{t('Welcome, {name}', { name: first ?? '' })}</p>
                <div className="mt-1 grid gap-1"><AccountMenu onDone={() => setOpen(false)} logout={logout} /></div>
              </div>
            ) : (
              <>
                <Link to="/signin" className="flex h-11 flex-1 items-center justify-center rounded-xl border border-brand text-sm font-semibold text-brand">{t('Sign In')}</Link>
                <Link to="/signup" className="flex h-11 flex-1 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white">{t('Create account')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AccountMenu({ onDone, logout }: { onDone: () => void; logout: () => void }) {
  const { user } = useAuth()
  const { t } = useI18n()
  return (
    <>
      <div className="border-b border-black/5 px-3 py-2">
        <p className="truncate text-xs font-semibold text-ink">{user?.fullName}</p>
        <p className="truncate text-[11px] text-muted" dir="ltr">{user?.email}</p>
        <p className="mt-1 text-[10px] font-medium text-gold-dark">{user?.verification === 'verified' ? t('Verified bidder') : t('Verification pending')}</p>
      </div>
      <Link role="menuitem" to="/live-bidding" onClick={onDone} className="block rounded-lg px-3 py-2 text-xs text-ink hover:bg-brand-50">{t('My live bids')}</Link>
      <Link role="menuitem" to="/offers" onClick={onDone} className="block rounded-lg px-3 py-2 text-xs text-ink hover:bg-brand-50">{t('Direct Offers')}</Link>
      <button type="button" role="menuitem" onClick={() => { logout(); onDone() }} className="block w-full rounded-lg px-3 py-2 text-start text-xs font-semibold text-red-700 hover:bg-red-50">{t('Sign out')}</button>
    </>
  )
}
