import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { dictionaries, type Key, type Lang } from './i18n'
import {
  seedAuctions, seedSubmissions, seedTx, seedUsers,
  type AdminAuction, type AdminUser, type Bi, type Submission, type Tx,
} from './data'

export interface Settings {
  platformName: string
  supportEmail: string
  minDeposit: string
  extension: string
  currency: string
}

interface Store {
  lang: Lang
  dir: 'ltr' | 'rtl'
  toggleLang: () => void
  t: (k: Key) => string
  loc: (b: Bi) => string
  loggedIn: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  query: string
  setQuery: (q: string) => void
  toast: string | null
  auctions: AdminAuction[]
  saveAuction: (a: AdminAuction) => void
  submissions: Submission[]
  decideSubmission: (id: string, status: 'Approved' | 'Rejected', reason?: string) => void
  users: AdminUser[]
  toggleSuspend: (id: string) => void
  transactions: Tx[]
  settings: Settings
  saveSettings: (s: Settings) => void
  notify: (msg: string) => void
}

const Ctx = createContext<Store | null>(null)

const SESSION_KEY = 'emazadak-admin-session'
const LANG_KEY = 'emazadak-admin-lang'

function readLS(k: string): string | null {
  try {
    return window.localStorage.getItem(k)
  } catch {
    return null
  }
}
function writeLS(k: string, v: string | null) {
  try {
    if (v === null) window.localStorage.removeItem(k)
    else window.localStorage.setItem(k, v)
  } catch {
    /* storage unavailable: ignore */
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (readLS(LANG_KEY) === 'ar' ? 'ar' : 'en'))
  const [loggedIn, setLoggedIn] = useState(() => readLS(SESSION_KEY) === '1')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [auctions, setAuctions] = useState(seedAuctions)
  const [submissions, setSubmissions] = useState(seedSubmissions)
  const [users, setUsers] = useState(seedUsers)
  const [settings, setSettings] = useState<Settings>({
    platformName: 'Emazadak',
    supportEmail: 'support@emazadak.com',
    minDeposit: '1000',
    extension: '5',
    currency: 'JOD',
  })

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2800)
  }, [])

  const value = useMemo<Store>(() => {
    const dict = dictionaries[lang]
    return {
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      toggleLang: () => {
        const next: Lang = lang === 'en' ? 'ar' : 'en'
        setLang(next)
        writeLS(LANG_KEY, next)
      },
      t: (k) => dict[k],
      loc: (b) => b[lang],
      loggedIn,
      login: (email, password) => {
        const ok = email.trim().toLowerCase() === 'admin@emazadak.com' && password === 'admin123'
        if (ok) {
          setLoggedIn(true)
          writeLS(SESSION_KEY, '1')
        }
        return ok
      },
      logout: () => {
        setLoggedIn(false)
        writeLS(SESSION_KEY, null)
      },
      query,
      setQuery,
      toast,
      auctions,
      saveAuction: (a) =>
        setAuctions((prev) => (prev.some((x) => x.id === a.id) ? prev.map((x) => (x.id === a.id ? a : x)) : [a, ...prev])),
      submissions,
      decideSubmission: (id, status, reason) =>
        setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status, reason } : s))),
      users,
      toggleSuspend: (id) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, suspended: !u.suspended } : u))),
      transactions: seedTx,
      settings,
      saveSettings: setSettings,
      notify,
    }
  }, [lang, loggedIn, query, toast, auctions, submissions, users, settings, notify])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAdmin(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAdmin must be used inside <AdminProvider>')
  return v
}
