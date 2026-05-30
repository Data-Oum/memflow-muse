## Amit Chakraborty — Mem0 Portfolio

A pixel-perfect, light-themed, single-page portfolio targeting a Staff/Principal Frontend role at Mem0. Built on the existing TanStack Start template, with a live mock `mem0` client driving an interactive demo, animated scroll choreography, full SEO/AEO/GEO metadata, and installable PWA support.

### Visual direction — "Light Memory"
- Premium editorial light theme: cool off-white page (`#F7F8FA`), white surfaces, emerald `#16A07C` signal accent.
- Typography pair: **Instrument Serif** (italic display) + **Geist** (body) + **JetBrains Mono** (labels/code).
- Motion language: `cubic-bezier(0.16, 1, 0.3, 1)` at 0.3s; cards lift `-3px` with signal glow on hover.
- All tokens land in `src/styles.css` as CSS custom properties so Tailwind utilities + raw CSS both consume them.

### Sections (single home route at `/`)
1. **Sticky nav** — scroll-spy active dot, "Open to roles" emerald pill.
2. **Hero** — terminal-typed intro (`mem0.search(...)`) → staggered fade-up of name, role, tagline, 3 stats, CTAs, animated scroll cue.
3. **Philosophy** — 3 cards (Memory-First, AI Co-Pilot, End-to-End Ownership).
4. **Skills bento** — 6 cluster cards with animated retrieval-score bars (IntersectionObserver triggered, once).
5. **Projects** — 6 shipped systems with mem-ID, score bar, category pill, stack chips, hover lift.
6. **Live mem0 demo** — two-panel: input + quick-fill chips + live code preview (dark) on the left, animated memory list with category pills, scores, slide-out delete on the right. Real `MockMem0Client` with `add` / `search` / `getAll` / `delete`, smart `extractMemory` + `detectCategory`.
7. **AI workflow logs** — 3 terminal panels (Claude Code, Cursor, Windsurf) with syntax-colored prompt/output.
8. **Contact** — copy-to-clipboard email with toast, social links, Apply-to-Mem0 CTA, final `amit.contribution.js` terminal block.
- **Returning visitor banner** — localStorage-backed, slides in under nav on repeat visits.

### Architecture
- Replace `src/routes/index.tsx` placeholder with the full portfolio.
- Split into focused components under `src/components/portfolio/` (Nav, Hero, Philosophy, Skills, Projects, Demo, Logs, Contact, MemoryBanner, Toast). Keeps the single-page artifact readable and reviewable — the spec's "single file" intent is preserved at the route level.
- Mem0 mock client + helpers in `src/lib/mem0/mock-client.ts` (typed, fully client-side, no backend needed).
- Custom hooks in `src/hooks/`: `useInView` (threshold 0.12, fire-once), `useTypewriter`, `useScrollSpy`, `useClipboard`.
- Per-section `head()` metadata via route options; root layout keeps sitewide defaults.

### SEO / AEO / GEO
- Route `head()`: title, description, og:title/description/type=profile, og:url, twitter card, canonical (leaf only).
- JSON-LD `Person` schema (name, jobTitle, location, sameAs links, knowsAbout skills) in route `scripts`.
- JSON-LD `WebSite` + `BreadcrumbList`.
- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<section aria-labelledby>`), single H1, alt text, focus rings.
- AEO: FAQ-style structured copy in Philosophy + crisp factual stat strings answer-engines can lift.
- GEO: `address` microdata (Kolkata, India · Remote), `geo` Person field, hreflang `en`.

### PWA (manifest-only, safe for Lovable preview)
- `public/manifest.webmanifest` with name, short_name, theme `#16A07C`, background `#F7F8FA`, `display: standalone`, icons (192/512, generated).
- `<link rel="manifest">` + theme-color meta in `__root.tsx`.
- **No service worker** — per platform guidance, SWs break the preview iframe; manifest alone makes the site installable.

### Performance & polish
- `requestAnimationFrame` for scroll spy; passive listeners.
- `content-visibility: auto` on below-fold sections.
- Reduced-motion media query disables typewriter + parallax.
- Lighthouse target: 95+ across the board.

### Technical notes
- Stack stays TanStack Start + Tailwind v4 + TypeScript strict (the template's defaults). The spec's "single .jsx, no libraries" is adapted to the project's existing strict-TS / file-routing setup — visual output and behavior match the spec exactly; code is split for maintainability.
- Fonts loaded via `<link rel="preconnect">` + Google Fonts `@import` in `styles.css`.
- All copy verbatim from the spec — zero placeholder text.
- No new npm dependencies required.

### Out of scope (this pass)
- Real mem0 backend wiring (mock client only, as specified).
- Auth, analytics, or CMS.
- Dark mode (explicitly excluded by the spec).

Ready to build on approval.