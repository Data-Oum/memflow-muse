import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── icons ── */
const GithubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const XIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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
  { label: "react_native", score: "0.98", style: { top: 16, left: 14 } },
  { label: "ai_pipelines", score: "0.95", style: { top: 16, right: 14 } },
  { label: "leadership",   score: "0.98", style: { bottom: 56, left: 14 } },
  { label: "web3",         score: "0.91", style: { bottom: 56, right: 14 } },
] as const;

const SKILL_BARS = [
  { key: "react_native", val: 98 },
  { key: "ai_systems",   val: 88 },
  { key: "leadership",   val: 95 },
  { key: "web3",         val: 85 },
] as const;

const STACK = [
  { rotate: 8,  scale: 0.90, y: 26 }, // back
  { rotate: -5, scale: 0.96, y: 14 }, // mid
  { rotate: 2,  scale: 1,    y: 0  }, // front
];

/* ─────────────────────────────────────────────────────────
   Card 0: Portrait — hero gradient treatment
   ───────────────────────────────────────────────────────── */
function PortraitCard() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Photo */}
      <img
        src="https://devamit.co.in/amit-portrait.jpg"
        alt="Amit Chakraborty"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top center",
          display: "block",
        }}
      />

      {/* Purple ambient tint — top-left corner light leak */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(155deg, rgba(124,58,237,0.22) 0%, transparent 55%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* ★ THE MAIN GRADIENT — semi-transparent top → opaque bottom */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0)      0%,
            rgba(0,0,0,0.01)   28%,
            rgba(6,2,20,0.18)  46%,
            rgba(6,2,20,0.62)  64%,
            rgba(6,2,20,0.90)  80%,
            rgba(6,2,20,0.98)  100%
          )`,
          pointerEvents: "none",
        }}
      />

      {/* Top-left badge */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 14,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px) saturate(1.8)",
          WebkitBackdropFilter: "blur(14px) saturate(1.8)",
          border: "0.5px solid rgba(255,255,255,0.14)",
          borderRadius: 999,
          padding: "4px 11px",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "rgba(255,255,255,0.50)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        01 / portfolio
      </div>

      {/* Top-right live badge */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          background: "rgba(0,0,0,0.40)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "0.5px solid rgba(255,255,255,0.10)",
          borderRadius: 999,
          padding: "4px 11px",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "rgba(255,255,255,0.48)",
          letterSpacing: "0.06em",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#22C55E",
            boxShadow: "0 0 8px rgba(34,197,94,0.85)",
            animation: "pm-pulse 2.4s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        Live
      </div>

      {/* Footer content */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          padding: "20px 20px 22px",
        }}
      >
        {/* Available pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(34,197,94,0.10)",
            border: "0.5px solid rgba(34,197,94,0.25)",
            borderRadius: 999,
            padding: "4px 11px",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#22C55E",
              boxShadow: "0 0 6px rgba(34,197,94,0.9)",
              animation: "pm-pulse 2.4s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9.5,
              color: "#22C55E",
              letterSpacing: "0.04em",
            }}
          >
            Available · Remote
          </span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 21,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Amit Chakraborty
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(155,120,255,0.85)",
            marginTop: 4,
            letterSpacing: "0.03em",
          }}
        >
          Principal Architect · Kolkata, India
        </div>

        {/* Social icons */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[
            { label: "GitHub",   href: "https://github.com/devamitch",      Icon: GithubIcon },
            { label: "LinkedIn", href: "https://linkedin.com/in/devamitch",  Icon: LinkedinIcon },
            { label: "X",        href: "https://x.com/devamitch",           Icon: XIcon },
          ].map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                color: "rgba(255,255,255,0.55)",
                transition: "background 0.2s, border-color 0.2s",
                flexShrink: 0,
              }}
            >
              <Icon />
            </a>
          ))}
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
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#F0EEFF",
      }}
    >
      {/* Ambient gradient bg */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 70% at 60% 30%, rgba(124,58,237,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(99,44,230,0.08) 0%, transparent 60%)
          `,
          pointerEvents: "none",
        }}
      />

      {/* Pseudo network nodes — simple circles */}
      {[
        { w: 52, h: 52, top: "38%", left: "42%", delay: "0s" },
        { w: 28, h: 28, top: "22%", left: "20%", delay: "0.6s" },
        { w: 20, h: 20, top: "55%", left: "70%", delay: "1.1s" },
        { w: 16, h: 16, top: "70%", left: "28%", delay: "0.3s" },
        { w: 24, h: 24, top: "18%", left: "65%", delay: "0.8s" },
        { w: 14, h: 14, top: "62%", left: "55%", delay: "1.5s" },
      ].map((n, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            width: n.w,
            height: n.h,
            top: n.top,
            left: n.left,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.20)",
            animation: `pm-nodepulse 3s ease-in-out ${n.delay} infinite`,
          }}
        />
      ))}

      {/* Corner memory chips */}
      {MEMORY_CHIPS.map((chip) => (
        <div
          key={chip.label}
          style={{
            position: "absolute",
            ...chip.style,
            background: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(16px) saturate(2)",
            WebkitBackdropFilter: "blur(16px) saturate(2)",
            border: "0.5px solid rgba(124,58,237,0.15)",
            borderRadius: 9,
            padding: "6px 10px",
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            boxShadow: "0 4px 16px rgba(124,58,237,0.08)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <span style={{ color: "var(--signal)" }}>{chip.label}</span>
          <span style={{ color: "rgba(0,0,0,0.35)" }}> · {chip.score}</span>
        </div>
      ))}

      {/* Bottom pill */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px) saturate(2)",
          WebkitBackdropFilter: "blur(16px) saturate(2)",
          border: "0.5px solid rgba(124,58,237,0.18)",
          borderRadius: 999,
          padding: "7px 16px",
          fontFamily: "var(--font-mono)",
          fontSize: 9.5,
          color: "var(--signal)",
          whiteSpace: "nowrap",
          boxShadow: "0 4px 20px rgba(124,58,237,0.12)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        mem0.search("amit") → 97 memories
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card 2: Stats — dark terminal
   ───────────────────────────────────────────────────────── */
function StatsCard() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0C0C14",
        overflow: "hidden",
      }}
    >
      {/* Background purple glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -40, right: -40,
          width: 160, height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "22px 20px 20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Label */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(124,58,237,0.45)",
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          // amit.profile
        </div>

        {/* Avatar + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 22,
          }}
        >
          <img
            src="https://github.com/devamitch.png"
            alt=""
            aria-hidden
            style={{
              width: 34, height: 34, borderRadius: "50%",
              objectFit: "cover",
              border: "1.5px solid rgba(124,58,237,0.30)",
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 13.5,
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Amit Chakraborty
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(255,255,255,0.32)",
                marginTop: 2,
              }}
            >
              Principal Architect
            </div>
          </div>
        </div>

        {/* Skill bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 13, flex: 1 }}>
          {SKILL_BARS.map(({ key, val }) => (
            <div key={key}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    color: "rgba(255,255,255,0.38)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {key}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9.5,
                    color: "var(--signal)",
                  }}
                >
                  {val}
                </span>
              </div>
              <div
                style={{
                  height: 2.5,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${val}%`,
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, rgba(124,58,237,0.6) 0%, rgba(124,58,237,1) 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Metrics strip */}
        <div
          style={{
            borderTop: "0.5px solid rgba(255,255,255,0.06)",
            paddingTop: 14,
            marginTop: 16,
            display: "flex",
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
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {v}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 8.5,
                  color: "rgba(255,255,255,0.28)",
                  marginTop: 3,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Card order: [back, mid, front] */
const CARD_COMPS = [PortraitCard, MemoryCard, StatsCard];

/* ─────────────────────────────────────────────────────────
   SwipeableStack
   ───────────────────────────────────────────────────────── */
function SwipeableStack() {
  const [order, setOrder] = useState<[number, number, number]>([2, 1, 0]);
  const [exiting, setExiting] = useState(false);
  const [exitDir, setExitDir] = useState(0);
  const [dragging, setDragging] = useState(false);

  const x      = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const busyRef  = useRef(false);

  const advance = (dir: number) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setExitDir(dir);
    setExiting(true);
    setTimeout(() => {
      x.set(0);
      setExiting(false);
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
  };

  return (
    <div style={{ position: "relative", height: "clamp(400px, 46vw, 490px)", margin: "0 8px" }}>
      {order.map((cardIdx, si) => {
        const Comp    = CARD_COMPS[cardIdx];
        const isFront = si === 2;
        const pos     = STACK[si];
        const isActive = isFront && !exiting;

        const animTarget =
          isFront && exiting
            ? { x: exitDir * 720, rotate: exitDir * 26, opacity: 0, scale: 0.92 }
            : { rotate: pos.rotate, scale: pos.scale, y: pos.y, opacity: 1 };

        const transitionOpts =
          isFront && exiting
            ? { duration: 0.26, ease: [0.4, 0, 1, 1] as [number, number, number, number] }
            : { type: "spring" as const, stiffness: 280, damping: 26 };

        /* Front card shadow depends on which card is showing */
        const frontShadow =
          cardIdx === 0
            ? "0 32px 80px rgba(0,0,0,0.70), 0 0 0 0.5px rgba(255,255,255,0.08), inset 0 0.5px 0 rgba(255,255,255,0.12)"
            : cardIdx === 1
            ? "0 24px 70px rgba(0,0,0,0.50), 0 0 0 0.5px rgba(255,255,255,0.06), 0 0 40px rgba(124,58,237,0.08)"
            : "0 24px 70px rgba(0,0,0,0.60), 0 0 0 0.5px rgba(255,255,255,0.06)";

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
              borderRadius: 24,
              overflow: "hidden",
              zIndex: si + 1,
              cursor: isActive ? (dragging ? "grabbing" : "grab") : "default",
              touchAction: isActive ? "none" : "auto",
              boxShadow: isFront ? frontShadow : "none",
              ...(isActive ? { x, rotate } : {}),
            }}
          >
            <Comp />
          </motion.div>
        );
      })}

      {/* Dots */}
      <div
        aria-label="Card navigation"
        style={{
          position: "absolute",
          bottom: -32,
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
                width: isCurrentFront ? 20 : 6,
                height: 6,
                borderRadius: 999,
                background: isCurrentFront ? "var(--signal)" : "rgba(124,58,237,0.22)",
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

      {!dragging && !exiting && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -52,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            color: "var(--ink-quaternary)",
            whiteSpace: "nowrap",
            letterSpacing: "0.06em",
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
   Hero
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
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0, right: 0,
          width: "50%", height: "70%",
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
        {/* ── LEFT ── */}
        <div ref={textRef}>
          <div
            className="h-item"
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26, opacity: 0 }}
          >
            <img
              src="https://github.com/devamitch.png"
              alt="Amit Chakraborty"
              width={44}
              height={44}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                objectFit: "cover", flexShrink: 0,
              }}
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
                  animation: "pm-pulse 2.4s ease-in-out infinite",
                  flexShrink: 0,
                }}
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
                display: "inline-block",
                letterSpacing: "-0.01em",
                transition: "opacity 0.2s, transform 0.18s",
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
                display: "inline-block",
                letterSpacing: "-0.01em",
                transition: "opacity 0.2s, transform 0.18s",
              }}
            >
              Resume
            </a>
          </div>

          <div
            className="h-item"
            style={{ display: "flex", alignItems: "center", gap: 2, opacity: 0 }}
          >
            {[
              { label: "GitHub",      href: "https://github.com/devamitch",       Icon: GithubIcon },
              { label: "LinkedIn",    href: "https://linkedin.com/in/devamitch",   Icon: LinkedinIcon },
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
                  width: 34, height: 34,
                  borderRadius: 9,
                  color: "var(--ink-tertiary)",
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
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

        {/* ── RIGHT: cards ── */}
        <div className="hide-on-mobile" style={{ paddingBottom: 56 }}>
          <SwipeableStack />
        </div>
      </div>

      <style>{`
        @keyframes pm-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.55;transform:scale(0.8);} }
        @keyframes pm-nodepulse { 0%,100%{transform:scale(1);opacity:0.7;} 50%{transform:scale(1.08);opacity:1;} }
        @media (max-width: 720px) { .hero-grid { grid-template-columns: 1fr !important; } }
        .h-item { opacity: 0; }
      `}</style>
    </section>
  );
}