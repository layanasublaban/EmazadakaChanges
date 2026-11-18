import { useEffect, useState } from 'react'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { PageHeader } from '@/components/PageHeader'
import type { PropertyType } from '@/data/auctions'
import { useI18n } from '@/lib/i18n'
import { Link } from '@/lib/router'
import { useAuth } from '@/lib/auth'

const types: PropertyType[] = ['Residential Property', 'Residential Apartment', 'Residential Building', 'Vacant Residential Land Plot', 'Vacant Commercial Land Plot', 'Commercial Complex', 'Industrial Land Plot', 'Factory']
const cities = ['Amman West', 'Amman East', 'Zarqa', 'Irbid', 'Aqaba', 'Salt', 'Madaba', 'Karak', 'Jerash']
const steps = ['Property', 'Pricing & ownership', 'Photos & documents', 'Review']

interface Draft {
  type: PropertyType | ''
  title: string
  city: string
  area: string
  landSize: string
  bedrooms: string
  description: string
  saleType: 'auction' | 'direct'
  startingPrice: string
  marketPrice: string
  duration: string
  deedNumber: string
  ownerName: string
  photos: File[]
  deed: File | null
  agree: boolean
}
const empty: Draft = { type: '', title: '', city: '', area: '', landSize: '', bedrooms: '', description: '', saleType: 'auction', startingPrice: '', marketPrice: '', duration: '14', deedNumber: '', ownerName: '', photos: [], deed: null, agree: false }
const KEY = 'emazadak.listings'

const cls = (e?: string) => `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 ${e ? 'border-red-400 focus:ring-red-200' : 'border-black/15 focus:border-brand focus:ring-brand/20'}`
function F({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  const { t } = useI18n()
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink">{t(label)}</span>
      {children}
      {error ? <span role="alert" className="mt-1 block text-[11px] text-red-600">{t(error)}</span> : hint ? <span className="mt-1 block text-[11px] text-muted">{t(hint)}</span> : null}
    </label>
  )
}

function check(step: number, d: Draft): Record<string, string> {
  const e: Record<string, string> = {}
  if (step === 0) {
    if (!d.type) e.type = 'Select the property type.'
    if (d.title.trim().length < 6) e.title = 'Give the listing a short title (at least 6 characters).'
    if (!d.city) e.city = 'Select the city.'
    if (!d.area.trim()) e.area = 'Enter the neighbourhood.'
    if (!(Number(d.landSize) > 0)) e.landSize = 'Enter the land size in m².'
    if (d.description.trim().length < 30) e.description = 'Describe the property in at least 30 characters.'
  }
  if (step === 1) {
    if (!(Number(d.marketPrice) > 0)) e.marketPrice = 'Enter the estimated market value.'
    if (!(Number(d.startingPrice) > 0)) e.startingPrice = 'Enter the starting price.'
    else if (Number(d.marketPrice) > 0 && Number(d.startingPrice) > Number(d.marketPrice)) e.startingPrice = 'Starting price cannot exceed the market value.'
    if (!/^\d{4,12}$/.test(d.deedNumber)) e.deedNumber = 'Enter the title deed number (digits only).'
    if (d.ownerName.trim().split(/\s+/).length < 2) e.ownerName = 'Enter the owner’s full name as on the deed.'
  }
  if (step === 2) {
    if (d.photos.length < 3) e.photos = 'Upload at least 3 photos.'
    if (!d.deed) e.deed = 'Upload a copy of the title deed.'
  }
  if (step === 3 && !d.agree) e.agree = 'You must confirm the information is accurate.'
  return e
}

