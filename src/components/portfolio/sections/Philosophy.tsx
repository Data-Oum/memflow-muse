import { Section } from "../ui/Section";
import { Label } from "../ui/Label";

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
      <Label>{'[ memory.get({ entity: "principles" }) ]'}</Label>

      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 36,
          fontWeight: 400,
          color: "var(--ink-primary)",
          margin: "12px 0 48px",
          lineHeight: 1.2,
        }}
      >
        <i>How I think</i> about building.
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="pm-card">
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--signal)",
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: "1px solid var(--signal-border)",
                display: "inline-block",
              }}
            >
              [{p.index}]
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--ink-primary)",
                marginBottom: 8,
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
          </div>
        ))}
      </div>
    </Section>
  );
}
