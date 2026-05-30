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

  return (
    <>
      {/* Desktop Floating Pill Header */}
      <div
        style={{
          position: "sticky",
          top: 24,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          padding: "0 24px",
          pointerEvents: "none",
        }}
        className="hide-on-mobile"
      >
        <header
          style={{
            pointerEvents: "auto",
            height: 48,
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "var(--r-full)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
            padding: "0 8px 0 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <a
            href="#hero"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ink-primary)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-primary)")}
          >
            amit.co
          </a>

          {/* Desktop links */}
          <nav
            style={{ display: "flex", gap: 4, alignItems: "center" }}
            aria-label="Desktop Navigation"
          >
            {NAV_LINKS.map((n) => {
              const isActive = active === n.id;
              return (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: isActive ? "var(--ink-primary)" : "var(--ink-tertiary)",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                    transition: "color 0.2s, background 0.2s",
                    padding: "6px 12px",
                    borderRadius: "var(--r-full)",
                    background: isActive ? "rgba(0,0,0,0.05)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--ink-secondary)";
                      e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--ink-tertiary)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {n.label}
                </a>
              );
            })}
          </nav>

          <a
            href="#contact"
            style={{
              background: "var(--signal)",
              color: "#FFF",
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              fontSize: 10,
              padding: "6px 14px",
              borderRadius: "var(--r-full)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(22,160,124,0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(22,160,124,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(22,160,124,0.3)";
            }}
          >
            Available
          </a>
        </header>
      </div>

      {/* Mobile Floating Bottom Tab Navigation */}
      <div
        className="show-on-mobile"
        style={{
          position: "fixed",
          bottom: 24,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          padding: "0 16px",
        }}
      >
        <nav
          style={{
            pointerEvents: "auto",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "var(--r-full)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
            maxWidth: 400,
          }}
          aria-label="Mobile Navigation"
        >
          {NAV_LINKS.map((n) => {
            const isActive = active === n.id;
            return (
              <a
                key={n.id}
                href={`#${n.id}`}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  borderRadius: "var(--r-full)",
                  background: isActive ? "rgba(0,0,0,0.04)" : "transparent",
                  color: isActive ? "var(--ink-primary)" : "var(--ink-tertiary)",
                  textDecoration: "none",
                  transition: "color 0.2s, background 0.2s",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {n.label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
