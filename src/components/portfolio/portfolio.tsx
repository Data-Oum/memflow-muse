import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  mem0 as mockMem0,
  CATEGORY_COLORS,
  type MemoryEntry,
  type MemorySearchResult,
  type MemoryCategory,
} from "@/lib/mem0/mock-client";
import {
  addMemoryFn,
  searchMemoryFn,
  deleteMemoryFn,
  type MemoryResult,
} from "@/lib/api/memory.functions";
import { useInView } from "@/hooks/use-in-view";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────────────────────────────────────────── */

function Section({ id, children, full }: { id: string; children: ReactNode; full?: boolean }) {
  const ref = useGsapReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className="reveal-section section-mobile-pad"
      style={{
        padding: "96px 24px",
        maxWidth: full ? "100%" : 1080,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <span className="section-label">{children}</span>;
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pm-slide-in"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "var(--ink-primary)",
        color: "white",
        padding: "10px 16px",
        borderRadius: "var(--r-full)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        boxShadow: "var(--shadow-lg)",
        zIndex: 400,
      }}
    >
      {message}
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.max(1, Math.floor(diff))}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────────────────────────── */

const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "demo", label: "Demo" },
  { id: "logs", label: "Logs" },
  { id: "contact", label: "Contact" },
];

function Nav() {
  const active = useScrollSpy(
    NAV.map((n) => n.id),
    120,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 56,
          background: "rgba(247,248,250,0.90)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid var(--edge-subtle)",
        }}
      >
        <nav
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
          aria-label="Primary"
        >
          <a
            href="#hero"
            className="font-mono"
            style={{
              fontSize: 13,
              color: "var(--ink-primary)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-primary)")}
          >
            amit.co
          </a>

          {/* Desktop nav */}
          <div
            style={{ display: "flex", gap: 24, alignItems: "center" }}
            className="hide-on-mobile"
          >
            {NAV.map((n) => {
              const isActive = active === n.id;
              return (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    position: "relative",
                    color: isActive ? "var(--signal)" : "var(--ink-secondary)",
                    fontWeight: isActive ? 500 : 400,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    padding: "4px 0",
                  }}
                >
                  {n.label}
                  {isActive && (
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--signal)",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a
              href="#contact"
              style={{
                background: "var(--signal-light)",
                border: "1px solid var(--signal-border)",
                color: "var(--signal)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: "var(--r-full)",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(22,160,124,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--signal-light)")}
            >
              Open to roles →
            </a>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label="Open menu"
              className="show-on-mobile"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "transparent",
                border: "1px solid var(--edge-default)",
                borderRadius: "var(--r-sm)",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--ink-secondary)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "var(--bg-page)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              background: "transparent",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "var(--ink-secondary)",
            }}
          >
            ×
          </button>
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 28,
                color: "var(--ink-primary)",
                textDecoration: "none",
              }}
            >
              {n.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────────── */

const PORTRAIT_URL = "https://devamit.co.in/amit-portrait.jpg";

function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // GSAP entrance — runs immediately, no loading gate
  useEffect(() => {
    if (typeof window === "undefined") return;

    import("gsap").then(({ gsap }) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Portrait slides in from the right
      tl.fromTo(
        imageRef.current,
        { opacity: 0, x: 48, scale: 0.94 },
        { opacity: 1, x: 0, scale: 1, duration: 0.9 },
      );

      // Text items stagger up
      const items = textRef.current?.querySelectorAll(".h-item");
      if (items?.length) {
        tl.fromTo(
          items,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
          "-=0.6",
        );
      }

      // Scroll indicator fades in last
      tl.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");
    });
  }, []);

  const stats = [
    { v: "8+", l: "Years" },
    { v: "18+", l: "Apps shipped" },
    { v: "21", l: "Engineers led" },
    { v: "50K+", l: "Peak DAU" },
  ];

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 700px 500px at 70% 40%, rgba(22,160,124,0.07) 0%, transparent 60%)," +
            "radial-gradient(ellipse 400px 300px at 20% 80%, rgba(22,160,124,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
        }}
      >
        {/* ── Left: text ── */}
        <div ref={textRef} style={{ maxWidth: 600 }}>
          {/* Badge */}
          <span
            className="h-item"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "var(--signal-light)",
              border: "1px solid var(--signal-border)",
              borderRadius: "var(--r-full)",
              padding: "5px 14px 5px 10px",
              marginBottom: 28,
              opacity: 0, // GSAP takes over
            }}
          >
            <span
              className="pm-pulse"
              aria-hidden
              style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--signal)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--signal)",
                letterSpacing: "0.06em",
              }}
            >
              AVAILABLE NOW · REMOTE ONLY
            </span>
          </span>

          {/* Name */}
          <h1
            className="h-item"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(2.8rem, 6.5vw, 5.5rem)",
              color: "var(--ink-primary)",
              lineHeight: 1.02,
              fontWeight: 400,
              marginBottom: 16,
              opacity: 0,
            }}
          >
            Amit
            <br />
            Chakraborty
          </h1>

          {/* Role */}
          <div
            className="h-item"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--ink-tertiary)",
              letterSpacing: "0.05em",
              marginBottom: 24,
              opacity: 0,
            }}
          >
            Principal Architect <span style={{ color: "var(--signal)" }}>·</span> AI-Native{" "}
            <span style={{ color: "var(--signal)" }}>·</span> React{" "}
            <span style={{ color: "var(--signal)" }}>·</span> mem0
          </div>

          {/* Tagline */}
          <p
            className="h-item"
            style={{
              fontSize: 17,
              color: "var(--ink-secondary)",
              lineHeight: 1.65,
              marginBottom: 32,
              maxWidth: 460,
              opacity: 0,
            }}
          >
            8+ years building production-grade AI, mobile, and web systems. Founding Engineer. 21
            engineers led.
          </p>

          {/* Stats */}
          <div
            className="h-item"
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 36,
              flexWrap: "wrap",
              opacity: 0,
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.l}
                style={{
                  padding: "0 24px",
                  borderLeft: i === 0 ? "none" : "1px solid var(--edge-default)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                    color: "var(--ink-primary)",
                    lineHeight: 1,
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-tertiary)",
                    letterSpacing: "0.06em",
                    marginTop: 5,
                    textTransform: "uppercase",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="h-item"
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36, opacity: 0 }}
          >
            <a
              href="#work"
              style={{
                background: "var(--signal)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                padding: "12px 28px",
                borderRadius: "var(--r-md)",
                textDecoration: "none",
                transition: "box-shadow 0.25s var(--ease), transform 0.25s var(--ease)",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-signal)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              View My Work ↓
            </a>
            <a
              href="mailto:amit@devamit.co.in"
              style={{
                background: "transparent",
                border: "1px solid var(--edge-default)",
                color: "var(--ink-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                padding: "12px 20px",
                borderRadius: "var(--r-md)",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--edge-signal)";
                e.currentTarget.style.color = "var(--signal)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--edge-default)";
                e.currentTarget.style.color = "var(--ink-secondary)";
              }}
            >
              amit@devamit.co.in ↗
            </a>
          </div>

          {/* Decorative mem0 code snippet */}
          <div
            className="h-item"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1A1D23",
              borderRadius: "var(--r-sm)",
              padding: "7px 14px",
              opacity: 0,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#28C840",
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#9CA3AF" }}>
              <span style={{ color: "#16A07C" }}>mem0</span>
              <span style={{ color: "#8B5CF6" }}>.add</span>
              <span style={{ color: "#9CA3AF" }}>(</span>
              <span style={{ color: "#FB923C" }}>"amit is available now"</span>
              <span style={{ color: "#9CA3AF" }}>)</span>
            </span>
          </div>
        </div>

        {/* ── Right: portrait ── */}
        <div ref={imageRef} style={{ opacity: 0 }} className="hide-on-mobile">
          <div
            style={{
              position: "relative",
              width: "clamp(260px, 26vw, 360px)",
            }}
          >
            {/* Photo card */}
            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                border: "1px solid var(--edge-default)",
                aspectRatio: "4/5",
                background: "var(--bg-raised)",
              }}
            >
              <img
                src={PORTRAIT_URL}
                alt="Amit Chakraborty — Principal Architect"
                width={360}
                height={450}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                }}
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Availability badge */}
            <div
              style={{
                position: "absolute",
                bottom: -16,
                left: "50%",
                transform: "translateX(-50%)",
                background: "white",
                border: "1px solid var(--edge-default)",
                borderRadius: "var(--r-full)",
                padding: "8px 18px 8px 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "var(--shadow-md)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                className="pm-pulse"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22C55E",
                  flexShrink: 0,
                }}
                aria-hidden
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-primary)",
                  letterSpacing: "0.06em",
                }}
              >
                AVAILABLE NOW · REMOTE ONLY
              </span>
            </div>

            {/* mem0 score chip */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: -16,
                background: "var(--signal-light)",
                border: "1px solid var(--signal-border)",
                borderRadius: "var(--r-sm)",
                padding: "5px 10px",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--signal)",
              }}
            >
              score: 0.99
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--ink-tertiary)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          scroll
        </span>
        <svg
          className="pm-bounce"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="var(--ink-tertiary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHILOSOPHY
