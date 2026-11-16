import { useState } from 'react'

/** Photo with a neutral gradient fallback while the real file is missing from public/images. */
export function PropertyImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-gradient-to-br from-brand-200 via-brand-400 to-brand-700 ${className}`}
      />
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />
}
