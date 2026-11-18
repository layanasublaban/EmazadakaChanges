/** Pulsing "live" indicator dot. */
export function LiveDot({ className = 'text-red-500', size = 8 }: { className?: string; size?: number }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} style={{ width: size, height: size }} aria-hidden>
      <span className="live-ring" />
      <span className="relative inline-block size-full rounded-full bg-current" />
    </span>
  )
}
