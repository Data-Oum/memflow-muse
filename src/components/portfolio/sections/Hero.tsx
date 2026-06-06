import { MemoryGraph } from "@/components/portfolio/ui/MemoryGraph";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── icons ── */
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── static data ── */
const TRUST_BADGES = [
  { value: "18+", label: "Apps Shipped" },
  { value: "50K+", label: "Peak DAU" },
  { value: "21", label: "Engineers Led" },
  { value: "8+", label: "Years" },
];

const MEMORY_CHIPS = [
  { label: "react_native", score: "0.98", style: { top: 18, left: 14 } },
  { label: "ai_pipelines", score: "0.95", style: { top: 18, right: 14 } },
  { label: "leadership",   score: "0.98", style: { bottom: 18, left: 14 } },
  { label: "web3",         score: "0.91", style: { bottom: 18, right: 14 } },
] as const;

const SKILL_BARS = [
  { key: "react_native", val: 98 },
  { key: "ai_systems",   val: 88 },
  { key: "leadership",   val: 95 },
  { key: "web3",         val: 85 },
] as const;

/* ── stack visual positions  [back, mid, front] ── */
const STACK = [
  { rotate: 8,  scale: 0.90, y: 26 }, // back  (si = 0)
  { rotate: -5, scale: 0.96, y: 14 }, // mid   (si = 1)
  { rotate: 2,  scale: 1,    y: 0  }, // front (si = 2)
];

/* ─────────────────────────────────────────────────────────
   Card 0: Portrait
   ───────────────────────────────────────────────────────── */
