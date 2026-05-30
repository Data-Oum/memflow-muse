import type { CSSProperties } from "react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Section } from "../ui/Section";
import { Label } from "../ui/Label";
import { PROJECTS, type Project } from "../data/projects";
import { useInView } from "@/hooks/use-in-view";

function ProjectCard({
  p,
  onSelect,
}: {
  p: Project;
  onSelect: (p: Project) => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.18);
  const visibleStack = p.stack.slice(0, 4);
  const overflowCount = p.stack.length - visibleStack.length;

  return (
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(p);
        }
      }}
      style={
        {
          "--project-color": p.signal,
          background: "var(--bg-surface)",
          border: "1px solid var(--edge-default)",
          borderRadius: "var(--r-lg)",
          padding: 24,
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "transform 0.25s var(--ease), box-shadow 0.25s var(--ease)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        } as CSSProperties
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${p.signal}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top accent bar */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: p.signal,
        }}
      />

      {/* ID + Score row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        <span style={{ color: "var(--ink-tertiary)" }}>{p.id}</span>
        <strong style={{ color: p.signal }}>{p.score.toFixed(2)}</strong>
      </div>

      {/* Animated score bar */}
      <div
        aria-hidden
        style={{
          height: 3,
          borderRadius: "var(--r-full)",
          background: "var(--bg-raised)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: inView ? `${p.score * 100}%` : "0%",
            background: p.signal,
            borderRadius: "var(--r-full)",
            transition: "width 0.8s var(--ease)",
          }}
        />
      </div>

      {/* Category pill */}
      <span
        style={{
          display: "inline-block",
          alignSelf: "flex-start",
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          color: p.signal,
          background: `${p.signal}10`,
          border: `1px solid ${p.signal}25`,
          borderRadius: "var(--r-full)",
          padding: "2px 10px",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        {p.category}
      </span>

      {/* Name + Tagline */}
      <h3
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          fontWeight: 400,
          color: "var(--ink-primary)",
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {p.name}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "var(--ink-secondary)",
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {p.tagline}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "var(--ink-secondary)",
          margin: 0,
          flex: 1,
        }}
      >
        {p.description}
      </p>

      {/* Impact */}
      <p
        style={{
          fontSize: 13,
          fontFamily: "var(--font-mono)",
          color: "var(--ink-primary)",
          fontWeight: 600,
          margin: 0,
        }}
      >
        <span style={{ color: p.signal, marginRight: 6 }}>&rarr;</span>
        {p.impact}
      </p>

      {/* Stack tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {visibleStack.map((t) => (
          <span
            key={t}
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              padding: "2px 8px",
              borderRadius: "var(--r-sm)",
              background: "var(--bg-raised)",
              color: "var(--ink-secondary)",
              border: "1px solid var(--edge-subtle)",
            }}
          >
            {t}
          </span>
        ))}
        {overflowCount > 0 && (
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              padding: "2px 8px",
              borderRadius: "var(--r-sm)",
              background: "var(--bg-raised)",
              color: "var(--ink-tertiary)",
              border: "1px solid var(--edge-subtle)",
            }}
          >
            +{overflowCount} more
          </span>
        )}
      </div>

      {/* Footer: year + actions */}
      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 8,
          borderTop: "1px solid var(--edge-subtle)",
          marginTop: "auto",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            color: "var(--ink-tertiary)",
          }}
        >
          {p.year}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              color: "var(--signal)",
              background: "var(--signal-light)",
              border: "1px solid var(--signal-border)",
              borderRadius: "var(--r-sm)",
              padding: "4px 10px",
              cursor: "pointer",
              transition: "background 0.2s var(--ease)",
            }}
          >
            View Details <ArrowRight aria-hidden size={12} />
          </button>
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${p.name}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: "var(--r-sm)",
              border: "1px solid var(--edge-default)",
              color: "var(--ink-secondary)",
              background: "transparent",
              transition: "border-color 0.2s var(--ease), color 0.2s var(--ease)",
            }}
          >
            <ExternalLink aria-hidden size={14} />
          </a>
        </div>
      </footer>
    </article>
  );
}

export function Projects({
  onSelect,
}: {
  onSelect: (p: Project) => void;
}) {
  return (
    <Section id="work">
      <Label>{"[ memory.search({ category: 'shipped_work' }) ]"}</Label>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 400,
          color: "var(--ink-primary)",
          lineHeight: 1.15,
          margin: "12px 0 8px",
        }}
      >
        <i>Shipped systems,</i> not side projects.
      </h2>
      <p
        style={{
          fontSize: 16,
          color: "var(--ink-secondary)",
          lineHeight: 1.6,
          maxWidth: 600,
          margin: "0 0 32px",
        }}
      >
        Six of 18+ production systems. Each had real users, real stakes, and
        durable context problems.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} onSelect={onSelect} />
        ))}
      </div>
    </Section>
  );
}
