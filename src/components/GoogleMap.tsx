import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/lib/i18n'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any
    __emazadakMapsReady?: () => void
  }
}

export interface MapPin {
  id: string
  lat: number
  lng: number
  title: string
  live: boolean
  ended?: boolean
}

/** Set VITE_GOOGLE_MAPS_API_KEY in .env to get the full interactive map; without it the keyless embed is used. */
export const MAPS_KEY: string = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ?? ''
export const hasMapsKey = !!MAPS_KEY

export const googleMapsLink = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

let loader: Promise<any> | null = null
function loadMaps(lang: string): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.google?.maps) return Promise.resolve(window.google)
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      window.__emazadakMapsReady = () => resolve(window.google)
      const s = document.createElement('script')
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(MAPS_KEY)}&v=weekly&language=${lang}&region=JO&callback=__emazadakMapsReady`
      s.async = true
      s.onerror = () => reject(new Error('Google Maps failed to load'))
      document.head.appendChild(s)
    })
  }
  return loader
}

/** Single-property map without an API key (Google's public embed). */
export function EmbedMap({ lat, lng, zoom = 15, className = '', title }: { lat: number; lng: number; zoom?: number; className?: string; title: string }) {
  const { lang } = useI18n()
  return (
    <iframe
      title={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=${lang}&output=embed`}
      className={`border-0 ${className}`}
    />
  )
}

interface Props {
  pins: MapPin[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  center?: { lat: number; lng: number }
  zoom?: number
  className?: string
}

/** Google Maps (JS API) with glowing live-auction markers. Needs VITE_GOOGLE_MAPS_API_KEY. */
export function GoogleMap({ pins, selectedId, onSelect, center = { lat: 31.3, lng: 36.2 }, zoom = 7, className = '' }: Props) {
  const { lang, t } = useI18n()
  const host = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const overlays = useRef<any[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let off = false
    loadMaps(lang)
      .then((g) => {
        if (off || !host.current) return
        map.current = new g.maps.Map(host.current, {
          center,
          zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'greedy',
          styles: [{ featureType: 'poi.business', stylers: [{ visibility: 'off' }] }],
        })
        setState('ready')
      })
      .catch(() => !off && setState('error'))
    return () => {
      off = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  // (Re)draw markers
  useEffect(() => {
    const g = window.google
    if (state !== 'ready' || !g || !map.current) return
    overlays.current.forEach((o) => o.setMap(null))
    overlays.current = []

    class PinOverlay extends g.maps.OverlayView {
      el: HTMLDivElement
      constructor(private pin: MapPin, private selected: boolean) {
        super()
        this.el = document.createElement('div')
        this.el.style.position = 'absolute'
        this.el.style.cursor = 'pointer'
        this.el.title = pin.title
        const color = pin.ended ? '#9ca3af' : pin.live ? '#e03d3d' : '#194b3f'
        this.el.innerHTML = `<div class="pin-wrap" style="color:${color};transform:translate(-50%,-50%) scale(${selected ? 1.4 : 1})">${
          pin.live ? '<span class="live-ring"></span>' : ''
        }<span class="pin-dot" style="background:${color}"></span></div>`
        this.el.addEventListener('click', () => onSelect?.(pin.id))
      }
      onAdd() {
        this.getPanes().overlayMouseTarget.appendChild(this.el)
      }
      draw() {
        const p = this.getProjection()?.fromLatLngToDivPixel(new g.maps.LatLng(this.pin.lat, this.pin.lng))
        if (p) {
          this.el.style.left = `${p.x}px`
          this.el.style.top = `${p.y}px`
          this.el.style.zIndex = this.selected ? '10' : this.pin.live ? '5' : '1'
        }
      }
      onRemove() {
        this.el.remove()
      }
    }

    overlays.current = pins.map((p) => {
      const o = new PinOverlay(p, p.id === selectedId)
      o.setMap(map.current)
      return o
    })

    const sel = pins.find((p) => p.id === selectedId)
    if (sel) {
      map.current.panTo({ lat: sel.lat, lng: sel.lng })
      if ((map.current.getZoom() ?? 0) < 12) map.current.setZoom(13)
    }
  }, [state, pins, selectedId, onSelect])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={host} className="absolute inset-0" />
      {state !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-50 text-sm text-brand">
          {state === 'loading' ? t('Loading map…') : t('Google Maps could not be loaded. Check the API key.')}
        </div>
      )}
    </div>
  )
}
