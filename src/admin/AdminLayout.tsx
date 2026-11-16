import type { ReactNode } from 'react'
import { Link } from '@/lib/router'
import type { Key } from './i18n'
import { DashboardIcon, FileTextIcon, GavelIcon, LogOutIcon, SearchIcon, SettingsIcon, UsersIcon, WalletIcon } from './icons'
import { useAdmin } from './store'
import { Button } from './ui'

const nav: { key: Key; to: string; icon: typeof DashboardIcon }[] = [
  { key: 'dashboard', to: '/admin', icon: DashboardIcon },
  { key: 'auctions', to: '/admin/auctions', icon: GavelIcon },
  { key: 'submissions', to: '/admin/submissions', icon: FileTextIcon },
  { key: 'users', to: '/admin/users', icon: UsersIcon },
  { key: 'transactions', to: '/admin/transactions', icon: WalletIcon },
  { key: 'settings', to: '/admin/settings', icon: SettingsIcon },
]

export function AdminLayout({ route, children }: { route: string; children: ReactNode }) {
  const { t, lang, toggleLang, logout, query, setQuery, toast } = useAdmin()
  const isActive = (to: string) => (to === '/admin' ? route === '/admin' : route.startsWith(to))

  return (
    <div className="flex min-h-screen bg-page">
      <aside className="flex w-[260px] shrink-0 flex-col gap-2 bg-brand p-6 text-white">
        <div className="px-3 pt-2 pb-6 text-2xl font-bold">{t('appName')}</div>
        <nav aria-label="Admin" className="flex flex-col gap-2">
          {nav.map(({ key, to, icon: Icon }) => {
            const active = isActive(to)
            return (
              <Link
                key={key}
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  active ? 'bg-brand-600 font-semibold' : 'opacity-75 hover:bg-white/10 hover:opacity-100'
                }`}
              >
                <Icon />
                {t(key)}
              </Link>
            )
          })}
        </nav>
        <div className="flex-1" />
        <Link
          to="/admin/login"
          onClick={logout}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm opacity-90 hover:bg-white/10"
        >
          <LogOutIcon />
          {t('logout')}
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[72px] items-center gap-4 border-b border-black/10 bg-white px-8">
          <label className="flex w-[360px] items-center gap-2 rounded-lg bg-black/[0.04] px-4 py-2.5 text-icon">
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              aria-label={t('search')}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-icon"
            />
          </label>
          <div className="flex-1" />
          <Button kind="outline" onClick={toggleLang} lang={lang === 'en' ? 'ar' : 'en'}>
            {t('switchLang')}
          </Button>
          <div className="flex items-center gap-3 text-sm font-medium">
            <span className="size-9 rounded-full bg-brand-50" aria-hidden />
            {t('adminUser')}
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-6 p-8">{children}</main>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 start-1/2 -translate-x-1/2 rounded-lg bg-ink px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
