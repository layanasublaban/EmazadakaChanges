import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/lib/router'
import { useI18n } from '@/lib/i18n'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'
import { PropertyImage } from './PropertyImage'

const ads = [
  { tag: 'Featured', title: 'Luxury villas in Amman', text: 'Abdoun, Dabouq and Khalda estates with clear title deeds – bid live from anywhere.', cta: 'Browse villas', to: '/auctions?q=villa', image: '/images/ads/ad-1.svg' },
  { tag: 'Land', title: 'Land plots from 20,000 JOD', text: 'Residential, commercial and industrial plots across Amman, Zarqa, Irbid and Aqaba.', cta: 'Explore land', to: '/auctions?q=land', image: '/images/ads/ad-2.svg' },
  { tag: 'Live now', title: 'Bid live, in real time', text: 'Follow running auctions, place bids in one tap and watch the countdown to the hammer.', cta: 'Go to live bidding', to: '/live-bidding', image: '/images/ads/ad-3.svg' },
  { tag: 'Direct offers', title: 'Skip the wait – make an offer', text: 'Negotiate directly with sellers on selected properties and close faster.', cta: 'See direct offers', to: '/offers', image: '/images/ads/ad-4.svg' },
  { tag: 'For owners', title: 'List your property with Emazadak', text: 'Reach verified bidders across Jordan with a transparent, fully digital auction.', cta: 'List a property', to: '/list-property', image: '/images/ads/ad-5.svg' },
]

const INTERVAL = 6000

/** Auto-advancing ad slider (every 6s) with a sliding transition, progress dots, arrows, swipe and pause-on-hover. */
export function AdsCarousel() {
  const { t, rtl } = useI18n()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [touchX, setTouchX] = useState<number | null>(null)
  const next = useCallback(() => setI((v) => (v + 1) % ads.length), [])
  const prev = () => setI((v) => (v - 1 + ads.length) % ads.length)

  useEffect(() => {
    if (paused) return
    const id = setTimeout(next, INTERVAL)
    return () => clearTimeout(id)
  }, [i, paused, next])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Ads"
      dir="ltr"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return
        const dx = e.changedTouches[0].clientX - touchX
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
        setTouchX(null)
      }}
      className="relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {ads.map((ad, n) => (
          <div key={ad.title} className="relative h-[320px] w-full shrink-0 sm:h-[300px]" aria-hidden={n !== i} role="group" aria-label={`${n + 1} / ${ads.length}`}>
            <PropertyImage src={ad.image} alt="" className="size-full" />
            <div className={`absolute inset-0 ${rtl ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-brand/95 via-brand/75 to-brand/10 max-sm:from-brand/90 max-sm:via-brand/70`} />
            <div
              key={n === i ? `on-${i}` : `off-${n}`}
              dir={rtl ? 'rtl' : 'ltr'}
              className={`absolute inset-y-0 flex max-w-[640px] flex-col justify-center px-6 pb-8 text-white sm:px-12 ${rtl ? 'right-0' : 'left-0'} ${n === i ? 'animate-fade-up' : ''}`}
            >
              <span className="w-fit rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-ink">{t(ad.tag)}</span>
              <h3 className="mt-3 font-serif text-2xl leading-tight font-bold sm:mt-4 sm:text-[34px]">{t(ad.title)}</h3>
              <p className="mt-2 max-w-[460px] text-sm leading-relaxed text-white/90 sm:mt-3 sm:text-[15px]">{t(ad.text)}</p>
              <Link to={ad.to} tabIndex={n === i ? 0 : -1} className="btn-shine mt-4 w-fit rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-gold-50 sm:mt-6">
                {t(ad.cta)} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button type="button" aria-label="Previous ad" onClick={prev} className="absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-110 sm:flex">
        <ChevronLeftIcon width={18} height={18} />
      </button>
      <button type="button" aria-label="Next ad" onClick={next} className="absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-110 sm:flex">
        <ChevronRightIcon width={18} height={18} />
      </button>

      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {ads.map((ad, n) => (
          <button key={ad.title} type="button" aria-label={`Go to ad ${n + 1}`} aria-current={n === i} onClick={() => setI(n)} className={`relative h-1.5 overflow-hidden rounded-full bg-white/50 transition-all ${n === i ? 'w-10' : 'w-4'}`}>
            {n === i && (
              <span
                key={`${i}-${paused}`}
                className={`absolute inset-0 rounded-full bg-gold ${paused ? '' : 'animate-progress'}`}
                style={{ '--dur': `${INTERVAL}ms`, transform: paused ? 'scaleX(1)' : undefined, transformOrigin: 'left' } as React.CSSProperties}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
