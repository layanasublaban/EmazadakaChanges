import { useState } from 'react'
import { Link } from '@/lib/router'
import { formatMoney, type Auction } from '@/data/auctions'
import { useI18n } from '@/lib/i18n'
import { CountdownTimer } from './CountdownTimer'
import { HeartIcon } from './Icons'
import { LiveDot } from './LiveDot'
import { PropertyImage } from './PropertyImage'
import { StatusBadge, type BadgeKind } from './StatusBadge'

interface Props {
  auction: Auction
  /** Label of the primary action: "Place Bid" for auctions, "Place Offer" for direct offers. */
  primaryLabel?: string
  /** Show the Live / Coming Soon status pill (used on the Auctions listing page). */
  showStatus?: boolean
}

const badgeFor = (a: Auction): BadgeKind | null =>
  a.status === 'live' ? 'live' : a.status === 'ending-soon' ? 'live-ending' : a.status === 'coming-soon' ? 'coming-soon' : a.status === 'finished' ? 'finished' : null

export function AuctionCard({ auction: a, primaryLabel = 'Place Bid', showStatus = false }: Props) {
  const { t, auction } = useI18n()
  const loc = auction(a)
  const [liked, setLiked] = useState(false)
  const badge = badgeFor(a)
  const live = a.status === 'live' || a.status === 'ending-soon'

  return (
    <article className={`group overflow-hidden rounded-lg border bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_30px_rgba(25,75,63,0.16)] ${live ? 'border-red-200' : 'border-black/5'}`}>
      <div className="relative overflow-hidden">
        <PropertyImage src={a.image} alt={loc.title} className="h-[200px] w-full transition-transform duration-700 group-hover:scale-105" />
        {live ? (
          <span className="live-glow absolute top-3 start-3 flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-[10px] font-semibold text-white">
            <LiveDot className="text-white" size={6} /> {t('LIVE')} · {t(a.status === 'ending-soon' ? 'Ending Soon' : 'Running Now')}
          </span>
        ) : (
          <span className="absolute top-3 start-3 rounded bg-brand px-2 py-1 text-[10px] font-medium text-white">{loc.chip}</span>
        )}
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 end-3 flex size-7 items-center justify-center rounded-full bg-white/90 text-ink transition-transform hover:scale-110"
        >
          <span key={String(liked)} className={liked ? 'animate-heart text-red-500' : ''}>
            <HeartIcon width={14} height={14} fill={liked ? 'currentColor' : 'none'} />
          </span>
        </button>
      </div>

      <div className="px-3.5 pt-4 pb-3.5">
        <h3 className="text-[13px] font-semibold text-ink">{loc.title}</h3>
        <p className="mt-2 line-clamp-3 text-[10px] leading-[1.6] text-muted">{loc.description}</p>

        <div className="mt-3 flex justify-between gap-2 text-[9px] text-muted">
          <span>{t('Original Price')}: <b className="font-medium text-ink"><bdi>${formatMoney(a.originalPrice)}</bdi></b></span>
          <span>{t('Initial Price')}: <b className="font-medium text-ink"><bdi>${formatMoney(a.initialPrice)}</bdi></b></span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px]">
          <span className="font-medium text-gold">{t('Min Bid Increment')}: <bdi>${formatMoney(a.minBidIncrement)}</bdi></span>
          {showStatus && badge && <StatusBadge kind={badge} small />}
        </div>

        <div className="mt-3">
          <CountdownTimer endsAt={a.endsAt} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Link to={`/auctions/${a.id}`} className="btn-shine rounded bg-brand py-2 text-center text-[11px] font-medium text-white transition-colors hover:bg-brand-700">
            {t(primaryLabel)}
          </Link>
          <Link to={`/auctions/${a.id}`} className="rounded border border-brand py-2 text-center text-[11px] font-medium text-brand transition-colors hover:bg-brand-50">
            {t('View Details')}
          </Link>
        </div>
      </div>
    </article>
  )
}
