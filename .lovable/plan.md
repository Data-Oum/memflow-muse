## Plan: Premium polish + SEO/PWA/Voice/Mem0 hardening

### 1. Visual polish pass (out-of-the-box premium)
- Audit `styles.css` and all section components; strip non-essential shadows, gradients, and borders. Keep only structural separators (1px hairlines where required).
- Refine typography scale: tighter tracking on display serif, larger hero, more whitespace, asymmetric grid in Projects.
- Replace decorative shadows on cards with subtle background-tone shifts (`--bg-raised` vs `--bg-surface`).
- Add a single restrained motion language: fade + 8px rise, 400ms cubic-bezier; remove competing GSAP/Framer animations.
- Refine Nav into a floating pill with backdrop blur only on scroll.
- Mem0Demo, VoiceChat, Logs panels: flat surfaces, mono labels, emerald only as semantic accent (success/active).

### 2. SEO / AEO / GEO validation
- Move per-page meta into route `head()` (root keeps defaults only; remove `og:image` from root if present).
- Add JSON-LD on `/`: `Person` + `WebSite` + `BreadcrumbList`.
- Verify Open Graph + Twitter card tags (title, description, url, image, type).
- Create `src/routes/sitemap[.]xml.ts` server route (replace any static sitemap).
- Ensure `public/robots.txt` allows all + references sitemap at production domain.
- Run `seo_chat--trigger_scan` after changes and surface findings.

### 3. PWA polish
- Redesign `public/offline.html` to match design system (serif headline, mono caption, emerald dot).
- Add install-prompt component: capture `beforeinstallprompt`, show a dismissible chip in Nav after 20s on eligible devices, persist dismissal in localStorage.
- Bump `CACHE_VERSION` in `sw.js` to invalidate stale shell.

### 4. Voice chat improvements
- Granular mic permission error states: `not-allowed`, `not-found`, `not-supported`, `aborted`, network — each with tailored message + retry CTA.
- Show live interim transcript (separate styling from final).
- Stop button cancels both `SpeechRecognition` and the streaming fetch (AbortController).
- Retry preserves last user prompt + partial assistant text; "regenerate" re-issues with same context.
- Persist last 10 turns in `sessionStorage` for state recovery on reload.

### 5. Click/gesture audit
- Add a lightweight `useClickInstrumentation` hook that wraps `onClick` to log `{component, label, timestamp}` to console (gated by `VITE_DEBUG_CLICKS`) and to the in-app Logs feed.
- Audit every `<button>`, `<a>`, and Framer `motion` element: ensure no `whileTap`/`whileHover` blocks pointer events, no overlay div without `pointer-events:none`, no `onClick` on parent + child stealing events.
- Replace any `motion.button` with `<motion.button>` only where animation is needed; otherwise plain `<button>` with CSS transition.
- Verify `ProjectModal`, Nav links, Resume button, Mem0 actions, VoiceChat controls all fire.

### 6. Mem0 ops test panel
- New section `Mem0TestPanel` (collapsible, below VoiceChat) that runs a scripted suite:
  1. `add` deterministic seed memory → assert id returned
  2. `search` with known query → assert seed in results, score parsed
  3. `score` on returned id → assert numeric
  4. `delete` → assert success
  5. `search` again → assert removed
- Each step: status (pending/running/pass/fail), latency ms, raw request/response JSON in collapsible viewer, retry button (3 attempts, exponential backoff).
- Uses real API when `MEM0_API_KEY` set; otherwise mock with banner.

### Technical notes
- No new heavy deps. Use existing Framer Motion sparingly.
- All new color/spacing tokens added to `src/styles.css`.
- Keep changes within existing file structure; no `src/pages/`.
- Verify build after each phase.

### Out of scope
- Dark mode, i18n, auth, analytics provider integration.
