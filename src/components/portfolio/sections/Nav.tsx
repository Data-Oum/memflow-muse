import { useState } from "react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "demo", label: "Demo" },
  { id: "logs", label: "Logs" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const active = useScrollSpy(
    NAV_LINKS.map((n) => n.id),
    120,
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 56,
          background: "rgba(247,248,250,0.90)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid var(--edge-subtle)",
        }}
      >
        <nav
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
          aria-label="Primary"
        >
          <a
            href="#hero"
            className="font-mono"
            style={{ fontSize: 13, color: "var(--ink-primary)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-primary)")}
          >
            amit.co
          </a>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }} className="hide-on-mobile">
            {NAV_LINKS.map((n) => {
              const isActive = active === n.id;
              return (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    position: "relative",
                    color: isActive ? "var(--signal)" : "var(--ink-secondary)",
                    fontWeight: isActive ? 500 : 400,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    padding: "4px 0",
                  }}
                >
                  {n.label}
                  {isActive && (
                    <span
                      aria-hidden
                      style={{
                        position: "absolute",
                        bottom: -4,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--signal)",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a
              href="#contact"
              style={{
                background: "var(--signal-light)",
                border: "1px solid var(--signal-border)",
                color: "var(--signal)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: "var(--r-full)",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(22,160,124,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--signal-light)")}
            >
              Open to roles →
            </a>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label="Open menu"
              className="show-on-mobile"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "transparent",
                border: "1px solid var(--edge-default)",
                borderRadius: "var(--r-sm)",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--ink-secondary)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "var(--bg-page)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            style={{
              position: "absolute",
              top: 16,
              right: 20,
              background: "transparent",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "var(--ink-secondary)",
            }}
          >
            ×
          </button>
          {NAV_LINKS.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 28,
                color: "var(--ink-primary)",
                textDecoration: "none",
              }}
            >
              {n.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
