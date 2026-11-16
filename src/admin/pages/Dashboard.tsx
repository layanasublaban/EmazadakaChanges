import { jod } from '../data'
import { useAdmin } from '../store'
import { Badge, Card, DataTable, LinkButton, PageHeader } from '../ui'

export default function Dashboard() {
  const { t, loc, auctions, submissions, users, transactions } = useAdmin()
  const active = auctions.filter((a) => a.status === 'Active').length
  const pending = submissions.filter((s) => s.status === 'Pending').length
  const deposits = transactions.filter((x) => x.type === 'Deposit' && x.status === 'Completed').reduce((n, x) => n + x.amount, 0)
  const stats = [
    { label: t('activeAuctions'), value: String(active) },
    { label: t('pendingSubmissions'), value: String(pending) },
    { label: t('registeredUsers'), value: users.length.toLocaleString('en-US') },
    { label: t('totalDeposits'), value: jod(deposits) },
  ]
  return (
    <>
      <PageHeader title={t('dashboard')} sub={t('dashboardSub')} action={<LinkButton to="/admin/auctions/new">{t('createAuction')}</LinkButton>} />
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-sm text-street">{s.label}</div>
            <div className="mt-2 text-2xl font-bold text-brand">{s.value}</div>
          </Card>
        ))}
      </div>
      <h2 className="text-lg font-semibold text-black">{t('recentAuctions')}</h2>
      <DataTable
        rows={auctions.slice(0, 5)}
        cols={[
          { header: t('id'), width: 'w-32', cell: (a) => <span className="font-medium text-brand">#{a.id}</span> },
          { header: t('property'), cell: (a) => loc(a.title) },
          { header: t('status'), width: 'w-36', cell: (a) => <Badge status={a.status} /> },
          { header: t('highestBid'), width: 'w-44', cell: (a) => jod(a.highestBid) },
          { header: t('endsIn'), width: 'w-32', cell: (a) => a.endsIn },
        ]}
      />
    </>
  )
}
