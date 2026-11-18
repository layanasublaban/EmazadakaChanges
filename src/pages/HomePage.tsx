import { useEffect, useState } from 'react'
import { auctions } from '@/data/auctions'
import { AuctionCard } from '@/components/AuctionCard'
import { Footer } from '@/components/Footer'
import { AdsCarousel } from '@/components/AdsCarousel'
import { AppleIcon, ChevronLeftIcon, ChevronRightIcon, PinIcon, PlayIcon } from '@/components/Icons'
import { SearchBox } from '@/components/SearchBox'
import { Navbar } from '@/components/Navbar'
import { PropertyImage } from '@/components/PropertyImage'
import { Link } from '@/lib/router'

const heroSlides = [
  { src: '/images/hero-buildings.jpg', title: 'City properties', place: 'Amman · Zarqa · Irbid' },
  { src: '/images/properties/aerial-villa.jpg', title: 'Villas & estates', place: 'Amman West' },
  { src: '/images/properties/valley-mountains.jpg', title: 'Land plots', place: 'Across the Kingdom of Jordan' },
  { src: '/images/properties/modern-villa-pool.jpg', title: 'Luxury villas', place: 'Aqaba · Dead Sea' },
  { src: '/images/properties/house-landscape.jpg', title: 'Family homes', place: 'Irbid · Salt · Madaba' },
  { src: '/images/properties/modern-home-dusk.jpg', title: 'Modern residences', place: 'Abdoun, Amman' },
]

