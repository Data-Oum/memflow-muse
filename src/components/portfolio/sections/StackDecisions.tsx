import { useInView } from "@/hooks/use-in-view";
import { AuroraBackground } from "@/components/ui/aurora-background";

const DECISIONS = [
  {
    layer: "Frontend State",
    chosen: "Zustand",
    rejected: "Redux",
    why: "80% less boilerplate. Shallow selectors built-in. Same power, zero ceremony.",
  },
  {
    layer: "Server State",
    chosen: "React Query",
    rejected: "Context / Redux",
    why: "Caching, background refetch, and optimistic updates out of the box.",
  },
  {
    layer: "Backend",
    chosen: "NestJS",
    rejected: "Express",
    why: "Forces architecture via DI and modules. Express allows chaos at scale.",
  },
  {
    layer: "Database",
    chosen: "PostgreSQL",
    rejected: "MySQL",
    why: "ACID, PostGIS, better query planner, window functions. No trade-offs.",
  },
  {
    layer: "Styling",
    chosen: "Tailwind + CSS Props",
    rejected: "CSS-in-JS",
    why: "Zero runtime overhead. Design tokens live in custom properties.",
  },
  {
    layer: "Mobile CI/CD",
    chosen: "Fastlane",
    rejected: "Manual / Scripts",
    why: "5 years in production. Nothing comes close for iOS cert management.",
  },
  {
    layer: "Mobile Storage",
    chosen: "MMKV",
    rejected: "AsyncStorage",
    why: "10× faster, synchronous reads. Built for offline-first mobile.",
  },
  {
    layer: "LLM at scale",
    chosen: "Gemini Flash",
    rejected: "GPT-4o",
    why: "10× cost advantage at production scale without sacrificing quality.",
  },
];

function DecisionRow({
  d,
  index,
  isLast,
}: {
  d: (typeof DECISIONS)[0];
  index: number;
  isLast: boolean;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.08);

  return (
    <div
      ref={ref}
      className="sd-row"
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr 1fr",
        alignItems: "baseline",
        gap: "0 32px",
        padding: "20px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : "translateY(6px)",
        transition: `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`,
      }}
    >
      {/* Layer label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "rgba(255,255,255,0.28)",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
        }}
      >
        {d.layer}
      </span>

      {/* Chosen vs rejected */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 600,
            color: "rgba(255,255,255,0.90)",
            letterSpacing: "-0.01em",
          }}
        >
          {d.chosen}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(124,58,237,0.55)",
            letterSpacing: "0.04em",
          }}
        >
          vs
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "rgba(255,255,255,0.22)",
            textDecoration: "line-through",
            textDecorationColor: "rgba(255,255,255,0.15)",
          }}
        >
          {d.rejected}
        </span>
      </div>

      {/* Why */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "rgba(255,255,255,0.38)",
          fontStyle: "italic",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {d.why}
      </p>
    </div>
  );
}

export function StackDecisions() {
  return (
    <AuroraBackground style={{ background: "var(--dark-bg)" }}>
      <section id="stack-decisions" style={{ padding: "64px 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--signal-bright)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Architecture Decisions
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.95)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Every choice has a reason.
              </h2>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 280,
                textAlign: "right",
              }}
            >
              Like mem0's persistent context — decisions stay documented, not forgotten.
            </p>
          </div>

          {/* Column headers */}
          <div
            className="sd-row sd-header"
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr 1fr",
              gap: "0 32px",
              padding: "0 0 12px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              marginBottom: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Layer
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Decision
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Rationale
            </span>
          </div>

          {/* Decision rows */}
          <div>
            {DECISIONS.map((d, i) => (
              <DecisionRow
                key={d.layer}
                d={d}
                index={i}
                isLast={i === DECISIONS.length - 1}
              />
            ))}
          </div>

          {/* Meta-principle — clean, no box */}
          <div
            style={{
              marginTop: 48,
              paddingTop: 36,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 2,
                height: 48,
                borderRadius: 999,
                background: "var(--signal)",
                flexShrink: 0,
                opacity: 0.7,
                marginTop: 2,
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--signal-bright)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                  opacity: 0.8,
                }}
              >
                Meta-principle
              </div>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.65,
                  margin: 0,
                  letterSpacing: "-0.01em",
                  maxWidth: 580,
                }}
              >
                Production survival → team maintainability → simplicity → scalability → elegance.
                In that order. Always.
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 680px) {
            .sd-row { grid-template-columns: 1fr !important; gap: 4px 0 !important; padding: 16px 0 !important; }
            .sd-header { display: none !important; }
          }
        `}</style>
      </section>
    </AuroraBackground>
  );
}