───────────────────────────────────────────────────────────────────────────── */

function Philosophy() {
  const cards = [
    {
      icon: "🧠",
      title: "Memory-First Design",
      body: "Every UI I build considers state persistence and context retention across sessions. I think in memory graphs, not component trees. Mem0 is exactly that discipline.",
    },
    {
      icon: "⚡",
      title: "AI as Co-Pilot, Not Crutch",
      body: "I use Claude Code, Cursor, Codex, and Windsurf to accelerate, not replace judgment. My prompt logs show deliberate engineering decisions — not vibe-coding.",
    },
    {
      icon: "🎯",
      title: "End-to-End Ownership",
      body: "Design system → API integration → performance profiling → user feedback loops. Nothing ships from my hands unless it's complete, polished, and production-ready.",
    },
  ];
  return (
    <Section id="about">
      <Label>{"[ memory.get({ entity: 'principles' }) ]"}</Label>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          margin: "8px 0 48px",
          lineHeight: 1.1,
          fontWeight: 400,
        }}
      >
        <span style={{ fontStyle: "italic" }}>How I think</span> about building.
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((c) => (
          <article key={c.title} className="pm-card">
            <div style={{ fontSize: 28, marginBottom: 12 }} aria-hidden>
              {c.icon}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 10,
                color: "var(--ink-primary)",
              }}
            >
              {c.title}
            </h3>
            <p
              style={{
                color: "var(--ink-secondary)",
                lineHeight: 1.6,
                fontSize: 14,
              }}
            >
              {c.body}
            </p>
          </article>
        ))}
      </div>
      <style>{`
        .pm-card {
          background: var(--bg-surface);
          border: 1px solid var(--edge-default);
          border-radius: var(--r-lg);
          padding: 28px;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s var(--ease);
        }
        .pm-card:hover {
          border-color: var(--edge-signal);
          box-shadow: var(--shadow-signal);
          transform: translateY(-3px);
        }
      `}</style>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────────────────────────────────────── */

interface Skill {
  name: string;
  score: number;
  note: string;
}
interface Cluster {
  id: string;
  label: string;
  color: string;
  ghost: string;
  skills: Skill[];
}

const CLUSTERS: Cluster[] = [
  {
    id: "mobile",
    label: "mobile",
    color: "#0EA5E9",
    ghost: "rgba(14,165,233,0.08)",
    skills: [
      {
        name: "React Native Bridgeless",
        score: 98,
        note: "JSI · Fabric · TurboModules",
      },
      {
        name: "TypeScript Strict",
        score: 96,
        note: "Generics · discriminated unions",
      },
      {
        name: "Reanimated 3",
        score: 92,
        note: "UI thread worklets · 60fps on $150 Android",
      },
      {
        name: "iOS + Android Deploy",
        score: 95,
        note: "App Store · Play Store · Fastlane",
      },
      {
        name: "C++ / Swift / Kotlin",
        score: 83,
        note: "Native modules · JSI bridge",
      },
    ],
  },
  {
    id: "ai",
    label: "ai_ml",
    color: "#8B5CF6",
    ghost: "rgba(139,92,246,0.08)",
    skills: [
      { name: "mem0 SDK", score: 90, note: "This portfolio is proof" },
      {
        name: "RAG Pipelines",
        score: 88,
        note: "HIPAA · 99.9% uptime · Pinecone",
      },
      {
        name: "Claude / Gemini / OpenAI",
        score: 87,
        note: "Streaming · tool use · function calling",
      },
      { name: "MediaPipe CV", score: 84, note: "BlazePose · <16ms on mobile" },
      {
        name: "Context Engineering",
        score: 91,
        note: "Prompt architecture · memory injection",
      },
    ],
  },
  {
    id: "frontend",
    label: "frontend",
    color: "#16A07C",
    ghost: "rgba(22,160,124,0.08)",
    skills: [
      { name: "React 18 / 19", score: 94, note: "Concurrent · Suspense · RSC" },
      { name: "Next.js 15", score: 92, note: "App Router · ISR · Edge Runtime" },
      {
        name: "Framer Motion",
        score: 87,
        note: "Spring physics · choreography",
      },
      {
        name: "Zustand + React Query",
        score: 90,
        note: "The only state stack I need",
      },
    ],
  },
  {
    id: "backend",
    label: "backend",
    color: "#F59E0B",
    ghost: "rgba(245,158,11,0.08)",
    skills: [
      { name: "NestJS", score: 90, note: "DI · guards · event-driven" },
      {
        name: "PostgreSQL + PostGIS",
        score: 90,
        note: "ACID · geospatial · window fns",
      },
      { name: "GraphQL", score: 88, note: "DataLoader · federation" },
    ],
  },
  {
    id: "web3",
    label: "web3",
    color: "#A78BFA",
    ghost: "rgba(167,139,250,0.08)",
    skills: [
      { name: "Solidity", score: 85, note: "ERC-20/721/1155 · UUPS proxy" },
      {
        name: "Wagmi v2 + Viem",
        score: 86,
        note: "Type-safe · multi-chain · SSR",
      },
      {
        name: "Ethereum Mainnet",
        score: 81,
        note: "Gas optimization · on-chain game logic",
      },
    ],
  },
  {
    id: "leadership",
    label: "leadership",
    color: "#F472B6",
    ghost: "rgba(244,114,182,0.08)",
    skills: [
      {
        name: "0→1 Architecture",
        score: 98,
        note: "5 complete systems from zero",
      },
      {
        name: "Team Scaling",
        score: 94,
        note: "0→21 engineers · 3 seniors promoted",
      },
      {
        name: "Technical Mentorship",
        score: 95,
        note: "Standards · reviews · culture",
      },
    ],
  },
];

