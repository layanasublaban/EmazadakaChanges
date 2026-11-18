import { useEffect, useState } from 'react'
import { auctions } from '@/data/auctions'
import { AdsCarousel } from '@/components/AdsCarousel'
import { AuctionCard } from '@/components/AuctionCard'
import { Footer } from '@/components/Footer'
import { HomeMapBanner } from '@/components/HomeMapBanner'
import { AppleIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@/components/Icons'
import { Navbar } from '@/components/Navbar'
import { PropertyImage } from '@/components/PropertyImage'
import { Reveal } from '@/components/Reveal'
import { SearchBox } from '@/components/SearchBox'
import { useI18n } from '@/lib/i18n'
import { Link } from '@/lib/router'

/* Hero photos exported from the Figma design – used only here, so no photo repeats elsewhere on the site. */
const heroSlides = [
  { src: '/images/hero-buildings.jpg', title: 'City properties', place: 'Amman · Zarqa · Irbid' },
  { src: '/images/properties/aerial-villa.jpg', title: 'Villas & estates', place: 'Amman West' },
  { src: '/images/properties/valley-mountains.jpg', title: 'Land plots', place: 'Across the Kingdom of Jordan' },
  { src: '/images/properties/modern-villa-pool.jpg', title: 'Luxury villas', place: 'Aqaba · Dead Sea' },
  { src: '/images/properties/house-landscape.jpg', title: 'Family homes', place: 'Irbid · Salt · Madaba' },
  { src: '/images/properties/modern-home-dusk.jpg', title: 'Modern residences', place: 'Abdoun, Amman' },
]

function CardsRow({ title, items, primaryLabel }: { title: string; items: typeof auctions; primaryLabel: string }) {
  const { t, rtl } = useI18n()
  const [visible, setVisible] = useState(3)
  const [offset, setOffset] = useState(0)
  const shown = items.slice(offset, offset + visible)
  const Prev = rtl ? ChevronRightIcon : ChevronLeftIcon
  const Next = rtl ? ChevronLeftIcon : ChevronRightIcon

  return (
    <Reveal>
      <section className="mx-auto mt-14 max-w-[960px] sm:mt-16">
        <h2 className="text-center text-xl font-semibold text-ink sm:text-[22px]">{t(title)}</h2>
        <div className="relative mt-6 sm:mt-8">
          <button type="button" aria-label="Previous" onClick={() => setOffset((o) => Math.max(0, o - 1))} className="absolute top-1/2 -start-5 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow transition-transform hover:scale-110 md:flex">
            <Prev width={16} height={16} />
          </button>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
            {shown.map((a) => (
              <div key={a.id} className="w-[82%] shrink-0 snap-center sm:w-[60%] md:w-auto">
                <AuctionCard auction={a} primaryLabel={primaryLabel} />
              </div>
            ))}
          </div>
          <button type="button" aria-label="Next" onClick={() => setOffset((o) => Math.min(items.length - visible, o + 1))} className="absolute top-1/2 -end-5 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow transition-transform hover:scale-110 md:flex">
            <Next width={16} height={16} />
          </button>
        </div>
        <div className="mt-6 text-center sm:mt-8">
          <button type="button" onClick={() => setVisible((v) => Math.min(items.length, v + 3))} className="rounded border border-brand bg-white px-5 py-2 text-sm text-brand transition-colors hover:bg-brand hover:text-white">
            {t('Load More Results')}
          </button>
        </div>
      </section>
    </Reveal>
  )
}

function Hero() {
  const { t, rtl } = useI18n()
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 6000)
    return () => clearInterval(id)
  }, [])
  return (
    <section className="relative z-20 pb-12 sm:pb-16">
      {/* Rotating Jordan property photos */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-brand-50" aria-hidden>
        {heroSlides.map((s, n) => (
          <div key={s.src} className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${n === i ? 'opacity-100' : 'opacity-0'}`}>
            <PropertyImage src={s.src} alt="" className={`size-full ${n === i ? 'animate-kenburns' : ''}`} />
          </div>
        ))}
        <div className={`absolute inset-0 ${rtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-white/95 via-white/75 to-white/10 max-md:from-white/90 max-md:via-white/80 max-md:to-white/55`} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-page to-transparent" />
      </div>

      <Navbar active="/" />

      <div className="relative mx-auto mt-10 max-w-[1360px] px-4 sm:mt-16 sm:px-6">
        <h1 className="animate-fade-up font-serif text-[30px] leading-[1.35] font-bold text-brand sm:text-[46px]">{t('Accelerate, Elevate,& Innovate.')}</h1>
        <p className="animate-fade-up font-serif text-[30px] leading-[1.35] font-bold text-gold [animation-delay:120ms] sm:text-[46px]">{t('Find your next Property')}</p>
        <p className="animate-fade-up mt-3 font-serif text-lg font-bold text-brand [animation-delay:240ms] sm:text-[27px]">{t('Driving Innovation in Estate Auction Technology')}</p>

        <SearchBox className="animate-fade-up mt-6 max-w-[860px] [animation-delay:360ms] sm:mt-8" />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 sm:mt-6">
          <Link to="/auctions" className="btn-shine rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700">
            {t('Browse Auctions')}
          </Link>
          <div className="flex items-center gap-4 rounded-full bg-white/85 py-2 ps-5 pe-4 shadow backdrop-blur">
            <div className="leading-tight">
              <p key={i} className="animate-fade-up text-xs font-semibold text-brand">{t(heroSlides[i].title)}</p>
              <p className="text-[11px] text-muted">{t(heroSlides[i].place)}</p>
            </div>
            <div className="flex gap-1.5">
              {heroSlides.map((s, n) => (
                <button key={s.src} type="button" aria-label={`Show ${s.title}`} aria-current={n === i} onClick={() => setI(n)} className={`h-2 rounded-full transition-all ${n === i ? 'w-6 bg-gold' : 'w-2 bg-brand/30'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  const { t } = useI18n()
  const featured = auctions.filter((a) => !a.directOffer && a.status !== 'finished').slice(0, 6)
  const direct = auctions.filter((a) => a.directOffer && a.status !== 'finished').slice(0, 6)

  return (
    <div className="min-h-screen bg-page">
      <Hero />

      <div className="mx-auto max-w-[1356px] px-4 sm:px-[41px]">
        <Reveal>
          <HomeMapBanner />
        </Reveal>

        <Reveal className="mt-14 sm:mt-20">
          <AdsCarousel />
        </Reveal>

        <CardsRow title="Featured Auctions" items={featured} primaryLabel="Place Bid" />
        <CardsRow title="Direct Offers" items={direct} primaryLabel="Place Offer" />

        {/* Download the app */}
        <Reveal>
          <section className="mx-auto mt-16 flex max-w-[760px] flex-col items-center gap-8 sm:mt-24 sm:flex-row sm:gap-16">
            <div aria-hidden className="animate-float relative h-[310px] w-[152px] shrink-0 overflow-hidden rounded-[28px] border-[5px] border-ink bg-white shadow-xl">
              <PropertyImage src="/images/auth/app.svg" alt="" className="h-[130px] w-full" />
              <div className="space-y-1.5 p-2.5">
                <p className="text-[8px] font-semibold text-ink">{t('Luxury Villa – Abdoun')}</p>
                <p className="text-[7px] text-muted">{t('Current Bid')}</p>
                <p className="text-[12px] font-bold text-brand"><bdi>245,000 JOD</bdi></p>
                <div className="flex gap-1 pt-1">
                  {['02', '14', '31'].map((n) => (
                    <span key={n} className="flex-1 rounded bg-brand-50 py-1 text-center text-[8px] font-semibold text-brand">{n}</span>
                  ))}
                </div>
                <div className="mt-2 rounded bg-brand py-1.5 text-center text-[8px] font-medium text-white">{t('Place Bid')}</div>
                <div className="rounded border border-brand py-1.5 text-center text-[8px] font-medium text-brand">{t('View Details')}</div>
              </div>
            </div>
            <div className="text-center sm:text-start">
              <h2 className="text-xl font-semibold text-ink sm:text-[22px]">{t('Download the App')}</h2>
              <p className="mt-3 max-w-[340px] text-xs leading-relaxed text-ink sm:text-[11px]">{t('Bid anytime with the Emazadak Auction app. Explore live and upcoming auctions at home, on the move, or wherever opportunities arise.')}</p>
              <div className="mt-5 flex justify-center gap-3 sm:justify-start">
                <a href="#" className="flex items-center gap-2 rounded bg-brand px-3 py-2 text-white transition-transform hover:-translate-y-0.5">
                  <AppleIcon width={18} height={18} />
                  <span className="text-[8px] leading-tight">{t('Download on the')}<br /><b className="text-[10px]">{t('Apple Store')}</b></span>
                </a>
                <a href="#" className="flex items-center gap-2 rounded bg-brand px-3 py-2 text-white transition-transform hover:-translate-y-0.5">
                  <PlayIcon width={16} height={16} />
                  <span className="text-[8px] leading-tight">{t('Get it on')}<br /><b className="text-[10px]">Google Play</b></span>
                </a>
              </div>
            </div>
          </section>
        </Reveal>
      </div>

      <Footer />
    </div>
  )
}
