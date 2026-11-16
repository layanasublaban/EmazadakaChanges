import { useState } from 'react'

/**
 * Uses /images/logo.svg when present (export it from Figma into public/images/),
 * otherwise falls back to the text wordmark.
 */
export function Logo({ className = '', size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false)
  const lg = size === 'lg'

  if (!failed) {
    return (
      <img
        src="/images/logo.svg"
        alt="Emazadak – PropTech Market Leader"
        className={`${lg ? 'h-[84px]' : 'h-[46px]'} w-auto ${className}`}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <span className={`font-serif font-bold text-ink ${lg ? 'text-[44px]' : 'text-[22px]'}`}>Emazadak</span>
      <span className={`text-brand ${lg ? 'text-[17px]' : 'text-[9px]'}`}>PropTech Market Leader</span>
    </div>
  )
}
