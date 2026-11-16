import { useCountdown } from '@/lib/useCountdown'

const pad = (n: number) => String(n).padStart(2, '0')

interface Props {
  endsAt: number
  /** "sm" for cards, "lg" for the auction details sidebar */
  size?: 'sm' | 'lg'
}

export function CountdownTimer({ endsAt, size = 'sm' }: Props) {
  const t = useCountdown(endsAt)
  const lg = size === 'lg'
  const parts = [
    { v: t.days, label: 'Days' },
    { v: t.hours, label: 'Hours' },
    { v: t.minutes, label: 'Minutes' },
    { v: t.seconds, label: 'Seconds' },
  ]

  return (
    <div
      role="timer"
      aria-label="Time remaining"
      className={`flex items-start justify-center ${lg ? 'gap-5' : 'gap-3'}`}
    >
      {parts.map((p, i) => (
        <div key={p.label} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`flex items-center justify-center rounded-md bg-sand font-semibold text-brand tabular-nums ${
                lg ? 'h-10 min-w-10 px-1.5 text-[22px]' : 'h-5 min-w-5 px-1 text-[11px]'
              }`}
            >
              {pad(p.v)}
            </span>
            <span className={`mt-1 text-ink ${lg ? 'text-xs font-medium' : 'text-[7px]'}`}>{p.label}</span>
          </div>
          {i < parts.length - 1 && (
            <span className={`font-bold text-ink ${lg ? 'mt-1 text-2xl' : 'text-xs leading-5'}`}>:</span>
          )}
        </div>
      ))}
    </div>
  )
}
