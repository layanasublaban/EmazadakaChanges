import AdminApp from '@/admin/AdminApp'
import { AuthProvider } from '@/lib/auth'
import { LangProvider } from '@/lib/i18n'
import { useHashRoute } from '@/lib/router'
import AuctionDetailsPage from '@/pages/AuctionDetailsPage'
import AuctionsPage from '@/pages/AuctionsPage'
import { SignInPage, SignUpPage } from '@/pages/AuthPages'
import DirectOffersPage from '@/pages/DirectOffersPage'
import LiveBiddingPage from '@/pages/LiveBiddingPage'
import ListPropertyPage from '@/pages/ListPropertyPage'
import MapPage from '@/pages/MapPage'
import HomePage from '@/pages/HomePage'

/**
 * Routes (hash based):
 *   #/                 Homepage
 *   #/auctions         Auctions list with filters
 *   #/auctions/:id     Auction details
 *   #/signin, #/signup Website sign in / sign up
 *   #/live-bidding, #/offers, #/map, #/list-property  Menu pages
 *   #/admin/...        Admin panel (see src/admin/AdminApp.tsx)
 */
function Routes() {
  const route = useHashRoute()
  if (route.startsWith('/admin')) return <AdminApp route={route} />
  const details = route.match(/^\/auctions\/([^/]+)$/)

  if (details) return <AuctionDetailsPage id={details[1]} route={route} />
  if (route.startsWith('/auctions')) return <AuctionsPage />
  if (route === '/live-bidding') return <LiveBiddingPage route={route} />
  if (route === '/offers') return <DirectOffersPage route={route} />
  if (route === '/map') return <MapPage route={route} />
  if (route === '/list-property') return <ListPropertyPage route={route} />
  if (route === '/signin') return <SignInPage />
  if (route === '/signup') return <SignUpPage />
  return <HomePage />
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </LangProvider>
  )
}
