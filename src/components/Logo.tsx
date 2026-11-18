import { useState } from 'react'

/**
 * Emazadak logo exported from the Figma design (public/images/logo.png, 138x41 – used in the header,
 * and logo-footer.png for the footer). Falls back to a text wordmark if the file is missing.
 */
export function Logo({ className = '', size = 'md' }: { className?: string; size?: 'md' | 'lg' }) {
  const [failed, setFailed] = useState(false)
  const lg = size === 'lg'

  if (!failed) {
    return (
      <img
        src={lg ? '/images/logo-footer.png' : '/images/logo.png'}
        alt="Emazadak – PropTech Market Leader"
        width={lg ? 270 : 138}
        height={lg ? 83 : 41}
        className={`${lg ? 'h-[83px] w-[270px]' : 'h-[41px] w-[138px]'} max-w-none object-contain ${className}`}
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
