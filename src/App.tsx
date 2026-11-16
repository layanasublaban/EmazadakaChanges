import AdminApp from '@/admin/AdminApp'
import { AuthProvider } from '@/lib/auth'
import { useHashRoute } from '@/lib/router'
import AuctionDetailsPage from '@/pages/AuctionDetailsPage'
import AuctionsPage from '@/pages/AuctionsPage'
import ComingSoonPage from '@/pages/ComingSoonPage'
import HomePage from '@/pages/HomePage'

/**
 * Routes (hash based):
 *   #/                 Homepage
 *   #/auctions         Auctions list with filters
 *   #/auctions/:id     Auction details
 *   #/admin/...        Admin panel (see src/admin/AdminApp.tsx)
 */
function Routes() {
  const route = useHashRoute()
  if (route.startsWith('/admin')) return <AdminApp route={route} />
  const details = route.match(/^\/auctions\/([^/]+)$/)

  if (details) return <AuctionDetailsPage id={details[1]} route={route} />
  if (route.startsWith('/auctions')) return <AuctionsPage />
  if (['/live-bidding', '/offers', '/map', '/list-property'].includes(route)) return <ComingSoonPage route={route} />
  return <HomePage />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}
