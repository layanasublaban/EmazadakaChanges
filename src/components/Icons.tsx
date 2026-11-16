import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export const HeartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9Z" />
  </svg>
)
export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
export const UserCircleIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 18.5c1.2-2 3-3 5.5-3s4.3 1 5.5 3" />
  </svg>
)
export const ChevronLeftIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m15 5-7 7 7 7" />
  </svg>
)
export const ChevronRightIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
)
export const ChevronDownIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 9 7 7 7-7" />
  </svg>
)
export const PinIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
  </svg>
)
export const WarningIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 3 2 21h20L12 3Zm1 14h-2v-2h2v2Zm0-4h-2V9h2v4Z" />
  </svg>
)
export const LiveDotIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.5" fill="currentColor" />
  </svg>
)
export const FilterIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </svg>
)
export const AppleIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3 .9-3.9 2.3-1.7 2.9-.4 7.1 1.2 9.4.8 1.1 1.7 2.4 2.9 2.4 1.2 0 1.6-.8 3-.8s1.8.8 3.1.8 2.1-1.1 2.9-2.3c.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.5-1-2.5-4Zm-2.3-6.9c.6-.8 1.1-1.9.9-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3Z" />
  </svg>
)
export const PlayIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M5 3.5v17a1 1 0 0 0 1.5.9l14-8.5a1 1 0 0 0 0-1.8l-14-8.5A1 1 0 0 0 5 3.5Z" />
  </svg>
)
export const FacebookIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M12 2a10 10 0 0 0-1.6 19.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 12 2Z" />
  </svg>
)
export const TwitterIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M22 5.9a8 8 0 0 1-2.4.7 4.1 4.1 0 0 0 1.8-2.3 8.200 8.200 0 0 1-2.6 1 4.100 4.100 0 0 0-7 3.700A11.600 11.600 0 0 1 3.400 4.800a4.100 4.100 0 0 0 1.300 5.500 4 4 0 0 1-1.900-.5v.1a4.100 4.100 0 0 0 3.300 4 4.100 4.100 0 0 1-1.900.1 4.100 4.100 0 0 0 3.800 2.800A8.200 8.200 0 0 1 2 18.500 11.600 11.600 0 0 0 8.300 20.300c7.500 0 11.700-6.300 11.700-11.700v-.5A8.300 8.300 0 0 0 22 5.900Z" />
  </svg>
)
export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".8" fill="currentColor" />
  </svg>
)
export const LinkedinIcon = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}>
    <path d="M4.500 8.500h3.500V20H4.500V8.500ZM6.250 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 8.500h3.300v1.600h.1c.5-.9 1.600-1.900 3.400-1.900 3.600 0 4.200 2.400 4.200 5.400V20h-3.500v-5.700c0-1.400 0-3.100-1.900-3.100s-2.200 1.500-2.200 3V20H10V8.500Z" />
  </svg>
)