function SkillBar({ score, color, animate }: { score: number; color: string; animate: boolean }) {
  return (
    <div
      style={{
        height: 3,
        background: "var(--bg-raised)",
        borderRadius: 2,
        overflow: "hidden",
        marginTop: 6,
      }}
    >
      <div
        style={{
          height: "100%",
          width: animate ? `${score}%` : "0%",
          background: color,
          opacity: 0.85,
          transition: "width 0.7s ease-out",
        }}
      />
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className="pm-card" style={{ padding: 24, background: "var(--bg-surface)" }}>
      <div
        style={{
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: cluster.color,
          background: cluster.ghost,
          padding: "3px 10px",
          borderRadius: "var(--r-full)",
          marginBottom: 16,
        }}
      >
        {cluster.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cluster.skills.map((s, i) => (
          <div key={s.name} style={{ transitionDelay: `${i * 60}ms` }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--ink-primary)" }}>{s.name}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: cluster.color,
                }}
              >
                {s.score}
              </span>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-tertiary)",
                marginTop: 2,
              }}
            >
              {s.note}
            </div>
            <SkillBar score={s.score} color={cluster.color} animate={inView} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <Section id="skills">
      <Label>{"[ memory.getCategories() ]"}</Label>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.8rem, 4.5vw, 2.75rem)",
          margin: "8px 0 12px",
          fontWeight: 400,
        }}
      >
        <span style={{ fontStyle: "italic" }}>Technical</span> memory index.
      </h2>
      <p
        style={{
          color: "var(--ink-secondary)",
          fontSize: 16,
          marginBottom: 32,
          maxWidth: 600,
        }}
      >
        Proficiency mapped as retrieval scores. Higher = faster recall under pressure.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {CLUSTERS.map((c) => (
          <ClusterCard key={c.id} cluster={c} />
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────────────────────────────────────── */

interface Project {
  id: string;
  name: string;
  signal: string;
  tagline: string;
  category: string;
  score: number;
  year: string;
  url: string;
  impact: string;
  stack: string[];
  description: string;
  roleHighlights: string[];
  whyItMatters: string;
}

const PROJECTS: Project[] = [
  {
    id: "mem_001",
    name: "Aura Studio",
    signal: "#8B5CF6",
    tagline: "Visual AI Orchestration Platform",
    category: "AI Infrastructure",
    score: 0.98,
    year: "2025–2026",
    url: "https://aurastudio.devamit.co.in",
    impact: "45+ node types · Live LLM pipelines",
    stack: ["React 19", "React Flow", "Next.js", "Gemini API", "NestJS", "Zustand"],
    description:
      "Nodal canvas where users drag, connect, and configure 45+ AI pipeline nodes in real time without glue code. Full streaming execution. Not a demo.",
    roleHighlights: [
      "Designed the entire node/edge type system — 45+ custom React Flow nodes with typed connections",
      "Built streaming LLM execution engine — real-time output injection across any pipeline topology",
      "Owned the complete stack: UI architecture, NestJS orchestrator, Gemini API integration",
    ],
    whyItMatters:
      "This is memory architecture made visual. Every node is a memory transformer — storing intermediate context, injecting it forward, and searching relevant state. The nodal metaphor is exactly how mem0's memory graph works: add → search → inject → respond.",
  },
  {
    id: "mem_002",
    name: "KSHEM / ProLandly",
    signal: "#16A07C",
    tagline: "Government Land Intelligence Platform",
    category: "GovTech · GIS",
    score: 0.96,
    year: "2025–2026",
    url: "https://kshem.devamit.co.in",
    impact: "20+ portals · Claude AI · PostGIS",
    stack: ["Next.js 16", "React 19", "Claude API", "PostGIS", "Tailwind v4"],
    description:
      "Core digital infrastructure for land governance. 20+ stakeholder portals. Embedded document AI via Claude. RERA compliance.",
    roleHighlights: [
      "Architected 20+ stakeholder portal routing via Next.js App Router with per-role access layers",
      "Integrated Claude AI for legal document analysis — extracting structured data from unstructured PDFs",
      "Built PostGIS + GeoJSON boundary engine for spatial land parcel intelligence",
    ],
    whyItMatters:
      "Every government interaction leaves a context trail across portals. I built the memory layer that keeps 20+ user types coherent — same persistence problem mem0 solves, but across a state-managed GovTech ecosystem.",
  },
  {
    id: "mem_003",
    name: "HarmonyBloom",
    signal: "#F472B6",
    tagline: "Encrypted AI Wellness — Telegram Mini App",
    category: "Consumer AI · TMA",
    score: 0.94,
    year: "2024–2026",
    url: "https://harmonybloom.devamit.co.in",
    impact: "AES-256-GCM · Dexie offline-first · Gemini AI",
    stack: ["React 18", "Vite", "Supabase", "Dexie", "Framer Motion", "Gemini API"],
    description:
      "Privacy-first wellness engine. Zero-knowledge architecture. Runs inside Telegram. AI coach with gamified habit tracking.",
    roleHighlights: [
      "Zero-knowledge memory: AES-256-GCM encryption on all user data — not even the server can read it",
      "Built offline-first persistence layer with Dexie (IndexedDB) + service worker sync",
      "Designed Gemini AI coach with long-term memory injection for continuity across sessions",
    ],
    whyItMatters:
      "This app is the mem0 thesis in consumer form: an AI that remembers you privately, persistently, and meaningfully. The Aura coach uses contextual memory injection — exactly the pattern mem0 enables at the SDK level. Built before I'd seen mem0's architecture. Converged naturally.",
  },
  {
    id: "mem_004",
    name: "Aura Arena",
    signal: "#FB923C",
    tagline: "Real-time Computer Vision Gaming PWA",
    category: "Computer Vision · Gaming",
    score: 0.93,
    year: "2024–2025",
    url: "https://auraarena.devamit.co.in",
    impact: "<16ms inference · 60fps · Supabase Realtime",
    stack: ["MediaPipe", "TensorFlow.js", "WebGPU", "Supabase Realtime", "PWA"],
    description:
      "Live camera → competitive gameplay. BlazePose + Face Mesh at 60fps on consumer hardware. 1v1 battle mode. Global leaderboard.",
    roleHighlights: [
      "Achieved <16ms/frame inference using MediaPipe BlazePose + WebGPU acceleration in-browser",
      "Built hybrid on-device + cloud pipeline: edge inference locally, results ranked via Supabase Realtime",
      "Designed biometric scoring engine — movement quality as a persistent performance memory",
    ],
    whyItMatters:
      "Biometric movement data is the ultimate user memory — it persists across sessions, reveals patterns, and enables personalization. I built the scoring and retrieval layer for physical context the way mem0 does for conversational context.",
  },
  {
    id: "mem_005",
    name: "Vulcan Eleven",
    signal: "#38BDF8",
    tagline: "Fantasy Sports · 50K+ Daily Active Users",
    category: "React Native · Mobile",
    score: 0.95,
    year: "2023–2025",
    url: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
    impact: "50K+ DAU · C++ native · Razorpay + Binance Pay",
    stack: ["React Native", "Reanimated 3", "C++", "Razorpay", "Binance Pay"],
    description:
      "Fantasy sports at scale. C++ native modules for 60fps on $150 Android. Gesture mechanics, dual payment rails, zero critical failures in production.",
    roleHighlights: [
      "Built proprietary C++ native module for render pipeline — achieved 60fps on mid-range Android hardware",
      "Integrated Razorpay (fiat) + Binance Pay (crypto) — dual payment rail with no UX disruption",
      "Zero critical production failures across 50K+ daily active users",
    ],
    whyItMatters:
      "At 50K DAU, user context is everything — personalized contests, session continuity, payment preference memory. This is where I learned that stateful user memory is not a feature, it is the product.",
  },
  {
    id: "mem_006",
    name: "DeFi11",
    signal: "#A78BFA",
    tagline: "Fully On-Chain Decentralized Fantasy Sports",
    category: "Web3 · Solidity",
    score: 0.91,
    year: "2022–2024",
    url: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
    impact: "Ethereum Mainnet · UUPS proxy · NFT marketplace",
    stack: ["Solidity", "React Native", "Wagmi", "Ethers.js", "ERC-721"],
    description:
      "100% on-chain. Smart contract prize pools. NFT marketplace with ERC-2981 royalties. Zero-trust — no centralized game logic.",
    roleHighlights: [
      "Designed UUPS upgradeable proxy architecture — contracts live on Ethereum Mainnet",
      "Built NFT marketplace with on-chain royalty enforcement via ERC-2981",
      "Zero centralized game logic — all state lives on-chain, verifiable by anyone",
    ],
    whyItMatters:
      "Blockchain is the most extreme form of persistent, verifiable memory. Every transaction, every ownership change is immutable context. Building DeFi systems taught me that the most valuable memory is the one that cannot be falsified.",
  },
];

/* ─── Project Card ─────────────────────────────────────────────────────────── */

function ProjectCard({ p, onSelect }: { p: Project; onSelect: (p: Project) => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.18);
  const visibleStack = p.stack.slice(0, 4);
  const overflow = p.stack.length - visibleStack.length;
  return (
    <div
      ref={ref}
      className="proj-card"
      style={{
        position: "relative",
        background: "var(--bg-surface)",
        border: "1px solid var(--edge-default)",
        borderRadius: "var(--r-lg)",
        padding: 24,
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflow: "hidden",
        transition: "all 0.3s var(--ease)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 8px 32px ${p.signal}26`;
        e.currentTarget.style.borderColor = `${p.signal}66`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--edge-default)";
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: p.signal,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
        }}
      >
        <span style={{ color: "var(--ink-tertiary)" }}>{p.id}</span>
        <span style={{ color: p.signal }}>{p.score.toFixed(2)}</span>
      </div>

      <div
        style={{
          height: 2,
          background: "var(--bg-raised)",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: inView ? `${p.score * 100}%` : "0%",
            background: p.signal,
            transition: "width 0.8s ease-out",
          }}
        />
      </div>

      <div>
        <span
          style={{
            display: "inline-block",
            background: `${p.signal}1a`,
            border: `1px solid ${p.signal}40`,
            color: p.signal,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            padding: "3px 10px",
            borderRadius: "var(--r-full)",
          }}
        >
          {p.category}
        </span>
      </div>

      <div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--ink-primary)",
            marginBottom: 4,
          }}
        >
          {p.name}
        </h3>
        <div style={{ fontSize: 13, color: "var(--ink-secondary)" }}>{p.tagline}</div>
      </div>

      <p style={{ fontSize: 13, color: "var(--ink-secondary)", lineHeight: 1.5 }}>
        {p.description}
      </p>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: p.signal }}>
        → {p.impact}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {visibleStack.map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-tertiary)",
              background: "var(--bg-raised)",
              border: "1px solid var(--edge-subtle)",
              padding: "3px 8px",
              borderRadius: "var(--r-xs)",
            }}
          >
            {s}
          </span>
        ))}
        {overflow > 0 && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--ink-tertiary)",
              background: "var(--bg-raised)",
              padding: "3px 8px",
              borderRadius: "var(--r-xs)",
            }}
          >
            +{overflow} more
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: 8,
          borderTop: "1px solid var(--edge-subtle)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-tertiary)",
          }}
        >
          {p.year}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p);
            }}
            aria-label={`View details for ${p.name}`}
            style={{
              background: `${p.signal}15`,
              border: `1px solid ${p.signal}40`,
              color: p.signal,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              padding: "4px 10px",
              borderRadius: "var(--r-sm)",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = `${p.signal}25`)}
            onMouseLeave={(e) => (e.currentTarget.style.background = `${p.signal}15`)}
          >
            View Details
          </button>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${p.name} in new tab`}
            style={{ color: "var(--ink-tertiary)", fontSize: 14 }}
          >
            ↗
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Project Modal ────────────────────────────────────────────────────────── */

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const p = project;

  // Close on Escape + freeze Lenis while modal is open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);

    // Freeze Lenis scroll while modal is open
    import("@/hooks/use-smooth-scroll").then(({ getLenis }) => {
      getLenis()?.stop();
    });

    return () => {
      document.removeEventListener("keydown", handler);
      import("@/hooks/use-smooth-scroll").then(({ getLenis }) => {
        getLenis()?.start();
      });
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${p.name} project details`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "rgba(247,248,250,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "modalFadeIn 0.3s var(--ease)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--shadow-lg)",
          maxWidth: 760,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "modalSlideIn 0.3s var(--ease)",
          border: "1px solid var(--edge-default)",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            height: 4,
            background: p.signal,
            borderRadius: "var(--r-xl) var(--r-xl) 0 0",
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid var(--edge-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span
                style={{
                  background: `${p.signal}1a`,
                  border: `1px solid ${p.signal}40`,
                  color: p.signal,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: "var(--r-full)",
                }}
              >
                {p.category}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--ink-tertiary)",
                }}
              >
                {p.id} · score {p.score.toFixed(2)}
              </span>
            </div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "var(--ink-primary)",
                marginBottom: 4,
              }}
            >
              {p.name}
            </h2>
            <p style={{ fontSize: 14, color: "var(--ink-secondary)" }}>{p.tagline}</p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--edge-default)",
              borderRadius: "var(--r-sm)",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--ink-secondary)",
              fontSize: 16,
              flexShrink: 0,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-overlay)";
              e.currentTarget.style.color = "var(--ink-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-raised)";
              e.currentTarget.style.color = "var(--ink-secondary)";
            }}
          >
            ×
          </button>
        </div>

        {/* Visual hero — gradient placeholder */}
        <div
          style={{
            margin: "0",
            height: 180,
            background: `linear-gradient(135deg, ${p.signal}18 0%, ${p.signal}08 50%, transparent 100%), var(--bg-raised)`,
            borderBottom: "1px solid var(--edge-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 8,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: `1px solid ${p.signal}20`,
              top: -100,
              right: -60,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `1px solid ${p.signal}15`,
              bottom: -80,
              left: 40,
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 28,
              color: p.signal,
              position: "relative",
              zIndex: 1,
            }}
          >
            {p.name}
          </div>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--ink-tertiary)",
              textDecoration: "none",
              position: "relative",
              zIndex: 1,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = p.signal)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-tertiary)")}
          >
            [ live at {p.url.replace("https://", "")} ↗ ]
          </a>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Description */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--signal)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Overview
            </div>
            <p
              style={{
                fontSize: 15,
                color: "var(--ink-secondary)",
                lineHeight: 1.7,
              }}
            >
              {p.description}
            </p>
          </div>

          {/* Role Highlights */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--signal)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Role Highlights
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {p.roleHighlights.map((h, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    fontSize: 14,
                    color: "var(--ink-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      color: p.signal,
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    →
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* mem0 Why it matters */}
          <div
            style={{
              background: `${p.signal}08`,
              border: `1px solid ${p.signal}30`,
              borderRadius: "var(--r-md)",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: p.signal,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>🧠</span>
              <span>[ memory.search("why it matters") ]</span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-secondary)",
                lineHeight: 1.7,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {p.whyItMatters}
            </p>
          </div>

          {/* Full stack */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--signal)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Full Stack
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.stack.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-secondary)",
                    background: "var(--bg-raised)",
                    border: "1px solid var(--edge-default)",
                    padding: "4px 10px",
                    borderRadius: "var(--r-sm)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: p.signal,
              paddingTop: 4,
            }}
          >
            → {p.impact}
          </div>
        </div>

        {/* Footer CTA */}
        <div
          style={{
            padding: "16px 28px 24px",
            borderTop: "1px solid var(--edge-subtle)",
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--edge-default)",
              color: "var(--ink-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              padding: "10px 20px",
              borderRadius: "var(--r-md)",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: p.signal,
              color: "white",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 20px",
              borderRadius: "var(--r-md)",
              textDecoration: "none",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow-signal)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            View Live ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function Projects({ onSelect }: { onSelect: (p: Project) => void }) {
  return (
    <Section id="work">
      <Label>{"[ memory.search({ category: 'shipped_work' }) ]"}</Label>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          margin: "8px 0 12px",
          fontWeight: 400,
        }}
      >
        <span style={{ fontStyle: "italic" }}>Shipped systems,</span>{" "}
        <span style={{ color: "var(--ink-secondary)" }}>not side projects.</span>
      </h2>
      <p
        style={{
          color: "var(--ink-secondary)",
          fontSize: 16,
          marginBottom: 32,
        }}
      >
        6 of 18+ production systems. Each had real users. Real stakes.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} onSelect={onSelect} />
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEMO — connected to real mem0 server functions
───────────────────────────────────────────────────────────────────────────── */

