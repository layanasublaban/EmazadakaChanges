import { useMemo, useRef, useState } from 'react'
import { formatMoney, searchAuctions } from '@/data/auctions'
import { navigate } from '@/lib/router'
import { useI18n } from '@/lib/i18n'
import { SearchIcon } from './Icons'
import { PropertyImage } from './PropertyImage'

const popular = ['Villa Amman', 'Land plot', 'Aqaba', 'Apartment', 'Irbid', 'Commercial', 'Factory']

/** Live search: suggestions while typing, Enter / button opens the full results on the Auctions page. */
export function SearchBox({ className = '', autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const { t, auction } = useI18n()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const box = useRef<HTMLDivElement>(null)

  const all = useMemo(() => (q.trim() ? searchAuctions(q) : []), [q])
  const shown = all.slice(0, 5)

  const go = (query: string) => {
    setOpen(false)
    navigate(`/auctions${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(shown.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(-1, i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div
      ref={box}
      className={`relative ${className}`}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (active >= 0 && shown[active]) navigate(`/auctions/${shown[active].id}`)
          else go(q)
        }}
        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-3.5 py-2.5 shadow-[0_10px_30px_rgba(25,75,63,0.18)] sm:px-5 sm:py-3 focus-within:ring-2 focus-within:ring-gold"
      >
        <SearchIcon width={22} height={22} className="shrink-0 text-icon" />
        <input
          autoFocus={autoFocus}
          aria-label="Search by auction or property"
          aria-expanded={open}
          aria-controls="search-suggestions"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setActive(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={t('Search by auction or Property – try “villa Amman”, “land”, “Aqaba”…')}
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] text-ink placeholder:text-muted focus:outline-none"
        />
        {q && (
          <button
            type="button"
            aria-label={t('Clear search')}
            onClick={() => {
              setQ('')
              setActive(-1)
            }}
            className="text-lg leading-none text-icon hover:text-ink"
          >
            ×
          </button>
        )}
        <button type="submit" className="btn-shine rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:px-6">
          {t('Search')}
        </button>
      </form>

      {open && (
        <div
          id="search-suggestions"
          className="animate-pop-in absolute top-[calc(100%+8px)] inset-x-0 z-30 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
        >
          {!q.trim() ? (
            <div className="p-4">
              <p className="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">{t('Popular searches')}</p>
              <div className="flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setQ(p)
                      go(p)
                    }}
                    className="rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-medium text-brand hover:bg-brand-200/40"
                  >
                    {t(p)}
                  </button>
                ))}
              </div>
            </div>
          ) : shown.length === 0 ? (
            <div className="p-5 text-sm text-muted">
              {t('No auctions match your search. Try a city (Amman, Irbid, Aqaba) or a type (villa, land, apartment).')}
            </div>
          ) : (
            <>
              <ul role="listbox">
                {shown.map((a, i) => (
                  <li key={a.id} role="option" aria-selected={i === active}>
                    <a
                      href={`#/auctions/${a.id}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-4 py-2.5 ${i === active ? 'bg-brand-50' : 'hover:bg-brand-50'}`}
                    >
                      <PropertyImage src={a.image} alt="" className="size-12 shrink-0 rounded-lg" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold text-ink">{auction(a).title}</span>
                        <span className="block truncate text-[11px] text-muted">
                          <bdi>{a.code}</bdi> · {auction(a).type} · {auction(a).location}
                        </span>
                      </span>
                      <span className="shrink-0 text-end text-xs font-semibold text-brand">
                        {formatMoney(a.currentBid)} <span className="font-normal text-icon">JOD</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => go(q)}
                className="w-full border-t border-black/5 bg-brand-50 px-4 py-3 text-start text-xs font-semibold text-brand hover:bg-brand-200/40"
              >
                {t('View all {n} results', { n: all.length })} →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
