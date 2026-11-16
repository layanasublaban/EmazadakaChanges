import { useState } from 'react'
import { formatMoney, getAuction } from '@/data/auctions'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Footer } from '@/components/Footer'
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, PinIcon } from '@/components/Icons'
import { Navbar } from '@/components/Navbar'
import { PropertyImage } from '@/components/PropertyImage'
import { StatusBadge, type BadgeKind } from '@/components/StatusBadge'
import { Link } from '@/lib/router'
import { useAuth } from '@/lib/auth'

type DetailTab = 'Overview' | 'Specs' | 'Documents'
const detailTabs: DetailTab[] = ['Overview', 'Specs', 'Documents']

function Money({ value, plus = false, big = false }: { value: number; plus?: boolean; big?: boolean }) {
  return (
    <span className={`font-medium text-brand ${big ? 'text-[26px]' : 'text-xl'}`}>
      {plus && '+'}
      {formatMoney(value)} <span className="text-xs font-light text-icon">JOD</span>
    </span>
  )
}

export default function AuctionDetailsPage({ id, route }: { id: string; route: string }) {
  const a = getAuction(id)
  const { loggedIn } = useAuth()
  const [imageIndex, setImageIndex] = useState(a.gallery.length - 1)
  const [tab, setTab] = useState<DetailTab>('Overview')
  const [liked, setLiked] = useState(false)
  const [depositPaid, setDepositPaid] = useState(false)
  const [currentBid, setCurrentBid] = useState(a.currentBid)

  const badge: BadgeKind = a.status === 'coming-soon' ? 'coming-soon' : a.status === 'ending-soon' ? 'live-ending' : 'live'
  const canPayDeposit = loggedIn && !depositPaid
  const canBid = loggedIn && depositPaid

  const prev = () => setImageIndex((i) => (i - 1 + a.gallery.length) % a.gallery.length)
  const next = () => setImageIndex((i) => (i + 1) % a.gallery.length)

  return (
    <div className="min-h-screen bg-page">
      <div className="px-[41px] pt-8">
        <Navbar active={route} />
      </div>

      <main className="mx-auto max-w-[1356px] px-[41px]">
        <nav aria-label="Breadcrumb" className="mt-8 text-base text-muted">
          <Link to="/auctions" className="hover:text-brand">Auctions</Link> /{' '}
          <span>{a.category}</span> / <span>Auction {a.code}</span>
        </nav>

        <h1 className="mt-5 text-[26px] font-semibold text-ink">{a.title}</h1>

        <div className="mt-5 flex flex-wrap gap-[30px]">
          <StatusBadge kind={badge} />
          {!depositPaid && <StatusBadge kind="deposit-required" />}
          {!loggedIn && <StatusBadge kind="verification-required" />}
        </div>

        <div className="mt-6 grid grid-cols-[848px_1fr] gap-[18px]">
          {/* Left column */}
          <div>
            <div className="relative overflow-hidden rounded-lg border-2 border-brand">
              <PropertyImage src={a.gallery[imageIndex]} alt={a.title} className="h-[358px] w-full" />
              <span className="absolute top-6 left-6 rounded-full bg-brand px-4 py-2 text-[15px] font-medium text-white">
                {a.category}
              </span>
              <button
                type="button"
                aria-pressed={liked}
                aria-label="Add to favourites"
                onClick={() => setLiked((v) => !v)}
                className="absolute top-6 right-6 flex size-9 items-center justify-center rounded-full bg-white"
              >
                <HeartIcon width={18} height={18} fill={liked ? 'currentColor' : 'none'} />
              </button>
              <button type="button" aria-label="Previous image" onClick={prev} className="absolute top-1/2 left-4 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/60 text-white">
                <ChevronLeftIcon />
              </button>
              <button type="button" aria-label="Next image" onClick={next} className="absolute top-1/2 right-4 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/60 text-white">
                <ChevronRightIcon />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-6">
              {a.gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === imageIndex}
                  onClick={() => setImageIndex(i)}
                  className={`overflow-hidden rounded-lg ${i === imageIndex ? 'ring-2 ring-brand' : ''}`}
                >
                  <PropertyImage src={src} alt="" className="h-[119px] w-full" />
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-black/10 bg-white shadow-sm">
              <div role="tablist" className="flex items-center border-b border-black/10 px-[18px] text-base text-ink">
                {detailTabs.map((t, i) => (
                  <div key={t} className="flex items-center">
                    {i > 0 && <span className="mx-6 h-4 w-px bg-black/20" />}
                    <button
                      role="tab"
                      type="button"
                      aria-selected={tab === t}
                      onClick={() => setTab(t)}
                      className={`py-3 ${tab === t ? 'border-b-2 border-brand' : ''}`}
                    >
                      {t}
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-[18px]">
                {tab === 'Overview' && (
                  <>
                    <p className="flex items-center gap-3 text-xl font-medium text-ink">
                      <PinIcon width={20} height={20} /> {a.location}
                    </p>
                    <p className="mt-4 text-xl leading-[30px] text-muted">
                      {a.description} {a.description} {a.description}
                    </p>
                    <div className="mt-6 grid grid-cols-3 divide-x divide-black/15 rounded-lg bg-[#f7f8f8] px-4 py-4 text-center">
                      <div className="text-left">
                        <p className="text-xl text-ink">Starting Price</p>
                        <p className="mt-3"><Money value={a.startingPrice} big /></p>
                      </div>
                      <div>
                        <p className="text-xl text-ink">Market Price</p>
                        <p className="mt-3"><Money value={a.startingPrice} big /></p>
                      </div>
                      <div>
                        <p className="text-xl text-ink">Min Bid Increment</p>
                        <p className="mt-3"><Money value={a.minBidIncrement} plus big /></p>
                      </div>
                    </div>
                  </>
                )}
                {tab === 'Specs' && (
                  <dl className="grid grid-cols-2 gap-4 text-lg">
                    <dt className="text-muted">Property type</dt><dd>{a.type}</dd>
                    <dt className="text-muted">Land size</dt><dd>{a.landSize} m²</dd>
                    <dt className="text-muted">Location</dt><dd>{a.location}</dd>
                  </dl>
                )}
                {tab === 'Documents' && (
                  <p className="text-lg text-muted">Title deed and transfer documents are available after verification.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-7">
            <section className="rounded-lg border border-black/10 bg-white p-[25px] shadow-sm">
              <h2 className="border-b border-black/10 pb-3 text-center text-[26px] text-ink">Deposit Status</h2>
              <div
                className={`mt-5 rounded-md py-3.5 text-center text-xl ${
                  depositPaid ? 'bg-[#e6f4ea] text-[#2e7d32]' : 'bg-[#f9e6e6] text-[#d0021b]'
                }`}
              >
                {depositPaid ? 'Deposit Paid' : 'Deposit Required'}
              </div>
              {!loggedIn && <p className="mt-4 text-sm text-ink">*Please Login to pay deposit</p>}
              <button
                type="button"
                disabled={!canPayDeposit}
                onClick={() => setDepositPaid(true)}
                className={`mt-6 w-full rounded-md py-4 text-xl font-medium ${
                  canPayDeposit ? 'bg-brand text-white hover:bg-brand-700' : 'bg-[#d0d0d0] text-white/90'
                }`}
              >
                Pay Deposit
              </button>
            </section>

            <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-center text-xl text-ink">Current Bid</p>
              <p className="mt-2 text-center">
                <span className="text-[44px] font-medium text-brand">{formatMoney(currentBid)}</span>{' '}
                <span className="text-2xl font-light text-icon">JOD</span>
              </p>

              <dl className="mt-5 space-y-5 border-t border-black/10 pt-5 text-lg text-ink">
                <div className="flex items-center justify-between"><dt>Starting Price</dt><dd><Money value={a.startingPrice} /></dd></div>
                <div className="flex items-center justify-between"><dt>Market Price</dt><dd><Money value={a.marketPrice} /></dd></div>
                <div className="flex items-center justify-between"><dt>Min Bid Increment</dt><dd><Money value={a.minBidIncrement} plus /></dd></div>
              </dl>

              <div className="mt-6 border-t border-black/10 pt-6">
                <p className="text-center text-base text-ink">Auction Ends In</p>
                <div className="mt-3">
                  <CountdownTimer endsAt={a.endsAt} size="lg" />
                </div>
              </div>

              <button
                type="button"
                disabled={!canBid}
                onClick={() => setCurrentBid((b) => b + a.minBidIncrement)}
                className={`mt-8 w-full rounded-md py-4 text-xl font-medium ${
                  canBid ? 'bg-brand text-white hover:bg-brand-700' : 'bg-[#cfcfcf] text-white/90'
                }`}
              >
                Place Bid
              </button>
              {!canBid && <p className="mt-4 text-sm text-ink">*Deposit is required to bid</p>}
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
