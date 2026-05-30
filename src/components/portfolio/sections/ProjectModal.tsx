import { useEffect, useRef, type CSSProperties } from "react";
import { X, ExternalLink, Brain, ArrowRight } from "lucide-react";
import type { Project } from "../data/projects";
import { getLenis } from "@/hooks/use-smooth-scroll";

const fadeInKeyframes = `
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(24px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;

export function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    getLenis()?.stop();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [onClose]);

  return (
    <>
      {/* Inject keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: fadeInKeyframes }} />

      {/* Backdrop */}
      <div
        role="presentation"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(247, 248, 250, 0.92)",
          animation: "modalFadeIn 0.25s ease-out both",
          padding: 24,
        }}
      >
        {/* Modal card */}
        <article
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          style={
            {
              "--pc": project.signal,
              position: "relative",
              background: "var(--bg-surface)",
              borderRadius: "var(--r-xl)",
              maxWidth: 760,
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
              border: "none",
              animation: "modalSlideIn 0.3s ease-out both",
            } as CSSProperties
          }
        >
          {/* Top accent bar */}
          <div
            aria-hidden
            style={{
              height: 4,
              background: project.signal,
              borderRadius: "var(--r-xl) var(--r-xl) 0 0",
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: "24px 28px 0",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--r-sm)",
                border: "none",
                background: "var(--bg-raised)",
                color: "var(--ink-secondary)",
                cursor: "pointer",
                transition: "border-color 0.2s var(--ease), color 0.2s var(--ease)",
              }}
            >
              <X aria-hidden size={16} />
            </button>

            {/* Category pill + ID/score */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 40,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: project.signal,
                  background: `${project.signal}10`,
                  border: "none",
                  borderRadius: "var(--r-full)",
                  padding: "2px 10px",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {project.category}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-tertiary)",
                }}
              >
                {project.id} · score{" "}
                <strong style={{ color: project.signal }}>{project.score.toFixed(2)}</strong>
              </span>
            </div>

            {/* Title + tagline */}
            <h2
              id="project-modal-title"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(24px, 3.5vw, 34px)",
                fontWeight: 400,
                color: "var(--ink-primary)",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {project.name}
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--ink-secondary)",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              {project.tagline}
            </p>
          </div>

          {/* Visual hero */}
          <div
            aria-hidden
            style={{
              margin: "20px 28px 0",
              borderRadius: "var(--r-md)",
              padding: "40px 28px",
              background: `linear-gradient(135deg, ${project.signal}12, ${project.signal}06)`,
              border: `1px solid ${project.signal}18`,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Decorative circles */}
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: `${project.signal}08`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -30,
                left: -10,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `${project.signal}06`,
              }}
            />

            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 3vw, 28px)",
                color: project.signal,
                textAlign: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {project.name}
            </span>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                color: "var(--ink-tertiary)",
                textDecoration: "none",
                position: "relative",
                zIndex: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                transition: "color 0.2s var(--ease)",
              }}
            >
              <ExternalLink aria-hidden size={11} />
              {project.url.replace(/^https?:\/\//, "")}
            </a>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "24px 28px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* 1. Overview */}
            <section>
              <h3
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 8px",
                }}
              >
                Overview
              </h3>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "var(--ink-secondary)",
                  margin: 0,
                }}
              >
                {project.description}
              </p>
            </section>

            {/* 2. Role Highlights */}
            <section>
              <h3
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 10px",
                }}
              >
                Role Highlights
              </h3>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {project.roleHighlights.map((h) => (
                  <li
                    key={h}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--ink-secondary)",
                    }}
                  >
                    <ArrowRight
                      aria-hidden
                      size={14}
                      style={{
                        color: project.signal,
                        flexShrink: 0,
                        marginTop: 3,
                      }}
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Why It Matters panel */}
            <section
              style={{
                background: `${project.signal}08`,
                border: "none",
                borderRadius: "var(--r-md)",
                padding: "16px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <Brain aria-hidden size={16} style={{ color: project.signal }} />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: project.signal,
                  }}
                >
                  [ memory.search("why it matters") ]
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--ink-secondary)",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                {project.whyItMatters}
              </p>
            </section>

            {/* 4. Full Stack */}
            <section>
              <h3
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  color: "var(--ink-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  margin: "0 0 10px",
                }}
              >
                Full Stack
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.stack.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      padding: "3px 10px",
                      borderRadius: "var(--r-sm)",
                      background: "var(--bg-raised)",
                      color: "var(--ink-secondary)",
                      border: "none",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* 5. Impact */}
            <p
              style={{
                fontSize: 14,
                fontFamily: "var(--font-mono)",
                color: "var(--ink-primary)",
                fontWeight: 600,
                margin: 0,
                padding: "12px 0",
                borderTop: "1px solid var(--edge-subtle)",
              }}
            >
              <span style={{ color: project.signal, marginRight: 6 }}>&rarr;</span>
              {project.impact}
            </p>

            {/* Footer */}
            <footer
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                paddingTop: 4,
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  padding: "8px 18px",
                  borderRadius: "var(--r-sm)",
                  border: "none",
                  background: "var(--bg-raised)",
                  color: "var(--ink-secondary)",
                  cursor: "pointer",
                  transition: "border-color 0.2s var(--ease)",
                }}
              >
                Close
              </button>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  padding: "8px 18px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--signal)",
                  color: "#fff",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.2s var(--ease)",
                }}
              >
                <ExternalLink aria-hidden size={14} />
                View Live
              </a>
            </footer>
          </div>
        </article>
      </div>
    </>
  );
}
