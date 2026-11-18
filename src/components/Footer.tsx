import { Link } from '@/lib/router'
import { useI18n } from '@/lib/i18n'
import { Logo } from './Logo'
import { FacebookIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from './Icons'

const pages = [
  { label: 'Home', to: '/' },
  { label: 'Auctions', to: '/auctions' },
  { label: 'Live Bidding', to: '/live-bidding' },
  { label: 'Direct Offers', to: '/offers' },
  { label: 'Map', to: '/map' },
  { label: 'List Property', to: '/list-property' },
]

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="mt-16 bg-brand-50 md:mt-20">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 pb-8 sm:px-[41px] sm:pt-12">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1.3fr_1fr] md:gap-8">
          <div>
            <Logo size="lg" className="max-w-full" />
            <p className="mt-6 max-w-[320px] text-lg leading-snug text-muted md:mt-10 md:text-[19px]">{t('The Future of Digital Real Estate Auctions in Jordan')}</p>
            <div className="mt-8 flex gap-8 text-brand md:mt-12 md:gap-14">
              <FacebookIcon aria-label="Facebook" className="transition-transform hover:-translate-y-1" />
              <TwitterIcon aria-label="Twitter" className="transition-transform hover:-translate-y-1" />
              <InstagramIcon aria-label="Instagram" className="transition-transform hover:-translate-y-1" />
              <LinkedinIcon aria-label="LinkedIn" className="transition-transform hover:-translate-y-1" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium text-brand">{t('Pages')}</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-base text-ink md:block md:space-y-6">
              {pages.map((p) => (
                <li key={p.label}>
                  <Link to={p.to} className="transition-colors hover:text-brand-600">{t(p.label)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium text-brand">{t('Contact Us')}</h3>
            <ul className="mt-5 space-y-4 text-base text-ink md:space-y-6">
              <li>{t('Email')}</li>
              <li>{t('Phone')}</li>
              <li>{t('Location')}</li>
            </ul>
          </div>
        </div>

        <hr className="mt-10 border-black/10" />
        <p className="mt-8 text-center text-base text-ink md:text-lg">© Emazadak - {t('All Copyrights reserved')}</p>
      </div>
    </footer>
  )
}
