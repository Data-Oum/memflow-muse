import { MemoryGraph } from "@/components/portfolio/ui/MemoryGraph";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

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
        paddingBottom: 72,
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
        {/* ── LEFT ── */}
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
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
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
              { label: "GitHub", href: "https://github.com/devamitch", Icon: GithubIcon },
              { label: "LinkedIn", href: "https://linkedin.com/in/devamitch", Icon: LinkedinIcon },
              { label: "X / Twitter", href: "https://x.com/devamitch", Icon: XIcon },
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

        {/* ── RIGHT: stacked cards ── */}
        <div
          className="hide-on-mobile"
          style={{
            position: "relative",
            height: "clamp(400px, 46vw, 500px)",
          }}
        >
          {/* Back card — MemoryGraph */}
          <motion.div
            initial={{ rotate: -4, scale: 0.94, y: 16 }}
            animate={{ rotate: -3, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              background: "#F0EEFF",
              overflow: "hidden",
              transformOrigin: "bottom right",
              zIndex: 1,
            }}
          >
            <MemoryGraph
              density={18}
              mode="light"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />

            {/* Memory chips on back card */}
            {MEMORY_CHIPS.map((chip, i) => (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
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
              </motion.div>
            ))}

            {/* Bottom label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
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
            </motion.div>
          </motion.div>

          {/* Front card — Portrait */}
          <motion.div
            initial={{ rotate: 5, y: 24, x: -12 }}
            animate={{ rotate: 2.5, y: 12, x: -20 }}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.08 }}
            style={{
              position: "absolute",
              top: 20,
              left: 40,
              width: "85%",
              bottom: 20,
              borderRadius: 20,
              background: "#fff",
              overflow: "hidden",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 12px 40px rgba(124,58,237,0.10), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {/* Photo — full bleed */}
            <div style={{ flex: 1, overflow: "hidden", }}>
              <img
                src="https://devamit.co.in/amit-portrait.jpg"
                alt="Amit Chakraborty"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
            {/* Name plate */}
            <div
              style={{
                padding: "14px 16px",
                // background: "#fff",
                // borderTop: "1px solid #F3F4F6",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--ink-primary)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                Amit Chakraborty
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--signal)",
                  marginTop: 3,
                  letterSpacing: "0.02em",
                }}
              >
                Principal Architect · Kolkata
              </div>
            </div>
          </motion.div>
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
