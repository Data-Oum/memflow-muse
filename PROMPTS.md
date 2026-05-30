# Prompt Logs — mem0 Portfolio Regeneration

These are the exact prompts used to build and evolve this portfolio.
Each prompt is self-contained and copy-paste ready into Claude Code, Cursor, or any LLM.

---

## PROMPT 00 — Full Regeneration (Master)

Use this single prompt to regenerate the entire portfolio from scratch in a new project.

```
You are a world-class frontend engineer. Build me a premium portfolio for a job application
to mem0.ai for a Staff/Principal Frontend Engineer role.

IDENTITY:
  Name: Amit Chakraborty
  Title: Principal Architect · AI-Native Systems Engineer
  Location: Kolkata, India — Remote only
  Stats: 8+ years · 18+ production apps · 21 engineers led · 50K+ peak DAU
  Contact: amit@devamit.co.in · github.com/devamitch · linkedin.com/in/devamitch
  Target: Staff/Principal Frontend Engineer at mem0.ai

STACK:
  TanStack Start (Vite + SSR) + React 19 + TypeScript + Tailwind v4 + shadcn/ui

DESIGN:
  Light theme only. mem0 emerald (#16A07C) as the single signal accent.
  Fonts: Instrument Serif + Geist + JetBrains Mono.
  CSS custom properties for all tokens.

SECTIONS:
  1. Sticky Nav (scroll spy, mobile hamburger)
  2. Hero (terminal typewriter animation → content)
  3. Philosophy (3 cards: Memory-First, AI Co-Pilot, End-to-End Ownership)
  4. Skills (6 cluster cards with animated score bars)
  5. Projects (6 cards + modal with role highlights + mem0 "why it matters")
  6. Live Demo (real mem0 API via server functions, mock fallback, live code preview)
  7. AI Workflow Logs (3 terminal panels: Claude Code, Cursor, Windsurf)
  8. Contact (links, Apply button, Resume download, code block)

FEATURES:
  - Real mem0 API server functions (add/search/delete) with mock fallback
  - Project detail modal: gradient hero, role highlights, mem0 insight, full stack
  - Resume download with loading state (fetches /public/resume.txt)
  - Returning visitor memory banner (localStorage visit count)
  - PWA: service worker (cache-first + network-first) + offline page
  - Comprehensive SEO: JSON-LD Person + ProfilePage + WebPage + ItemList + FAQ
  - GEO meta tags for Kolkata, IN-WB
  - Scroll animations via IntersectionObserver (one-shot fade-up)

See the existing codebase at /Volumes/Amit/my-projects/memflow-muse for reference.
```

---

## PROMPT 01 — Add a New Project to the Portfolio

```
In src/components/portfolio/portfolio.tsx, add a new project to the PROJECTS array.

New project details:
  Name: [PROJECT NAME]
  Signal color: #[HEX]
  Tagline: [SHORT TAGLINE]
  Category: [CATEGORY]
  Score: 0.[XX]
  Year: YYYY–YYYY
  URL: https://[url]
  Impact: [metric · metric]
  Stack: ["Tech1", "Tech2", ...]
  Description: [2-3 sentences]
  Role highlights: 3 specific achievements
  Why it matters (mem0 connection): [1-2 sentences linking this to mem0's mission]

Add it in the appropriate position in the array (roughly ordered by score descending).
No other changes needed.
```

---

## PROMPT 02 — Connect Real mem0 API Key

```
The portfolio demo is currently running in mock mode.
In src/lib/api/memory.functions.ts, the server functions check process.env.MEM0_API_KEY.

Tasks:
1. Create .env.local with: MEM0_API_KEY=<key>
2. Verify that mem0ai package is installed: bun add mem0ai
3. Confirm the three server functions (addMemoryFn, searchMemoryFn, deleteMemoryFn)
   return apiMode: "real" when the key is present.
4. Run bun dev and test the Demo section — the connection indicator should show
   "● API Connected" (green) instead of "○ Local Demo Mode" (amber).

Do not change any UI — only verify the connection works.
```

---

## PROMPT 03 — Enhance the Hero Animation

