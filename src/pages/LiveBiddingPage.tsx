import { useEffect, useMemo, useRef, useState } from 'react'
import { auctions, formatMoney, type Auction } from '@/data/auctions'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { PageHeader } from '@/components/PageHeader'
import { PropertyImage } from '@/components/PropertyImage'
import { Link, navigate } from '@/lib/router'
import { useAuth } from '@/lib/auth'

interface Activity {
  id: number
  auctionId: string
  title: string
  amount: number
  bidder: string
  at: number
  mine?: boolean
}

const liveOnes = auctions.filter((a) => a.status === 'live' || a.status === 'ending-soon').slice(0, 12)
const bidders = ['Bidder ••21', 'Bidder ••48', 'Bidder ••07', 'Bidder ••63', 'Bidder ••15', 'Bidder ••92']

/** Live bidding room. Bids from other participants are simulated until the real-time backend is connected. */
export default function LiveBiddingPage({ route }: { route: string }) {
  const { loggedIn, user } = useAuth()
  const [bids, setBids] = useState<Record<string, number>>(() => Object.fromEntries(liveOnes.map((a) => [a.id, a.currentBid])))
  const [counts, setCounts] = useState<Record<string, number>>(() => Object.fromEntries(liveOnes.map((a) => [a.id, a.bids])))
  const [feed, setFeed] = useState<Activity[]>([])
  const [flash, setFlash] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'ending'>('all')
  const [notice, setNotice] = useState('')
  const seq = useRef(0)
  const bidsRef = useRef(bids)
  bidsRef.current = bids

  const record = (a: Auction, amount: number, bidder: string, mine = false) => {
    setBids((b) => ({ ...b, [a.id]: amount }))
    setCounts((c) => ({ ...c, [a.id]: (c[a.id] ?? a.bids) + 1 }))
    setFeed((f) => [{ id: ++seq.current, auctionId: a.id, title: a.title, amount, bidder, at: Date.now(), mine }, ...f].slice(0, 12))
    setFlash(a.id)
    setTimeout(() => setFlash((x) => (x === a.id ? null : x)), 1200)
  }

  // Simulated competing bids
  useEffect(() => {
    const id = setInterval(() => {
      const a = liveOnes[Math.floor(Math.random() * liveOnes.length)]
      record(a, (bidsRef.current[a.id] ?? a.currentBid) + a.minBidIncrement, bidders[Math.floor(Math.random() * bidders.length)])
    }, 4500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeBid = (a: Auction) => {
    if (!loggedIn) return navigate(`/signin?next=${encodeURIComponent(route)}`)
    record(a, (bids[a.id] ?? a.currentBid) + a.minBidIncrement, `You (${user?.fullName.split(' ')[0]})`, true)
    setNotice(`Your bid of ${formatMoney((bids[a.id] ?? a.currentBid) + a.minBidIncrement)} JOD was placed on ${a.title}.`)
  }

  const list = useMemo(() => liveOnes.filter((a) => filter === 'all' || a.status === 'ending-soon'), [filter])

  return (
    <div className="min-h-screen bg-page">
      <Navbar active={route} />
      <PageHeader title="Live Bidding" subtitle="Auctions running right now. Bids update in real time – place yours before the countdown ends.">
        <div role="tablist" className="flex gap-2">
          {([['all', 'All live auctions'], ['ending', 'Ending soon']] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={filter === k} type="button" onClick={() => setFilter(k)}
              className={`rounded-md border px-4 py-2 text-sm ${filter === k ? 'border-brand bg-brand font-semibold text-white' : 'border-brand-400 text-brand-600 hover:bg-brand-50'}`}>
              {l}
            </button>
          ))}
        </div>
      </PageHeader>

      <main className="mx-auto mt-8 grid max-w-[1356px] gap-6 px-[41px] lg:grid-cols-[1fr_340px]">
        <section aria-live="polite">
          {notice && <p role="status" className="mb-4 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand">{notice}</p>}
          <div className="grid gap-5 md:grid-cols-2">
            {list.map((a) => (
              <article key={a.id} className={`overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow ${flash === a.id ? 'border-gold shadow-[0_0_0_3px_rgba(212,160,65,0.35)]' : 'border-black/5'}`}>
                <div className="relative">
                  <PropertyImage src={a.image} alt={a.title} className="h-[170px] w-full" />
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold text-white">
                    <span className="size-1.5 animate-pulse rounded-full bg-white" /> LIVE
                  </span>
                  <span className="absolute top-3 right-3 rounded bg-white/90 px-2 py-1 text-[10px] font-medium text-brand">{counts[a.id]} bids</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-ink">{a.title}</h3>
                  <p className="mt-1 text-xs text-muted">{a.type} · {a.landSize} m²</p>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-[11px] text-muted">Current bid</p>
                      <p className={`text-[22px] font-semibold text-brand transition-transform ${flash === a.id ? 'scale-105' : ''}`}>
                        {formatMoney(bids[a.id])} <span className="text-xs font-light text-icon">JOD</span>
                      </p>
                    </div>
                    <CountdownTimer endsAt={a.endsAt} />
                  </div>
                  <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                    <button type="button" onClick={() => placeBid(a)} className="rounded-lg bg-brand py-2.5 text-xs font-semibold text-white hover:bg-brand-700">
                      Bid +{formatMoney(a.minBidIncrement)} JOD
                    </button>
                    <Link to={`/auctions/${a.id}`} className="rounded-lg border border-brand px-4 py-2.5 text-xs font-semibold text-brand hover:bg-brand-50">Details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-black/5 bg-white p-5 shadow-sm lg:sticky lg:top-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink"><span className="size-2 animate-pulse rounded-full bg-red-600" /> Live activity</h2>
          {feed.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Waiting for the next bid…</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {feed.map((f) => (
                <li key={f.id} className={`animate-pop-in rounded-lg px-3 py-2.5 text-xs ${f.mine ? 'bg-gold-50' : 'bg-brand-50'}`}>
                  <p className="font-semibold text-ink">{f.bidder} bid {formatMoney(f.amount)} JOD</p>
                  <p className="mt-0.5 truncate text-muted">{f.title}</p>
                </li>
              ))}
            </ul>
          )}
          {!loggedIn && (
            <p className="mt-5 rounded-lg bg-brand-50 p-3 text-xs text-brand">
              <Link to="/signin?next=/live-bidding" className="font-semibold underline">Sign in</Link> or <Link to="/signup" className="font-semibold underline">create an account</Link> to place bids.
            </p>
          )}
        </aside>
      </main>
      <Footer />
    </div>
  )
}
