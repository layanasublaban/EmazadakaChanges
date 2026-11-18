import { useState, type FormEvent, type ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { PropertyImage } from '@/components/PropertyImage'
import { Link, navigate, useQuery } from '@/lib/router'
import { useAuth } from '@/lib/auth'

/* ---------- shared bits ---------- */
const inputCls = (err?: string) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-icon focus:outline-none focus:ring-2 ${
    err ? 'border-red-400 focus:ring-red-200' : 'border-black/15 focus:border-brand focus:ring-brand/20'
  }`

function Field({ label, error, hint, children, required = true }: { label: string; error?: string; hint?: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
      {children}
      {error ? <span role="alert" className="mt-1 block text-[11px] text-red-600">{error}</span> : hint ? <span className="mt-1 block text-[11px] text-muted">{hint}</span> : null}
    </label>
  )
}

function PasswordInput({ value, onChange, error, placeholder, autoComplete }: { value: string; onChange: (v: string) => void; error?: string; placeholder?: string; autoComplete?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} className={`${inputCls(error)} pr-14`} />
      <button type="button" onClick={() => setShow((v) => !v)} className="absolute top-1/2 right-3 -translate-y-1/2 text-[11px] font-semibold text-brand">
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

function AuthShell({ children, title, subtitle, side }: { children: ReactNode; title: string; subtitle: string; side: 'in' | 'up' }) {
  return (
    <div className="min-h-screen bg-page">
      <Navbar active={side === 'in' ? '/signin' : '/signup'} />
      <main className="mx-auto mt-10 grid max-w-[1360px] overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] lg:grid-cols-[5fr_6fr]" style={{ width: 'calc(100% - 3rem)' }}>
        <aside className="relative hidden min-h-[640px] lg:block">
          <PropertyImage src={side === 'in' ? '/images/properties/modern-villa-pool.jpg' : '/images/properties/aerial-villa.jpg'} alt="" className="absolute inset-0 size-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/70 to-brand/20" />
          <div className="relative flex h-full flex-col justify-end p-10 text-white">
            <h2 className="font-serif text-[30px] leading-tight font-bold">Jordan’s digital real estate auctions</h2>
            <p className="mt-3 text-sm text-white/85">Bid on villas, apartments and land across Amman, Zarqa, Irbid and Aqaba – fully online, fully transparent.</p>
            <ul className="mt-6 space-y-3 text-sm">
              {['Verified bidders only – every account is identity-checked', 'Refundable deposit protects both buyers and sellers', 'Live bidding with real-time countdowns', 'Clear title deeds and ready-for-transfer properties'].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-ink">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <section className="p-8 sm:p-12">
          <h1 className="text-[28px] font-semibold text-ink">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* ---------- Sign in ---------- */
export function SignInPage() {
  const { signIn } = useAuth()
  const next = useQuery().get('next') || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [busy, setBusy] = useState(false)
  const [forgot, setForgot] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!emailRe.test(email)) errs.email = 'Enter a valid email address.'
    if (!password) errs.password = 'Enter your password.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const res = await signIn(email, password, remember)
    setBusy(false)
    if (res.ok) navigate(next)
    else setErrors({ form: res.error })
  }

  return (
    <AuthShell side="in" title="Welcome back" subtitle="Sign in to place bids, make offers and follow your auctions.">
      <form onSubmit={submit} noValidate className="max-w-[460px] space-y-5">
        {errors.form && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{errors.form}</p>}
        <Field label="Email" error={errors.email}>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={inputCls(errors.email)} />
        </Field>
        <Field label="Password" error={errors.password}>
          <PasswordInput value={password} onChange={setPassword} error={errors.password} autoComplete="current-password" placeholder="Your password" />
        </Field>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-ink">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-brand" /> Keep me signed in
          </label>
          <button type="button" onClick={() => setForgot((v) => !v)} className="font-semibold text-brand hover:underline">Forgot password?</button>
        </div>
        {forgot && (
          <p className="rounded-lg bg-brand-50 px-3.5 py-2.5 text-xs text-brand">
            Enter your email above and we’ll send a reset link once email delivery is connected to the backend.
          </p>
        )}
        <button type="submit" disabled={busy} className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
        <p className="text-center text-sm text-muted">
          New to Emazadak? <Link to={`/signup${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-brand hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  )
}

