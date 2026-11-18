import { useEffect, useMemo, useState } from 'react'
import { auctions, searchAuctions, type PropertyType } from '@/data/auctions'
import { useQuery } from '@/lib/router'
import { AuctionCard } from '@/components/AuctionCard'
import { Footer } from '@/components/Footer'
import { ChevronDownIcon, FilterIcon, SearchIcon } from '@/components/Icons'
import { Navbar } from '@/components/Navbar'

type Tab = 'All' | 'Direct Offers' | 'Coming Soon' | 'Ending Soon' | 'Finished Auctions'
const tabs: Tab[] = ['All', 'Direct Offers', 'Coming Soon', 'Ending Soon', 'Finished Auctions']

const propertyTypes: PropertyType[] = [
  'Residential Apartment',
  'Residential Property',
  'Vacant Residential Land Plot',
  'Vacant Commercial Land Plot',
  'Residential Building',
  'Commercial Complex',
  'Industrial Land Plot',
  'Factory',
]

const priceRanges = [
  { label: 'Less than ', bold: '50,000', max: 50_000 },
  { label: 'Less than ', bold: '100,000', max: 100_000 },
  { label: 'Less than ', bold: '500,000', max: 500_000 },
  { label: 'Less than ', bold: 'one million', max: 1_000_000 },
]

const locations = ['Amman West', 'Amman East', 'Zarqa', 'Irbid', 'Aqaba']
const PAGE_SIZE = 15

interface Filters {
  types: PropertyType[]
  price: number | null
  location: string
  landMin: number
  landMax: number
}

const emptyFilters: Filters = { types: [], price: null, location: '', landMin: 500, landMax: 1200 }

function FilterTitle({ children, onReset }: { children: string; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[17px] font-medium text-brand">{children}</h3>
      <button type="button" onClick={onReset} className="text-[11px] text-icon underline">
        Reset
      </button>
    </div>
  )
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center justify-between py-[7px] text-[11px] text-ink">
      <span>{children}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-3.5 cursor-pointer appearance-none rounded-[3px] border border-icon bg-white checked:border-gold checked:bg-gold"
      />
    </label>
  )
}

