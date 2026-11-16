import { useMemo } from 'react'
import { useAdmin } from '../store'
import { Badge, DataTable, LinkButton, PageHeader } from '../ui'

export default function Users() {
  const { t, loc, users, query } = useAdmin()
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => !q || u.name.en.toLowerCase().includes(q) || u.name.ar.includes(q) || u.email.includes(q) || u.id.toLowerCase().includes(q))
  }, [users, query])
  return (
    <>
      <PageHeader title={t('users')} sub={t('usersSub')} />
      <DataTable
        rows={rows}
        cols={[
          { header: t('name'), cell: (u) => <span className="font-medium">{loc(u.name)}</span> },
          { header: t('email'), cell: (u) => <span dir="ltr">{u.email}</span> },
          { header: t('phone'), width: 'w-44', cell: (u) => <span dir="ltr">{u.phone}</span> },
          { header: t('status'), width: 'w-36', cell: (u) => <Badge status={u.suspended ? 'Suspended' : u.verified ? 'Verified' : 'Unverified'} /> },
          { header: t('actions'), width: 'w-28', cell: (u) => <LinkButton kind="outline" to={`/admin/users/${u.id}`}>{t('view')}</LinkButton> },
        ]}
      />
    </>
  )
}
