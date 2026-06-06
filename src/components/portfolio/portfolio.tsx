import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "./data/projects";
import { ClickInstrumentationLayer } from "./sections/ClickInstrumentationLayer";
import { ContactFooter } from "./sections/ContactFooter";
import { Hero } from "./sections/Hero";
import { Nav } from "./sections/Nav";
import { ProjectModal } from "./sections/ProjectModal";
import { Projects } from "./sections/Projects";
import { PwaInstallPrompt } from "./sections/PwaInstallPrompt";
import { TechnicalChops } from "./sections/TechnicalChops";
import { VoiceChatDialog } from "./sections/VoiceChatDialog";
import { WhyMem0 } from "./sections/WhyMem0";
import { Toast } from "./ui/Toast";

export function Portfolio() {
  const [visitorId, setVisitorId] = useState("visitor_ssr000");
  useEffect(() => {
    try {
      const existing = localStorage.getItem("portfolio_visitor_id");
      if (existing) { setVisitorId(existing); return; }
      const id = "visitor_" + Math.random().toString(36).slice(2, 7);
      localStorage.setItem("portfolio_visitor_id", id);
      setVisitorId(id);
    } catch {
      setVisitorId("visitor_" + Math.random().toString(36).slice(2, 7));
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
    <div style={{ background: "var(--bg-page)", color: "var(--ink-primary)", minHeight: "100vh" }}>
      <Nav />
      <ClickInstrumentationLayer />

      <main>
        {/* 1. Hero — WHITE */}
        <Hero />
        {/* 2. Projects — LIGHT */}
        <Projects onSelect={setSelectedProject} />
        {/* 3. TechnicalChops — DARK (id="skills" for nav) */}
        <TechnicalChops />
        {/* 4. WhyMem0 — LIGHT (white, max contrast between dark sections) */}
        <WhyMem0 />
      </main>

      {/* Contact + Footer — unified dark closing section */}
      <ContactFooter showToast={showToast} />

      <Toast message={toast} />
      <VoiceChatDialog visitorId={visitorId} />
      <PwaInstallPrompt />

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