/* ---------- Sign up ---------- */
const cities = ['Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Salt', 'Madaba', 'Karak', 'Jerash', 'Ajloun', 'Mafraq', 'Ma’an', 'Tafilah']

const strength = (p: string) => {
  let s = 0
  if (p.length >= 8) s++
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) s++
  return s
}

interface Form {
  accountType: 'individual' | 'company'
  fullName: string
  dob: string
  nationalId: string
  email: string
  phone: string
  city: string
  companyName: string
  commercialReg: string
  password: string
  confirm: string
  terms: boolean
  binding: boolean
}

const empty: Form = { accountType: 'individual', fullName: '', dob: '', nationalId: '', email: '', phone: '', city: '', companyName: '', commercialReg: '', password: '', confirm: '', terms: false, binding: false }

function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {}
  if (f.fullName.trim().split(/\s+/).filter(Boolean).length < 2) e.fullName = 'Enter your full name (first and last name, as on your ID).'
  if (!f.dob) e.dob = 'Select your date of birth.'
  else {
    const d = new Date(f.dob)
    const adult = new Date(d.getFullYear() + 18, d.getMonth(), d.getDate()) <= new Date()
    if (Number.isNaN(d.getTime()) || !adult) e.dob = 'You must be at least 18 years old to bid.'
  }
  if (!/^\d{10}$/.test(f.nationalId)) e.nationalId = 'National ID must be exactly 10 digits.'
  if (!emailRe.test(f.email)) e.email = 'Enter a valid email address.'
  if (!/^7[789]\d{7}$/.test(f.phone)) e.phone = 'Enter a Jordanian mobile number, e.g. 79 123 4567.'
  if (!f.city) e.city = 'Select your city.'
  if (f.accountType === 'company') {
    if (!f.companyName.trim()) e.companyName = 'Enter the company name.'
    if (!/^\d{4,12}$/.test(f.commercialReg)) e.commercialReg = 'Enter the commercial registration number (digits only).'
  }
  if (strength(f.password) < 3 || f.password.length < 8) e.password = 'Use at least 8 characters with upper & lower case letters and a number.'
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match.'
  if (!f.terms) e.terms = 'You must accept the Terms & Conditions.'
  if (!f.binding) e.binding = 'You must acknowledge that bids are binding.'
  return e
}

