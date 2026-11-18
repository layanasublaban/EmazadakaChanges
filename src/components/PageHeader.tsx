import type { ReactNode } from 'react'
import { useI18n } from '@/lib/i18n'

/** Title block used at the top of inner pages (below the shared Navbar). Title/subtitle are English keys translated via t(). */
export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  const { t } = useI18n()
  return (
    <div className="mx-auto mt-6 flex max-w-[1356px] flex-wrap items-end justify-between gap-4 px-4 sm:mt-10 sm:px-[41px]">
      <div className="animate-fade-up">
        <h1 className="font-serif text-[26px] leading-tight font-bold text-brand sm:text-[34px]">{t(title)}</h1>
        <p className="mt-2 max-w-[640px] text-sm text-muted sm:text-[15px]">{t(subtitle)}</p>
      </div>
      {children}
    </div>
  )
}
