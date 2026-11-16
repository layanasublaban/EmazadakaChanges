import { Link } from '@/lib/router'
import { useAuth } from '@/lib/auth'
import { Logo } from './Logo'
import { UserCircleIcon } from './Icons'

const links = [
  { label: 'HomePage', to: '/' },
  { label: 'Auctions', to: '/auctions' },
  { label: 'Map', to: '/map' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'About Us', to: '/about' },
]

interface NavbarProps {
  /** Current route, used to highlight the active item. */
  active: string
  /** "light" = white pill over the hero image, "gray" = gray pill on inner pages. */
  variant?: 'light' | 'gray'
}

export function Navbar({ active, variant = 'gray' }: NavbarProps) {
  const { loggedIn, login, logout } = useAuth()
  const isActive = (to: string) => (to === '/' ? active === '/' : active.startsWith(to))

  return (
    <header
      className={`mx-auto flex h-[72px] w-full max-w-[1356px] items-center justify-between rounded-full px-9 ${
        variant === 'light' ? 'bg-white shadow-sm' : 'border border-black/5 bg-[#cfcfcf]/80'
      }`}
    >
      <Link to="/" aria-label="Emazadak home">
        <Logo />
      </Link>

      <nav className="flex items-center gap-1 text-[15px] text-ink" aria-label="Main">
        {links.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            className={`rounded-lg px-3.5 py-2 transition-colors ${
              isActive(l.to) ? 'bg-brand text-white' : 'hover:text-brand'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {loggedIn ? (
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 text-sm font-semibold text-street"
          aria-label="Log out"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-brand text-xs text-white">LS</span>
          My Account
        </button>
      ) : variant === 'light' ? (
        <button
          type="button"
          onClick={login}
          className="flex items-center gap-1.5 rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand"
        >
          <UserCircleIcon width={16} height={16} />
          Sign In
        </button>
      ) : (
        <button type="button" onClick={login} className="flex items-center gap-1.5 text-sm font-semibold text-street">
          <UserCircleIcon width={20} height={20} />
          Login / Register
        </button>
      )}
    </header>
  )
}
