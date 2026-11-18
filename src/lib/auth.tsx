import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  nationalId: string
  dob: string
  city: string
  accountType: 'individual' | 'company'
  companyName?: string
  commercialReg?: string
  createdAt: number
  /** Identity verification status (demo: becomes "pending" after sign up). */
  verification: 'unverified' | 'pending' | 'verified'
}

export interface SignUpInput extends Omit<User, 'id' | 'createdAt' | 'verification'> {
  password: string
}

interface AuthState {
  user: User | null
  loggedIn: boolean
  signIn: (email: string, password: string, remember: boolean) => Promise<{ ok: true } | { ok: false; error: string }>
  signUp: (input: SignUpInput) => Promise<{ ok: true } | { ok: false; error: string }>
  logout: () => void
}

const USERS_KEY = 'emazadak.users'
const SESSION_KEY = 'emazadak.session'

type Stored = User & { hash: string }

const read = <T,>(storage: 'local' | 'session', key: string, fallback: T): T => {
  try {
    const s = storage === 'local' ? window.localStorage : window.sessionStorage
    const raw = s.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
const write = (storage: 'local' | 'session', key: string, value: unknown) => {
  try {
    const s = storage === 'local' ? window.localStorage : window.sessionStorage
    s.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) */
  }
}
const remove = (key: string) => {
  try {
    window.localStorage.removeItem(key)
    window.sessionStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

async function hashPassword(pw: string): Promise<string> {
  try {
    const data = new TextEncoder().encode(`emazadak:${pw}`)
    const buf = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return `plain:${pw}`
  }
}

const AuthContext = createContext<AuthState>({
  user: null,
  loggedIn: false,
  signIn: async () => ({ ok: false, error: 'Auth unavailable' }),
  signUp: async () => ({ ok: false, error: 'Auth unavailable' }),
  logout: () => {},
})

/**
 * Front-end auth for the public website (not the admin panel).
 * Accounts are kept in the browser (localStorage) until a real backend is connected:
 * replace signIn / signUp with API calls and keep the same shapes.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const id = read<string | null>('local', SESSION_KEY, null) ?? read<string | null>('session', SESSION_KEY, null)
    if (id) {
      const found = read<Stored[]>('local', USERS_KEY, []).find((u) => u.id === id)
      if (found) setUser(stripHash(found))
    }
  }, [])

  const signIn = useCallback<AuthState['signIn']>(async (email, password, remember) => {
    const users = read<Stored[]>('local', USERS_KEY, [])
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!found || found.hash !== (await hashPassword(password))) return { ok: false, error: 'Incorrect email or password.' }
    remove(SESSION_KEY)
    write(remember ? 'local' : 'session', SESSION_KEY, found.id)
    setUser(stripHash(found))
    return { ok: true }
  }, [])

  const signUp = useCallback<AuthState['signUp']>(async ({ password, ...profile }) => {
    const users = read<Stored[]>('local', USERS_KEY, [])
    if (users.some((u) => u.email.toLowerCase() === profile.email.trim().toLowerCase()))
      return { ok: false, error: 'An account with this email already exists.' }
    if (users.some((u) => u.nationalId === profile.nationalId))
      return { ok: false, error: 'This national ID is already registered.' }
    const created: Stored = {
      ...profile,
      email: profile.email.trim(),
      id: `U${Date.now()}`,
      createdAt: Date.now(),
      verification: 'pending',
      hash: await hashPassword(password),
    }
    write('local', USERS_KEY, [...users, created])
    remove(SESSION_KEY)
    write('local', SESSION_KEY, created.id)
    setUser(stripHash(created))
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    remove(SESSION_KEY)
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loggedIn: !!user, signIn, signUp, logout }), [user, signIn, signUp, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function stripHash({ hash: _h, ...u }: Stored): User {
  return u
}

export const useAuth = () => useContext(AuthContext)
