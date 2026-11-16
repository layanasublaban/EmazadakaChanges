import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const compute = (endsAt: number): Countdown => {
  const total = Math.max(0, Math.floor((endsAt - Date.now()) / 1000))
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  }
}

/** Ticks once per second until `endsAt` (epoch ms). */
export function useCountdown(endsAt: number): Countdown {
  const [value, setValue] = useState(() => compute(endsAt))
  useEffect(() => {
    setValue(compute(endsAt))
    const id = setInterval(() => setValue(compute(endsAt)), 1000)
    return () => clearInterval(id)
  }, [endsAt])
  return value
}
