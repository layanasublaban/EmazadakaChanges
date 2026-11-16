import { useMemo, useState } from 'react'
import { jod } from '../data'
import { useAdmin } from '../store'
import { Badge, DataTable, LinkButton, PageHeader } from '../ui'

const filters = ['All', 'Active', 'Upcoming', 'Ended'] as const

export default function Auctions() {
  const { t, loc, auctions, query } = useAdmin()
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return auctions.filter(
      (a) =>
        (filter === 'All' || a.status === filter) &&
        (!q || a.id.toLowerCase().includes(q) || a.title.en.toLowerCase().includes(q) || a.title.ar.includes(q)),
    )
  }, [auctions, query, filter])
  return (
    <>
      <PageHeader title={t('auctions')} sub={t('auctionsSub')} action={<LinkButton to="/admin/auctions/new">{t('createAuction')}</LinkButton>} />
      <div className="flex gap-2" role="tablist">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${filter === f ? 'bg-brand text-white' : 'border border-black/10 bg-white text-street'}`}
          >
            {f === 'All' ? t('filterAll') : t(f)}
          </button>
        ))}
      </div>
      <DataTable
        rows={rows}
        cols={[
          { header: t('id'), width: 'w-28', cell: (a) => <span className="font-medium text-brand">#{a.id}</span> },
          { header: t('property'), cell: (a) => loc(a.title) },
          { header: t('status'), width: 'w-32', cell: (a) => <Badge status={a.status} /> },
          { header: t('highestBid'), width: 'w-40', cell: (a) => jod(a.highestBid) },
          { header: t('endsIn'), width: 'w-28', cell: (a) => a.endsIn },
          {
            header: t('actions'),
            width: 'w-40',
            cell: (a) => (
              <div className="flex gap-2">
                <LinkButton kind="outline" to={`/admin/auctions/${a.id}/edit`}>
                  {t('view')}
                </LinkButton>
                <LinkButton kind="outline" to={`/admin/auctions/${a.id}/edit`}>
                  {t('edit')}
                </LinkButton>
              </div>
            ),
          },
        ]}
      />
    </>
  )
}
