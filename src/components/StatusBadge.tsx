import type { ReactNode } from 'react'
import { useI18n } from '@/lib/i18n'
import { LiveDot } from './LiveDot'
import { WarningIcon } from './Icons'

export type BadgeKind = 'live' | 'live-ending' | 'coming-soon' | 'deposit-required' | 'verification-required' | 'finished'

const styles: Record<BadgeKind, string> = {
  live: 'border-[#a9d36b] bg-[#f3f9e8] text-[#4a9a1c]',
  'live-ending': 'border-red-300 bg-red-50 text-red-600',
  'coming-soon': 'border-[#b9d4f2] bg-[#e9f2fc] text-[#4d86c6]',
  'deposit-required': 'border-gold-300 bg-cream text-[#e0a100]',
  'verification-required': 'border-gold-300 bg-cream text-[#e0a100]',
  finished: 'border-black/10 bg-black/5 text-muted',
}

const labels: Record<BadgeKind, string> = {
  live: 'Live - Auction Started',
  'live-ending': 'Live - Ending Soon',
  'coming-soon': 'Coming Soon',
  'deposit-required': 'Deposit Required',
  'verification-required': 'Verification Required',
  finished: 'Auction Closed',
}

interface Props {
  kind: BadgeKind
  /** Compact variant used inside auction cards */
  small?: boolean
  children?: ReactNode
}

export function StatusBadge({ kind, small = false, children }: Props) {
  const { t } = useI18n()
  const warn = kind === 'deposit-required' || kind === 'verification-required'
  const live = kind === 'live' || kind === 'live-ending'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${styles[kind]} ${small ? 'px-2 py-0.5 text-[9px]' : 'px-3 py-2 text-sm sm:text-[15px]'}`}>
      {warn ? <WarningIcon width={small ? 9 : 18} height={small ? 9 : 18} /> : live ? <LiveDot className={kind === 'live' ? 'text-[#4a9a1c]' : 'text-red-500'} size={small ? 7 : 10} /> : <span className="size-2 rounded-full bg-current opacity-60" />}
      {children ?? t(labels[kind])}
    </span>
  )
}
