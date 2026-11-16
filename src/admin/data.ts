export interface Bi {
  en: string
  ar: string
}

export type AuctionStatus = 'Active' | 'Upcoming' | 'Ended'
export interface AdminAuction {
  id: string
  title: Bi
  type: string
  status: AuctionStatus
  highestBid: number
  startingPrice: number
  minIncrement: number
  endsIn: string
  startDate: string
  endDate: string
  location: Bi
  landSize: number
  description: string
}

export type SubStatus = 'Pending' | 'Approved' | 'Rejected'
export interface Submission {
  id: string
  title: Bi
  type: string
  location: Bi
  area: number
  expectedPrice: number
  owner: Bi
  docs: number
  submitted: string
  status: SubStatus
  reason?: string
}

export interface AdminUser {
  id: string
  name: Bi
  email: string
  phone: string
  verified: boolean
  suspended: boolean
  bids: number
  won: number
  deposit: number
}

export type TxStatus = 'Completed' | 'Pending' | 'Failed'
export interface Tx {
  id: string
  userId: string
  type: 'Deposit' | 'Refund' | 'Payout'
  amount: number
  status: TxStatus
  date: string
}

export interface Activity {
  auctionId: string
  action: 'placedBid' | 'wonAuction'
  amount: number
  date: string
}

const desc = 'Spacious high-end property featuring landscaped gardens and private parking.'

export const seedAuctions: AdminAuction[] = [
  { id: 'A-1042', title: { en: 'Luxury Residential Estate – Amman West', ar: 'عقار سكني فاخر – عمّان الغربية' }, type: 'Residential', status: 'Active', highestBid: 245000, startingPrice: 212500, minIncrement: 12500, endsIn: '1d 03h', startDate: '2026-11-10 10:00', endDate: '2026-11-17 18:00', location: { en: 'Amman West', ar: 'عمّان الغربية' }, landSize: 1200, description: desc },
  { id: 'A-1041', title: { en: 'Apartment in Abdoun', ar: 'شقة في عبدون' }, type: 'Apartment', status: 'Active', highestBid: 228000, startingPrice: 200000, minIncrement: 5000, endsIn: '2d 04h', startDate: '2026-11-09 10:00', endDate: '2026-11-18 18:00', location: { en: 'Abdoun, Amman', ar: 'عبدون، عمّان' }, landSize: 180, description: desc },
  { id: 'A-1040', title: { en: 'Commercial Land – Zarqa', ar: 'أرض تجارية – الزرقاء' }, type: 'Land', status: 'Upcoming', highestBid: 211000, startingPrice: 211000, minIncrement: 5000, endsIn: '3d 05h', startDate: '2026-11-19 10:00', endDate: '2026-11-26 18:00', location: { en: 'Zarqa', ar: 'الزرقاء' }, landSize: 2400, description: desc },
  { id: 'A-1039', title: { en: 'Office Building – Shmeisani', ar: 'بناية مكاتب – الشميساني' }, type: 'Office', status: 'Ended', highestBid: 194000, startingPrice: 170000, minIncrement: 5000, endsIn: '—', startDate: '2026-11-01 10:00', endDate: '2026-11-08 18:00', location: { en: 'Shmeisani, Amman', ar: 'الشميساني، عمّان' }, landSize: 640, description: desc },
  { id: 'A-1038', title: { en: 'Villa with Pool – Dabouq', ar: 'فيلا مع مسبح – دابوق' }, type: 'Villa', status: 'Active', highestBid: 177000, startingPrice: 150000, minIncrement: 7500, endsIn: '5d 07h', startDate: '2026-11-12 10:00', endDate: '2026-11-22 18:00', location: { en: 'Dabouq, Amman', ar: 'دابوق، عمّان' }, landSize: 900, description: desc },
  { id: 'A-1037', title: { en: 'Residential Building – Irbid', ar: 'عمارة سكنية – إربد' }, type: 'Residential', status: 'Ended', highestBid: 160000, startingPrice: 140000, minIncrement: 5000, endsIn: '—', startDate: '2026-10-25 10:00', endDate: '2026-11-05 18:00', location: { en: 'Irbid', ar: 'إربد' }, landSize: 520, description: desc },
]