function PortraitCard() {
  return (
    <div style={{ position: "absolute", inset: 0,  display: "flex", flexDirection: "column" }}>
      {/* Photo */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <img
          src="https://devamit.co.in/amit-portrait.jpg"
          alt="Amit Chakraborty"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
        />
        
      </div>

      {/* Name plate */}

       <div className="absolute left-2.5 top-2.5 rounded-full bg-bg/85 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-ink-3 backdrop-blur-md">
              01
            </div>
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-bg/90 px-2 py-0.5 backdrop-blur-md">
              <span className="h-1 w-1 rounded-full bg-accent" />
              <span className="font-mono text-[8px] uppercase tracking-wider text-ink-2">
                Live
              </span>
            </div>
      <div  className="backdrop-blur-md" style={{ background: "rgba(255,255,255,0.8)", padding: "14px 18px 18px", position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
          <span
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22C55E",
              animation: "pm-pulse 2.4s ease-in-out infinite",
              flexShrink: 0,
            }}
            aria-hidden
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#22C55E", letterSpacing: "0.04em" }}>
            Available · Remote
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--ink-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
          Amit Chakraborty
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--signal)", marginTop: 3, letterSpacing: "0.01em" }}>
          Principal Architect · Kolkata, India
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card 1: Memory Graph
   ───────────────────────────────────────────────────────── */
function MemoryCard() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F0EEFF", overflow: "hidden" }}>
      <MemoryGraph
        density={18}
        mode="light"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Corner memory chips */}
      {MEMORY_CHIPS.map((chip) => (
        <div
          key={chip.label}
          style={{
            position: "absolute",
            ...chip.style,
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(8px)",
            borderRadius: 7,
            padding: "5px 9px",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-secondary)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <span style={{ color: "var(--signal)" }}>{chip.label}</span>
          <span style={{ color: "var(--ink-tertiary)" }}> · {chip.score}</span>
        </div>
      ))}

      {/* Bottom pill */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          borderRadius: 999,
          padding: "6px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--signal)",
          whiteSpace: "nowrap",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        mem0.search("amit") → 97 memories
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card 2: Skill Profile (dark terminal card)
   ───────────────────────────────────────────────────────── */
function StatsCard() {
  return (
    <div
      style={{
        position: "absolute", inset: 0,
        background: "#0F1115",
        padding: "24px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(124,58,237,0.5)", letterSpacing: "0.08em", marginBottom: 6 }}>
          // amit.profile
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="https://github.com/devamitch.png"
            alt=""
            aria-hidden
            style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Amit Chakraborty
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>
              Principal Architect
            </div>
          </div>
        </div>
      </div>

      {/* Skill bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        {SKILL_BARS.map(({ key, val }) => (
          <div key={key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
                {key}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--signal)", letterSpacing: "0.02em" }}>
                {val}
              </span>
            </div>
            <div style={{ height: 3, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${val}%`,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, rgba(124,58,237,0.7) 0%, rgba(124,58,237,1) 100%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Metrics strip */}
      <div
        style={{
          display: "flex",
          gap: 0,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {[
          { v: "18+", l: "Apps" },
          { v: "50K+", l: "DAU" },
          { v: "21", l: "Engineers" },
        ].map(({ v, l }, i) => (
          <div
            key={l}
            style={{
              flex: 1,
              textAlign: i === 1 ? "center" : i === 2 ? "right" : "left",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1, letterSpacing: "-0.03em" }}>
              {v}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card components indexed: 0=Portrait, 1=Memory, 2=Stats
   Initial order = [2, 1, 0]:
     si 0 (back)  → cardIdx 2 (Stats)
     si 1 (mid)   → cardIdx 1 (Memory)
     si 2 (front) → cardIdx 0 (Portrait)
   ───────────────────────────────────────────────────────── */
const CARD_COMPS = [ MemoryCard, StatsCard,PortraitCard,];

/* ─────────────────────────────────────────────────────────
   SwipeableStack
   ───────────────────────────────────────────────────────── */
function SwipeableStack() {
  // order[si] = cardIdx currently at stack position si
  const [order, setOrder] = useState<[number, number, number]>([  0,1,2]);
  const [exiting, setExiting]   = useState(false);
  const [exitDir, setExitDir]   = useState(0);
  const [dragging, setDragging] = useState(false);

  // Drag x MotionValue — drives real-time rotate during drag
  const x      = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const busyRef  = useRef(false);

  // advance: send the current front card to back, reveal next
  const advance = (dir: number) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setExitDir(dir);
    setExiting(true);
    setTimeout(() => {
      x.set(0);
      setExiting(false);
      // Rotate: [back, mid, front] → [front, back, mid]
      setOrder(([b, m, f]) => [f, b, m]);
      busyRef.current = false;
    }, 340);
  };

  const scheduleTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => advance(1), 5200);
  };

  useEffect(() => {
    scheduleTimer();
    return () => clearTimeout(timerRef.current);
    // advance refs stable — intentional empty dep array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    const decisive =
      Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 380;
    if (decisive) {
      advance(info.offset.x > 0 ? 1 : -1);
      scheduleTimer();
    }
    // else: framer-motion springs back via dragConstraints
  };

  return (
    <div
      style={{
        position: "relative",
        height: "clamp(400px, 46vw, 500px)",
        // extra horizontal margin so rotated cards don't clip
        margin: "0 8px",
      }}
    >
      {order.map((cardIdx, si) => {
        const Comp     = CARD_COMPS[cardIdx];
        const isFront  = si === 2;
        const pos      = STACK[si];
        const isActive = isFront && !exiting;

        const animTarget = isFront && exiting
          ? { x: exitDir * 720, rotate: exitDir * 26, opacity: 0, scale: 0.92 }
          : { rotate: pos.rotate, scale: pos.scale, y: pos.y, opacity: 1 };

        const transitionOpts = isFront && exiting
          ? { duration: 0.26, ease: [0.4, 0, 1, 1] as [number, number, number, number] }
          : { type: "spring" as const, stiffness: 280, damping: 26 };

        return (
          <motion.div
            key={cardIdx}
            drag={isActive ? "x" : false}
            dragElastic={0.12}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={isFront ? onDragEnd : undefined}
            animate={animTarget}
            transition={transitionOpts}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              overflow: "hidden",
              zIndex: si + 1,
              cursor: isActive ? (dragging ? "grabbing" : "grab") : "default",
              touchAction: isActive ? "none" : "auto",
              boxShadow: isFront
                ? "0 20px 56px rgba(124,58,237,0.13), 0 4px 16px rgba(0,0,0,0.07)"
                : "none",
              // Real-time drag x + rotation only on active front card
              ...(isActive ? { x, rotate } : {}),
            }}
          >
            <Comp />
          </motion.div>
        );
      })}

      {/* Dot indicators */}
      <div
        aria-label="Card navigation"
        style={{
          position: "absolute",
          bottom: -30,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {[0, 1, 2].map((cardIdx) => {
          const isCurrentFront = order[2] === cardIdx;
          return (
            <button
              key={cardIdx}
              type="button"
              onClick={() => { if (!busyRef.current) { advance(1); scheduleTimer(); } }}
              aria-label={`Card ${cardIdx + 1}`}
              style={{
                width:  isCurrentFront ? 20 : 6,
                height: 6,
                borderRadius: 999,
                background: isCurrentFront ? "var(--signal)" : "rgba(124,58,237,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.25s",
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>

      {/* Swipe hint — fades after first interaction */}
      {!dragging && !exiting && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -52,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-quaternary)",
            whiteSpace: "nowrap",
            letterSpacing: "0.04em",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          swipe to explore
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Hero section
   ───────────────────────────────────────────────────────── */
export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    import("gsap")
      .then(({ gsap }) => {
        const items = textRef.current?.querySelectorAll(".h-item");
        if (!items?.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" }
        );
      })
      .catch(() => {
        textRef.current?.querySelectorAll(".h-item").forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
        });
      });
  }, []);

  return (
    <section
      id="hero"
      style={{
        background: "#FFFFFF",
        paddingTop: "calc(54px + 64px)",
        paddingBottom: 88,
        paddingLeft: 24,
        paddingRight: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient tint */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "70%",
          background:
            "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(124,58,237,0.045) 0%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* ── LEFT: text content ── */}
        <div ref={textRef}>
          {/* Avatar + status */}
          <div
            className="h-item"
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26, opacity: 0 }}
          >
            <img
              src="https://github.com/devamitch.png"
              alt="Amit Chakraborty"
              width={44}
              height={44}
              style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--signal-light)",
                borderRadius: 999,
                padding: "5px 12px",
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#22C55E",
                  flexShrink: 0,
                  animation: "pm-pulse 2.4s ease-in-out infinite",
                }}
                aria-hidden
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--signal)",
                  letterSpacing: "0.02em",
                }}
              >
                Available · Remote
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1
            className="h-item"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.1rem, 4.8vw, 3.4rem)",
              color: "var(--ink-primary)",
              lineHeight: 1.06,
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: "-0.03em",
              opacity: 0,
            }}
          >
            Engineer who builds systems{" "}
            <span style={{ color: "var(--signal)" }}>that remember.</span>
          </h1>

          {/* Subtext */}
          <p
            className="h-item"
            style={{
              fontSize: 15,
              color: "var(--ink-secondary)",
              lineHeight: 1.68,
              marginBottom: 28,
              maxWidth: 400,
              opacity: 0,
            }}
          >
            React Native · AI/ML pipelines · Web3. 8+ years shipping production
            systems. Applying for Senior Frontend Engineer at{" "}
            <span style={{ color: "var(--signal)", fontWeight: 500 }}>mem0</span>.
          </p>

          {/* Trust badges */}
          <div
            className="h-item"
            style={{ display: "flex", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 0, opacity: 0 }}
          >
            {TRUST_BADGES.map((b, i) => (
              <div
                key={b.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  paddingRight: 18,
                  paddingLeft: i === 0 ? 0 : 18,
                  borderLeft: i === 0 ? "none" : "1px solid var(--edge-default)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.1rem, 2.2vw, 1.45rem)",
                    color: "var(--ink-primary)",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {b.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--ink-tertiary)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="h-item"
            style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22, opacity: 0 }}
          >
            <a
              href="#projects"
              style={{
                background: "var(--signal)",
                color: "#fff",
                fontSize: 13.5,
                fontWeight: 500,
                padding: "11px 22px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.18s",
                display: "inline-block",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              View Projects
            </a>
            <a
              href="/Amit Chakraborty.pdf"
              download
              style={{
                background: "var(--signal-light)",
                color: "var(--signal)",
                fontSize: 13.5,
                fontWeight: 500,
                padding: "11px 22px",
                borderRadius: 999,
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.18s",
                display: "inline-block",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.82";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Resume
            </a>
          </div>

          {/* Social icons */}
          <div
            className="h-item"
            style={{ display: "flex", alignItems: "center", gap: 2, opacity: 0 }}
          >
            {[
              { label: "GitHub",     href: "https://github.com/devamitch",        Icon: GithubIcon },
              { label: "LinkedIn",   href: "https://linkedin.com/in/devamitch",    Icon: LinkedinIcon },
              { label: "X / Twitter", href: "https://x.com/devamitch",            Icon: XIcon },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  color: "var(--ink-tertiary)",
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--signal)";
                  e.currentTarget.style.background = "var(--signal-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--ink-tertiary)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon />
              </a>
            ))}
            <span
              style={{
                marginLeft: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--ink-quaternary)",
                letterSpacing: "0.01em",
              }}
            >
              amit@devamit.co.in
            </span>
          </div>
        </div>

        {/* ── RIGHT: swipeable card stack ── */}
        <div className="hide-on-mobile" style={{ paddingBottom: 56 }}>
          <SwipeableStack />
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
        .h-item { opacity: 0; }
      `}</style>
    </section>
  );
}
