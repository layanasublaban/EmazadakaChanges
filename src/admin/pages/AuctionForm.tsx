import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { AdminAuction } from '../data'
import { go } from '../nav'
import { useAdmin } from '../store'
import { Card, Field, LinkButton, PageHeader } from '../ui'

type F = { title: string; type: string; price: string; inc: string; start: string; end: string; location: string; size: string; desc: string }
const num = (s: string) => /^\d[\d,]*$/.test(s.trim())
const toN = (s: string) => Number(s.replace(/,/g, ''))

export default function AuctionForm({ id }: { id?: string }) {
  const { t, lang, auctions, saveAuction, notify } = useAdmin()
  const existing = auctions.find((a) => a.id === id)
  const [f, setF] = useState<F>(() =>
    existing
      ? { title: existing.title[lang], type: t(existing.type as never), price: String(existing.startingPrice), inc: String(existing.minIncrement), start: existing.startDate, end: existing.endDate, location: existing.location[lang], size: String(existing.landSize), desc: existing.description }
      : { title: '', type: '', price: '', inc: '', start: '', end: '', location: '', size: '', desc: '' },
  )
  const [errs, setErrs] = useState<Partial<Record<keyof F, string>>>({})
  const set = (k: keyof F) => (e: ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errs = {}
    for (const k of ['title', 'type', 'start', 'end', 'location'] as const) if (!f[k].trim()) next[k] = t('required')
    for (const k of ['price', 'inc', 'size'] as const) {
      if (!f[k].trim()) next[k] = t('required')
      else if (!num(f[k])) next[k] = t('mustBeNumber')
    }
    setErrs(next)
    if (Object.keys(next).length) return
    const a: AdminAuction = {
      id: existing?.id ?? `A-${1043 + auctions.filter((x) => Number(x.id.slice(2)) > 1042).length}`,
      title: existing ? { ...existing.title, [lang]: f.title } : { en: f.title, ar: f.title },
      type: existing && f.type === t(existing.type as never) ? existing.type : f.type,
      status: existing?.status ?? 'Upcoming',
      highestBid: existing?.highestBid ?? toN(f.price),
      startingPrice: toN(f.price),
      minIncrement: toN(f.inc),
      endsIn: existing?.endsIn ?? '—',
      startDate: f.start,
      endDate: f.end,
      location: existing ? { ...existing.location, [lang]: f.location } : { en: f.location, ar: f.location },
      landSize: toN(f.size),
      description: f.desc,
    }
    saveAuction(a)
    notify(existing ? t('updated') : t('published'))
    go('/admin/auctions')
  }

  return (
    <>
      <PageHeader title={existing ? t('editAuction') : t('createAuction')} sub={existing ? t('editAuctionSub') : t('createAuctionSub')} />
      <Card>
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Field id="title" label={t('propertyTitle')} value={f.title} onChange={set('title')} error={errs.title} />
            <Field id="type" label={t('propertyType')} value={f.type} onChange={set('type')} error={errs.type} />
          </div>
          <div className="flex gap-4">
            <Field id="price" label={t('startingPrice')} inputMode="numeric" value={f.price} onChange={set('price')} error={errs.price} />
            <Field id="inc" label={t('minIncrement')} inputMode="numeric" value={f.inc} onChange={set('inc')} error={errs.inc} />
          </div>
          <div className="flex gap-4">
            <Field id="start" label={t('startDate')} placeholder="2026-12-01 10:00" value={f.start} onChange={set('start')} error={errs.start} />
            <Field id="end" label={t('endDate')} placeholder="2026-12-10 18:00" value={f.end} onChange={set('end')} error={errs.end} />
          </div>
          <div className="flex gap-4">
            <Field id="location" label={t('location')} value={f.location} onChange={set('location')} error={errs.location} />
            <Field id="size" label={t('landSize')} inputMode="numeric" value={f.size} onChange={set('size')} error={errs.size} />
          </div>
          <Field id="desc" label={t('description')} value={f.desc} onChange={set('desc')} />
          <div className="flex justify-end gap-3">
            <LinkButton kind="outline" to="/admin/auctions">
              {t('cancel')}
            </LinkButton>
            <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-white hover:bg-brand-700">
              {existing ? t('save') : t('publish')}
            </button>
          </div>
        </form>
      </Card>
    </>
  )
}
