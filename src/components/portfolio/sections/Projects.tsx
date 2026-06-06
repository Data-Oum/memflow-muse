import { useInView } from "@/hooks/use-in-view";
import { ExternalLink } from "lucide-react";
import { PROJECTS, type Project } from "../data/projects";

function ProjectCard({ p, onSelect }: { p: Project; onSelect: (p: Project) => void }) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.15);

  return (
    <div
      ref={ref}
      onClick={() => onSelect(p)}
      style={{
        position: "relative",
        cursor: "pointer",
        background: "#FFFFFF",
        borderRadius: 16,
        padding: "20px 20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        overflow: "hidden",
        transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1), background 0.15s",
        opacity: isInView ? 1 : 0,
        transform: isInView ? "none" : "translateY(10px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.background = "#FDFCFF";
        e.currentTarget.style.boxShadow = `0 8px 32px -8px ${p.signal}22, 0 2px 8px rgba(0,0,0,0.04)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.background = "#FFFFFF";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Colored top bar — signal accent */}
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2.5,
          backgroundColor: p.signal,
          transformOrigin: "left",
          transform: isInView ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.85s cubic-bezier(0.16,1,0.3,1)",
          borderRadius: "16px",
          opacity: isInView ? 0.7 : 0,
        }}
      /> */}

      {/* ID + score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--ink-tertiary)",
            letterSpacing: "0.04em",
          }}
        >
          {p.id}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: p.signal,
            letterSpacing: "0.02em",
          }}
        >
          {p.score.toFixed(2)}
        </span>
      </div>

      {/* Category */}
      <span
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          padding: "3px 8px",
          borderRadius: 999,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: p.signal,
          background: `color-mix(in srgb, ${p.signal} 8%, white)`,
          letterSpacing: "0.04em",
        }}
      >
        {p.category}
      </span>

      {/* Name */}
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: 16,
          color: "var(--ink-primary)",
          lineHeight: 1.25,
          margin: 0,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {p.name}
        <ExternalLink size={12} style={{ color: "var(--ink-tertiary)", flexShrink: 0, opacity: 0.45 }} />
      </h3>

      {/* Tagline */}
      <p style={{ fontSize: 13, color: "var(--ink-secondary)", lineHeight: 1.5, margin: 0 }}>
        {p.tagline}
      </p>

      {/* Stack tags — no borders */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: "auto" }}>
        {p.stack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              padding: "2px 7px",
              borderRadius: 999,
              color: "var(--ink-tertiary)",
              background: "#F3F4F6",
            }}
          >
            {tech}
          </span>
        ))}
        {p.stack.length > 3 && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              padding: "2px 7px",
              borderRadius: 999,
              color: "var(--ink-tertiary)",
              background: "#F3F4F6",
            }}
          >
            +{p.stack.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 12,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-tertiary)" }}>
          {p.year}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: p.signal,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          Details →
        </span>
      </div>
    </div>
  );
}

export function Projects({ onSelect }: { onSelect: (p: Project) => void }) {
  return (
    <section
      id="projects"
      style={{ background: "#F7F8FA", padding: "56px 24px 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--signal)",
              letterSpacing: "0.04em",
              marginBottom: 10,
              opacity: 0.75,
            }}
          >
            mem0.search("amit_projects", limit: 6)
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
              fontWeight: 700,
              color: "var(--ink-primary)",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Shipped systems.
          </h2>
        </div>

        {/* Grid */}
        <div
          className="projects-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} p={p} onSelect={onSelect} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .projects-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .projects-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
