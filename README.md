# EmazadakaChanges

New and changed files for the `Emazadak` repo, kept at the same paths as in that repo.
Copy them over the repo root (e.g. `cp -r src public /path/to/Emazadak/`).

Included: brand tokens (`src/index.css`), routing + `App.tsx`, shared components,
Homepage, Auctions list and Auction details pages. Export the images listed in
`public/images/README.md` from Figma into `public/images/`.


## Admin panel

Hash routes under `#/admin` (login: `admin@emazadak.com` / `admin123`), English and Arabic (RTL),
code in `src/admin`. Menu and footer of the public site now match the Figma pages.
See `QA_REPORT.md` for the quality review.


## Public website pages (Nov 2026 update)

| Route | Page |
|---|---|
| `#/` | Home – rotating hero photos, working search (suggestions + results), animated ads, featured auctions |
| `#/auctions?q=` | Auctions list; the `q` param is the search query (English or Arabic keywords) |
| `#/live-bidding` | Live bidding room (simulated competing bids until the backend is connected) |
| `#/offers` | Direct offers with a "Place offer" dialog |
| `#/map` | Schematic Jordan map with auction areas |
| `#/list-property` | 4-step seller form (requires sign-in) |
| `#/signin`, `#/signup` | Website accounts (stored in the browser until a backend exists – replace `signIn`/`signUp` in `src/lib/auth.tsx` with API calls) |

The header (`src/components/Navbar.tsx`) is a single component used on every page, measured from the Figma Header component.