function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 6000)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="relative z-20 pb-16">
      {/* Rotating Jordan property photos */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-brand-50" aria-hidden>
        {heroSlides.map((s, n) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${n === i ? 'opacity-100' : 'opacity-0'}`}>
            <PropertyImage src={s.src} alt="" className={`size-full ${n === i ? 'animate-kenburns' : ''}`} />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-page to-transparent" />
      </div>

      <Navbar active="/" />

      <div className="relative mx-auto mt-16 max-w-[1360px] px-6">
        <h1 className="animate-fade-up font-serif text-[46px] leading-[1.35] font-bold text-brand">Accelerate, Elevate,&amp; Innovate.</h1>
        <p className="animate-fade-up font-serif text-[46px] leading-[1.35] font-bold text-gold [animation-delay:120ms]">Find your next Property</p>
        <p className="animate-fade-up mt-3 font-serif text-[27px] font-bold text-brand [animation-delay:240ms]">Driving Innovation in Estate Auction Technology</p>

        <SearchBox className="animate-fade-up mt-8 max-w-[860px] [animation-delay:360ms]" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Link to="/auctions" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
            Browse Auctions
          </Link>
          <div className="flex items-center gap-4 rounded-full bg-white/85 py-2 pr-4 pl-5 shadow backdrop-blur">
            <div className="text-right leading-tight">
              <p className="text-xs font-semibold text-brand">{heroSlides[i].title}</p>
              <p className="text-[11px] text-muted">{heroSlides[i].place}</p>
            </div>
            <div className="flex gap-1.5">
              {heroSlides.map((s, n) => (
                <button
                  key={s.src}
                  type="button"
                  aria-label={`Show ${s.title}`}
                  aria-current={n === i}
                  onClick={() => setI(n)}
                  className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-gold' : 'w-2 bg-brand/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CardsRow({ title, items, primaryLabel }: { title: string; items: typeof auctions; primaryLabel: string }) {
  const [visible, setVisible] = useState(3)
  const [offset, setOffset] = useState(0)
  const shown = items.slice(offset, offset + visible)

  return (
    <section className="mx-auto mt-16 max-w-[960px]">
      <h2 className="text-center text-[22px] font-semibold text-ink">{title}</h2>
      <div className="relative mt-8">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          className="absolute top-1/2 -left-5 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
        >
          <ChevronLeftIcon width={16} height={16} />
        </button>
        <div className="grid grid-cols-3 gap-5">
          {shown.map((a) => (
            <AuctionCard key={a.id} auction={a} primaryLabel={primaryLabel} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => setOffset((o) => Math.min(items.length - visible, o + 1))}
          className="absolute top-1/2 -right-5 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow"
        >
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setVisible((v) => Math.min(items.length, v + 3))}
          className="rounded border border-brand bg-white px-5 py-1.5 text-sm text-brand hover:bg-brand-50"
        >
          Load More Results
        </button>
      </div>
    </section>
  )
}

export default function HomePage() {
  const featured = auctions.filter((a) => !a.directOffer).slice(0, 6)
  const direct = auctions.filter((a) => a.directOffer).slice(0, 6)

  return (
    <div className="min-h-screen bg-page">
      <Hero />

      <div className="mx-auto max-w-[1356px] px-[41px]">
        {/* Live map banner */}
        <section className="relative mt-12 flex h-[260px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-b from-[#cfd9d6] to-[#e7ecea] shadow">
          {[
            ['left-[24%]', 'top-[10%]'],
            ['left-[11%]', 'top-[56%]'],
            ['left-[84%]', 'top-[16%]'],
            ['left-[71%]', 'top-[52%]'],
            ['left-[33%]', 'top-[74%]'],
            ['left-[82%]', 'top-[78%]'],
          ].map(([x, y], i) => (
            <PinIcon key={i} className={`absolute ${x} ${y} ${i % 3 === 2 ? 'text-gold' : 'text-brand-600'} opacity-70`} />
          ))}
          <h2 className="relative text-[34px] font-medium text-white">View Live Auctions on Map</h2>
          <Link to="/map" className="relative mt-4 rounded bg-brand px-5 py-2.5 text-[15px] font-medium text-white hover:bg-brand-700">
            View Auction Map
          </Link>
        </section>

        {/* Ads carousel */}
        <div className="mt-20">
          <AdsCarousel />
        </div>

        <CardsRow title="Featured Auctions" items={featured} primaryLabel="Place Bid" />
        <CardsRow title="Direct Offers" items={direct} primaryLabel="Place Offer" />

        {/* Download the app */}
        <section className="mx-auto mt-24 flex max-w-[760px] items-center gap-16">
          <div aria-hidden className="relative h-[310px] w-[152px] shrink-0 overflow-hidden rounded-[28px] border-[5px] border-ink bg-white shadow-xl">
            <PropertyImage src="/images/properties/modern-villa-pool.jpg" alt="" className="h-[130px] w-full" />
            <div className="space-y-1.5 p-2.5">
              <p className="text-[8px] font-semibold text-ink">Luxury Villa – Abdoun</p>
              <p className="text-[7px] text-muted">Current bid</p>
              <p className="text-[12px] font-bold text-brand">245,000 JOD</p>
              <div className="flex gap-1 pt-1">
                {['02', '14', '31'].map((n) => (
                  <span key={n} className="flex-1 rounded bg-brand-50 py-1 text-center text-[8px] font-semibold text-brand">{n}</span>
                ))}
              </div>
              <div className="mt-2 rounded bg-brand py-1.5 text-center text-[8px] font-medium text-white">Place Bid</div>
              <div className="rounded border border-brand py-1.5 text-center text-[8px] font-medium text-brand">View Details</div>
            </div>
          </div>
          <div>
            <h2 className="text-[22px] font-semibold text-ink">Download the App</h2>
            <p className="mt-3 max-w-[340px] text-[9px] leading-relaxed text-ink">
              Bid anytime with the Emazadak Auction app. Explore live and upcoming auctions at home, on the move, or
              wherever opportunities arise.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="flex items-center gap-2 rounded bg-brand px-3 py-2 text-white">
                <AppleIcon width={18} height={18} />
                <span className="text-[7px] leading-tight">
                  Download on the
                  <br />
                  <b className="text-[9px]">Apple Store</b>
                </span>
              </a>
              <a href="#" className="flex items-center gap-2 rounded bg-brand px-3 py-2 text-white">
                <PlayIcon width={16} height={16} />
                <span className="text-[7px] leading-tight">
                  Get it on
                  <br />
                  <b className="text-[9px]">Google Play</b>
                </span>
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
