import { useEffect, useMemo, useState } from 'react'
import { auctions, formatMoney } from '@/data/auctions'
import { useI18n } from '@/lib/i18n'
import { Link } from '@/lib/router'
import { DEAD_SEA, OUTLINE, VIEW, project, toPath } from '@/lib/jordan'
import { CountUp } from './Reveal'
import { LiveDot } from './LiveDot'
import { PropertyImage } from './PropertyImage'

const CITY: Record<string, { en: string; ar: string; lat: number; lng: number }> = {
  Amman: { en: 'Amman', ar: 'عمّان', lat: 31.95, lng: 35.91 },
  Zarqa: { en: 'Zarqa', ar: 'الزرقاء', lat: 32.07, lng: 36.09 },
  Irbid: { en: 'Irbid', ar: 'إربد', lat: 32.55, lng: 35.85 },
  Aqaba: { en: 'Aqaba', ar: 'العقبة', lat: 29.53, lng: 35.0 },
}
const cityOf = (loc: string) => loc.replace(/ (West|East)$/, '')

/** Modern replacement for the old "View Live Auctions on Map" shortcut: dark map card with glowing live pins. */
export function HomeMapBanner() {
  const { t, lang, auction } = useI18n()
  const active = useMemo(() => auctions.filter((a) => a.status !== 'finished'), [])
  const live = useMemo(() => active.filter((a) => a.status === 'live' || a.status === 'ending-soon'), [active])
  const ending = live.filter((a) => a.status === 'ending-soon').length

  const cities = useMemo(
    () => Object.keys(CITY).map((k) => ({ key: k, ...CITY[k], total: active.filter((a) => cityOf(a.location) === k).length, live: live.filter((a) => cityOf(a.location) === k).length })),
    [active, live],
  )

  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % live.length), 4000)
    return () => clearInterval(id)
  }, [live.length])
  const spotlight = live[i]
  const sl = auction(spotlight)

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-[#1c5a4b] to-[#0f342b] text-white shadow-[0_20px_50px_rgba(25,75,63,0.35)]">
      {/* dotted grid + soft glows */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div className="pointer-events-none absolute -top-24 -end-16 size-72 rounded-full bg-gold/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 start-10 size-72 rounded-full bg-brand-400/30 blur-3xl" />

      <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:p-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur">
            <LiveDot className="text-red-400" size={8} /> {t('{n} auctions live right now', { n: live.length })}
          </span>
          <h2 className="mt-5 font-serif text-[28px] leading-tight font-bold sm:text-4xl">{t('Explore live auctions on the map')}</h2>
          <p className="mt-3 max-w-[460px] text-sm leading-relaxed text-white/80 sm:text-base">{t('See every property across Jordan, spot what is live right now and jump straight into the bidding.')}</p>

          <div className="mt-6 grid max-w-[460px] grid-cols-3 gap-3 text-center">
            {[
              { n: live.length, l: 'Live now' },
              { n: ending, l: 'Ending soon' },
              { n: active.length, l: 'Properties' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/10 px-2 py-3 backdrop-blur">
                <p className="text-2xl font-semibold text-gold-100"><CountUp to={s.n} /></p>
                <p className="mt-0.5 text-[11px] text-white/75">{t(s.l)}</p>
              </div>
            ))}
          </div>

          <Link to="/map" className="btn-shine mt-7 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5 hover:bg-gold-300">
            {t('View Auction Map')} <span aria-hidden className="rtl:-scale-x-100">→</span>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <svg viewBox={`0 0 ${VIEW.W} ${VIEW.H}`} role="img" aria-label={t('Map of Jordan with auction locations')} className="h-auto w-full" dir="ltr">
            <defs>
              <linearGradient id="mb-land" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.2" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.07" />
              </linearGradient>
            </defs>
            <path d={toPath(OUTLINE)} fill="url(#mb-land)" stroke="#f7d14e" strokeOpacity="0.55" strokeWidth="1.5" strokeLinejoin="round" />
            <path d={toPath(DEAD_SEA)} fill="#7fd0ff" fillOpacity="0.45" />
            {cities.map((c) => {
              const p = project(c.lng, c.lat)
              const hasLive = c.live > 0
              const label = lang === 'ar' ? c.ar : c.en
              const left = c.key === 'Amman'
              return (
                <g key={c.key}>
                  {hasLive && (
                    <>
                      <circle cx={p.x} cy={p.y} r="9" fill="#ff5a5a" className="origin-center [transform-box:fill-box] animate-[ping-ring_1.9s_cubic-bezier(0,0,.2,1)_infinite]" />
                      <circle cx={p.x} cy={p.y} r="9" fill="#ff5a5a" className="origin-center [transform-box:fill-box] animate-[ping-ring_1.9s_cubic-bezier(0,0,.2,1)_0.9s_infinite]" />
                    </>
                  )}
                  <circle cx={p.x} cy={p.y} r="10" fill={hasLive ? '#e03d3d' : '#d4a041'} stroke="#fff" strokeWidth="2.5" />
                  <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{c.total}</text>
                  <text x={left ? p.x - 16 : p.x + 16} y={p.y + 4} textAnchor={left ? 'end' : 'start'} fontSize="11" fontWeight="600" fill="#fff">{label}</text>
                </g>
              )
            })}
          </svg>

          {/* live spotlight card */}
          <Link to={`/auctions/${spotlight.id}`} key={spotlight.id} className="animate-float absolute end-0 bottom-2 flex w-[230px] items-center gap-3 rounded-2xl bg-white p-2.5 text-ink shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:-end-2">
            <PropertyImage src={spotlight.image} alt="" className="size-14 shrink-0 rounded-xl" />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600"><LiveDot size={7} /> {t('LIVE')}</span>
              <span className="block truncate text-xs font-semibold">{sl.title}</span>
              <span className="block text-xs font-semibold text-brand">{formatMoney(spotlight.currentBid)} <span className="font-normal text-icon">JOD</span></span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
