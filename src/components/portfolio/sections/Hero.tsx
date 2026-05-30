import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const PORTRAIT_URL = "https://devamit.co.in/amit-portrait.jpg";

const STATS = [
  { v: "8+", l: "Years" },
  { v: "18+", l: "Apps shipped" },
  { v: "21", l: "Engineers led" },
  { v: "50K+", l: "Peak DAU" },
];

export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("gsap")
      .then(({ gsap }) => {
        const items = textRef.current?.querySelectorAll(".h-item");

        // CRITICAL: Hide elements via gsap.set BEFORE animating.
        // Elements are visible by default in JSX — so if GSAP never loads,
        // the hero still renders content instead of a blank page.
        if (items?.length) {
          gsap.set(items, { opacity: 0, y: 22 });
        }
        if (imageRef.current) {
          gsap.set(imageRef.current, { opacity: 0, x: 48, scale: 0.94 });
        }
        if (scrollRef.current) {
          gsap.set(scrollRef.current, { opacity: 0 });
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Portrait slides in from right
        tl.fromTo(
          imageRef.current,
          { opacity: 0, x: 48, scale: 0.94 },
          { opacity: 1, x: 0, scale: 1, duration: 0.9 },
        );

        // Text items stagger up
        if (items?.length) {
          tl.fromTo(
            items,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 },
            "-=0.6",
          );
        }

        // Scroll indicator fades in last
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          "-=0.2",
        );
      })
      .catch(() => {
        // GSAP failed to load — ensure everything is visible
        textRef.current?.querySelectorAll(".h-item").forEach((item) => {
          (item as HTMLElement).style.opacity = "1";
        });
        if (imageRef.current) imageRef.current.style.opacity = "1";
        if (scrollRef.current) scrollRef.current.style.opacity = "1";
      });
  }, []);

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
      {/* Ambient glow */}
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
        {/* Left: text */}
        <div ref={textRef} style={{ maxWidth: 600 }}>
          {/* Availability badge */}
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
            }}
          >
            <span
              className="pm-pulse"
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--signal)",
              }}
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
            }}
          >
            Principal Architect{" "}
            <span style={{ color: "var(--signal)" }}>&middot;</span> AI-Native{" "}
            <span style={{ color: "var(--signal)" }}>&middot;</span> React{" "}
            <span style={{ color: "var(--signal)" }}>&middot;</span> mem0
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
            }}
          >
            8+ years building production-grade AI, mobile, and web systems.
            Founding Engineer. 21 engineers led.
          </p>

          {/* Stats */}
          <div
            className="h-item"
            style={{
              display: "flex",
              gap: 0,
              marginBottom: 36,
              flexWrap: "wrap",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={s.l}
                style={{
                  padding: "0 24px",
                  borderLeft:
                    i === 0 ? "none" : "1px solid var(--edge-default)",
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
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 36,
            }}
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
                transition:
                  "box-shadow 0.25s var(--ease), transform 0.25s var(--ease)",
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
              View My Work
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
              amit@devamit.co.in
            </a>
          </div>

          {/* Decorative mem0 snippet */}
          <div
            className="h-item"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1A1D23",
              borderRadius: "var(--r-sm)",
              padding: "7px 14px",
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
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "#9CA3AF",
              }}
            >
              <span style={{ color: "#16A07C" }}>mem0</span>
              <span style={{ color: "#8B5CF6" }}>.add</span>
              <span style={{ color: "#9CA3AF" }}>(</span>
              <span style={{ color: "#FB923C" }}>
                &quot;amit is available now&quot;
              </span>
              <span style={{ color: "#9CA3AF" }}>)</span>
            </span>
          </div>
        </div>

        {/* Right: portrait */}
        <div ref={imageRef} className="hide-on-mobile">
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
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
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
        <ChevronDown
          className="pm-bounce"
          aria-hidden
          size={14}
          color="var(--ink-tertiary)"
        />
      </div>
    </section>
  );
}