export function SignUpPage() {
  const { signUp } = useAuth()
  const next = useQuery().get('next') || '/'
  const [f, setF] = useState<Form>(empty)
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({})
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    const nf = { ...f, [k]: v }
    setF(nf)
    if (submitted) setErrors(validate(nf))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const errs = validate(f)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const res = await signUp({
      accountType: f.accountType,
      fullName: f.fullName.trim().replace(/\s+/g, ' '),
      dob: f.dob,
      nationalId: f.nationalId,
      email: f.email,
      phone: `+962${f.phone}`,
      city: f.city,
      ...(f.accountType === 'company' ? { companyName: f.companyName.trim(), commercialReg: f.commercialReg } : {}),
      password: f.password,
    })
    setBusy(false)
    if (res.ok) navigate(next)
    else setFormError(res.error)
  }

  const s = strength(f.password)
  const sLabel = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][s]

  return (
    <AuthShell side="up" title="Create your bidder account" subtitle="Registration is free. We verify your identity before you can place bids, as required for real estate auctions.">
      <form onSubmit={submit} noValidate className="max-w-[640px] space-y-6">
        {formError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{formError}</p>}

        <div role="radiogroup" aria-label="Account type" className="grid grid-cols-2 gap-3">
          {(['individual', 'company'] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={f.accountType === t} onClick={() => set('accountType', t)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${f.accountType === t ? 'border-brand bg-brand-50 font-semibold text-brand' : 'border-black/15 text-ink hover:bg-brand-50/60'}`}>
              {t === 'individual' ? 'Individual' : 'Company'}
              <span className="block text-[11px] font-normal text-muted">{t === 'individual' ? 'Bid in your own name' : 'Bid on behalf of a registered company'}</span>
            </button>
          ))}
        </div>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-sm font-semibold text-brand">Personal details (as on your national ID)</legend>
          <div className="sm:col-span-2">
            <Field label="Full name" error={errors.fullName}>
              <input value={f.fullName} onChange={(e) => set('fullName', e.target.value)} autoComplete="name" placeholder="e.g. Layana Sublaban" className={inputCls(errors.fullName)} />
            </Field>
          </div>
          <Field label="Date of birth" error={errors.dob}>
            <input type="date" value={f.dob} onChange={(e) => set('dob', e.target.value)} autoComplete="bday" className={inputCls(errors.dob)} />
          </Field>
          <Field label="National ID number" error={errors.nationalId} hint="10 digits">
            <input inputMode="numeric" maxLength={10} value={f.nationalId} onChange={(e) => set('nationalId', e.target.value.replace(/\D/g, ''))} placeholder="9XXXXXXXXX" className={inputCls(errors.nationalId)} />
          </Field>
        </fieldset>

        {f.accountType === 'company' && (
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-semibold text-brand">Company details</legend>
            <Field label="Company name" error={errors.companyName}>
              <input value={f.companyName} onChange={(e) => set('companyName', e.target.value)} className={inputCls(errors.companyName)} />
            </Field>
            <Field label="Commercial registration no." error={errors.commercialReg}>
              <input inputMode="numeric" value={f.commercialReg} onChange={(e) => set('commercialReg', e.target.value.replace(/\D/g, ''))} className={inputCls(errors.commercialReg)} />
            </Field>
          </fieldset>
        )}

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-sm font-semibold text-brand">Contact</legend>
          <Field label="Email" error={errors.email}>
            <input type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" className={inputCls(errors.email)} />
          </Field>
          <Field label="Mobile number" error={errors.phone} hint="Used for bid alerts and one-time codes">
            <div className="flex">
              <span className="flex items-center rounded-l-lg border border-r-0 border-black/15 bg-brand-50 px-3 text-sm text-ink">+962</span>
              <input inputMode="numeric" autoComplete="tel-national" maxLength={9} value={f.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} placeholder="79 123 4567" className={`${inputCls(errors.phone)} rounded-l-none`} />
            </div>
          </Field>
          <div className="sm:col-span-2">
            <Field label="City" error={errors.city}>
              <select value={f.city} onChange={(e) => set('city', e.target.value)} className={inputCls(errors.city)}>
                <option value="">Select your city</option>
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-3 text-sm font-semibold text-brand">Security</legend>
          <div>
            <Field label="Password" error={errors.password}>
              <PasswordInput value={f.password} onChange={(v) => set('password', v)} error={errors.password} autoComplete="new-password" />
            </Field>
            {f.password && (
              <div className="mt-2" aria-live="polite">
                <div className="flex gap-1">{[1, 2, 3, 4].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= s ? (s <= 1 ? 'bg-red-500' : s === 2 ? 'bg-gold' : 'bg-brand-500') : 'bg-black/10'}`} />)}</div>
                <p className="mt-1 text-[11px] text-muted">Strength: {sLabel}</p>
              </div>
            )}
          </div>
          <Field label="Confirm password" error={errors.confirm}>
            <PasswordInput value={f.confirm} onChange={(v) => set('confirm', v)} error={errors.confirm} autoComplete="new-password" />
          </Field>
        </fieldset>

        <div className="space-y-3 rounded-xl bg-brand-50 p-4 text-xs text-ink">
          <label className="flex items-start gap-2.5">
            <input type="checkbox" checked={f.terms} onChange={(e) => set('terms', e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-brand" />
            <span>I have read and accept the <b>Terms &amp; Conditions</b> and the <b>Privacy Policy</b>, and I confirm the information above is accurate.</span>
          </label>
          {errors.terms && <p role="alert" className="text-[11px] text-red-600">{errors.terms}</p>}
          <label className="flex items-start gap-2.5">
            <input type="checkbox" checked={f.binding} onChange={(e) => set('binding', e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-brand" />
            <span>I understand that every bid I place is <b>legally binding</b>, that a refundable deposit is required before bidding, and that my identity will be verified.</span>
          </label>
          {errors.binding && <p role="alert" className="text-[11px] text-red-600">{errors.binding}</p>}
        </div>

        <button type="submit" disabled={busy} className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
          {busy ? 'Creating account…' : 'Create Account'}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account? <Link to={`/signin${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-brand hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  )
}
