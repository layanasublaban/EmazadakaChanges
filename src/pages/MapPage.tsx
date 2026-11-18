import { useMemo, useState } from 'react'
import { auctions, formatMoney } from '@/data/auctions'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { PageHeader } from '@/components/PageHeader'
import { PropertyImage } from '@/components/PropertyImage'
import { GoogleMap, hasMapsKey } from '@/components/GoogleMap'
import { LiveDot } from '@/components/LiveDot'
import { useI18n } from '@/lib/i18n'
import { AR, AR_AREAS, AR_LOCATIONS } from '@/lib/ar'
import { Link, navigate } from '@/lib/router'

/* Schematic map of Jordan (no external tiles needed). Coordinates are [lng, lat]. */
const OUTLINE: [number, number][] = [
  [35.55, 32.72], [36.6, 32.38], [37.2, 32.3], [38.8, 33.37], [39.3, 32.35], [38.0, 30.5], [37.6, 30.35],
  [37.0, 29.98], [36.0, 29.2], [35.0, 29.35], [34.95, 29.55], [35.1, 30.1], [35.3, 30.8], [35.45, 31.3], [35.5, 31.8], [35.55, 32.4],
]
const DEAD_SEA: [number, number][] = [[35.4, 31.2], [35.55, 31.2], [35.58, 31.75], [35.46, 31.78]]
const CITIES = [
  { n: 'Amman', lng: 35.91, lat: 31.95 }, { n: 'Irbid', lng: 35.85, lat: 32.55 }, { n: 'Zarqa', lng: 36.09, lat: 32.07 },
  { n: 'Aqaba', lng: 35.0, lat: 29.53 }, { n: 'Petra', lng: 35.44, lat: 30.33 }, { n: 'Karak', lng: 35.7, lat: 31.18 },
]
const W = 460
const H = 440
const VIEWS = {
  jordan: { minLng: 34.8, maxLat: 33.5, sx: 85, sy: 100 },
  amman: { minLng: 35.72, maxLat: 32.1, sx: 935, sy: 1100 },
}
type ViewKey = keyof typeof VIEWS

