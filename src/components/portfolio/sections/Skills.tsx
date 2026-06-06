import { useInView } from "@/hooks/use-in-view";
import { AuroraBackground } from "@/components/ui/aurora-background";

const DOMAINS = [
  { name: "React Native", score: 98, label: "Mobile" },
  { name: "Frontend (React)", score: 94, label: "Web" },
  { name: "Backend (NestJS)", score: 90, label: "API" },
  { name: "AI / RAG Systems", score: 88, label: "AI/ML" },
  { name: "Web3 / Solidity", score: 85, label: "Chain" },
  { name: "Engineering Lead", score: 98, label: "Lead" },
];

const STACK_GROUPS = [
  {
    label: "Mobile",
    tags: ["React Native", "Expo", "Reanimated 3", "JSI / TurboModules", "Fastlane"],
  },
  {
    label: "AI",
    tags: ["Claude API", "Gemini 2.0", "RAG Pipelines", "MediaPipe", "Pinecone"],
  },
  {
    label: "Web",
    tags: ["Next.js 16", "React 19", "Zustand", "React Query", "Tailwind v4"],
  },
  {
    label: "Data",
    tags: ["PostgreSQL", "Supabase", "Redis", "MongoDB", "PostGIS"],
  },
  {
    label: "DevOps",
    tags: ["AWS", "Docker", "GitHub Actions", "Vercel", "Sentry"],
  },
];

const PREFERRED = new Set(["React Native", "Claude API", "Gemini 2.0", "Next.js 16", "RAG Pipelines"]);

function DomainRow({ name, score, label }: { name: string; score: number; label: string }) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.88)", letterSpacing: "-0.01em" }}>
            {name}
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--signal-bright)",
            letterSpacing: "0.01em",
            fontWeight: 600,
          }}
        >
          {score}
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: isInView ? `${score}%` : "0%",
            background: "linear-gradient(90deg, var(--signal) 0%, var(--signal-bright) 100%)",
            borderRadius: 999,
            transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <AuroraBackground
      style={{ background: "var(--dark-bg)" }}
    >
    <section
      id="skills"
      style={{ padding: "56px 24px 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--signal-bright)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            mem0.getCategories("amit_skills")
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Technical memory index.
          </h2>
        </div>

        {/* 2-col layout */}
        <div
          className="skills-cols"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          {/* Left: domain score bars inside card */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              padding: "24px 22px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(255,255,255,0.30)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 22,
              }}
            >
              Domain proficiency
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {DOMAINS.map((d) => (
                <DomainRow key={d.name} {...d} />
              ))}
            </div>
          </div>

          {/* Right: stack tag cloud */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(255,255,255,0.30)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 22,
              }}
            >
              Proven stack
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {STACK_GROUPS.map((group) => (
                <div key={group.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--signal-bright)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 9,
                      opacity: 0.8,
                    }}
                  >
                    {group.label}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {group.tags.map((tag) => {
                      const preferred = PREFERRED.has(tag);
                      return (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 11,
                            padding: "4px 10px",
                            height: 28,
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: 999,
                            background: preferred ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.05)",
                            border: preferred
                              ? "1px solid rgba(124,58,237,0.35)"
                              : "1px solid rgba(255,255,255,0.08)",
                            color: preferred ? "var(--signal-bright)" : "rgba(255,255,255,0.52)",
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 680px) {
            .skills-cols { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </div>
    </section>
    </AuroraBackground>
  );
}
