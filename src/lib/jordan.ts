/** Schematic outline of Jordan, [lng, lat]. Used by the home map banner. */
export const OUTLINE: [number, number][] = [
  [35.55, 32.72], [36.6, 32.38], [37.2, 32.3], [38.8, 33.37], [39.3, 32.35], [38.0, 30.5], [37.6, 30.35],
  [37.0, 29.98], [36.0, 29.2], [35.0, 29.35], [34.95, 29.55], [35.1, 30.1], [35.3, 30.8], [35.45, 31.3], [35.5, 31.8], [35.55, 32.4],
]
export const DEAD_SEA: [number, number][] = [[35.45, 31.2], [35.58, 31.2], [35.6, 31.75], [35.5, 31.78]]
export const VIEW = { minLng: 34.8, maxLat: 33.5, sx: 85, sy: 100, W: 460, H: 440 }
export const project = (lng: number, lat: number) => ({ x: (lng - VIEW.minLng) * VIEW.sx, y: (VIEW.maxLat - lat) * VIEW.sy })
export const toPath = (pts: [number, number][]) =>
  pts.map(([lng, lat], i) => `${i ? 'L' : 'M'}${project(lng, lat).x.toFixed(1)},${project(lng, lat).y.toFixed(1)}`).join('') + 'Z'
