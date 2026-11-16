import { useMemo } from 'react'
import { jod } from '../data'
import { useAdmin } from '../store'
import { Badge, DataTable, PageHeader } from '../ui'

export default function Transactions() {
  const { t, loc, users, transactions, query } = useAdmin()
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions.filter((x) => {
      const u = users.find((v) => v.id === x.userId)
      return !q || x.id.toLowerCase().includes(q) || (u && (u.name.en.toLowerCase().includes(q) || u.name.ar.includes(q)))
    })
  }, [transactions, users, query])
  return (
    <>
      <PageHeader title={t('transactions')} sub={t('transactionsSub')} />
      <DataTable
        rows={rows}
        cols={[
          { header: t('id'), width: 'w-32', cell: (x) => <span className="font-medium text-brand">#{x.id}</span> },
          { header: t('user'), cell: (x) => { const u = users.find((v) => v.id === x.userId); return u ? loc(u.name) : x.userId } },
          { header: t('type'), width: 'w-36', cell: (x) => t(x.type) },
          { header: t('amount'), width: 'w-40', cell: (x) => jod(x.amount) },
          { header: t('status'), width: 'w-36', cell: (x) => <Badge status={x.status} /> },
          { header: t('date'), width: 'w-36', cell: (x) => x.date },
        ]}
      />
    </>
  )
}
