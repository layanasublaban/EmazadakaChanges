import { useEffect, type ReactNode } from 'react'
import { go } from './nav'
import { AdminLayout } from './AdminLayout'
import { AdminProvider, useAdmin } from './store'
import AuctionForm from './pages/AuctionForm'
import Auctions from './pages/Auctions'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SettingsPage from './pages/SettingsPage'
import SubmissionDetail from './pages/SubmissionDetail'
import Submissions from './pages/Submissions'
import Transactions from './pages/Transactions'
import UserDetail from './pages/UserDetail'
import Users from './pages/Users'

/**
 * Admin routes (hash based, all under #/admin):
 *   /admin/login                 /admin                    dashboard
 *   /admin/auctions              /admin/auctions/new       /admin/auctions/:id/edit
 *   /admin/submissions           /admin/submissions/:id    /admin/submissions/:id/reject
 *   /admin/users                 /admin/users/:id
 *   /admin/transactions          /admin/settings
 */
function Inner({ route }: { route: string }) {
  const { loggedIn, dir, lang } = useAdmin()

  useEffect(() => {
    if (!loggedIn && route !== '/admin/login') go('/admin/login')
    if (loggedIn && route === '/admin/login') go('/admin')
  }, [loggedIn, route])

  let page = <Dashboard />
  const m = (re: RegExp) => route.match(re)
  let d
  if (route === '/admin/auctions') page = <Auctions />
  else if (route === '/admin/auctions/new') page = <AuctionForm />
  else if ((d = m(/^\/admin\/auctions\/([^/]+)\/edit$/))) page = <AuctionForm key={d[1]} id={d[1]} />
  else if (route === '/admin/submissions') page = <Submissions />
  else if ((d = m(/^\/admin\/submissions\/([^/]+)\/reject$/))) page = <SubmissionDetail id={d[1]} rejecting />
  else if ((d = m(/^\/admin\/submissions\/([^/]+)$/))) page = <SubmissionDetail id={d[1]} rejecting={false} />
  else if (route === '/admin/users') page = <Users />
  else if ((d = m(/^\/admin\/users\/([^/]+)$/))) page = <UserDetail id={d[1]} />
  else if (route === '/admin/transactions') page = <Transactions />
  else if (route === '/admin/settings') page = <SettingsPage />

  const wrap = (c: ReactNode) => (
    <div dir={dir} lang={lang} className={lang === 'ar' ? 'font-arabic' : ''}>
      {c}
    </div>
  )
  if (route === '/admin/login') return wrap(<Login />)
  if (!loggedIn) return null
  return wrap(<AdminLayout route={route}>{page}</AdminLayout>)
}

export default function AdminApp({ route }: { route: string }) {
  return (
    <AdminProvider>
      <Inner route={route} />
    </AdminProvider>
  )
}
