import { Section } from "../ui/Section";
import { Label } from "../ui/Label";
import { SpotlightCard } from "@/components/ui/spotlight";

const PRINCIPLES = [
  {
    index: "01",
    title: "Memory-First Design",
    body: "State is ephemeral. Memory is persistent. I architect systems around long-lived memory graphs — user context, preferences, and behavioral patterns that compound over time, not session-scoped state that dies on refresh.",
  },
  {
    index: "02",
    title: "AI as Co-Pilot, Not Crutch",
    body: 'Claude Code, Cursor, Gemini — I use them daily. But the architecture decisions, the trade-off judgments, the "this will break at 50K DAU" instinct — that\'s 8 years of production muscle memory no model replaces.',
  },
  {
    index: "03",
    title: "End-to-End Ownership",
    body: "From design system tokens to App Store submissions. From database schema to user feedback loops. I don't hand off — I ship the full vertical, then instrument it to learn what to ship next.",
  },
] as const;

export function Philosophy() {
  return (
    <Section id="about">
      <Label>memory.get(&quot;principles&quot;)</Label>

      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 600,
          color: "var(--ink-primary)",
          margin: "12px 0 32px",
          lineHeight: 1.15,
        }}
      >
        How I think about building.
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {PRINCIPLES.map((p) => (
          <SpotlightCard
            key={p.title}
            spotlightSize={240}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--edge-default)",
              borderRadius: "var(--r-lg)",
              padding: 24,
              transition: "border-color 0.24s var(--ease)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--signal)",
                marginBottom: 16,
              }}
            >
              [{p.index}]
            </div>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                color: "var(--ink-primary)",
                marginBottom: 10,
              }}
            >
              {p.title}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {p.body}
            </p>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