export const seedSubmissions: Submission[] = [
  { id: 'S-2031', title: { en: 'Apartment in Abdoun', ar: 'شقة في عبدون' }, type: 'Apartment', location: { en: 'Abdoun, Amman', ar: 'عبدون، عمّان' }, area: 180, expectedPrice: 228000, owner: { en: 'Lina Haddad', ar: 'لينا حداد' }, docs: 3, submitted: '2026-11-12', status: 'Pending' },
  { id: 'S-2030', title: { en: 'Land Plot – Madaba', ar: 'قطعة أرض – مادبا' }, type: 'Land', location: { en: 'Madaba', ar: 'مادبا' }, area: 1500, expectedPrice: 95000, owner: { en: 'Omar Khalil', ar: 'عمر خليل' }, docs: 2, submitted: '2026-11-11', status: 'Pending' },
  { id: 'S-2029', title: { en: 'Villa – Dabouq', ar: 'فيلا – دابوق' }, type: 'Villa', location: { en: 'Dabouq, Amman', ar: 'دابوق، عمّان' }, area: 900, expectedPrice: 410000, owner: { en: 'Sara Nasser', ar: 'سارة ناصر' }, docs: 4, submitted: '2026-11-10', status: 'Pending' },
  { id: 'S-2028', title: { en: 'Commercial Complex – Aqaba', ar: 'مجمّع تجاري – العقبة' }, type: 'Commercial', location: { en: 'Aqaba', ar: 'العقبة' }, area: 3200, expectedPrice: 880000, owner: { en: 'Yazan Ali', ar: 'يزن علي' }, docs: 5, submitted: '2026-11-08', status: 'Approved' },
  { id: 'S-2027', title: { en: 'Residential Building – Salt', ar: 'عمارة سكنية – السلط' }, type: 'Residential', location: { en: 'Salt', ar: 'السلط' }, area: 600, expectedPrice: 150000, owner: { en: 'Dana Fares', ar: 'دانا فارس' }, docs: 1, submitted: '2026-11-06', status: 'Rejected', reason: 'Documents are incomplete' },
]

export const seedUsers: AdminUser[] = [
  { id: 'U-501', name: { en: 'Lina Haddad', ar: 'لينا حداد' }, email: 'lina.haddad@example.com', phone: '+962 79 000 0001', verified: true, suspended: false, bids: 42, won: 3, deposit: 5000 },
  { id: 'U-502', name: { en: 'Omar Khalil', ar: 'عمر خليل' }, email: 'omar.khalil@example.com', phone: '+962 79 000 0002', verified: true, suspended: false, bids: 18, won: 1, deposit: 2500 },
  { id: 'U-503', name: { en: 'Sara Nasser', ar: 'سارة ناصر' }, email: 'sara.nasser@example.com', phone: '+962 79 000 0003', verified: false, suspended: false, bids: 4, won: 0, deposit: 1000 },
  { id: 'U-504', name: { en: 'Yazan Ali', ar: 'يزن علي' }, email: 'yazan.ali@example.com', phone: '+962 79 000 0004', verified: true, suspended: false, bids: 27, won: 2, deposit: 3000 },
  { id: 'U-505', name: { en: 'Dana Fares', ar: 'دانا فارس' }, email: 'dana.fares@example.com', phone: '+962 79 000 0005', verified: true, suspended: false, bids: 9, won: 1, deposit: 0 },
  { id: 'U-506', name: { en: 'Khaled Zoubi', ar: 'خالد الزعبي' }, email: 'khaled.zoubi@example.com', phone: '+962 79 000 0006', verified: false, suspended: true, bids: 0, won: 0, deposit: 0 },
]

export const seedTx: Tx[] = [
  { id: 'T-9031', userId: 'U-501', type: 'Deposit', amount: 5000, status: 'Completed', date: '2026-11-14' },
  { id: 'T-9030', userId: 'U-502', type: 'Deposit', amount: 2500, status: 'Pending', date: '2026-11-14' },
  { id: 'T-9029', userId: 'U-503', type: 'Refund', amount: 1000, status: 'Completed', date: '2026-11-13' },
  { id: 'T-9028', userId: 'U-504', type: 'Deposit', amount: 3000, status: 'Failed', date: '2026-11-12' },
  { id: 'T-9027', userId: 'U-505', type: 'Payout', amount: 160000, status: 'Completed', date: '2026-11-10' },
]

export const activityFor = (_userId: string): Activity[] => [
  { auctionId: 'A-1042', action: 'placedBid', amount: 245000, date: '2026-11-14' },
  { auctionId: 'A-1041', action: 'placedBid', amount: 228000, date: '2026-11-13' },
  { auctionId: 'A-1037', action: 'wonAuction', amount: 160000, date: '2026-11-05' },
]

export const jod = (n: number) => `JOD ${n.toLocaleString('en-US')}`
