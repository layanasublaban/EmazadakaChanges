// Generates unique illustrated property images (SVG) – run: node scripts/gen-art.mjs
// Output: public/images/art/{id}-{view}.svg and public/images/ads/ad-{n}.svg
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) }

const SKIES = [
  { name: 'morning', top: '#9fd0e6', bot: '#fdeccf', sun: '#fff3c4', hill: ['#c8b58a', '#b19a6e', '#8f7d57'], glass: '#a9d3e8', lit: false },
  { name: 'noon', top: '#5eb0dc', bot: '#d7efff', sun: '#fffbe0', hill: ['#d9c79c', '#c2ad7c', '#a38f63'], glass: '#8cc5e6', lit: false },
  { name: 'golden', top: '#f4a259', bot: '#ffe3a6', sun: '#fff0b3', hill: ['#c99a62', '#a97a48', '#7f5a35'], glass: '#f3c88a', lit: false },
  { name: 'dusk', top: '#2c3e6b', bot: '#f08a5d', sun: '#ffd6a0', hill: ['#6b5b73', '#4d405a', '#33294a'], glass: '#ffd98a', lit: true },
  { name: 'overcast', top: '#aebfc9', bot: '#e6ecef', sun: '#f4f7f8', hill: ['#b9b7a6', '#9c9a88', '#7e7c6b'], glass: '#c5d6df', lit: false },
]
const WALLS = ['#f4efe6', '#e8dcc6', '#f7f3ea', '#dfe6e3', '#efe2cf', '#ece8f0']
const ACCENT = ['#194b3f', '#d4a041', '#316c5e', '#b9773a', '#2c2c2c']

const f = (n) => Math.round(n * 10) / 10

function base(W, H, sky, r) {
  const sunX = W * (0.15 + r() * 0.7), sunY = H * (0.16 + r() * 0.14)
  let s = `<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky.top}"/><stop offset="1" stop-color="${sky.bot}"/></linearGradient>
<radialGradient id="sun"><stop offset="0" stop-color="${sky.sun}" stop-opacity="1"/><stop offset="1" stop-color="${sky.sun}" stop-opacity="0"/></radialGradient>
<linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
<filter id="blur"><feGaussianBlur stdDeviation="6"/></filter></defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<circle cx="${f(sunX)}" cy="${f(sunY)}" r="${H * 0.3}" fill="url(#sun)"/>
<circle cx="${f(sunX)}" cy="${f(sunY)}" r="${H * 0.045}" fill="${sky.sun}"/>`
  // clouds
  const nc = sky.name === 'overcast' ? 7 : 3
  for (let i = 0; i < nc; i++) {
    const cx = r() * W, cy = H * (0.1 + r() * 0.3), w = 90 + r() * 160
    s += `<g opacity="${sky.name === 'overcast' ? 0.75 : 0.55}" fill="#fff"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(w)}" ry="${f(w * 0.18)}"/><ellipse cx="${f(cx + w * 0.3)}" cy="${f(cy - w * 0.1)}" rx="${f(w * 0.55)}" ry="${f(w * 0.16)}"/></g>`
  }
  return s
}

function hills(W, H, sky, r, horizon) {
  let s = ''
  sky.hill.forEach((c, i) => {
    const y0 = horizon - (2 - i) * H * 0.05 - r() * H * 0.05
    let d = `M0 ${H}L0 ${f(y0)}`
    const steps = 6
    for (let k = 1; k <= steps; k++) d += `Q${f((W * (k - 0.5)) / steps)} ${f(y0 - 20 - r() * H * 0.12)} ${f((W * k) / steps)} ${f(y0 + (r() - 0.5) * 24)}`
    s += `<path d="${d}L${W} ${H}Z" fill="${c}"/>`
  })
  return s
}

