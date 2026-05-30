import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toast } from "./ui/Toast";
import { Nav } from "./sections/Nav";
import { MemoryBanner } from "./sections/MemoryBanner";
import { Hero } from "./sections/Hero";
import { Philosophy } from "./sections/Philosophy";
import { Skills } from "./sections/Skills";
import { Projects } from "./sections/Projects";
import { Mem0Demo } from "./sections/Mem0Demo";
import { Logs } from "./sections/Logs";
import { Contact } from "./sections/Contact";
import { ProjectModal } from "./sections/ProjectModal";
import type { Project } from "./data/projects";

export function Portfolio() {
  const visitorId = useMemo(() => {
    if (typeof window === "undefined") return "visitor_ssr000";
    try {
      const existing = localStorage.getItem("portfolio_visitor_id");
      if (existing) return existing;
      const id = "visitor_" + Math.random().toString(36).slice(2, 7);
      localStorage.setItem("portfolio_visitor_id", id);
      return id;
    } catch {
      return "visitor_" + Math.random().toString(36).slice(2, 7);
    }
  }, []);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div
      style={{
        background: "var(--bg-page)",
        color: "var(--ink-primary)",
        minHeight: "100vh",
        paddingBottom: 64, // Add padding for bottom nav on mobile
      }}
    >
      <Nav />
      <MemoryBanner />
      <main>
        <Hero />
        <Philosophy />
        <Skills />
        <Projects onSelect={setSelectedProject} />
        <Mem0Demo visitorId={visitorId} showToast={showToast} />
        <Logs />
      </main>
      <Contact showToast={showToast} />
      <footer
        style={{
          background: "var(--bg-raised)",
          padding: "32px 24px",
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--ink-tertiary)",
          borderTop: "1px solid var(--edge-subtle)",
        }}
      >
        // built with mem0 · {new Date().getFullYear()} · Kolkata → Remote
      </footer>
      <Toast message={toast} />

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
