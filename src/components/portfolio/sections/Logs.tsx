import { Section } from "../ui/Section";
import { Label } from "../ui/Label";
import { Terminal } from "../ui/Terminal";
import { LOGS } from "../data/logs";

export function Logs() {
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
        Not &apos;I used AI&apos;. Deliberate, logged, reviewable engineering decisions.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {LOGS.map((l) => (
          <Terminal key={l.filename} log={l} />
        ))}
      </div>
    </Section>
  );
}