function tree(x, y, h, r, sky, kind = 'olive') {
  const dark = sky.lit ? '#1f3a33' : '#2f6b52', mid = sky.lit ? '#2b4d44' : '#4a8b6a'
  if (kind === 'palm') {
    let s = `<path d="M${f(x)} ${f(y)}Q${f(x + 6)} ${f(y - h * 0.5)} ${f(x + 2)} ${f(y - h)}" stroke="#8a6a45" stroke-width="${f(h * 0.06)}" fill="none"/>`
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2, L = h * 0.42
      s += `<path d="M${f(x + 2)} ${f(y - h)}Q${f(x + 2 + Math.cos(a) * L * 0.7)} ${f(y - h - 10 + Math.sin(a) * L * 0.2)} ${f(x + 2 + Math.cos(a) * L)} ${f(y - h + 6 + Math.abs(Math.sin(a)) * L * 0.5)}" stroke="${dark}" stroke-width="${f(h * 0.05)}" fill="none" stroke-linecap="round"/>`
    }
    return s
  }
  return `<rect x="${f(x - h * 0.03)}" y="${f(y - h * 0.4)}" width="${f(h * 0.06)}" height="${f(h * 0.4)}" fill="#6b5236"/>
<ellipse cx="${f(x)}" cy="${f(y - h * 0.62)}" rx="${f(h * 0.3)}" ry="${f(h * 0.3)}" fill="${dark}"/><ellipse cx="${f(x - h * 0.08)}" cy="${f(y - h * 0.7)}" rx="${f(h * 0.2)}" ry="${f(h * 0.18)}" fill="${mid}"/>`
}

function windows(x, y, w, h, cols, rows, sky, r, lit = sky.lit) {
  let s = ''
  const gw = w / cols, gh = h / rows
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const on = lit && r() > 0.35
    s += `<rect x="${f(x + i * gw + gw * 0.15)}" y="${f(y + j * gh + gh * 0.18)}" width="${f(gw * 0.7)}" height="${f(gh * 0.64)}" rx="1.5" fill="${on ? '#ffd98a' : sky.glass}" opacity="${on ? 1 : 0.9}"/>`
  }
  return s
}

const ground = (W, H, y, sky, color) => `<rect y="${f(y)}" width="${W}" height="${f(H - y)}" fill="${color}"/><rect y="${f(y)}" width="${W}" height="${f(H - y)}" fill="url(#shade)"/>`

/* ---------- scenes ---------- */
function villa(W, H, sky, r) {
  const gy = H * 0.72, wall = WALLS[Math.floor(r() * WALLS.length)], acc = ACCENT[Math.floor(r() * 3)]
  let s = hills(W, H, sky, r, H * 0.56) + ground(W, H, gy, sky, sky.lit ? '#3d5a4a' : '#8fb27a')
  const bw = W * (0.5 + r() * 0.12), bx = W * 0.12 + r() * W * 0.1, bh = H * 0.2
  // lower volume
  s += `<rect x="${f(bx)}" y="${f(gy - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${wall}"/>`
  s += `<rect x="${f(bx - 10)}" y="${f(gy - bh - 8)}" width="${f(bw + 20)}" height="10" fill="${acc}"/>`
  s += windows(bx + bw * 0.05, gy - bh * 0.9, bw * 0.62, bh * 0.8, 4, 1, sky, r)
  s += `<rect x="${f(bx + bw * 0.75)}" y="${f(gy - bh * 0.85)}" width="${f(bw * 0.12)}" height="${f(bh * 0.85)}" fill="${acc}"/>`
  // upper volume
  const ux = bx + bw * (0.1 + r() * 0.2), uw = bw * 0.55, uh = H * 0.17
  s += `<rect x="${f(ux)}" y="${f(gy - bh - uh - 8)}" width="${f(uw)}" height="${f(uh)}" fill="${wall}"/><rect x="${f(ux)}" y="${f(gy - bh - uh - 8)}" width="${f(uw)}" height="${f(uh)}" fill="#000" opacity=".05"/>`
  s += `<rect x="${f(ux - 12)}" y="${f(gy - bh - uh - 16)}" width="${f(uw + 24)}" height="9" fill="#2c2c2c"/>`
  s += windows(ux + uw * 0.06, gy - bh - uh - 2, uw * 0.88, uh * 0.78, 3, 1, sky, r)
  // pool
  const px = bx + bw * 0.05, pw = bw * 0.7
  s += `<rect x="${f(px)}" y="${f(gy + 18)}" width="${f(pw)}" height="${f(H * 0.09)}" rx="8" fill="#4fb6d3"/><rect x="${f(px)}" y="${f(gy + 18)}" width="${f(pw)}" height="${f(H * 0.025)}" rx="8" fill="#fff" opacity=".28"/>`
  // garden
  for (let i = 0; i < 5; i++) s += tree(r() > 0.5 ? bx - 30 - r() * bx * 0.6 : bx + bw + 30 + r() * (W - bx - bw) * 0.8, gy + 6 + r() * 20, 80 + r() * 90, r, sky, r() > 0.6 ? 'palm' : 'olive')
  return s
}

