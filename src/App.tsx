import { AuthProvider } from '@/lib/auth'
import { useHashRoute } from '@/lib/router'
import AuctionDetailsPage from '@/pages/AuctionDetailsPage'
import AuctionsPage from '@/pages/AuctionsPage'
import HomePage from '@/pages/HomePage'

/**
 * Routes (hash based):
 *   #/                 Homepage
 *   #/auctions         Auctions list with filters
 *   #/auctions/:id     Auction details
 */
function Routes() {
  const route = useHashRoute()
  const details = route.match(/^\/auctions\/([^/]+)$/)

  if (details) return <AuctionDetailsPage id={details[1]} route={route} />
  if (route.startsWith('/auctions')) return <AuctionsPage />
  return <HomePage />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}
