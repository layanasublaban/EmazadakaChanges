# UI/UX Quality Assurance Report

Date: 2026-11-16. Scope: Figma file `EmazadakPro` (Website, WebsiteTranslation, Admin Panel pages) and the code in this repo.

## Results

| Area | Result |
|---|---|
| Admin Panel (Figma, 22 screens EN + AR) | Clean: 0 unbound text styles / fills / strokes, 0 elements outside their frame, 0 text under 12px, real vector icons (lucide set) bound to color variables |
| Admin prototype | 206 click links wired (sidebar, logout, language toggle, create / view / edit, approve / reject, back). Checked through the Plugin API, not played in presentation mode |
| Header / Footer (Website + translation) | One shared component each; menu = Home, Auctions, Live Bidding, Direct Offers, Map, List Property (About / Contact removed). Checked visually on 3 pages; the others were checked by script |
| Admin code (`src/admin`) | Bundles with esbuild and server-renders every route in EN and AR without errors |

## Open findings (Website, from the original design)

1. **Text too small (accessibility)**: 372 text nodes are under 11px on the EN site and 233 on the AR site (sizes 8px: 94, 10px: 139 on AR). Mostly the auction cards and filter text. Recommend minimum 12px.
2. **Unbound leftovers**: EN 52 text nodes without a text style, 55 solid fills and 17 strokes not bound to variables. AR 37 / 47 / 44. Mostly Brand Palette annotations, ProfileMainpage, TransactionHistory, Map.
3. **Off-frame elements**: 8 on EN (Homepage frames, Brand Palette), 4 on AR.
4. **AR "Container" frame (669:30832)** has no Header/Footer.
5. **Pages still missing in code**: Live Bidding, Direct Offers, Map, List Property, Profile. They are in the menu and show a "coming soon" placeholder.

## Open findings (code)

- Not run: `pnpm install` / `vite build` / `tsc` (package installs are blocked in this workspace). Run `pnpm install && pnpm build` before deploying.
- Admin data is in-memory demo data; state resets on page reload (language and login session are kept in localStorage). Demo login: `admin@emazadak.com` / `admin123`.
- Admin keyboard and screen reader basics are in place (labels, `aria-current`, dialog role, `role=alert` errors); a full WCAG pass was not done.