const QUICK_FILL = [
  "I prefer TypeScript over JavaScript",
  "I'm a startup founder in India",
  "I love minimal light mode UIs",
];

function syntaxHighlight(code: string) {
  const out: ReactNode[] = [];
  const lines = code.split("\n");
  lines.forEach((line, li) => {
    const parts: ReactNode[] = [];
    let idx = 0;
    const re =
      /("[^"]*")|(\bawait\b)|(\.[a-zA-Z_]+)|(\bconst\b|\blet\b|\bnew\b)|(\bclient\b|\bmem0\b)|(\{|\}|\[|\])/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > idx) parts.push(line.slice(idx, m.index));
      const text = m[0];
      let color = "#F0F0FF";
      if (m[1]) color = "#FB923C";
      else if (m[2]) color = "#16A07C";
      else if (m[3]) color = "#8B5CF6";
      else if (m[4]) color = "#16A07C";
      else if (m[5]) color = "#F0F0FF";
      else if (m[6]) color = "#9CA3AF";
      parts.push(
        <span key={`${li}-${m.index}`} style={{ color }}>
          {text}
        </span>,
      );
      idx = m.index + text.length;
    }
    if (idx < line.length) parts.push(line.slice(idx));
    out.push(<div key={li}>{parts.length ? parts : " "}</div>);
  });
  return out;
}