function apartment(W, H, sky, r) {
  const gy = H * 0.84, wall = WALLS[Math.floor(r() * WALLS.length)], acc = ACCENT[Math.floor(r() * 3)]
  let s = hills(W, H, sky, r, H * 0.62) + ground(W, H, gy, sky, '#6f7378')
  const bw = W * 0.34, bx = W * (0.25 + r() * 0.2), bh = H * (0.6 + r() * 0.1)
  s += `<rect x="${f(bx + bw)}" y="${f(gy - bh)}" width="${f(bw * 0.28)}" height="${f(bh)}" fill="#000" opacity=".16"/>`
  s += `<rect x="${f(bx)}" y="${f(gy - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${wall}"/><rect x="${f(bx - 8)}" y="${f(gy - bh - 10)}" width="${f(bw + 16)}" height="12" fill="${acc}"/>`
  const rows = 8
  for (let j = 0; j < rows; j++) {
    const y = gy - bh + 20 + j * ((bh - 80) / rows)
    s += windows(bx + 14, y, bw - 28, (bh - 80) / rows - 8, 4, 1, sky, r)
    s += `<rect x="${f(bx + 6)}" y="${f(y + (bh - 80) / rows - 12)}" width="${f(bw - 12)}" height="4" fill="#fff" opacity=".7"/>`
  }
  s += `<rect x="${f(bx + bw * 0.4)}" y="${f(gy - 62)}" width="${f(bw * 0.2)}" height="62" fill="${acc}"/><rect x="${f(bx + bw * 0.43)}" y="${f(gy - 52)}" width="${f(bw * 0.14)}" height="52" fill="${sky.glass}"/>`
  // neighbour
  const nx = bx - W * 0.2, nh = bh * 0.62
  s += `<rect x="${f(nx)}" y="${f(gy - nh)}" width="${f(W * 0.16)}" height="${f(nh)}" fill="${WALLS[(Math.floor(r() * 5) + 1) % 6]}" opacity=".95"/>` + windows(nx + 8, gy - nh + 14, W * 0.16 - 16, nh - 30, 3, 6, sky, r)
  for (let i = 0; i < 4; i++) s += tree(W * (0.04 + r() * 0.92), gy + 4, 60 + r() * 40, r, sky, 'olive')
  return s
}

function building(W, H, sky, r) {
  const gy = H * 0.82, acc = ACCENT[Math.floor(r() * 4)], wall = WALLS[Math.floor(r() * WALLS.length)]
  let s = hills(W, H, sky, r, H * 0.58) + ground(W, H, gy, sky, '#74777c')
  const n = 3, bw = W * 0.24
  for (let i = 0; i < n; i++) {
    const bx = W * 0.1 + i * (bw + W * 0.04), bh = H * (0.34 + r() * 0.24)
    s += `<rect x="${f(bx)}" y="${f(gy - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${i === 1 ? acc : wall}"/><rect x="${f(bx + bw)}" y="${f(gy - bh)}" width="12" height="${f(bh)}" fill="#000" opacity=".12"/>`
    s += windows(bx + 10, gy - bh + 14, bw - 20, bh - 70, 3, Math.round((bh - 70) / 40), sky, r)
    s += `<rect x="${f(bx)}" y="${f(gy - 44)}" width="${f(bw)}" height="44" fill="#2c2c2c" opacity=".85"/><rect x="${f(bx + bw * 0.1)}" y="${f(gy - 36)}" width="${f(bw * 0.8)}" height="36" fill="${sky.glass}" opacity=".9"/>`
  }
  s += `<rect y="${f(gy + 28)}" width="${W}" height="6" fill="#fff" opacity=".35" stroke-dasharray="40 30"/>`
  return s
}

