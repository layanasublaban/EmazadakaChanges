import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { auctions, formatMoney, searchAuctions, type Auction } from '@/data/auctions'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { PageHeader } from '@/components/PageHeader'
import { PropertyImage } from '@/components/PropertyImage'
import { SearchIcon } from '@/components/Icons'
import { Link, navigate } from '@/lib/router'
import { useAuth } from '@/lib/auth'

interface Offer {
  id: string
  auctionId: string
  title: string
  amount: number
  message: string
  at: number
  status: 'Pending'
}

const KEY = 'emazadak.offers'
const loadOffers = (): Offer[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

const direct = auctions.filter((a) => a.directOffer && a.status !== 'finished')
const askingPrice = (a: Auction) => a.currentBid + 25_000

export default function DirectOffersPage({ route }: { route: string }) {
  const { loggedIn, user } = useAuth()
  const [q, setQ] = useState('')
  const [location, setLocation] = useState('')
  const [sort, setSort] = useState<'new' | 'low' | 'high'>('new')
  const [target, setTarget] = useState<Auction | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  useEffect(() => setOffers(loadOffers()), [])

  const list = useMemo(() => {
    const r = searchAuctions(q, direct).filter((a) => !location || a.location === location)
    return sort === 'low' ? [...r].sort((a, b) => askingPrice(a) - askingPrice(b)) : sort === 'high' ? [...r].sort((a, b) => askingPrice(b) - askingPrice(a)) : r
  }, [q, location, sort])

  const open = (a: Auction) => (loggedIn ? setTarget(a) : navigate(`/signin?next=${encodeURIComponent(route)}`))
  const mine = user ? offers : []

  return (
    <div className="min-h-screen bg-page">
      <Navbar active={route} />
      <PageHeader title="Direct Offers" subtitle="Skip the countdown. Make an offer directly to the seller – offers start at 80% of the asking price." />

      <main className="mx-auto mt-8 max-w-[1356px] px-[41px]">
        <div className="flex flex-wrap gap-3">
          <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3.5 py-2.5">
            <SearchIcon width={16} height={16} className="text-icon" />
            <input aria-label="Search direct offers" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search direct offers" className="w-full bg-transparent text-sm focus:outline-none" />
          </div>
          <select aria-label="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm">
            <option value="">All locations</option>
            {['Amman West', 'Amman East', 'Zarqa', 'Irbid', 'Aqaba'].map((l) => <option key={l}>{l}</option>)}
          </select>
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm">
            <option value="new">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>

        <p className="mt-5 text-sm text-muted">{list.length} properties open for offers</p>

        {list.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white p-16 text-center shadow-sm"><p className="text-xl font-medium text-ink">No direct offers match your search</p></div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((a) => (
              <article key={a.id} className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
                <div className="relative">
                  <PropertyImage src={a.image} alt={a.title} className="h-[190px] w-full" />
                  <span className="absolute top-3 left-3 rounded bg-gold px-2 py-1 text-[10px] font-semibold text-ink">Direct offer</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-ink">{a.title}</h3>
                  <p className="mt-1 text-xs text-muted">{a.type} · {a.landSize} m²</p>
                  <p className="mt-3 text-[11px] text-muted">Asking price</p>
                  <p className="text-xl font-semibold text-brand">{formatMoney(askingPrice(a))} <span className="text-xs font-light text-icon">JOD</span></p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => open(a)} className="rounded-lg bg-brand py-2.5 text-xs font-semibold text-white hover:bg-brand-700">Place Offer</button>
                    <Link to={`/auctions/${a.id}`} className="rounded-lg border border-brand py-2.5 text-center text-xs font-semibold text-brand hover:bg-brand-50">View Details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {mine.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-ink">My offers</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-50 text-xs text-brand"><tr><th className="px-4 py-3">Property</th><th className="px-4 py-3">Offer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr></thead>
                <tbody>
                  {mine.map((o) => (
                    <tr key={o.id} className="border-t border-black/5">
                      <td className="px-4 py-3">{o.title}</td>
                      <td className="px-4 py-3 font-medium text-brand">{formatMoney(o.amount)} JOD</td>
                      <td className="px-4 py-3 text-muted">{new Date(o.at).toLocaleDateString('en-GB')}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-medium text-gold-dark">{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {target && (
        <OfferModal
          auction={target}
          onClose={() => setTarget(null)}
          onSubmit={(o) => {
            const next = [o, ...offers]
            setOffers(next)
            try {
              localStorage.setItem(KEY, JSON.stringify(next))
            } catch {
              /* ignore */
            }
          }}
        />
      )}
      <Footer />
    </div>
  )
}

function OfferModal({ auction: a, onClose, onSubmit }: { auction: Auction; onClose: () => void; onSubmit: (o: Offer) => void }) {
  const asking = askingPrice(a)
  const min = Math.round(asking * 0.8)
  const [amount, setAmount] = useState(String(min))
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(amount)
    if (!n || n < min) return setError(`Your offer must be at least ${formatMoney(min)} JOD (80% of the asking price).`)
    if (n > asking * 1.5) return setError('That amount is far above the asking price – please check it.')
    onSubmit({ id: `O${Date.now()}`, auctionId: a.id, title: a.title, amount: n, message, at: Date.now(), status: 'Pending' })
    setDone(true)
  }

  return (
    <div role="dialog" aria-modal="true" aria-label="Place offer" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="animate-pop-in w-full max-w-[460px] rounded-2xl bg-white p-6 shadow-2xl">
        {done ? (
          <div className="text-center">
            <p className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand text-xl text-white">✓</p>
            <h2 className="mt-4 text-lg font-semibold text-ink">Offer sent</h2>
            <p className="mt-2 text-sm text-muted">The seller will review your offer of {formatMoney(Number(amount))} JOD. You can follow it under “My offers”.</p>
            <button type="button" onClick={onClose} className="mt-5 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            <h2 className="text-lg font-semibold text-ink">Place an offer</h2>
            <p className="text-sm text-muted">{a.title}<br />Asking price: <b className="text-brand">{formatMoney(asking)} JOD</b></p>
            <label className="block text-xs font-medium text-ink">Your offer (JOD)
              <input inputMode="numeric" value={amount} onChange={(e) => { setAmount(e.target.value.replace(/\D/g, '')); setError('') }} className="mt-1.5 w-full rounded-lg border border-black/15 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </label>
            <label className="block text-xs font-medium text-ink">Message to the seller (optional)
              <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1.5 w-full rounded-lg border border-black/15 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </label>
            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="rounded-lg border border-black/15 px-5 py-2.5 text-sm">Cancel</button>
              <button type="submit" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Send offer</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
