import { useState } from 'react'
import { jod } from '../data'
import { go } from '../nav'
import { useAdmin } from '../store'
import { Badge, Button, Card, Field, LinkButton, PageHeader } from '../ui'

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 py-2.5 text-sm">
      <span className="text-street">{k}</span>
      <span className="font-medium text-ink">{v}</span>
    </div>
  )
}

export default function SubmissionDetail({ id, rejecting }: { id: string; rejecting: boolean }) {
  const { t, loc, submissions, decideSubmission, notify } = useAdmin()
  const [reason, setReason] = useState('')
  const s = submissions.find((x) => x.id === id)
  if (!s) return <PageHeader title={t('noResults')} sub="" action={<LinkButton to="/admin/submissions" kind="outline">{t('backToSubmissions')}</LinkButton>} />

  const pending = s.status === 'Pending'
  return (
    <>
      <PageHeader title={`${t('submissions')} #${s.id}`} sub={t('submissionSub')} />
      <div className="flex gap-6">
        <Card className="flex-1">
          <h2 className="mb-1 text-base font-semibold text-black">{t('propertyDetails')}</h2>
          <KV k={t('property')} v={loc(s.title)} />
          <KV k={t('type')} v={t(s.type as never)} />
          <KV k={t('location')} v={loc(s.location)} />
          <KV k={t('area')} v={`${s.area.toLocaleString('en-US')} m²`} />
          <KV k={t('expectedPrice')} v={jod(s.expectedPrice)} />
          <KV k={t('documents')} v={`${s.docs} ${t('filesUploaded')}`} />
          <KV k={t('submitted')} v={s.submitted} />
        </Card>
        <Card className="flex h-fit w-[340px] flex-col gap-4">
          <h2 className="text-base font-semibold text-black">{t('owner')}</h2>
          <div className="text-sm font-medium">{loc(s.owner)}</div>
          <div>
            <Badge status={s.status} />
          </div>
          {s.reason && <p className="text-xs text-street">{t('reason')}: {s.reason}</p>}
          {pending && (
            <>
              <Button
                onClick={() => {
                  decideSubmission(s.id, 'Approved')
                  notify(t('approvedToast'))
                  go('/admin/submissions')
                }}
              >
                {t('approve')}
              </Button>
              <LinkButton kind="danger" to={`/admin/submissions/${s.id}/reject`}>
                {t('reject')}
              </LinkButton>
            </>
          )}
          <LinkButton kind="outline" to="/admin/submissions">
            {t('backToSubmissions')}
          </LinkButton>
        </Card>
      </div>

      {rejecting && pending && (
        <div role="dialog" aria-modal="true" aria-labelledby="rej-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <Card className="flex w-full max-w-[480px] flex-col gap-4 p-7">
            <h2 id="rej-title" className="text-lg font-bold text-black">{t('rejectTitle')}</h2>
            <p className="text-sm text-street">{t('rejectText')}</p>
            <Field id="reason" label={t('reason')} value={reason} onChange={(e) => setReason(e.target.value)} autoFocus />
            <div className="flex justify-end gap-3">
              <LinkButton kind="outline" to={`/admin/submissions/${s.id}`}>
                {t('cancel')}
              </LinkButton>
              <Button
                kind="danger"
                onClick={() => {
                  decideSubmission(s.id, 'Rejected', reason.trim() || undefined)
                  notify(t('rejectedToast'))
                  go('/admin/submissions')
                }}
              >
                {t('confirmReject')}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