export default function AuctionsPage() {
  const [tab, setTab] = useState<Tab>('All')
  const [draft, setDraft] = useState<Filters>(emptyFilters)
  const [applied, setApplied] = useState<Filters>(emptyFilters)
  const urlQuery = useQuery().get('q') ?? ''
  const [search, setSearch] = useState(urlQuery)
  useEffect(() => {
    setSearch(urlQuery)
    setPage(1)
  }, [urlQuery])
  const [page, setPage] = useState(1)

  const results = useMemo(
    () =>
      searchAuctions(search, auctions).filter((a) => {
        if (tab === 'Direct Offers' && !a.directOffer) return false
        if (tab === 'Coming Soon' && a.status !== 'coming-soon') return false
        if (tab === 'Ending Soon' && a.status !== 'ending-soon') return false
        if (tab === 'Finished Auctions' && a.status !== 'finished') return false
        if (applied.types.length && !applied.types.includes(a.type)) return false
        if (applied.price && a.startingPrice > applied.price) return false
        if (applied.location && a.location !== applied.location) return false
        if (a.landSize < applied.landMin || a.landSize > applied.landMax) return false
        return true
      }),
    [tab, applied, search],
  )

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const current = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleType = (t: PropertyType) =>
    setDraft((d) => ({ ...d, types: d.types.includes(t) ? d.types.filter((x) => x !== t) : [...d.types, t] }))

  return (
    <div className="min-h-screen bg-page">
      <Navbar active="/auctions" />

      <main className="mx-auto max-w-[1356px] px-[41px]">
        {/* Status tabs */}
        <div role="tablist" aria-label="Auction status" className="mt-10 flex gap-3">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => {
                setTab(t)
                setPage(1)
              }}
              className={`rounded-md border px-5 py-2.5 text-[17px] transition-colors ${
                tab === t ? 'border-brand bg-brand font-semibold text-white' : 'border-brand-400 text-brand-600 hover:bg-brand-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-12 flex gap-5">
          {/* Filters */}
          <aside className="h-fit w-[320px] shrink-0 space-y-5">
            <div className="flex items-center gap-2 rounded-md bg-white px-3 py-2 shadow-sm">
              <SearchIcon width={13} height={13} className="text-icon" />
              <input
                aria-label="Search"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="w-full bg-transparent text-[11px] focus:outline-none"
              />
            </div>

            <div className="rounded-lg border border-black/5 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-black/10 pb-3">
                <h2 className="text-[17px] font-semibold text-ink">Filter</h2>
                <FilterIcon width={16} height={16} className="text-ink" />
              </div>

              <div className="mt-4">
                <FilterTitle onReset={() => setDraft((d) => ({ ...d, types: [] }))}>Property Type</FilterTitle>
                <div className="mt-2">
                  {propertyTypes.map((t) => (
                    <Check key={t} checked={draft.types.includes(t)} onChange={() => toggleType(t)}>
                      {t}
                    </Check>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <FilterTitle onReset={() => setDraft((d) => ({ ...d, location: '' }))}>Location</FilterTitle>
                <div className="relative mt-3">
                  <select
                    aria-label="Location"
                    value={draft.location}
                    onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                    className="w-full appearance-none rounded-md bg-[#f3f4f4] px-3 py-2 text-[11px] text-muted"
                  >
                    <option value="">Choose Location</option>
                    {locations.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                  <ChevronDownIcon width={14} height={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-icon" />
                </div>
              </div>

              <div className="mt-5">
                {/* The Figma frame labels this block "Property Type" a second time; it holds price ranges. */}
                <FilterTitle onReset={() => setDraft((d) => ({ ...d, price: null }))}>Price Range</FilterTitle>
                <div className="mt-2">
                  {priceRanges.map((p) => (
                    <Check
                      key={p.max}
                      checked={draft.price === p.max}
                      onChange={() => setDraft((d) => ({ ...d, price: d.price === p.max ? null : p.max }))}
                    >
                      {p.label}
                      <b className="font-semibold">{p.bold}</b>
                    </Check>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <FilterTitle onReset={() => setDraft((d) => ({ ...d, landMin: 500, landMax: 1200 }))}>Land Size</FilterTitle>
                <div className="mt-4 space-y-2">
                  <input
                    type="range"
                    aria-label="Minimum land size"
                    min={500}
                    max={1200}
                    step={50}
                    value={draft.landMin}
                    onChange={(e) => setDraft((d) => ({ ...d, landMin: Math.min(Number(e.target.value), d.landMax) }))}
                    className="w-full accent-gold"
                  />
                  <input
                    type="range"
                    aria-label="Maximum land size"
                    min={500}
                    max={1200}
                    step={50}
                    value={draft.landMax}
                    onChange={(e) => setDraft((d) => ({ ...d, landMax: Math.max(Number(e.target.value), d.landMin) }))}
                    className="w-full accent-gold"
                  />
                </div>
                <div className="mt-1 flex justify-around text-[11px] text-ink">
                  <span>{draft.landMin}m²</span>
                  <span>{draft.landMax.toLocaleString('en-US')}m²</span>
                </div>
              </div>

              <hr className="mt-5 border-black/10" />
              <button
                type="button"
                onClick={() => {
                  setApplied(draft)
                  setPage(1)
                }}
                className="mt-5 w-full rounded-md bg-gradient-to-b from-brand-600 to-brand py-2.5 text-[11px] font-medium text-white shadow"
              >
                Apply Filter
              </button>
            </div>
          </aside>

          {/* Results */}
          <section className="flex-1" aria-live="polite">
            <p className="mb-4 text-sm text-muted">
              {results.length} {results.length === 1 ? 'result' : 'results'}
              {search && (
                <>
                  {' '}for “<b className="text-ink">{search}</b>”
                </>
              )}
            </p>
            {current.length === 0 ? (
              <div className="rounded-lg bg-white p-16 text-center text-muted shadow-sm">
                <p className="text-xl font-medium text-ink">No results found</p>
                <p className="mt-2 text-sm">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {current.map((a) => (
                  <AuctionCard key={a.id} auction={a} showStatus primaryLabel={a.directOffer ? 'Place Offer' : 'Place Bid'} />
                ))}
              </div>
            )}

            <nav className="mt-6 flex gap-3" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={n === page ? 'page' : undefined}
                  onClick={() => setPage(n)}
                  className={`size-6 rounded border text-[11px] ${
                    n === page ? 'border-brand bg-brand text-white' : 'border-brand text-ink'
                  }`}
                >
                  {n}
                </button>
              ))}
            </nav>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