```
In the Hero component in src/components/portfolio/portfolio.tsx, the typewriter
animation shows a mem0 API call in a terminal panel before fading to the content.

The current text is:
  > mem0.search("staff frontend engineer, india")
  [connecting to memory store...]
  [retrieved: 1 match]

Update it to feel more alive:
1. Add a 400ms delay before typing starts (blank screen, then cursor appears)
2. After the text types out, show "[score: 0.99]" on a new line before fading
3. Increase the blinking cursor to a proper CSS animation rather than a static ▊
4. Ensure the fade-out (phase "intro" → "content") still triggers correctly

Touch only the Hero component and HeroStagger — no other changes.
```

---

## PROMPT 04 — Add Smooth Scroll Animations

```
The portfolio uses a simple fade-up animation via the useInView hook.
All Section components get .fade-up and .fade-up.in CSS classes.

Enhance the scroll animations:
1. Add staggered children inside each Section — each direct child gets
   animation-delay: index * 60ms
2. The skills SkillBar components already animate width on inView — keep that
3. Project cards: add a subtle scale(0.98 → 1) in addition to translateY
4. Don't touch the Hero (it has its own stagger system) or the Demo section

Implement entirely in CSS — no additional JS/state needed.
Add the stagger delays as a utility class in src/styles.css.
```

---

## PROMPT 05 — Improve SEO / AEO

```
The portfolio's SEO is defined in src/routes/index.tsx inside the head() function.
It already has Person, ProfilePage, WebPage, ItemList, and FAQ JSON-LD.

Tasks:
1. Verify the canonical URL uses the actual deployed domain (currently hardcoded as
   https://devamit.co.in — update if the deployment URL is different)
2. Add a HowTo schema describing "How to hire Amit Chakraborty" (3 steps: review
   portfolio, check GitHub, schedule a call)
3. Add a SoftwareApplication schema for the portfolio itself (applicationCategory:
   "Portfolio", operatingSystem: "Web", offers: free)
4. Ensure all JSON-LD is minified (no pretty-print) for optimal page weight

Touch only src/routes/index.tsx.
```

---

## PROMPT 06 — Add Dark Terminal Theme Toggle (Logs only)

```
The portfolio is light theme only — do not add a global dark mode toggle.

However, the terminal panels in the Logs section and the code preview in the Demo
section are already dark (#1A1D23 background). These should stay dark.

Task: Add a copy-to-clipboard button to each Terminal component.
  - Small pill button in the terminal header bar (right side, next to filename)
  - Click: copies the combined prompt + output text to clipboard
  - Button shows "Copy" → "Copied ✓" → resets after 2s
  - Style: JetBrains Mono 10px, dark surface, emerald signal color on hover

Only modify the Terminal component in portfolio.tsx.
No other changes.
```

---

## PROMPT 07 — PWA: Update Cache Version

```
The service worker at public/sw.js uses cache name: "amit-portfolio-v1".

After any significant asset change (new build output, new fonts, new images),
update the cache version to bust the old cache on all returning visitors.

Change "amit-portfolio-v1" to "amit-portfolio-v2" in public/sw.js.

Also verify:
1. STATIC_SHELL array includes any new critical assets added to /public/
2. The activate handler cleans up old cache keys correctly

No other changes.
```

---

## PROMPT 08 — Add Email OG Card

```
The portfolio references /og-card.png in SEO meta but the file doesn't exist.

Create a minimal SVG at public/og-card.svg (1200×630px) with:
  Background: #F7F8FA (light page color)
  Left vertical accent bar: 6px wide, color #16A07C (mem0 emerald)
  Main text: "Amit Chakraborty" in large serif italic
  Subtitle: "Principal Architect · AI-Native · mem0"
  Stats row: "8+ years · 18+ apps · 21 engineers"
  Footer: "devamit.co.in · Open to Staff roles"
  All text in dark ink (#0D0F12)
  No images or external resources — pure SVG text/shapes only

After creating the SVG, also update the og:image meta in src/routes/index.tsx
to point to /og-card.svg instead of /og-card.png.
```

---

## Meta-Prompt — Regenerate Specific Section

```
In src/components/portfolio/portfolio.tsx, find the [SECTION_NAME] component
(e.g., Philosophy, Skills, Projects, Demo, Logs, Contact).

Rewrite it with these specific changes:
  [DESCRIBE CHANGES]

Constraints:
  - Light theme only — no dark backgrounds except terminal panels
  - Use CSS custom properties from :root (--signal, --bg-surface, etc.)
  - No new npm packages
  - Inline styles for layout, CSS classes only for animations
  - TypeScript strict — no `any`
  - All interactive elements need aria-labels
  - Keep the Section wrapper component unchanged
```
