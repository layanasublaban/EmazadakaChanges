import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react'

const readHash = () => (typeof window === 'undefined' ? '/' : window.location.hash.replace(/^#/, '') || '/')

/** Splits "/auctions?q=villa" into the path and its query string. */
export function parseRoute(hash: string): { path: string; query: URLSearchParams } {
  const i = hash.indexOf('?')
  return { path: i === -1 ? hash : hash.slice(0, i), query: new URLSearchParams(i === -1 ? '' : hash.slice(i + 1)) }
}

function useHash(): string {
  const [hash, setHash] = useState(readHash)
  useEffect(() => {
    const onChange = () => {
      setHash(readHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

/** Tiny hash router so the app needs no extra dependencies. Returns the path without the query string. */
export function useHashRoute(): string {
  return parseRoute(useHash()).path
}

/** Query string of the current route, e.g. `useQuery().get('q')`. */
export function useQuery(): URLSearchParams {
  return parseRoute(useHash()).query
}

export const navigate = (to: string) => {
  window.location.hash = to
}

export function Link({ to, onClick, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={`#${to}`}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e)
      }}
      {...rest}
    />
  )
}
