## Scope (4 tracks, this turn)

### 1. ContactFooter — pixel polish
- Tighten vertical rhythm (88→72px top, even 24px gap between blocks).
- Promote the email button to a true primary CTA with gradient + hover-lift micro-animation; secondary "Open in mail" link on the right of the availability card becomes the visible secondary action.
- Social links: equal-width grid with subtle border-on-hover, no jumpy hover background swap.
- Availability card: replace per-row inline `onMouseEnter` (causes re-render on every row hover) with a single CSS rule via a className. Add subtle inset border-top gradient on the footer divider.
- Footer: 3-column on desktop (Brand · Sitemap · Built-with), single column on mobile, with consistent 13px mono labels.
- Reveal animation uses `useInView` once, then `will-change: auto` so it doesn't keep promoting layers.

### 2. Hero perf hardening
- Stop re-creating event handler arrays inside `STACK_POSITIONS.map(...)` on every render — extract a memo'd `StackCardPositioner`.
- `MemoryCard`: hover/select state already isolated, but the inline `style` objects on every node rebuild each render — move static styles into a stylesheet block keyed by `data-active`. Saves N\*style churn per hover.
- Wrap `useMotionValue`/`useTransform` consumers in `motion.div` so framer reads MotionValues directly (no React rerender per frame). Verify no `useTransform` output is read via `.get()` inside render.
- `MemoryGraph`: switch the rAF tick to throttle to ~30fps via `if (now - last < 33) return;` — cuts wakeups in half on mobile, invisible to the eye.
- Guarantee SSR-safe layout: confirm no `Math.random()`, `Date.now()`, or `window` access at render time. The seed function is deterministic; verify by hashing rendered SVG markup matches between server and client.
- Add `prefers-reduced-motion` short-circuit to the `STACK_POSITIONS` card-shuffle interval.

### 3. Graceful env recovery
- EnvHealthBanner: add a "Retry" button that re-invokes `checkRequiredEnv` and re-evaluates without a page reload; spinner state while retrying.
- Mem0Demo: when `apiMode === "mock"`, show a small amber "Mock mode — add MEM0_API_KEY in Lovable Secrets" pill next to the connection indicator (non-blocking, demo still works).
- VoiceChat: when LOVABLE_API_KEY check fails, replace the mic button with a disabled state + helper copy ("AI gateway offline — voice chat unavailable") instead of letting the user hit a 500.
- Surface a typed `{ ok, missing, mem0Mode }` from one source (existing `checkRequiredEnv` server fn) and consume it from all three places via a tiny `useEnvHealth()` hook with React Query, so the network call happens once per session.

### 4. Lovable Cloud + `search_history` table
Enable Cloud and create one table to persist search history for the mem0 demo, voice chat queries, and visitor variables.

```text
search_history
  id           uuid pk default gen_random_uuid()
  visitor_id   text not null            -- matches localStorage portfolio_visitor_id
  source       text not null check (source in ('mem0_demo','voice_chat','project_filter'))
  query        text not null            -- ≤500 chars
  result_count int                      -- nullable
  metadata     jsonb default '{}'       -- e.g. { mode: 'real'|'mock', category }
  created_at   timestamptz default now()

  index on (visitor_id, created_at desc)
  index on (source, created_at desc)
```

- RLS: anon + authenticated may INSERT and SELECT. No UPDATE/DELETE for clients (admin via service role only).
- Server fn `logSearch({ source, query, resultCount, metadata })` and `getRecentSearches(visitorId, limit=20)`.
- Wire into Mem0Demo (on search), VoiceChat (on user prompt submit), and Projects filter input (debounced 500ms). All fire-and-forget — never block the UI.
- New `RecentSearches` strip under the Mem0Demo input that pulls the visitor's last 5 queries — proves persistence is live.

### Technical notes (skip if non-technical)
- `useEnvHealth()` lives in `src/hooks/use-env-health.ts`, calls `checkRequiredEnv` with `staleTime: 60_000`, returns `{ data, isLoading, refetch }`.
- Cloud is auto-provisioned via `supabase--enable`; one migration adds the table + grants + RLS in the canonical CREATE → GRANT → ENABLE RLS → POLICY order.
- All search-logging server fns live in `src/lib/api/search-history.functions.ts` and import `@/integrations/supabase/auth-middleware` only when we eventually want per-user attribution (not this turn — visitor_id is anonymous).
- No client-side import of `client.server.ts`. Public reads via the publishable-key client; writes via server fn with admin client.

### Out of scope this turn
- Hero visual redesign (only perf hardening).
- New Cloud-backed features beyond search history.
- Auth/login (visitor_id stays anonymous).

Ask: approve to proceed end-to-end, or trim a track before I start?