import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAdmin, type Settings } from '../store'
import { Card, Field, PageHeader } from '../ui'

export default function SettingsPage() {
  const { t, settings, saveSettings, notify } = useAdmin()
  const [s, setS] = useState<Settings>(settings)
  const [err, setErr] = useState<Partial<Record<keyof Settings, string>>>({})
  const set = (k: keyof Settings) => (e: ChangeEvent<HTMLInputElement>) => setS({ ...s, [k]: e.target.value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n: typeof err = {}
    if (!s.platformName.trim()) n.platformName = t('required')
    if (!/^\S+@\S+\.\S+$/.test(s.supportEmail)) n.supportEmail = t('required')
    if (!/^\d+$/.test(s.minDeposit)) n.minDeposit = t('mustBeNumber')
    if (!/^\d+$/.test(s.extension)) n.extension = t('mustBeNumber')
    if (!s.currency.trim()) n.currency = t('required')
    setErr(n)
    if (Object.keys(n).length) return
    saveSettings(s)
    notify(t('savedToast'))
  }
  return (
    <>
      <PageHeader title={t('settings')} sub={t('settingsSub')} />
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <Card className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-black">{t('general')}</h2>
          <div className="flex gap-4">
            <Field id="pn" label={t('platformName')} value={s.platformName} onChange={set('platformName')} error={err.platformName} />
            <Field id="se" type="email" label={t('supportEmail')} value={s.supportEmail} onChange={set('supportEmail')} error={err.supportEmail} />
          </div>
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-black">{t('auctionRules')}</h2>
          <div className="flex gap-4">
            <Field id="md" inputMode="numeric" label={t('minDeposit')} value={s.minDeposit} onChange={set('minDeposit')} error={err.minDeposit} />
            <Field id="ex" inputMode="numeric" label={t('extension')} value={s.extension} onChange={set('extension')} error={err.extension} />
            <Field id="cu" label={t('currency')} value={s.currency} onChange={set('currency')} error={err.currency} />
          </div>
        </Card>
        <div className="flex justify-end">
          <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-700">
            {t('save')}
          </button>
        </div>
      </form>
    </>
  )
}
