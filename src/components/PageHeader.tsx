import type { ReactNode } from 'react'

/** Title block used at the top of inner pages (below the shared Navbar). */
export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <div className="mx-auto mt-10 flex max-w-[1356px] flex-wrap items-end justify-between gap-4 px-[41px]">
      <div>
        <h1 className="font-serif text-[34px] leading-tight font-bold text-brand">{title}</h1>
        <p className="mt-2 max-w-[640px] text-[15px] text-muted">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