function land(W, H, sky, r, tone = 0) {
  const gy = H * 0.6
  const soil = [['#d8c28f', '#c7ad74'], ['#b9c28c', '#a5b072'], ['#d9b48a', '#c49a6d']][tone % 3]
  let s = hills(W, H, sky, r, gy - H * 0.04)
  s += `<path d="M0 ${H}L0 ${f(gy)}Q${W * 0.4} ${f(gy - 30 - r() * 30)} ${W} ${f(gy + 10)}L${W} ${H}Z" fill="${soil[0]}"/><path d="M0 ${H}L0 ${f(gy + 50)}Q${W * 0.5} ${f(gy + 20 + r() * 40)} ${W} ${f(gy + 60)}L${W} ${H}Z" fill="${soil[1]}"/><rect y="${f(gy)}" width="${W}" height="${f(H - gy)}" fill="url(#shade)"/>`
  // plot polygon
  const p = [[W * 0.2, H * 0.74], [W * 0.46, H * 0.66], [W * 0.82, H * 0.7], [W * 0.88, H * 0.9], [W * 0.14, H * 0.93]]
  s += `<polygon points="${p.map((q) => q.map(f).join(',')).join(' ')}" fill="#fff" opacity=".18" stroke="#d4a041" stroke-width="4" stroke-dasharray="14 9" stroke-linejoin="round"/>`
  p.forEach(([x, y]) => (s += `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="#d4a041" stroke="#fff" stroke-width="3"/>`))
  // survey flag
  s += `<rect x="${f(W * 0.52)}" y="${f(H * 0.5)}" width="4" height="${H * 0.22}" fill="#2c2c2c"/><path d="M${f(W * 0.52 + 4)} ${f(H * 0.5)}h56l-12 14 12 14h-56z" fill="#194b3f"/>`
  for (let i = 0; i < 6; i++) s += tree(W * (0.05 + r() * 0.9), H * (0.66 + r() * 0.3), 50 + r() * 60, r, sky, r() > 0.75 ? 'palm' : 'olive')
  return s
}

function industrialLand(W, H, sky, r) {
  const gy = H * 0.62
  let s = hills(W, H, sky, r, gy - 10) + `<rect y="${f(gy)}" width="${W}" height="${f(H - gy)}" fill="#bfae8a"/><rect y="${f(gy)}" width="${W}" height="${f(H - gy)}" fill="url(#shade)"/>`
  s += `<path d="M0 ${H * 0.86}L${W} ${H * 0.78}L${W} ${H * 0.9}L0 ${H * 0.97}Z" fill="#6f7378"/><path d="M0 ${H * 0.915}L${W} ${H * 0.84}" stroke="#fff" stroke-width="3" stroke-dasharray="26 18" opacity=".7"/>`
  for (let i = 0; i < 3; i++) {
    const x = W * (0.2 + i * 0.28), h = H * 0.34
    s += `<path d="M${f(x - 28)} ${f(gy + 14)}L${f(x)} ${f(gy - h)}L${f(x + 28)} ${f(gy + 14)}M${f(x - 18)} ${f(gy - h * 0.3)}h36M${f(x - 12)} ${f(gy - h * 0.62)}h24M${f(x - 30)} ${f(gy - h * 0.9)}h60" stroke="#43484d" stroke-width="3" fill="none"/>`
  }
  s += `<path d="M0 ${f(gy - H * 0.3)}Q${W * 0.5} ${f(gy - H * 0.22)} ${W} ${f(gy - H * 0.31)}" stroke="#43484d" stroke-width="1.5" fill="none"/>`
  s += `<polygon points="${[[W * 0.18, H * 0.7], [W * 0.78, H * 0.68], [W * 0.82, H * 0.8], [W * 0.14, H * 0.82]].map((q) => q.map(f).join(',')).join(' ')}" fill="#fff" opacity=".15" stroke="#d4a041" stroke-width="4" stroke-dasharray="14 9"/>`
  return s
}

