import { useState } from 'react'
import { formatMoney, getAuction } from '@/data/auctions'
import { CountdownTimer } from '@/components/CountdownTimer'
import { Footer } from '@/components/Footer'
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, PinIcon } from '@/components/Icons'
import { Navbar } from '@/components/Navbar'
import { PropertyImage } from '@/components/PropertyImage'
import { StatusBadge, type BadgeKind } from '@/components/StatusBadge'
import { EmbedMap, GoogleMap, googleMapsLink, hasMapsKey } from '@/components/GoogleMap'
import { useI18n } from '@/lib/i18n'
import { Link } from '@/lib/router'
import { useAuth } from '@/lib/auth'

type DetailTab = 'Overview' | 'Specs' | 'Documents'
const detailTabs: DetailTab[] = ['Overview', 'Specs', 'Documents']

function Money({ value, plus = false, big = false }: { value: number; plus?: boolean; big?: boolean }) {
  return (
    <span className={`font-medium text-brand ${big ? 'text-xl sm:text-[26px]' : 'text-lg sm:text-xl'}`}>
      {plus && '+'}
      {formatMoney(value)} <span className="text-xs font-light text-icon">JOD</span>
    </span>
  )
}

export default function AuctionDetailsPage({ id, route }: { id: string; route: string }) {
  const a = getAuction(id)
  const { t, auction, rtl } = useI18n()
  const loc = auction(a)
  const { loggedIn } = useAuth()
  const [imageIndex, setImageIndex] = useState(0)
  const [tab, setTab] = useState<DetailTab>('Overview')
  const [liked, setLiked] = useState(false)
  const [depositPaid, setDepositPaid] = useState(false)
  const [currentBid, setCurrentBid] = useState(a.currentBid)

  const badge: BadgeKind = a.status === 'coming-soon' ? 'coming-soon' : a.status === 'ending-soon' ? 'live-ending' : a.status === 'finished' ? 'finished' : 'live'
  const canPayDeposit = loggedIn && !depositPaid
  const canBid = loggedIn && depositPaid && a.status !== 'finished'

  const prev = () => setImageIndex((i) => (i - 1 + a.gallery.length) % a.gallery.length)
  const next = () => setImageIndex((i) => (i + 1) % a.gallery.length)
  const Prev = rtl ? ChevronRightIcon : ChevronLeftIcon
  const Next = rtl ? ChevronLeftIcon : ChevronRightIcon

  return (
    <div className="min-h-screen bg-page">
      <Navbar active={route} />

      <main className="mx-auto max-w-[1356px] px-4 sm:px-[41px]">
        <nav aria-label="Breadcrumb" className="mt-6 text-sm text-muted sm:mt-8 sm:text-base">
          <Link to="/auctions" className="hover:text-brand">{t('Auctions')}</Link> / <span>{loc.category}</span> / <span>{t('Auction')} <bdi>{a.code}</bdi></span>
        </nav>

        <h1 className="mt-4 text-xl font-semibold text-ink sm:mt-5 sm:text-[26px]">{loc.title}</h1>

        <div className="mt-4 flex flex-wrap gap-3 sm:mt-5 sm:gap-[30px]">
          <StatusBadge kind={badge} />
          {!depositPaid && a.status !== 'finished' && <StatusBadge kind="deposit-required" />}
          {!loggedIn && <StatusBadge kind="verification-required" />}
        </div>

        <div className="mt-6 grid gap-[18px] lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <div>
            <div className="relative overflow-hidden rounded-lg border-2 border-brand">
              <PropertyImage key={imageIndex} src={a.gallery[imageIndex]} alt={loc.title} className="animate-fade-up h-[240px] w-full sm:h-[358px]" />
              <span className="absolute top-4 start-4 rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-white sm:top-6 sm:start-6 sm:px-4 sm:py-2 sm:text-[15px]">{loc.category}</span>
              <button type="button" aria-pressed={liked} aria-label="Add to favourites" onClick={() => setLiked((v) => !v)} className="absolute top-4 end-4 flex size-9 items-center justify-center rounded-full bg-white sm:top-6 sm:end-6">
                <span key={String(liked)} className={liked ? 'animate-heart text-red-500' : ''}><HeartIcon width={18} height={18} fill={liked ? 'currentColor' : 'none'} /></span>
              </button>
              <button type="button" aria-label="Previous image" onClick={prev} className="absolute top-1/2 start-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur sm:start-4"><Prev /></button>
              <button type="button" aria-label="Next image" onClick={next} className="absolute top-1/2 end-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur sm:end-4"><Next /></button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:mt-6 sm:gap-6">
              {a.gallery.map((src, i) => (
                <button key={src} type="button" aria-label={`Show image ${i + 1}`} aria-current={i === imageIndex} onClick={() => setImageIndex(i)} className={`overflow-hidden rounded-lg transition-transform hover:-translate-y-0.5 ${i === imageIndex ? 'ring-2 ring-brand' : ''}`}>
                  <PropertyImage src={src} alt="" className="h-[80px] w-full sm:h-[119px]" />
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-black/10 bg-white shadow-sm sm:mt-8">
              <div role="tablist" className="flex items-center overflow-x-auto border-b border-black/10 px-[18px] text-base text-ink">
                {detailTabs.map((tb, i) => (
                  <div key={tb} className="flex items-center">
                    {i > 0 && <span className="mx-4 h-4 w-px bg-black/20 sm:mx-6" />}
                    <button role="tab" type="button" aria-selected={tab === tb} onClick={() => setTab(tb)} className={`py-3 whitespace-nowrap ${tab === tb ? 'border-b-2 border-brand font-medium text-brand' : ''}`}>{t(tb)}</button>
                  </div>
                ))}
              </div>

              <div className="p-[18px]">
                {tab === 'Overview' && (
                  <>
                    <p className="flex items-center gap-3 text-lg font-medium text-ink sm:text-xl"><PinIcon width={20} height={20} /> {loc.area}, {loc.location}</p>
                    <p className="mt-4 text-base leading-7 text-muted sm:text-xl sm:leading-[30px]">{loc.description}</p>
                    <div className="mt-6 grid gap-4 rounded-lg bg-[#f7f8f8] p-4 text-center sm:grid-cols-3 sm:divide-x sm:divide-black/15 rtl:sm:divide-x-reverse">
                      <div><p className="text-base text-ink sm:text-xl">{t('Starting Price')}</p><p className="mt-2 sm:mt-3"><Money value={a.startingPrice} big /></p></div>
                      <div><p className="text-base text-ink sm:text-xl">{t('Market Price')}</p><p className="mt-2 sm:mt-3"><Money value={a.marketPrice} big /></p></div>
                      <div><p className="text-base text-ink sm:text-xl">{t('Min Bid Increment')}</p><p className="mt-2 sm:mt-3"><Money value={a.minBidIncrement} plus big /></p></div>
                    </div>
                  </>
                )}
                {tab === 'Specs' && (
                  <dl className="grid grid-cols-2 gap-4 text-base sm:text-lg">
                    <dt className="text-muted">{t('Property type')}</dt><dd>{loc.type}</dd>
                    <dt className="text-muted">{t('Land size')}</dt><dd dir="ltr" className="text-start">{a.landSize} m²</dd>
                    <dt className="text-muted">{t('Location')}</dt><dd>{loc.area}, {loc.location}</dd>
                    <dt className="text-muted">{t('Auction code')}</dt><dd dir="ltr" className="text-start">{a.code}</dd>
                  </dl>
                )}
                {tab === 'Documents' && <p className="text-base text-muted sm:text-lg">{t('Title deed and transfer documents are available after verification.')}</p>}
              </div>
            </div>

            {/* Location on Google Maps */}
            <section className="mt-6 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm sm:mt-8" aria-label={t('Location on map')}>
              <div className="flex items-center justify-between gap-3 px-[18px] py-3">
                <h2 className="flex items-center gap-2 text-base font-semibold text-ink sm:text-lg"><PinIcon width={18} height={18} className="text-brand" /> {t('Location on map')}</h2>
                <a href={googleMapsLink(a.lat, a.lng)} target="_blank" rel="noreferrer" className="rounded-md border border-brand px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">{t('Open in Google Maps')}</a>
              </div>
              {hasMapsKey ? (
                <GoogleMap className="h-[260px] sm:h-[320px]" pins={[{ id: a.id, lat: a.lat, lng: a.lng, title: loc.title, live: a.status === 'live' || a.status === 'ending-soon', ended: a.status === 'finished' }]} selectedId={a.id} center={{ lat: a.lat, lng: a.lng }} zoom={14} />
              ) : (
                <EmbedMap lat={a.lat} lng={a.lng} title={loc.title} className="h-[260px] w-full sm:h-[320px]" />
              )}
              <p className="px-[18px] py-2 text-[11px] text-muted">{t('Approximate area – the exact plot is shared after verification.')}</p>
            </section>
          </div>

          {/* Right column */}
          <aside className="space-y-6 sm:space-y-7">
            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-[25px]">
              <h2 className="border-b border-black/10 pb-3 text-center text-xl text-ink sm:text-[26px]">{t('Deposit Status')}</h2>
              <div className={`mt-5 rounded-md py-3.5 text-center text-lg sm:text-xl ${depositPaid ? 'bg-[#e6f4ea] text-[#2e7d32]' : 'bg-[#f9e6e6] text-[#d0021b]'}`}>{depositPaid ? t('Deposit Paid') : t('Deposit Required')}</div>
              {!loggedIn && <p className="mt-4 text-sm text-ink">*{t('Please Login to pay deposit')}</p>}
              <button type="button" disabled={!canPayDeposit} onClick={() => setDepositPaid(true)} className={`mt-6 w-full rounded-md py-3.5 text-lg font-medium transition-colors sm:py-4 sm:text-xl ${canPayDeposit ? 'btn-shine bg-brand text-white hover:bg-brand-700' : 'bg-[#d0d0d0] text-white/90'}`}>{t('Pay Deposit')}</button>
            </section>

            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-center text-lg text-ink sm:text-xl">{t('Current Bid')}</p>
              <p className="mt-2 text-center" dir="ltr">
                <span key={currentBid} className="animate-fade-up inline-block text-4xl font-medium text-brand sm:text-[44px]">{formatMoney(currentBid)}</span>{' '}
                <span className="text-xl font-light text-icon sm:text-2xl">JOD</span>
              </p>

              <dl className="mt-5 space-y-4 border-t border-black/10 pt-5 text-base text-ink sm:space-y-5 sm:text-lg">
                <div className="flex items-center justify-between gap-2"><dt>{t('Starting Price')}</dt><dd><Money value={a.startingPrice} /></dd></div>
                <div className="flex items-center justify-between gap-2"><dt>{t('Market Price')}</dt><dd><Money value={a.marketPrice} /></dd></div>
                <div className="flex items-center justify-between gap-2"><dt>{t('Min Bid Increment')}</dt><dd><Money value={a.minBidIncrement} plus /></dd></div>
              </dl>

              <div className="mt-6 border-t border-black/10 pt-6">
                <p className="text-center text-base text-ink">{t('Auction Ends In')}</p>
                <div className="mt-3"><CountdownTimer endsAt={a.endsAt} size="lg" /></div>
              </div>

              <button type="button" disabled={!canBid} onClick={() => setCurrentBid((b) => b + a.minBidIncrement)} className={`mt-8 w-full rounded-md py-3.5 text-lg font-medium transition-colors sm:py-4 sm:text-xl ${canBid ? 'btn-shine bg-brand text-white hover:bg-brand-700' : 'bg-[#cfcfcf] text-white/90'}`}>{t('Place Bid')}</button>
              {!canBid && <p className="mt-4 text-sm text-ink">*{t(a.status === 'finished' ? 'This auction has ended' : 'Deposit is required to bid')}</p>}
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
