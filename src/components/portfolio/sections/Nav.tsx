import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Work",     id: "projects" },
  { label: "Stack",    id: "skills" },
  { label: "Why mem0", id: "why" },
  { label: "Contact",  id: "contact" },
] as const;

type NavId = (typeof NAV_LINKS)[number]["id"];

function useScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      setPct(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return pct;
}

export function Nav() {
  const active = useScrollSpy(NAV_LINKS.map((l) => l.id)) as NavId | "";
  const progress = useScrollProgress();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 54,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Scroll progress line */}
      

      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          height: "100%",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Logo */}
        <a
          href="#hero"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M11 2L19.66 7V17L11 22L2.34 17V7L11 2Z" fill="#7C3AED" opacity="0.12" />
            <path d="M11 2L19.66 7V17L11 22L2.34 17V7L11 2Z" stroke="#7C3AED" strokeWidth="1.4" fill="none" />
            <circle cx="11" cy="11" r="2.5" fill="#7C3AED" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--ink-primary)",
              letterSpacing: "-0.015em",
            }}
          >
            amit<span style={{ color: "var(--signal)" }}>.</span>
          </span>
        </a>

        {/* Desktop links — centered */}
        <nav
          className="nav-links-desktop"
          aria-label="Primary navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {NAV_LINKS.map(({ label, id }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={isActive ? "page" : undefined}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--signal)" : "var(--ink-secondary)",
                  textDecoration: "none",
                  padding: "0 14px",
                  lineHeight: "54px",
                  letterSpacing: isActive ? "-0.01em" : "normal",
                  transition: "color 0.14s",
                  whiteSpace: "nowrap",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "var(--ink-primary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "var(--ink-secondary)";
                }}
              >
                {label}
                
              </a>
            );
          })}
        </nav>

        {/* Right: CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <a
            href="#contact"
            className="nav-cta-desktop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 32,
              padding: "0 14px",
              background: "var(--signal)",
              color: "#fff",
              borderRadius: 999,
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              fontWeight: 500,
              textDecoration: "none",
              transition: "opacity 0.18s, transform 0.18s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.82";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span
              aria-hidden
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
                animation: "pm-pulse 2.4s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            Available
          </a>
        </div>
      </div>

      <style>{`
        .nav-links-desktop { display: flex; }
        .nav-cta-desktop   { display: inline-flex; }
        @media (max-width: 680px) {
          .nav-links-desktop {
            position: static !important;
            transform: none !important;
            left: auto !important;
            gap: 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .nav-links-desktop::-webkit-scrollbar { display: none; }
          .nav-links-desktop a { font-size: 12px !important; padding: 0 10px !important; }
          .nav-cta-desktop { display: none !important; }
        }
      `}</style>
    </header>
  );
}
