import { useCallback, useEffect, useState } from 'react'
import { Link } from '@/lib/router'
import { IMG } from '@/data/auctions'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons'
import { PropertyImage } from './PropertyImage'

const ads = [
  {
    tag: 'Featured',
    title: 'Luxury villas in Amman',
    text: 'Abdoun, Dabouq and Khalda estates with clear title deeds – bid live from anywhere.',
    cta: 'Browse villas',
    to: '/auctions?q=villa',
    image: IMG.pool,
  },
  {
    tag: 'Land',
    title: 'Land plots from 20,000 JOD',
    text: 'Residential, commercial and industrial plots across Amman, Zarqa, Irbid and Aqaba.',
    cta: 'Explore land',
    to: '/auctions?q=land',
    image: IMG.valley,
  },
  {
    tag: 'Live now',
    title: 'Bid live, in real time',
    text: 'Follow running auctions, place bids in one tap and watch the countdown to the hammer.',
    cta: 'Go to live bidding',
    to: '/live-bidding',
    image: IMG.dusk,
  },
  {
    tag: 'Direct offers',
    title: 'Skip the wait – make an offer',
    text: 'Negotiate directly with sellers on selected properties and close faster.',
    cta: 'See direct offers',
    to: '/offers',
    image: IMG.aerial,
  },
  {
    tag: 'For owners',
    title: 'List your property with Emazadak',
    text: 'Reach verified bidders across Jordan with a transparent, fully digital auction.',
    cta: 'List a property',
    to: '/list-property',
    image: IMG.buildings,
  },
]

const INTERVAL = 6000

/** Auto-advancing ad slider (every 6s) with a sliding transition, progress dots, arrows and pause-on-hover. */
export function AdsCarousel() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
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
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {ads.map((ad, n) => (
          <div key={ad.title} className="relative h-[300px] w-full shrink-0" aria-hidden={n !== i} role="group" aria-label={`${n + 1} of ${ads.length}`}>
            <PropertyImage src={ad.image} alt="" className="size-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand/95 via-brand/70 to-transparent" />
            <div key={n === i ? `on-${i}` : `off-${n}`} className={`absolute inset-y-0 left-0 flex max-w-[620px] flex-col justify-center px-12 text-white ${n === i ? 'animate-fade-up' : ''}`}>
              <span className="w-fit rounded-full bg-gold px-3 py-1 text-[11px] font-semibold text-ink">{ad.tag}</span>
              <h3 className="mt-4 font-serif text-[34px] leading-tight font-bold">{ad.title}</h3>
              <p className="mt-3 max-w-[460px] text-[15px] leading-relaxed text-white/90">{ad.text}</p>
              <Link
                to={ad.to}
                tabIndex={n === i ? 0 : -1}
                className="mt-6 w-fit rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand hover:bg-gold-50"
              >
                {ad.cta} →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button type="button" aria-label="Previous ad" onClick={prev} className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white">
        <ChevronLeftIcon width={18} height={18} />
      </button>
      <button type="button" aria-label="Next ad" onClick={next} className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white">
        <ChevronRightIcon width={18} height={18} />
      </button>

      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {ads.map((ad, n) => (
          <button
            key={ad.title}
            type="button"
            aria-label={`Go to ad ${n + 1}`}
            aria-current={n === i}
            onClick={() => setI(n)}
            className={`relative h-1.5 overflow-hidden rounded-full bg-white/50 transition-all ${n === i ? 'w-10' : 'w-4'}`}
          >
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
