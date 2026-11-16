import { Link } from '@/lib/router'
import { Logo } from './Logo'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from './Icons'

const pages = [
  { label: 'Home', to: '/' },
  { label: 'Auctions', to: '/auctions' },
  { label: 'LiveBidding', to: '/auctions' },
  { label: 'Auction Map', to: '/map' },
]

export function Footer() {
  return (
    <footer className="mt-20 bg-brand-50">
      <div className="mx-auto max-w-[1440px] px-[41px] pt-12 pb-8">
        <div className="grid grid-cols-[1.35fr_1.3fr_1fr] gap-8">
          <div>
            <Logo size="lg" />
            <p className="mt-10 max-w-[320px] text-[19px] leading-snug text-muted">
              The Future of Digital Real Estate Auctions in Jordan
            </p>
            <div className="mt-12 flex gap-14 text-brand">
              <FacebookIcon aria-label="Facebook" />
              <TwitterIcon aria-label="Twitter" />
              <InstagramIcon aria-label="Instagram" />
              <LinkedinIcon aria-label="LinkedIn" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium text-brand">Pages</h3>
            <ul className="mt-5 space-y-6 text-base text-ink">
              {pages.map((p) => (
                <li key={p.label}>
                  <Link to={p.to} className="hover:text-brand-600">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-brand">Contact Us</h3>
            <ul className="mt-5 space-y-6 text-base text-ink">
              <li>Email</li>
              <li>Phone</li>
              <li>Location</li>
            </ul>
          </div>
        </div>

        <hr className="mt-10 border-black/10" />
        <p className="mt-8 text-center text-lg text-ink">© Emazadak - All Copyrights reserved</p>
      </div>
    </footer>
  )
}
