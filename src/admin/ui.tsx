import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { Link } from '@/lib/router'
import { useAdmin } from './store'

type Kind = 'primary' | 'outline' | 'danger'
const kinds: Record<Kind, string> = {
  primary: 'bg-brand text-white hover:bg-brand-700',
  outline: 'border border-black/10 bg-white text-ink hover:bg-black/[0.03]',
  danger: 'border border-red-600 bg-white text-red-700 hover:bg-red-50',
}
const btnBase =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50'

export function Button({ kind = 'primary', className = '', ...p }: { kind?: Kind } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`${btnBase} ${kinds[kind]} ${className}`} {...p} />
}

export function LinkButton({ to, kind = 'primary', children, className = '' }: { to: string; kind?: Kind; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`${btnBase} ${kinds[kind]} ${className}`}>
      {children}
    </Link>
  )
}

const badgeTone: Record<string, string> = {
  Active: 'bg-green-50 text-green-700',
  Approved: 'bg-green-50 text-green-700',
  Verified: 'bg-green-50 text-green-700',
  Completed: 'bg-green-50 text-green-700',
  Upcoming: 'bg-blue-50 text-blue-700',
  Ended: 'bg-black/5 text-street',
  Pending: 'bg-gold-50 text-gold-dark',
  Unverified: 'bg-gold-50 text-gold-dark',
  Rejected: 'bg-red-50 text-red-700',
  Failed: 'bg-red-50 text-red-700',
  Suspended: 'bg-red-50 text-red-700',
}
export function Badge({ status }: { status: string }) {
  const { t } = useAdmin()
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeTone[status] ?? 'bg-black/5'}`}>
      {t(status as never)}
    </span>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-black/10 bg-white p-6 ${className}`}>{children}</div>
}

export function PageHeader({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-black">{title}</h1>
        <p className="mt-1 text-sm text-street">{sub}</p>
      </div>
      {action}
    </div>
  )
}

export function Field({ label, error, id, ...p }: { label: string; error?: string; id: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-street">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={`rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${error ? 'border-red-600' : 'border-black/10'}`}
        {...p}
      />
      {error && (
        <span role="alert" className="text-xs text-red-700">
          {error}
        </span>
      )}
    </div>
  )
}

export interface Col<T> {
  header: string
  width?: string
  cell: (row: T) => ReactNode
}
export function DataTable<T extends { id: string }>({ cols, rows }: { cols: Col<T>[]; rows: T[] }) {
  const { t } = useAdmin()
  if (rows.length === 0) return <Card className="text-center text-sm text-street">{t('noResults')}</Card>
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
      <table className="w-full text-start text-sm">
        <thead>
          <tr className="bg-black/[0.04] text-xs font-semibold text-street">
            {cols.map((c) => (
              <th key={c.header} scope="col" className={`h-11 px-4 text-start ${c.width ?? ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-black/10 hover:bg-black/[0.015]">
              {cols.map((c) => (
                <td key={c.header} className="h-16 px-4 text-start">
                  {c.cell(r)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
