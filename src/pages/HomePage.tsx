import { useEffect, useState } from 'react'
import { auctions } from '@/data/auctions'
import { AuctionCard } from '@/components/AuctionCard'
import { Footer } from '@/components/Footer'
import { AppleIcon, ChevronLeftIcon, ChevronRightIcon, PinIcon, PlayIcon, SearchIcon } from '@/components/Icons'
import { Navbar } from '@/components/Navbar'
import { PropertyImage } from '@/components/PropertyImage'
import { Link } from '@/lib/router'

const ads = [
  { id: 1, text: 'ADS about our latest auctions!' },
  { id: 2, text: 'ADS about our latest auctions!' },
  { id: 3, text: 'ADS about our latest auctions!' },
  { id: 4, text: 'ADS about our latest auctions!' },
]

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
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % ads.length), 5000)
    return () => clearInterval(id)
  }, [])

  const featured = auctions.filter((a) => !a.directOffer).slice(0, 6)
  const direct = auctions.filter((a) => a.directOffer).slice(0, 6)

  return (
    <div className="min-h-screen bg-page">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef0ef] to-page pt-9 pb-24">
        <PropertyImage
          src="/images/hero-buildings.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 size-full opacity-40"
        />
        <div className="relative px-[41px]">
          <Navbar active="/" variant="light" />

          <div className="mx-auto mt-24 max-w-[1356px]">
            <h1 className="font-serif text-[46px] leading-[1.45] font-bold text-brand">Accelerate, Elevate,&amp; Innovate.</h1>
            <p className="font-serif text-[46px] leading-[1.45] font-bold text-gold">Find your next Property</p>
            <p className="mt-3 font-serif text-[27px] font-bold text-brand">Driving Innovation in Estate Auction Technology</p>
            <Link
              to="/auctions"
              className="mt-6 inline-block rounded bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Browse Auctions
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1356px] px-[41px]">
        {/* Search */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            window.location.hash = '/auctions'
          }}
          className="-mt-8 flex items-center rounded-md border border-black/10 bg-[#e6e6e6] px-6 py-[18px] shadow-sm"
        >
          <input
            aria-label="Search by auction or property"
            placeholder="Search by auction or Property"
            className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted focus:outline-none"
          />
          <button type="submit" aria-label="Search" className="text-icon">
            <SearchIcon width={24} height={24} />
          </button>
        </form>

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
        <section className="mt-20" aria-roledescription="carousel" aria-label="Ads">
          <div className="flex items-center justify-center gap-5 overflow-hidden">
            {[-1, 0, 1].map((d) => {
              const ad = ads[(slide + d + ads.length) % ads.length]
              const center = d === 0
              return (
                <div
                  key={`${slide}-${d}`}
                  className={`relative shrink-0 overflow-hidden rounded-lg shadow ${
                    center ? 'h-[205px] w-[880px]' : 'h-[170px] w-[250px] opacity-90'
                  }`}
                >
                  <PropertyImage src="/images/properties/valley-mountains.jpg" alt="" className="size-full" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className={`font-bold text-white ${center ? 'text-[26px]' : 'text-lg'}`}>{ad.text}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex justify-center gap-1.5">
            {ads.map((ad, i) => (
              <button
                key={ad.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === slide}
                onClick={() => setSlide(i)}
                className={`size-3.5 rounded-full ${i === slide ? 'bg-gold' : 'bg-gold-100'}`}
              />
            ))}
          </div>
        </section>

        <CardsRow title="Featured Auctions" items={featured} primaryLabel="Place Bid" />
        <CardsRow title="Direct Offers" items={direct} primaryLabel="Place Offer" />

        {/* Download the app */}
        <section className="mx-auto mt-24 flex max-w-[760px] items-center gap-16">
          <div
            aria-hidden
            className="flex h-[310px] w-[152px] shrink-0 items-center justify-center rounded-[28px] border-[5px] border-ink bg-gradient-to-br from-[#4da6ff] via-[#8ee0ff] to-[#b06bff] p-4 text-center text-xs text-ink"
          >
            Insert your Screenshot
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
