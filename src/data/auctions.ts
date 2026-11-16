export type AuctionStatus = 'live' | 'coming-soon' | 'ending-soon' | 'finished'
export type PropertyType =
  | 'Residential Apartment'
  | 'Residential Property'
  | 'Vacant Residential Land Plot'
  | 'Vacant Commercial Land Plot'
  | 'Residential Building'
  | 'Commercial Complex'
  | 'Industrial Land Plot'
  | 'Factory'

export interface Auction {
  id: string
  code: string
  title: string
  location: string
  category: string
  /** Chip shown on the card image (e.g. "Running Now", "Landscape", "Ending Soon") */
  chip: string
  status: AuctionStatus
  description: string
  image: string
  gallery: string[]
  originalPrice: number
  initialPrice: number
  marketPrice: number
  startingPrice: number
  currentBid: number
  minBidIncrement: number
  endsAt: number
  type: PropertyType
  landSize: number
  directOffer: boolean
}

/* Property photos live in public/images/properties/ (see public/images/README.md). */
const IMG = {
  dusk: '/images/properties/modern-home-dusk.jpg',
  landscape: '/images/properties/house-landscape.jpg',
  aerial: '/images/properties/aerial-villa.jpg',
  valley: '/images/properties/valley-mountains.jpg',
}

const DESCRIPTION =
  'Spacious high-end estate featuring 5 bedrooms, landscaped gardens, private parking, and premium finishes. Clear title deed and ready for transfer.'

const DAY = 86_400_000
/** 12 days, 20 hours, 41 minutes, 8 seconds from module load (matches the design mock). */
const END = Date.now() + 12 * DAY + 20 * 3_600_000 + 41 * 60_000 + 8_000

const base = {
  location: 'Amman West',
  description: DESCRIPTION,
  gallery: [IMG.valley, IMG.aerial, IMG.dusk, IMG.landscape],
  originalPrice: 12_500,
  initialPrice: 12_500,
  marketPrice: 60_000,
  startingPrice: 20_000,
  currentBid: 205_000,
  minBidIncrement: 12_500,
  endsAt: END,
  landSize: 800,
  directOffer: false,
}

const types: PropertyType[] = [
  'Residential Property',
  'Residential Apartment',
  'Residential Building',
  'Vacant Residential Land Plot',
  'Commercial Complex',
]

export const auctions: Auction[] = Array.from({ length: 60 }, (_, i) => {
  const col = i % 3
  const variant = [
    { image: IMG.dusk, chip: 'Running Now', status: 'live' as const, category: 'Residential' },
    { image: IMG.landscape, chip: 'Landscape', status: 'coming-soon' as const, category: 'Landscape' },
    { image: IMG.aerial, chip: 'Ending Soon', status: 'ending-soon' as const, category: 'Residential' },
  ][col]
  const n = 1021 + i
  return {
    ...base,
    ...variant,
    id: `A${n}`,
    code: `#A ${n}`,
    title: 'Luxury Residential Estate – Amman West',
    type: types[i % types.length],
    landSize: 500 + ((i * 97) % 700),
    directOffer: i % 2 === 1,
    startingPrice: 20_000 + (i % 4) * 10_000,
    currentBid: 205_000 + i * 5_000,
  }
})

export const getAuction = (id: string) => auctions.find((a) => a.id === id) ?? auctions[0]

export const formatMoney = (n: number) => n.toLocaleString('en-US')
