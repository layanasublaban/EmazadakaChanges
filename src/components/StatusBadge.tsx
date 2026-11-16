import type { ReactNode } from 'react'
import { LiveDotIcon, WarningIcon } from './Icons'

export type BadgeKind = 'live' | 'live-ending' | 'coming-soon' | 'deposit-required' | 'verification-required'

const styles: Record<BadgeKind, string> = {
  live: 'border-[#a9d36b] bg-[#f3f9e8] text-[#4a9a1c]',
  'live-ending': 'border-[#a9d36b] bg-[#f3f9e8] text-[#4a9a1c]',
  'coming-soon': 'border-[#b9d4f2] bg-[#e9f2fc] text-[#4d86c6]',
  'deposit-required': 'border-gold-300 bg-cream text-[#e0a100]',
  'verification-required': 'border-gold-300 bg-cream text-[#e0a100]',
}

const labels: Record<BadgeKind, string> = {
  live: 'Live - Auction Started',
  'live-ending': 'Live - Ending Soon',
  'coming-soon': 'Coming Soon',
  'deposit-required': 'Deposit Required',
  'verification-required': 'Verfication Required',
}

interface Props {
  kind: BadgeKind
  /** Compact variant used inside auction cards */
  small?: boolean
  children?: ReactNode
}

export function StatusBadge({ kind, small = false, children }: Props) {
  const warn = kind === 'deposit-required' || kind === 'verification-required'
  const Icon = warn ? WarningIcon : LiveDotIcon
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${styles[kind]} ${
        small ? 'px-2 py-0.5 text-[7px]' : 'px-3 py-2 text-[15px]'
      }`}
    >
      <Icon width={small ? 8 : 18} height={small ? 8 : 18} />
      {children ?? labels[kind]}
    </span>
  )
}
