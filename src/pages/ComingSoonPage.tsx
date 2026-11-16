import { Footer } from '@/components/Footer'
import { Navbar, links } from '@/components/Navbar'
import { Link } from '@/lib/router'

/** Placeholder for pages that are designed in Figma but not built in code yet. */
export default function ComingSoonPage({ route }: { route: string }) {
  const title = links.find((l) => l.to === route)?.label ?? 'Page'
  return (
    <div className="min-h-screen bg-page">
      <div className="px-6 pt-8">
        <Navbar active={route} />
      </div>
      <main className="mx-auto flex max-w-[720px] flex-col items-center gap-4 px-6 py-32 text-center">
        <h1 className="text-3xl font-bold text-brand">{title}</h1>
        <p className="text-muted">This page is designed in Figma and will be built in the next release.</p>
        <Link to="/auctions" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white">
          Browse Auctions
        </Link>
      </main>
      <Footer />
    </div>
  )
}
