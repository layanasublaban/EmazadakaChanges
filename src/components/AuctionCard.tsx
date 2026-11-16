import { useState } from 'react'
import { Link } from '@/lib/router'
import { formatMoney, type Auction } from '@/data/auctions'
import { CountdownTimer } from './CountdownTimer'
import { HeartIcon } from './Icons'
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
  a.status === 'live' ? 'live' : a.status === 'ending-soon' ? 'live-ending' : a.status === 'coming-soon' ? 'coming-soon' : null

export function AuctionCard({ auction: a, primaryLabel = 'Place Bid', showStatus = false }: Props) {
  const [liked, setLiked] = useState(false)
  const badge = badgeFor(a)

  return (
    <article className="overflow-hidden rounded-lg border border-black/5 bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="relative">
        <PropertyImage src={a.image} alt={a.title} className="h-[200px] w-full" />
        <span className="absolute top-3 left-3 rounded bg-brand px-2 py-1 text-[8px] font-medium text-white">
          {a.chip}
        </span>
        <button
          type="button"
          aria-pressed={liked}
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
          onClick={() => setLiked((v) => !v)}
          className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-white/90 text-ink"
        >
          <HeartIcon width={13} height={13} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="px-3.5 pt-4 pb-3.5">
        <h3 className="text-[11px] font-semibold text-ink">{a.title}</h3>
        <p className="mt-2 text-[8px] leading-[1.5] text-muted">{a.description}</p>

        <div className="mt-3 flex justify-between text-[7.5px] text-muted">
          <span>
            Original Price: <b className="font-medium text-ink">${formatMoney(a.originalPrice)}</b>
          </span>
          <span>
            Initial Price: <b className="font-medium text-ink">${formatMoney(a.initialPrice)}</b>
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[8px]">
          <span className="font-medium text-gold">Min Bid Increment: ${formatMoney(a.minBidIncrement)}</span>
          {showStatus && badge && <StatusBadge kind={badge} small />}
        </div>

        <div className="mt-3">
          <CountdownTimer endsAt={a.endsAt} />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Link
            to={`/auctions/${a.id}`}
            className="rounded bg-brand py-1.5 text-center text-[9px] font-medium text-white hover:bg-brand-700"
          >
            {primaryLabel}
          </Link>
          <Link
            to={`/auctions/${a.id}`}
            className="rounded border border-brand py-1.5 text-center text-[9px] font-medium text-brand hover:bg-brand-50"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
