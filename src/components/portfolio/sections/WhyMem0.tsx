import { useInView } from "@/hooks/use-in-view";

const PARALLELS = [
  {
    num: "01",
    concept: "mem0 adds persistent memories to AI",
    parallel: "I retain architectural context across every team and tool",
    note: "No context lost as engineers rotate or join. Decisions stay traceable years later.",
  },
  {
    num: "02",
    concept: "mem0 retrieves relevant context at runtime",
    parallel: "I retrieve proven patterns under pressure — not guesses",
    note: "Production-tested across 18+ apps. Institutional memory that travels with me.",
  },
  {
    num: "03",
    concept: "mem0 makes AI feel personalized",
    parallel: "I make systems shaped to the team's actual reality",
    note: "Architecture built for the engineer who maintains it six months from now.",
  },
];

const SIGNALS = [
  { label: "AI-native workflow", value: "Claude Code daily" },
  { label: "Role target", value: "Senior Frontend Engineer" },
  { label: "Location", value: "India · Remote" },
  { label: "Availability", value: "Immediate" },
];

function ParallelRow({
  item,
  index,
  isLast,
}: {
  item: (typeof PARALLELS)[0];
  index: number;
  isLast: boolean;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.12);

  return (
    <div
      ref={ref}
      className="why-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "start",
        gap: "0 56px",
        padding: "36px 0",
        borderBottom: isLast ? "none" : "1px solid #F0F2F5",
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : "translateY(12px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      {/* Left: mem0 concept */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(124,58,237,0.40)",
            letterSpacing: "0.04em",
            marginTop: 4,
            flexShrink: 0,
            userSelect: "none",
          }}
        >
          {item.num}
        </span>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--signal)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
              opacity: 0.75,
            }}
          >
            mem0
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-tertiary)",
              fontStyle: "italic",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            "{item.concept}"
          </p>
        </div>
      </div>

      {/* Right: Amit parallel */}
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-quaternary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Amit
        </div>
        <p
          style={{
            fontSize: 17,
            fontWeight: 600,
            color: "var(--ink-primary)",
            lineHeight: 1.45,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
          }}
        >
          {item.parallel}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-tertiary)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {item.note}
        </p>
      </div>
    </div>
  );
}

export function WhyMem0() {
  return (
    <section
      id="why"
      style={{
        background: "#FFFFFF",
        padding: "80px 24px 88px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--signal)",
              letterSpacing: "0.05em",
              marginBottom: 14,
              opacity: 0.75,
            }}
          >
            mem0.similarity("amit_experience", "mem0_mission") → 0.97
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              color: "var(--ink-primary)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: "0 0 12px",
            }}
          >
            Why mem0. Not just any AI company.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--ink-secondary)",
              lineHeight: 1.65,
              maxWidth: 540,
              margin: 0,
            }}
          >
            Every system I've built has a memory problem at its core.
            mem0 is building the infrastructure that would have solved all of them.
          </p>
        </div>

        {/* Column headers */}
        <div
          className="why-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 56px",
            padding: "24px 0 0",
            borderBottom: "1px solid #E5E9F0",
            marginBottom: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-quaternary)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              paddingLeft: 26,
            }}
          >
            mem0 principle
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--ink-quaternary)",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            How Amit lives it
          </span>
        </div>

        {/* Parallel rows */}
        <div>
          {PARALLELS.map((item, i) => (
            <ParallelRow
              key={item.num}
              item={item}
              index={i}
              isLast={i === PARALLELS.length - 1}
            />
          ))}
        </div>

        {/* Signal grid + CTA */}
        <div
          style={{
            marginTop: 56,
            paddingTop: 40,
            borderTop: "1px solid #F0F2F5",
            display: "flex",
            gap: 40,
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {/* Key signals */}
          <div className="why-signals" style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
            {SIGNALS.map(({ label, value }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "var(--ink-quaternary)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <p
              style={{
                fontSize: 13,
                color: "var(--ink-tertiary)",
                margin: 0,
                lineHeight: 1.5,
                maxWidth: 200,
              }}
            >
              Built this portfolio end-to-end with Claude Code.
            </p>
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--signal)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                padding: "10px 20px",
                borderRadius: 999,
                textDecoration: "none",
                letterSpacing: "-0.01em",
                flexShrink: 0,
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Let's connect
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .why-row { grid-template-columns: 1fr !important; gap: 16px !important; padding: 24px 0 !important; }
          .why-signals { gap: 20px !important; }
        }
      `}</style>
    </section>
  );
}
