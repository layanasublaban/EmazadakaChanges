import { useMemo } from 'react'
import { jod } from '../data'
import { useAdmin } from '../store'
import { Badge, Button, DataTable, LinkButton, PageHeader } from '../ui'

export default function Submissions() {
  const { t, loc, submissions, query, decideSubmission, notify } = useAdmin()
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return submissions.filter((s) => !q || s.id.toLowerCase().includes(q) || s.title.en.toLowerCase().includes(q) || s.title.ar.includes(q) || s.owner.en.toLowerCase().includes(q) || s.owner.ar.includes(q))
  }, [submissions, query])
  return (
    <>
      <PageHeader title={t('submissions')} sub={t('submissionsSub')} />
      <DataTable
        rows={rows}
        cols={[
          { header: t('id'), width: 'w-28', cell: (s) => <span className="font-medium text-brand">#{s.id}</span> },
          { header: t('property'), cell: (s) => loc(s.title) },
          { header: t('owner'), width: 'w-40', cell: (s) => loc(s.owner) },
          { header: t('expectedPrice'), width: 'w-40', cell: (s) => jod(s.expectedPrice) },
          { header: t('status'), width: 'w-32', cell: (s) => <Badge status={s.status} /> },
          {
            header: t('actions'),
            width: 'w-64',
            cell: (s) => (
              <div className="flex gap-2">
                <LinkButton kind="outline" to={`/admin/submissions/${s.id}`}>
                  {t('view')}
                </LinkButton>
                {s.status === 'Pending' && (
                  <>
                    <Button
                      onClick={() => {
                        decideSubmission(s.id, 'Approved')
                        notify(t('approvedToast'))
                      }}
                    >
                      {t('approve')}
                    </Button>
                    <LinkButton kind="danger" to={`/admin/submissions/${s.id}/reject`}>
                      {t('reject')}
                    </LinkButton>
                  </>
                )}
              </div>
            ),
          },
        ]}
      />
    </>
  )
}