function factory(W, H, sky, r) {
  const gy = H * 0.8
  let s = hills(W, H, sky, r, H * 0.6) + ground(W, H, gy, sky, '#85888c')
  const x0 = W * 0.1, w = W * 0.6, h = H * 0.24
  s += `<rect x="${f(x0)}" y="${f(gy - h)}" width="${f(w)}" height="${f(h)}" fill="#cfd4d8"/>`
  const teeth = 4
  for (let i = 0; i < teeth; i++) s += `<path d="M${f(x0 + (w / teeth) * i)} ${f(gy - h)}l0 -${H * 0.07}l${f(w / teeth)} ${H * 0.07}z" fill="#9aa3aa"/>`
  s += `<rect x="${f(x0)}" y="${f(gy - h)}" width="${f(w)}" height="10" fill="#194b3f"/>`
  for (let i = 0; i < 3; i++) s += `<rect x="${f(x0 + 30 + i * (w / 3.2))}" y="${f(gy - h * 0.62)}" width="${f(w / 4.2)}" height="${f(h * 0.62)}" fill="#6c757d"/><path d="M${f(x0 + 30 + i * (w / 3.2))} ${f(gy - h * 0.62 + 10)}h${f(w / 4.2)}M${f(x0 + 30 + i * (w / 3.2))} ${f(gy - h * 0.62 + 24)}h${f(w / 4.2)}" stroke="#868e96"/>`
  s += `<rect x="${f(x0 + w + 20)}" y="${f(gy - h * 1.5)}" width="40" height="${f(h * 1.5)}" fill="#b9bfc4"/><rect x="${f(x0 + w + 16)}" y="${f(gy - h * 1.5)}" width="48" height="12" fill="#d4a041"/>`
  s += `<ellipse cx="${f(x0 + w + 40)}" cy="${f(gy - h * 1.6)}" rx="50" ry="20" fill="#fff" opacity=".5"/><ellipse cx="${f(x0 + w + 80)}" cy="${f(gy - h * 1.9)}" rx="60" ry="22" fill="#fff" opacity=".35"/>`
  s += `<rect x="${f(x0 + w + 100)}" y="${f(gy - h * 1.1)}" width="64" height="${f(h * 1.1)}" rx="30" fill="#dee2e6"/><ellipse cx="${f(x0 + w + 132)}" cy="${f(gy - h * 1.1)}" rx="32" ry="12" fill="#c8ced3"/>`
  s += `<rect x="${f(W * 0.74)}" y="${f(gy + 8)}" width="90" height="34" rx="4" fill="#194b3f"/><rect x="${f(W * 0.74 + 90)}" y="${f(gy + 14)}" width="40" height="28" fill="#d4a041"/><circle cx="${f(W * 0.74 + 20)}" cy="${f(gy + 44)}" r="9" fill="#2c2c2c"/><circle cx="${f(W * 0.74 + 110)}" cy="${f(gy + 44)}" r="9" fill="#2c2c2c"/>`
  return s
}

function commercial(W, H, sky, r) {
  const gy = H * 0.82, acc = ACCENT[Math.floor(r() * 3)]
  let s = hills(W, H, sky, r, H * 0.58) + ground(W, H, gy, sky, '#6e7176')
  const bx = W * 0.1, bw = W * 0.8, bh = H * 0.32
  s += `<rect x="${f(bx)}" y="${f(gy - bh)}" width="${f(bw)}" height="${f(bh)}" fill="#e9ecee"/><rect x="${f(bx)}" y="${f(gy - bh)}" width="${f(bw)}" height="14" fill="${acc}"/>`
  s += windows(bx + 14, gy - bh + 30, bw - 28, bh * 0.5, 9, 2, sky, r)
  s += `<rect x="${f(bx)}" y="${f(gy - bh * 0.34)}" width="${f(bw)}" height="${f(bh * 0.34)}" fill="#2c2c2c" opacity=".88"/>`
  for (let i = 0; i < 6; i++) s += `<rect x="${f(bx + 16 + i * (bw / 6))}" y="${f(gy - bh * 0.3)}" width="${f(bw / 6 - 24)}" height="${f(bh * 0.3)}" fill="${sky.lit ? '#ffd98a' : sky.glass}"/>`
  s += `<rect x="${f(bx + bw * 0.38)}" y="${f(gy - bh - 34)}" width="${f(bw * 0.24)}" height="30" rx="4" fill="${acc}"/><rect x="${f(bx + bw * 0.41)}" y="${f(gy - bh - 26)}" width="${f(bw * 0.18)}" height="6" rx="3" fill="#fff" opacity=".85"/>`
  for (let i = 0; i < 6; i++) s += `<rect x="${f(bx + i * (bw / 6) + 14)}" y="${f(gy + 20 + (i % 2) * 18)}" width="54" height="22" rx="6" fill="${['#194b3f', '#d4a041', '#fff', '#c0c4c8', '#316c5e', '#2c2c2c'][i]}"/>`
  return s
}