function Demo({ visitorId, showToast }: { visitorId: string; showToast: (m: string) => void }) {
  const [input, setInput] = useState("");
  const [memories, setMemories] = useState<MemoryResult[]>([]);
  const [results, setResults] = useState<(MemoryResult & { score: string })[] | null>(null);
  const [loading, setLoading] = useState<"add" | "search" | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [apiMode, setApiMode] = useState<"real" | "mock" | null>(null);
  const [code, setCode] = useState<string>(
    `await mem0.add(\n  [{ role: "user", content: "..." }],\n  { user_id: "${visitorId}" }\n);`,
  );

  const onAdd = useCallback(async () => {
    if (!input.trim()) return;
    setLoading("add");
    setCode(
      `await mem0.add(\n  [{ role: "user", content: "${input.replace(/"/g, '\\"')}" }],\n  { user_id: "${visitorId}" }\n);`,
    );
    try {
      const res = (await addMemoryFn({
        data: {
          messages: [{ role: "user", content: input }],
          user_id: visitorId,
          metadata: { source: "portfolio_demo" },
        },
      })) as { success: boolean; data?: MemoryResult; apiMode: "real" | "mock" };
      if (res.success && res.data) {
        setMemories((prev) => [res.data!, ...prev]);
        setApiMode(res.apiMode);
        showToast(res.apiMode === "real" ? "Memory stored via mem0 API" : "Memory stored (local)");
      }
    } catch {
      // Fallback to mock client
      const entry = await mockMem0.add([{ role: "user", content: input }], {
        user_id: visitorId,
        metadata: { source: "portfolio_demo" },
      });
      setMemories((prev) => [entry as unknown as MemoryResult, ...prev]);
      setApiMode("mock");
      showToast("Memory stored (local fallback)");
    }
    setResults(null);
    setInput("");
    setLoading(null);
  }, [input, visitorId, showToast]);

  const onSearch = useCallback(async () => {
    setLoading("search");
    setCode(
      `await mem0.search(\n  "${searchQ.replace(/"/g, '\\"')}",\n  { user_id: "${visitorId}" }\n);`,
    );
    try {
      const res = (await searchMemoryFn({
        data: { query: searchQ || "*", user_id: visitorId },
      })) as {
        success: boolean;
        data?: (MemoryResult & { score: string })[];
        apiMode: "real" | "mock";
      };
      if (res.success && res.data) {
        setResults(res.data);
        setApiMode(res.apiMode);
      }
    } catch {
      const res = await mockMem0.search(searchQ || "*", {
        filters: { user_id: visitorId },
      });
      setResults(res as (MemoryResult & { score: string })[]);
      setApiMode("mock");
    }
    setLoading(null);
  }, [searchQ, visitorId]);

  const onDelete = useCallback(async (id: string) => {
    try {
      await deleteMemoryFn({ data: { memory_id: id } });
    } catch {
      await mockMem0.delete(id);
    }
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setResults((prev) => (prev ? prev.filter((m) => m.id !== id) : null));
    setCode(`await mem0.delete("${id}");`);
  }, []);

  const matchedIds = useMemo(() => new Set((results ?? []).map((r) => r.id)), [results]);
  const scoreById = useMemo(() => {
    const map = new Map<string, string>();
    (results ?? []).forEach((r) => map.set(r.id, r.score));
    return map;
  }, [results]);

  return (
    <Section id="demo">
      <Label>{"[ mem0.playground({ live: true }) ]"}</Label>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          margin: "8px 0 12px",
          fontWeight: 400,
        }}
      >
        <span style={{ fontStyle: "italic" }}>Memory</span> in action.
      </h2>
      <p
        style={{
          color: "var(--ink-secondary)",
          fontSize: 16,
          marginBottom: 32,
          maxWidth: 640,
        }}
      >
        This demo runs the real mem0 API surface. Add memories. Search them. Watch the retrieval
        scores. This is what I would build for your users.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {/* LEFT — Input panel */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--edge-default)",
            borderTop: "3px solid var(--signal)",
            borderRadius: "var(--r-lg)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--signal)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>mem0 · add()</span>
            {apiMode && (
              <span
                style={{
                  background: apiMode === "real" ? "rgba(22,160,124,0.1)" : "rgba(245,158,11,0.1)",
                  color: apiMode === "real" ? "var(--signal)" : "#F59E0B",
                  border: `1px solid ${apiMode === "real" ? "rgba(22,160,124,0.25)" : "rgba(245,158,11,0.3)"}`,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: "var(--r-full)",
                }}
              >
                {apiMode === "real" ? "● API Connected" : "○ Local Demo Mode"}
              </span>
            )}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me something about you..."
            aria-label="Memory content"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--edge-default)",
              borderRadius: "var(--r-md)",
              padding: 12,
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              minHeight: 80,
              resize: "vertical",
              color: "var(--ink-primary)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--signal)";
              e.currentTarget.style.boxShadow = "var(--signal-glow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--edge-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK_FILL.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setInput(q)}
                style={{
                  background: "var(--signal-light)",
                  border: "1px solid var(--signal-border)",
                  color: "var(--signal)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "5px 12px",
                  borderRadius: "var(--r-full)",
                  cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onAdd}
              disabled={loading === "add" || !input.trim()}
              aria-busy={loading === "add"}
              style={{
                background: "var(--signal)",
                color: "white",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: "var(--r-md)",
                border: "none",
                cursor: loading === "add" ? "wait" : "pointer",
                opacity: loading === "add" || !input.trim() ? 0.7 : 1,
              }}
            >
              {loading === "add" ? "Storing..." : "Store Memory"}
            </button>
            <button
              type="button"
              onClick={() => setShowSearch((s) => !s)}
              style={{
                background: "transparent",
                border: "1px solid var(--edge-strong)",
                color: "var(--ink-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                padding: "10px 16px",
                borderRadius: "var(--r-md)",
                cursor: "pointer",
              }}
            >
              Search Memory
            </button>
          </div>

          {showSearch && (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
                placeholder="Search stored memories..."
                aria-label="Search query"
                style={{
                  flex: 1,
                  background: "var(--bg-raised)",
                  border: "1px solid var(--edge-default)",
                  borderRadius: "var(--r-md)",
                  padding: "10px 12px",
                  fontSize: 14,
                  outline: "none",
                  color: "var(--ink-primary)",
                }}
              />
              <button
                type="button"
                onClick={onSearch}
                aria-busy={loading === "search"}
                style={{
                  background: "var(--ink-primary)",
                  color: "white",
                  fontSize: 13,
                  padding: "10px 16px",
                  borderRadius: "var(--r-md)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {loading === "search" ? "..." : "Run"}
              </button>
            </div>
          )}

          {/* Live code preview */}
          <div
            style={{
              background: "#1A1D23",
              borderRadius: "var(--r-md)",
              padding: 16,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              lineHeight: 1.7,
              color: "#9CA3AF",
              overflow: "auto",
              whiteSpace: "pre",
            }}
          >
            {loading ? (
              <span style={{ color: "var(--signal)" }}>
                <span
                  className="pm-pulse"
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    background: "var(--signal)",
                    borderRadius: "50%",
                    marginRight: 8,
                  }}
                />
                Processing with Mem0...
              </span>
            ) : (
              syntaxHighlight(code)
            )}
          </div>
        </div>

        {/* RIGHT — Memory state panel */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--edge-default)",
            borderRadius: "var(--r-lg)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minHeight: 360,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Stored Memories</div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-tertiary)",
                }}
              >
                user_id: {visitorId}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  background: "var(--signal-light)",
                  color: "var(--signal)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: "var(--r-full)",
                }}
              >
                {memories.length} {memories.length === 1 ? "Memory" : "Memories"}
              </span>
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--signal)",
                }}
              >
                <span
                  className="pm-pulse"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--signal)",
                  }}
                />
                Connected
              </span>
            </div>
          </div>

          {memories.length === 0 ? (
            <div
              style={{
                border: "2px dashed var(--edge-signal)",
                borderRadius: "var(--r-md)",
                padding: 40,
                textAlign: "center",
                color: "var(--ink-tertiary)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 2a4 4 0 00-4 4v1a4 4 0 00-2 7.5V17a3 3 0 003 3h6a3 3 0 003-3v-2.5A4 4 0 0016 7V6a4 4 0 00-4-4z"
                  stroke="var(--signal)"
                  strokeWidth="1.5"
                />
              </svg>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>No memories yet.</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                Start typing to watch Mem0 extract and store context.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                overflowY: "auto",
                maxHeight: 480,
              }}
            >
              {results && (
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--signal)",
                  }}
                >
                  Relevance ↓
                </div>
              )}
              {memories.map((m) => {
                const isMatch = !results || matchedIds.has(m.id);
                const score = scoreById.get(m.id);
                const cat = m.category as MemoryCategory;
                const color = CATEGORY_COLORS[cat] ?? "#6B7280";
                return (
                  <div
                    key={m.id}
                    className="pm-slide-in"
                    style={{
                      background: "var(--bg-raised)",
                      border: "1px solid var(--edge-subtle)",
                      borderRadius: "var(--r-md)",
                      padding: "12px 14px",
                      opacity: isMatch ? 1 : 0.4,
                      transition: "opacity 0.3s",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--ink-tertiary)",
                        }}
                      >
                        {m.id.slice(0, 12)}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            background: `${color}1a`,
                            color,
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: "var(--r-full)",
                          }}
                        >
                          {m.category}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--ink-tertiary)",
                          }}
                        >
                          {timeAgo(m.created_at)}
                        </span>
                        <button
                          type="button"
                          aria-label="Delete memory"
                          onClick={() => onDelete(m.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--ink-tertiary)",
                            fontSize: 16,
                            lineHeight: 1,
                            padding: 0,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "var(--ink-tertiary)")
                          }
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "var(--ink-primary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {m.memory}
                    </div>
                    {score && (
                      <div style={{ marginTop: 8 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--signal)",
                            marginBottom: 3,
                          }}
                        >
                          Score: {score}
                        </div>
                        <div
                          style={{
                            height: 3,
                            background: "var(--bg-overlay)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Number(score) * 100}%`,
                              background: "var(--signal)",
                              transition: "width 0.4s ease-out",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AI WORKFLOW LOGS
───────────────────────────────────────────────────────────────────────────── */

interface TermLog {
  tool: string;
  date: string;
  filename: string;
  prompt: string;
  output: string;
}

const LOGS: TermLog[] = [
  {
    tool: "Claude Code",
    date: "April 12, 2025 · 2:34 PM",
    filename: "useMemory.ts",
    prompt: `// Prompt: "Building a chat interface that persists conversation context using mem0.
// The user should feel the AI remembers them on return visits.
// Design: memory schema, React state architecture, and mem0 integration layer.
// Q: What to store vs retrieve? How to handle memory conflicts?
//    What's the retrieval strategy for context injection?"`,
    output: `> Files modified: /hooks/useMemory.ts · /lib/mem0Client.ts · /components/ChatContext.tsx
> Tokens: 4,847  |  Time saved: ~3.5 hours  |  Bugs caught before PR: 2`,
  },
  {
    tool: "Cursor",
    date: "March 28, 2025 · 11:15 AM",
    filename: "Dashboard.tsx → 4 hooks",
    prompt: `// "Dashboard component violates SRP — it fetches data, manages WebSocket,
// renders charts, AND handles user preferences.
// Extract: useMetrics(), useRealtimeUpdates(), useUserConfig().
// TypeScript strict — no \`any\` allowed. Justify every type decision."`,
    output: `> Generated: useMetrics.ts · useRealtimeUpdates.ts · useUserConfig.ts · useChartData.ts
> LOC: 847 generated, 312 written manually
> Duration: 23 min  |  Estimated manual: 6 hours`,
  },
  {
    tool: "Windsurf",
    date: "May 2, 2025 · 4:02 PM",
    filename: "MemoryClient.test.ts",
    prompt: `// "Generate Vitest unit tests for MockMemoryClient.
// Cover: add/search/delete happy paths, API errors (401, 429, 500),
// network timeouts, concurrent operations, edge cases:
// empty queries, duplicate memories, special chars in user_id.
// vi.mock the fetch layer."`,
    output: `> Test cases: 47 generated  |  Coverage: 94% → 98%
> Bugs caught before production: 3 edge cases in concurrent deletes`,
  },
];

function Terminal({ log }: { log: TermLog }) {
  return (
    <div
      style={{
        background: "#1A1D23",
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        style={{
          background: "#14161C",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-tertiary)",
          }}
        >
          {log.filename}
        </span>
      </div>
      <div
        style={{
          padding: "20px 24px",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.9,
          color: "#9CA3AF",
          whiteSpace: "pre-wrap",
          overflowX: "auto",
        }}
      >
        <div style={{ color: "var(--signal)", fontSize: 11, marginBottom: 12 }}>
          {log.tool} · {log.date}
        </div>
        <div style={{ color: "#4B5563" }}>{log.prompt}</div>
        <div style={{ marginTop: 12, color: "#F0F0FF" }}>{log.output}</div>
      </div>
    </div>
  );
}

function Logs() {
  return (
    <Section id="logs">
      <Label>{"[ memory.search({ category: 'ai_workflow' }) ]"}</Label>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.8rem, 4.5vw, 2.75rem)",
          margin: "8px 0 12px",
          fontWeight: 400,
        }}
      >
        <span style={{ fontStyle: "italic" }}>How I actually</span> build.
      </h2>
      <p
        style={{
          color: "var(--ink-secondary)",
          fontSize: 16,
          marginBottom: 32,
          maxWidth: 640,
        }}
      >
        Not 'I used AI'. Deliberate, logged, reviewable engineering decisions.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {LOGS.map((l) => (
          <Terminal key={l.filename} log={l} />
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RESUME DOWNLOAD
───────────────────────────────────────────────────────────────────────────── */

type DownloadState = "idle" | "downloading" | "done" | "error";

function ResumeDownloadButton() {
  const [state, setState] = useState<DownloadState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDownload = async () => {
    setState("downloading");
    try {
      const res = await fetch("/resume.txt");
      if (!res.ok) throw new Error("Not found");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "amit-chakraborty-resume.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setState("done");
    } catch {
      // Fallback: generate inline text blob
      const resumeText = generateResumeText();
      const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "amit-chakraborty-resume.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setState("done");
    }
    timerRef.current = setTimeout(() => setState("idle"), 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const labels: Record<DownloadState, string> = {
    idle: "Download Resume ↓",
    downloading: "Preparing...",
    done: "Downloaded ✓",
    error: "Try Again",
  };

  const colors: Record<DownloadState, string> = {
    idle: "var(--ink-secondary)",
    downloading: "var(--signal)",
    done: "var(--signal)",
    error: "#DC2626",
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state === "downloading"}
      aria-busy={state === "downloading"}
      aria-label={labels[state]}
      style={{
        background: "transparent",
        border: `1px solid ${state === "done" ? "var(--edge-signal)" : "var(--edge-strong)"}`,
        color: colors[state],
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        padding: "10px 20px",
        borderRadius: "var(--r-md)",
        cursor: state === "downloading" ? "wait" : "pointer",
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {state === "downloading" && (
        <span
          className="pm-pulse"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--signal)",
          }}
        />
      )}
      {labels[state]}
    </button>
  );
}

function generateResumeText(): string {
  return `AMIT CHAKRABORTY
Principal Architect · AI-Native Systems Engineer

amit@devamit.co.in  |  +91-9874173663
linkedin.com/in/devamitch  |  devamit.co.in  |  github.com/devamitch
Kolkata, India — Remote Only

════════════════════════════════════════════════════════════════

SUMMARY

Senior React Native Engineer with 8+ years of professional software development,
including 4+ years focused on iOS and Android mobile development for enterprise
production systems. Expert in React Native (Bridgeless Architecture, JSI,
TurboModules), TypeScript, and native modules (C++/Swift/Kotlin).

Proven track record shipping 18+ production applications. Built and automated
CI/CD pipelines using GitHub Actions, Fastlane, and Firebase App Distribution —
reducing release cycles from 2 days to 4 hours.

════════════════════════════════════════════════════════════════

KEY ACHIEVEMENTS

• 18+ production mobile applications shipped across App Store and Play Store
• OAuth 2.0 authentication flows with enterprise identity provider integration
• CI/CD pipeline automation — reduced release cycle from 2 days to 4 hours
• Native modules (C++/Swift/Kotlin) — 60fps on low-end $150 Android devices
• 0 → 21 engineers scaled from zero — full hiring, onboarding, mentorship
• 50,000+ daily active users served with 99.9% uptime
• Dating MVP delivered in 90 days — client secured seed funding

════════════════════════════════════════════════════════════════

EXPERIENCE

Synapsis Medical Technologies Inc.  |  Jan 2025 – Feb 2026
Senior Full-Stack Software & Mobile Development Lead
Edmonton, Canada (Remote) · Founding Engineer · HealthTech / AI

• Designed enterprise-grade mobile applications using React Native from zero
• Implemented OAuth 2.0 authentication with enterprise identity provider integration
• Built CI/CD pipelines with Fastlane + GitHub Actions + Firebase App Distribution
• Engineered native modules (C++/Swift/Kotlin) for consistent frame stability
• HIPAA-aligned architecture for regulated HealthTech data handling
• Scaled 0 → 21 engineers — designed hiring, onboarding, sprint processes
• Delivered 5 production applications in 13 months with 99.9% uptime

NonceBlox Pvt. Ltd.  |  Oct 2021 – Jan 2025
Lead Mobile Architect & Senior Full-Stack Engineer
Dubai (Remote) · 3 years 4 months · FinTech / Web3 / Gaming

• 13+ production apps across FinTech, Web3, consumer — 50K+ daily active users
• Secure payment systems across 6 providers (Stripe, Razorpay, PayU, Binance Pay)
• Optimized performance with native modules, rendering optimizations
• Mentored 8+ engineers over 3+ years

TechProMind & WebSkitters  |  May 2017 – Sept 2021
PHP Developer · Government & Enterprise Systems

• 13+ government systems with zero post-deployment security incidents
• GST Merchant Portal built from scratch — 40% efficiency improvement

════════════════════════════════════════════════════════════════

INDEPENDENT PROJECTS (2025–2026)

• Aura Arena  — AI movement PWA · MediaPipe <16ms · Supabase Realtime
               auraarena.devamit.co.in
• HarmonyBloom — Wellness TMA · AES-256-GCM · On-device AI · Gamified
               harmonybloom.devamit.co.in
• KSHEM        — Land intelligence · 20+ portals · AI documents · GIS
               kshem.devamit.co.in
• Aura Studio  — AI orchestration · 45+ nodes · React Flow · Gemini
               aurastudio.devamit.co.in
• Neev         — Family OS · Claude AI · Next.js 16
               neev.devamit.co.in

════════════════════════════════════════════════════════════════

EDUCATION

MCA  |  Techno Main Salt Lake, Kolkata  |  2018–2021  |  8.61 CGPA
BCA  |  The Heritage Academy, Kolkata   |  2014–2017  |  7.23 CGPA

════════════════════════════════════════════════════════════════

Generated from devamit.co.in · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────────────────────────── */

const contactLinkStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "var(--ink-secondary)",
  textDecoration: "none",
  cursor: "pointer",
};

function Contact({ showToast }: { showToast: (m: string) => void }) {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("amit@devamit.co.in");
      showToast("Copied!");
    } catch {
      showToast("Press Cmd/Ctrl+C");
    }
  };

  const finalCode = `// What Amit ships from day one
await mem0.add([
  { role: "engineer", content: "Polished production UIs, end-to-end" },
  { role: "engineer", content: "AI-native workflow — Claude Code, Cursor, Windsurf" },
  { role: "engineer", content: "mem0 SDK integrated before the first interview" },
  { role: "engineer", content: "8 years of shipped systems. No unfinished work." }
], { user_id: "mem0_team", metadata: { status: "open_to_hire" } });

// { id: "mem_amit_001", score: 0.99, category: "hire_now" }`;

  return (
    <div
      id="contact"
      style={{
        background: "var(--bg-raised)",
        borderTop: "1px solid var(--edge-default)",
      }}
    >
      <Section id="contact-inner">
        <Label>{"[ mem0.add({ user_id: 'mem0_team', content: 'Amit is available' }) ]"}</Label>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            margin: "8px 0 16px",
            fontWeight: 400,
          }}
        >
          <span style={{ fontStyle: "italic" }}>Let's build memory</span> together.
        </h2>
        <p
          style={{
            color: "var(--ink-secondary)",
            fontSize: 16,
            marginBottom: 32,
            maxWidth: 640,
          }}
        >
          I've studied the SDK. I've built the demo. I've shipped the logs. Here's how to reach me.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <button
            type="button"
            onClick={copyEmail}
            className="contact-link"
            style={contactLinkStyle}
          >
            ✉ amit@devamit.co.in
          </button>
          <a
            href="https://github.com/devamitch"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            style={contactLinkStyle}
          >
            ◐ github.com/devamitch
          </a>
          <a
            href="https://linkedin.com/in/devamitch"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            style={contactLinkStyle}
          >
            ⌗ linkedin.com/in/devamitch
          </a>
          <a
            href="https://x.com/devamitch"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            style={contactLinkStyle}
          >
            𝕏 x.com/devamitch
          </a>
        </div>

        {/* CTA row — apply button + resume download */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <ResumeDownloadButton />
        </div>

        <Terminal
          log={{
            tool: "amit.contribution",
            date: "ready",
            filename: "amit.contribution.js",
            prompt: finalCode,
            output: "",
          }}
        />
      </Section>
      <style>{`
        .contact-link { transition: color 0.2s; }
        .contact-link:hover { color: var(--signal) !important; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MEMORY BANNER (returning visitor)
───────────────────────────────────────────────────────────────────────────── */

function MemoryBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const visitsRaw = localStorage.getItem("portfolio_visit_count");
      const dismissed = sessionStorage.getItem("portfolio_banner_dismissed");
      const count = visitsRaw ? parseInt(visitsRaw, 10) : 0;
      localStorage.setItem("portfolio_visit_count", String(count + 1));
      if (count > 0 && !dismissed) setShow(true);
    } catch {
      // ignore storage errors
    }
  }, []);

  if (!show) return null;
  return (
    <div
      className="pm-slide-down"
      style={{
        position: "sticky",
        top: 56,
        zIndex: 90,
        background: "var(--signal-light)",
        borderBottom: "1px solid var(--signal-border)",
        height: 40,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--signal)",
        }}
      >
        [ memory recalled ] · Welcome back. You've been here before.
      </span>
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => {
          try {
            sessionStorage.setItem("portfolio_banner_dismissed", "1");
          } catch {
            // ignore
          }
          setShow(false);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--signal)",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export function Portfolio() {
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "visitor_ssr000";
    try {
      const existing = localStorage.getItem("portfolio_visitor_id");
      if (existing) return existing;
      const id = "visitor_" + Math.random().toString(36).slice(2, 7);
      localStorage.setItem("portfolio_visitor_id", id);
      return id;
    } catch {
      return "visitor_" + Math.random().toString(36).slice(2, 7);
    }
  }, []);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div
      style={{
        background: "var(--bg-page)",
        color: "var(--ink-primary)",
        minHeight: "100vh",
      }}
    >
      <Nav />
      <MemoryBanner />
      <main>
        <Hero />
        <Philosophy />
        <Skills />
        <Projects onSelect={setSelectedProject} />
        <Demo visitorId={visitorId} showToast={showToast} />
        <Logs />
      </main>
      <Contact showToast={showToast} />
      <footer
        style={{
          background: "var(--bg-raised)",
          padding: "32px 24px",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-tertiary)",
          borderTop: "1px solid var(--edge-subtle)",
        }}
      >
        // built with mem0 · {new Date().getFullYear()} · Kolkata → Remote
      </footer>
      <Toast message={toast} />

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
