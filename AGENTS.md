# memflow-muse — Codex Context

## What This Is

A production-grade portfolio built as a **live mem0 API demo** — the centerpiece
of Amit Chakraborty's application for Staff / Principal Frontend Engineer at mem0.

This is not a template. Every section is engineered for a specific hiring outcome.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | TanStack Start (Vite + SSR), React 19 |
| Language | TypeScript strict |
| Styling | Tailwind v4 + CSS custom properties |
| UI primitives | shadcn/ui |
| State | useState/useRef (no global store needed — SPA) |
| Routing | TanStack Router (file-based) |
| Server functions | `createServerFn` from `@tanstack/react-start` |
| Package manager | Bun |

## Key Files

```
src/
  routes/
    index.tsx                ← SEO/AEO meta + JSON-LD, renders <Portfolio />
    __root.tsx               ← Root layout, QueryClient, SW registration
  components/portfolio/
    portfolio.tsx            ← EVERYTHING — all sections in one file (intentional)
  lib/
    mem0/mock-client.ts      ← MockMem0Client (client-side fallback)
    api/memory.functions.ts  ← Real mem0 server functions (add/search/delete)
  hooks/
    use-in-view.ts           ← IntersectionObserver scroll animations
    use-scroll-spy.ts        ← Nav active state
    use-typewriter.ts        ← Hero terminal animation
  styles.css                 ← Design system CSS custom properties

public/
  sw.js                      ← Service worker (cache-first + network-first)
  offline.html               ← Offline fallback page
  resume.txt                 ← Resume download artifact
  manifest.webmanifest       ← PWA manifest
```

---

## Design System

All colors/typography via CSS custom properties in `src/styles.css`:

```css
--bg-page:       #F7F8FA    /* cool off-white */
--bg-surface:    #FFFFFF    /* card surfaces */
--bg-raised:     #F0F2F5    /* subtle raised panels */

--signal:        #16A07C    /* mem0 emerald — ONE accent */
--signal-light:  #E6F7F2
--signal-border: rgba(22,160,124,0.25)
--signal-glow:   0 0 0 3px rgba(22,160,124,0.12)

--ink-primary:   #0D0F12
--ink-secondary: #4B5563
--ink-tertiary:  #9CA3AF

--font-serif: 'Instrument Serif', Georgia, serif
--font-sans:  'Geist', system-ui, sans-serif
--font-mono:  'JetBrains Mono', monospace
```

**Light theme only.** No dark mode toggle. No `prefers-color-scheme`.

---

## Running Locally

```bash
bun install
bun run dev      # starts at localhost:3000
```

## With Real mem0 API

```bash
# create .env.local
echo "MEM0_API_KEY=your_key_here" > .env.local
bun run dev
```

When `MEM0_API_KEY` is set, the Demo section uses the real mem0 API.
Without it, the mock client runs in-process — the demo still works perfectly.

---

## How to Add a Project

In `portfolio.tsx`, find the `PROJECTS` array and add an entry following this shape:

```ts
{
  id: "mem_007",
  name: "Project Name",
  signal: "#HEX_COLOR",       // unique per project
  tagline: "One-line tagline",
  category: "Category · Sub",
  score: 0.94,                 // 0–1, displayed as mem0 relevance score
  year: "YYYY–YYYY",
  url: "https://...",
  impact: "Key metric · Another metric",
  stack: ["Tech 1", "Tech 2"],
  description: "2-3 sentence description.",
  roleHighlights: [            // 3 bullets for the modal
    "Specific thing you built",
    "Another specific achievement",
    "A third thing",
  ],
  whyItMatters:               // mem0-specific insight for the modal
    "Why this project is relevant to mem0's mission.",
}
```

---

## How to Modify the Demo

The Demo component in `portfolio.tsx` calls server functions from
`src/lib/api/memory.functions.ts`. The server functions return:

```ts
{ success: boolean; data: T; error?: string; apiMode: "real" | "mock" }
```

The `apiMode` value drives the connection indicator in the left panel.

---

## What NOT to Touch

- `src/lib/mem0/mock-client.ts` — The mock is used as client-side fallback.
  Don't add server-side imports here.
- `public/sw.js` — After changing the app shell significantly, bump `CACHE_VERSION`
  from `"amit-portfolio-v1"` to `"amit-portfolio-v2"` to bust the old cache.
- The `Section` component's fade-up animation — driven by `useInView`. Don't
  replace with CSS-only; the one-shot trigger ref is intentional.

---

## Deployment

Built for Vercel. `vite build` outputs to `dist/`.

```bash
bun run build
```

Set environment variables in Vercel dashboard:
- `MEM0_API_KEY` — enables real API mode
