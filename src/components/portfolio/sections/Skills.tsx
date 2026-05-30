import { Section } from "../ui/Section";
import { Label } from "../ui/Label";
import { CLUSTERS, type Cluster } from "../data/skills";
import { useInView } from "@/hooks/use-in-view";

function SkillBar({ score, color, animate }: { score: number; color: string; animate: boolean }) {
  return (
    <div
      style={{
        width: "100%",
        height: 3,
        borderRadius: "var(--r-full)",
        background: "var(--bg-raised)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: animate ? `${score}%` : "0%",
          background: color,
          borderRadius: "var(--r-full)",
          transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className="pm-card" style={{ padding: 24 }}>
      <span
        style={{
          display: "inline-block",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: cluster.color,
          background: cluster.ghost,
          padding: "4px 10px",
          borderRadius: "var(--r-full)",
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        {cluster.label}
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cluster.skills.map((skill, i) => (
          <div
            key={skill.name}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(8px)",
              transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--ink-primary)",
                  fontWeight: 500,
                }}
              >
                {skill.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: cluster.color,
                  fontWeight: 600,
                }}
              >
                {skill.score}
              </span>
            </div>

            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--ink-tertiary)",
                display: "block",
                marginBottom: 6,
              }}
            >
              {skill.note}
            </span>

            <SkillBar score={skill.score} color={cluster.color} animate={inView} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <Label>{"[ memory.getCategories() ]"}</Label>

      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 36,
          fontWeight: 400,
          color: "var(--ink-primary)",
          margin: "12px 0 8px",
          lineHeight: 1.2,
        }}
      >
        <i>Technical</i> memory index.
      </h2>

      <p
        style={{
          fontSize: 14,
          color: "var(--ink-secondary)",
          lineHeight: 1.6,
          margin: "0 0 48px",
          maxWidth: 520,
        }}
      >
        Proficiency mapped as retrieval scores — the higher the score, the faster I ship production
        code in that domain.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {CLUSTERS.map((cluster) => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </Section>
  );
}
