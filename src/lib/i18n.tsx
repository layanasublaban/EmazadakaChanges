import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AR, AR_AREAS, AR_DESC, AR_LOCATIONS, AR_NOUNS, AR_TYPES } from '@/lib/ar'
import type { Auction } from '@/data/auctions'

export type Lang = 'en' | 'ar'
const KEY = 'emazadak.lang'

interface I18n {
  lang: Lang
  rtl: boolean
  setLang: (l: Lang) => void
  /** Translate a UI string (keys are the English text). `{n}` placeholders are filled from vars. */
  t: (key: string, vars?: Record<string, string | number>) => string
  /** Localised text fields of an auction (title, location, area, type, description, chip). */
  auction: (a: Auction) => { title: string; location: string; area: string; type: string; description: string; chip: string; category: string }
}

const fill = (s: string, vars?: Record<string, string | number>) => (vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s)

const Ctx = createContext<I18n>({
  lang: 'en',
  rtl: false,
  setLang: () => {},
  t: (k, v) => fill(k, v),
  auction: (a) => ({ title: a.title, location: a.location, area: a.area, type: a.type, description: a.description, chip: a.chip, category: a.category }),
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem(KEY) : null
      return saved === 'ar' ? 'ar' : 'en'
    } catch {
      return 'en'
    }
  })

  // Keep <html lang/dir> in sync – the Arabic font (Tajawal, from the brand guide) is applied from CSS.
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<I18n>(() => {
    const t: I18n['t'] = (key, vars) => fill(lang === 'ar' ? (AR[key] ?? key) : key, vars)
    const auction: I18n['auction'] = (a) => {
      if (lang === 'en') return { title: a.title, location: a.location, area: a.area, type: a.type, description: a.description, chip: a.chip, category: a.category }
      const noun = AR_NOUNS[a.title.split(' – ')[0]] ?? a.title.split(' – ')[0]
      const area = AR_AREAS[a.area] ?? a.area
      const location = AR_LOCATIONS[a.location] ?? a.location
      return {
        title: `${noun} – ${area}، ${location}`,
        location,
        area,
        type: AR_TYPES[a.type] ?? a.type,
        description: AR_DESC[a.description] ?? a.description,
        chip: AR[a.chip] ?? a.chip,
        category: AR[a.category] ?? a.category,
      }
    }
    return { lang, rtl: lang === 'ar', setLang, t, auction }
  }, [lang, setLang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
export const useT = () => useContext(Ctx).t
