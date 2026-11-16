import { activityFor, jod } from '../data'
import { useAdmin } from '../store'
import { Badge, Button, Card, DataTable, LinkButton, PageHeader } from '../ui'

export default function UserDetail({ id }: { id: string }) {
  const { t, loc, users, toggleSuspend, notify } = useAdmin()
  const u = users.find((x) => x.id === id)
  if (!u) return <PageHeader title={t('noResults')} sub="" action={<LinkButton to="/admin/users" kind="outline">{t('backToUsers')}</LinkButton>} />
  const rows = activityFor(u.id).map((a, i) => ({ ...a, id: String(i) }))
  const stats = [
    { l: t('bidsPlaced'), v: String(u.bids) },
    { l: t('auctionsWon'), v: String(u.won) },
    { l: t('depositBalance'), v: jod(u.deposit) },
  ]
  return (
    <>
      <PageHeader title={loc(u.name)} sub={`${u.email} · ${u.phone}`} />
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.l} className="p-5">
            <div className="text-sm text-street">{s.l}</div>
            <div className="mt-2 text-2xl font-bold text-brand">{s.v}</div>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Badge status={u.suspended ? 'Suspended' : u.verified ? 'Verified' : 'Unverified'} />
        <Button
          kind={u.suspended ? 'primary' : 'danger'}
          onClick={() => {
            toggleSuspend(u.id)
            notify(u.suspended ? t('reactivatedToast') : t('suspendedToast'))
          }}
        >
          {u.suspended ? t('reactivate') : t('suspend')}
        </Button>
        <LinkButton kind="outline" to="/admin/users">
          {t('backToUsers')}
        </LinkButton>
      </div>
      <h2 className="text-lg font-semibold text-black">{t('recentActivity')}</h2>
      <DataTable
        rows={rows}
        cols={[
          { header: t('auction'), width: 'w-36', cell: (a) => <span className="font-medium text-brand">#{a.auctionId}</span> },
          { header: t('action'), cell: (a) => t(a.action) },
          { header: t('amount'), width: 'w-44', cell: (a) => jod(a.amount) },
          { header: t('date'), width: 'w-40', cell: (a) => a.date },
        ]}
      />
    </>
  )
}
