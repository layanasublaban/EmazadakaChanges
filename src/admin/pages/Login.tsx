import { useState, type FormEvent } from 'react'
import { go } from '../nav'
import { useAdmin } from '../store'
import { Button, Card, Field } from '../ui'

export default function Login() {
  const { t, login, lang, toggleLang } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return setError(t('loginError'))
    if (!login(email, password)) return setError(t('loginBad'))
    go('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <Card className="w-full max-w-[440px] p-8">
        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <div className="text-center">
            <div className="text-[32px] font-bold text-brand">{t('appName')}</div>
            <div className="text-sm text-street">{t('adminPanel')}</div>
          </div>
          <Field id="email" type="email" autoComplete="username" label={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@emazadak.com" />
          <Field id="password" type="password" autoComplete="current-password" label={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && (
            <p role="alert" className="text-xs text-red-700">
              {error}
            </p>
          )}
          <button type="submit" className="rounded-lg bg-brand px-4 py-3 text-sm font-medium text-white hover:bg-brand-700">
            {t('signIn')}
          </button>
          <Button kind="outline" onClick={toggleLang} lang={lang === 'en' ? 'ar' : 'en'}>
            {t('switchLang')}
          </Button>
        </form>
      </Card>
    </div>
  )
}