export default function MapPage({ route }: { route: string }) {
  const { t, auction, lang, rtl } = useI18n()
  const [view, setView] = useState<ViewKey>('jordan')
  const [selected, setSelected] = useState<string | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [status, setStatus] = useState<'all' | 'live' | 'coming-soon' | 'ending-soon'>('all')
  const v = VIEWS[view]
  const pt = (lng: number, lat: number) => ({ x: (lng - v.minLng) * v.sx, y: (v.maxLat - lat) * v.sy })
  const path = (pts: [number, number][]) => pts.map(([lng, lat], i) => `${i ? 'L' : 'M'}${pt(lng, lat).x.toFixed(1)},${pt(lng, lat).y.toFixed(1)}`).join('') + 'Z'
  const place = (k: string) => (lang === 'ar' ? AR_AREAS[k] ?? AR_LOCATIONS[k] ?? AR[k] ?? k : k)

  const visible = useMemo(() => auctions.filter((a) => a.status !== 'finished' && (status === 'all' || a.status === status)), [status])
  const groups = useMemo(() => {
    const m = new Map<string, { area: string; lat: number; lng: number; items: typeof auctions; live: number }>()
    for (const a of visible) {
      // Kingdom view groups by city so pins don't pile up; the zoomed view shows neighbourhoods.
      const key = view === 'jordan' ? a.location.replace(/ (West|East)$/, '') : a.area
      const g = m.get(key) ?? { area: key, lat: 0, lng: 0, items: [], live: 0 }
      g.items.push(a)
      if (a.status === 'live' || a.status === 'ending-soon') g.live++
      g.lat += a.lat
      g.lng += a.lng
      m.set(key, g)
    }
    return [...m.values()].map((g) => ({ ...g, lat: g.lat / g.items.length, lng: g.lng / g.items.length }))
  }, [visible, view])
  const sel = groups.find((g) => g.area === selected)
  const liveTotal = visible.filter((a) => a.status === 'live' || a.status === 'ending-soon').length
  const pins = useMemo(
    () => visible.map((a) => ({ id: a.id, lat: a.lat, lng: a.lng, title: auction(a).title, live: a.status === 'live' || a.status === 'ending-soon' })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible, lang],
  )
  const Back = rtl ? '→' : '←'

  return (
    <div className="min-h-screen bg-page">
      <Navbar active={route} />
      <PageHeader title="Auction Map" subtitle="See where Emazadak properties are across Jordan. Select an area to browse its auctions.">
        <div className="flex flex-wrap gap-2">
          {([['all', 'All'], ['live', 'Live'], ['ending-soon', 'Ending soon'], ['coming-soon', 'Coming soon']] as const).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={status === k} onClick={() => setStatus(k)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors sm:px-4 ${status === k ? 'border-brand bg-brand font-semibold text-white' : 'border-brand-400 text-brand-600 hover:bg-brand-50'}`}>
              {k === 'live' && <LiveDot className={status === k ? 'text-white' : 'text-red-500'} />}{t(l)}
            </button>
          ))}
        </div>
      </PageHeader>

      <main className="mx-auto mt-6 grid max-w-[1356px] gap-5 px-4 sm:mt-8 sm:gap-6 sm:px-[41px] lg:grid-cols-[1fr_380px]">
        <section className="relative overflow-hidden rounded-2xl border border-gold/50 bg-gradient-to-b from-[#dfe8e5] to-[#eef3f1] shadow">
          {hasMapsKey ? (
            <GoogleMap className="h-[420px] sm:h-[560px]" pins={pins} selectedId={hoverId} onSelect={(id) => navigate(`/auctions/${id}`)} />
          ) : (
            <>
              <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t('Map of Jordan with auction locations')} className="mx-auto h-auto max-h-[620px] w-full" dir="ltr">
                <path d={path(OUTLINE)} fill="#f7f4ea" stroke="#316c5e" strokeWidth={view === 'jordan' ? 1.5 : 3} strokeLinejoin="round" />
                <path d={path(DEAD_SEA)} fill="#a8d3e6" stroke="#7fb6cf" />
                {CITIES.filter((c) => view === 'amman' || ['Petra', 'Karak'].includes(c.n)).map((c) => {
                  const p = pt(c.lng, c.lat)
                  if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) return null
                  return (
                    <g key={c.n}>
                      <circle cx={p.x} cy={p.y} r={2.5} fill="#5a5a5a" />
                      <text x={p.x + 6} y={p.y + 3} fontSize={view === 'jordan' ? 9 : 12} fill="#5a5a5a">{lang === 'ar' ? ({ Amman: 'عمّان', Irbid: 'إربد', Zarqa: 'الزرقاء', Aqaba: 'العقبة', Petra: 'البتراء', Karak: 'الكرك' } as Record<string, string>)[c.n] : c.n}</text>
                    </g>
                  )
                })}
                {groups.map((g) => {
                  const p = pt(g.lng, g.lat)
                  if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) return null
                  const r = view === 'jordan' ? 7 + Math.min(g.items.length, 25) * 0.14 : 9 + Math.min(g.items.length, 12) * 0.9
                  const on = g.area === selected
                  const col = on ? '#d4a041' : '#194b3f'
                  return (
                    <g key={g.area} role="button" tabIndex={0} aria-label={`${place(g.area)}: ${g.items.length}`} className="cursor-pointer outline-none"
                      onClick={() => setSelected(on ? null : g.area)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelected(on ? null : g.area)}>
                      {g.live > 0 && (
                        <>
                          <circle className="svg-pulse" cx={p.x} cy={p.y} r={r} fill="#e03d3d" />
                          <circle className="svg-pulse" style={{ animationDelay: '0.9s' }} cx={p.x} cy={p.y} r={r} fill="#e03d3d" />
                        </>
                      )}
                      <circle cx={p.x} cy={p.y} r={r + 4} fill={col} opacity={0.18} />
                      <circle cx={p.x} cy={p.y} r={r} fill={col} stroke="#fff" strokeWidth={2} />
                      <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={on ? '#2c2c2c' : '#fff'}>{g.items.length}</text>
                      {g.live > 0 && <circle cx={p.x + r * 0.75} cy={p.y - r * 0.75} r={3.2} fill="#e03d3d" stroke="#fff" strokeWidth={1.2} />}
                      {view === 'amman' ? (
                        <text x={p.x} y={p.y - r - 5} textAnchor="middle" fontSize={11} fontWeight={500} fill="#194b3f">{place(g.area)}</text>
                      ) : (
                        <text x={g.area === 'Amman' ? p.x - r - 4 : p.x + r + 4} y={p.y + 3} textAnchor={g.area === 'Amman' ? 'end' : 'start'} fontSize={9} fontWeight={500} fill="#194b3f">{place(g.area)}</text>
                      )}
                    </g>
                  )
                })}
              </svg>
              <button type="button" onClick={() => { setView(view === 'jordan' ? 'amman' : 'jordan'); setSelected(null) }}
                className="absolute top-3 start-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand shadow hover:bg-brand-50 sm:top-4 sm:start-4 sm:px-4">
                {view === 'jordan' ? t('Zoom to Amman & Zarqa') : t('Show all of Jordan')}
              </button>
              <p className="absolute end-3 bottom-3 rounded bg-white/80 px-2 py-1 text-[10px] text-muted">{t('Schematic map · {n} active properties', { n: visible.length })}</p>
            </>
          )}
          <p className="absolute start-3 bottom-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-red-600 shadow">
            <LiveDot /> {t('{n} auctions live right now', { n: liveTotal })}
          </p>
        </section>

        <aside className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-semibold text-ink">{sel ? `${place(sel.area)} (${sel.items.length})` : t('Areas')}</h2>
          {!sel ? (
            <ul className="mt-4 space-y-2">
              {[...groups].sort((a, b) => b.items.length - a.items.length).map((g) => (
                <li key={g.area}>
                  <button type="button" onClick={() => setSelected(g.area)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg bg-brand-50 px-4 py-3 text-start text-sm transition-colors hover:bg-brand-200/40">
                    <span className="flex items-center gap-2 font-medium text-ink">{place(g.area)}{g.live > 0 && <span className="flex items-center gap-1 text-[11px] font-semibold text-red-600"><LiveDot size={6} />{g.live} {t('LIVE')}</span>}</span>
                    <span className="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white">{g.items.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <button type="button" onClick={() => setSelected(null)} className="mt-1 text-xs font-semibold text-brand hover:underline">{Back} {t('All areas')}</button>
              <ul className="mt-4 max-h-[520px] space-y-3 overflow-auto pe-1">
                {sel.items.map((a) => {
                  const l = auction(a)
                  const isLive = a.status === 'live' || a.status === 'ending-soon'
                  return (
                    <li key={a.id} onMouseEnter={() => setHoverId(a.id)} onMouseLeave={() => setHoverId(null)}>
                      <Link to={`/auctions/${a.id}`} className="flex gap-3 rounded-lg border border-black/5 p-2.5 transition-colors hover:bg-brand-50">
                        <PropertyImage src={a.image} alt="" className="size-16 shrink-0 rounded-md" />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-ink">{l.title}</span>
                          <span className="flex items-center gap-1.5 text-[11px] text-muted">{isLive && <LiveDot size={6} />}{l.type}</span>
                          <span className="block text-xs font-semibold text-brand">{formatMoney(a.currentBid)} JOD</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </aside>
      </main>
      <Footer />
    </div>
  )
}