function skyline(W, H, sky, r) {
  const gy = H * 0.86
  let s = hills(W, H, sky, r, H * 0.64) + ground(W, H, gy, sky, '#6f7378')
  let x = -20
  while (x < W) {
    const w = 60 + r() * 90, h = H * (0.18 + r() * 0.5), c = WALLS[Math.floor(r() * WALLS.length)]
    s += `<rect x="${f(x)}" y="${f(gy - h)}" width="${f(w)}" height="${f(h)}" fill="${c}"/><rect x="${f(x + w)}" y="${f(gy - h)}" width="8" height="${f(h)}" fill="#000" opacity=".12"/>` + windows(x + 8, gy - h + 12, w - 16, h - 40, Math.max(2, Math.round(w / 28)), Math.max(2, Math.round(h / 34)), sky, r)
    x += w + 6 + r() * 16
  }
  return s
}

const SCENES = { villa, apartment, building, land, industrialLand, factory, commercial, skyline }

export function render(kind, W, H, seed, skyIdx, extra) {
  const r = rng(seed)
  const sky = SKIES[skyIdx % SKIES.length]
  const body = SCENES[kind](W, H, sky, r, extra)
  const vignette = `<rect width="${W}" height="${H}" fill="url(#shade)" opacity=".18"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">${base(W, H, sky, r)}${body}${vignette}</svg>`
}

/* ---------- output ---------- */
const kinds = ['villa', 'apartment', 'building', 'land', 'commercial', 'land', 'industrialLand', 'factory'] // matches the 8 property types in data/auctions.ts order
const COUNT = 30
fs.mkdirSync(path.join(root, 'public/images/art'), { recursive: true })
fs.mkdirSync(path.join(root, 'public/images/ads'), { recursive: true })
for (let i = 0; i < COUNT; i++) {
  const kind = kinds[i % kinds.length]
  const id = `A${1021 + i}`
  for (let v = 0; v < 3; v++) {
    const seed = 1000 + i * 37 + v * 911
    const skyIdx = (i * 2 + v * 2 + (v === 2 ? 1 : 0)) % SKIES.length
    fs.writeFileSync(path.join(root, `public/images/art/${id}-${v}.svg`), render(kind, 1200, 800, seed, skyIdx, i + v))
  }
}
const ads = [['villa', 11, 2], ['land', 22, 1], ['skyline', 33, 3], ['commercial', 44, 0], ['skyline', 55, 2]]
ads.forEach(([k, seed, sky], n) => fs.writeFileSync(path.join(root, `public/images/ads/ad-${n + 1}.svg`), render(k, 1600, 600, seed, sky, n)))
fs.mkdirSync(path.join(root, 'public/images/auth'), { recursive: true })
fs.writeFileSync(path.join(root, 'public/images/auth/signin.svg'), render('villa', 900, 1100, 71, 2))
fs.writeFileSync(path.join(root, 'public/images/auth/signup.svg'), render('apartment', 900, 1100, 72, 3))
fs.writeFileSync(path.join(root, 'public/images/auth/app.svg'), render('villa', 600, 520, 73, 1))
console.log('done')