export default function ListPropertyPage({ route }: { route: string }) {
  const { loggedIn, user } = useAuth()
  const { t } = useI18n()
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Draft>(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [ref, setRef] = useState('')
  const [urls, setUrls] = useState<string[]>([])

  useEffect(() => {
    const u = d.photos.map((f) => URL.createObjectURL(f))
    setUrls(u)
    return () => u.forEach(URL.revokeObjectURL)
  }, [d.photos])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }))
  const num = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value.replace(/\D/g, '') as never)

  const next = () => {
    const e = check(step, d)
    setErrors(e)
    if (!Object.keys(e).length) setStep((s) => s + 1)
  }
  const submit = () => {
    const e = check(3, d)
    setErrors(e)
    if (Object.keys(e).length) return
    const id = `L-${Date.now().toString().slice(-6)}`
    try {
      const prev = JSON.parse(localStorage.getItem(KEY) ?? '[]')
      localStorage.setItem(KEY, JSON.stringify([...prev, { id, owner: user?.email, ...d, photos: d.photos.map((p) => p.name), deed: d.deed?.name, at: Date.now() }]))
    } catch {
      /* ignore */
    }
    setRef(id)
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar active={route} />
      <PageHeader title="List Your Property" subtitle="Sell through a transparent digital auction or a direct offer. Our team reviews every listing before it goes live." />

      <main className="mx-auto mt-6 max-w-[860px] px-4 sm:mt-8 sm:px-6">
        {!loggedIn ? (
          <div className="animate-fade-up rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
            <h2 className="text-xl font-semibold text-ink">{t('Sign in to list a property')}</h2>
            <p className="mt-2 text-sm text-muted">{t('Only verified account holders can submit properties for auction.')}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/signin?next=/list-property" className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white">{t('Sign In')}</Link>
              <Link to="/signup?next=/list-property" className="rounded-lg border border-brand px-6 py-2.5 text-sm font-semibold text-brand">{t('Create account')}</Link>
            </div>
            <ul className="mx-auto mt-8 grid max-w-[560px] gap-3 text-start text-sm text-ink sm:grid-cols-3">
              {['Submit property details & documents', 'We verify the title deed', 'Your auction goes live to verified bidders'].map((k, i) => (
                <li key={k} className="rounded-xl bg-brand-50 p-4"><b className="text-brand">{i + 1}.</b> {t(k)}</li>
              ))}
            </ul>
          </div>
        ) : ref ? (
          <div className="animate-pop-in rounded-2xl bg-white p-6 text-center shadow-sm sm:p-10">
            <p className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand text-2xl text-white">✓</p>
            <h2 className="mt-5 text-xl font-semibold text-ink">{t('Submission received')}</h2>
            <p className="mt-2 text-sm text-muted">{t('Reference')} <b className="text-brand" dir="ltr">{ref}</b>. {t('Our team will verify your title deed and contact you within 2 business days at')} <bdi>{user?.email}</bdi>.</p>
            <button type="button" onClick={() => { setD(empty); setStep(0); setRef('') }} className="mt-6 rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white">{t('List another property')}</button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
            <ol className="mb-6 flex items-center gap-2 sm:mb-8" aria-label={t('Progress')}>
              {steps.map((s, i) => (
                <li key={s} aria-current={i === step ? 'step' : undefined} className="flex flex-1 items-center gap-2">
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${i <= step ? 'bg-brand text-white' : 'bg-brand-50 text-brand'}`}>{i < step ? '✓' : i + 1}</span>
                  <span className={`hidden text-xs sm:block ${i === step ? 'font-semibold text-brand' : 'text-muted'}`}>{t(s)}</span>
                  {i < steps.length - 1 && <span className="h-px flex-1 bg-black/10" />}
                </li>
              ))}
            </ol>

            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Property type *" error={errors.type}>
                  <select value={d.type} onChange={(e) => set('type', e.target.value as PropertyType)} className={cls(errors.type)}>
                    <option value="">{t('Select type')}</option>{types.map((k) => <option key={k} value={k}>{t(k)}</option>)}
                  </select>
                </F>
                <F label="Listing title *" error={errors.title}><input value={d.title} onChange={(e) => set('title', e.target.value)} placeholder={t('e.g. Villa with garden in Dabouq')} className={cls(errors.title)} /></F>
                <F label="City *" error={errors.city}>
                  <select value={d.city} onChange={(e) => set('city', e.target.value)} className={cls(errors.city)}><option value="">{t('Select city')}</option>{cities.map((c) => <option key={c} value={c}>{t(c)}</option>)}</select>
                </F>
                <F label="Neighbourhood *" error={errors.area}><input value={d.area} onChange={(e) => set('area', e.target.value)} placeholder={t('e.g. Abdoun')} className={cls(errors.area)} /></F>
                <F label="Land size (m²) *" error={errors.landSize}><input inputMode="numeric" value={d.landSize} onChange={num('landSize')} className={cls(errors.landSize)} /></F>
                <F label="Bedrooms" hint="Leave empty for land"><input inputMode="numeric" value={d.bedrooms} onChange={num('bedrooms')} className={cls()} /></F>
                <div className="sm:col-span-2">
                  <F label="Description *" error={errors.description}><textarea rows={4} value={d.description} onChange={(e) => set('description', e.target.value)} className={cls(errors.description)} /></F>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-ink">{t('Sale type')}</span>
                  <div className="grid grid-cols-2 gap-3">
                    {([['auction', 'Live auction', 'Bidders compete until the timer ends'], ['direct', 'Direct offer', 'Buyers send offers; you pick the best']] as const).map(([k, ttl, sub]) => (
                      <button key={k} type="button" aria-pressed={d.saleType === k} onClick={() => set('saleType', k)}
                        className={`rounded-xl border px-4 py-3 text-start text-sm ${d.saleType === k ? 'border-brand bg-brand-50 font-semibold text-brand' : 'border-black/15 text-ink hover:bg-brand-50/60'}`}>{t(ttl)}<span className="block text-[11px] font-normal text-muted">{t(sub)}</span></button>
                    ))}
                  </div>
                </div>
                <F label="Estimated market value (JOD) *" error={errors.marketPrice}><input inputMode="numeric" value={d.marketPrice} onChange={num('marketPrice')} className={cls(errors.marketPrice)} /></F>
                <F label="Starting price (JOD) *" error={errors.startingPrice}><input inputMode="numeric" value={d.startingPrice} onChange={num('startingPrice')} className={cls(errors.startingPrice)} /></F>
                {d.saleType === 'auction' && (
                  <F label="Auction duration"><select value={d.duration} onChange={(e) => set('duration', e.target.value)} className={cls()}>{['7', '14', '21', '30'].map((n) => <option key={n} value={n}>{t('{n} days', { n })}</option>)}</select></F>
                )}
                <F label="Title deed number *" error={errors.deedNumber}><input inputMode="numeric" value={d.deedNumber} onChange={num('deedNumber')} className={cls(errors.deedNumber)} /></F>
                <F label="Owner full name (as on deed) *" error={errors.ownerName}><input value={d.ownerName} onChange={(e) => set('ownerName', e.target.value)} className={cls(errors.ownerName)} /></F>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <F label="Property photos * (at least 3, JPG or PNG)" error={errors.photos}>
                  <input type="file" accept="image/*" multiple onChange={(e) => set('photos', Array.from(e.target.files ?? []))} className="block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" />
                </F>
                {urls.length > 0 && <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{urls.map((u) => <img key={u} src={u} alt="" className="aspect-square rounded-lg object-cover" />)}</div>}
                <F label="Title deed copy * (PDF or image)" error={errors.deed}>
                  <input type="file" accept="application/pdf,image/*" onChange={(e) => set('deed', e.target.files?.[0] ?? null)} className="block w-full text-sm file:me-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white" />
                </F>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <dl className="grid gap-x-6 gap-y-3 rounded-xl bg-brand-50 p-5 text-sm sm:grid-cols-2">
                  {([['Type', t(d.type)], ['Title', d.title], ['Location', `${d.area}, ${t(d.city)}`], ['Land size', `${d.landSize} m²`], ['Sale type', d.saleType === 'auction' ? `${t('Live auction')} · ${t('{n} days', { n: d.duration })}` : t('Direct offer')], ['Starting price', `${Number(d.startingPrice).toLocaleString('en-US')} JOD`], ['Market value', `${Number(d.marketPrice).toLocaleString('en-US')} JOD`], ['Deed no.', d.deedNumber], ['Owner', d.ownerName], ['Photos', t('{n} uploaded', { n: d.photos.length })]] as const).map(([k, v]) => (
                    <div key={k}><dt className="text-[11px] text-muted">{t(k)}</dt><dd className="font-medium text-ink"><bdi>{v}</bdi></dd></div>
                  ))}
                </dl>
                <label className="flex items-start gap-2.5 text-xs text-ink">
                  <input type="checkbox" checked={d.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-0.5 size-4 accent-brand" />
                  <span>{t('I confirm I am the owner or authorised to sell this property, the information is accurate, and I accept Emazadak’s seller terms and commission.')}</span>
                </label>
                {errors.agree && <p role="alert" className="text-[11px] text-red-600">{t(errors.agree)}</p>}
              </div>
            )}

            <div className="mt-8 flex justify-between gap-3">
              <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="rounded-lg border border-black/15 px-6 py-2.5 text-sm disabled:opacity-40">{t('Back')}</button>
              {step < 3 ? (
                <button type="button" onClick={next} className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">{t('Continue')}</button>
              ) : (
                <button type="button" onClick={submit} className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">{t('Submit for review')}</button>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
