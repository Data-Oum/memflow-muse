import { useInView } from "@/hooks/use-in-view";
import { ResumeButton } from "../ui/ResumeButton";

/* ─── Brand SVG icons ─────────────────────────────────────────── */
const IconGitHub = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
const IconLinkedIn = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const IconX = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const IconMail = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Data ────────────────────────────────────────────────────── */
const SOCIALS = [
  { Icon: IconGitHub,   label: "devamitch",         href: "https://github.com/devamitch" },
  { Icon: IconLinkedIn, label: "in/devamitch",       href: "https://linkedin.com/in/devamitch" },
  { Icon: IconX,        label: "@devamitch",         href: "https://x.com/devamitch" },
];

const META_ROWS = [
  ["Location",     "Kolkata, India"],
  ["Timezone",     "IST (UTC+5:30)"],
  ["Format",       "Remote exclusively"],
  ["Target role",  "Staff / Principal Engineer"],
  ["Availability", "Immediate"],
];

const TECH = ["TanStack Start", "React 19", "TypeScript", "mem0 API", "Claude Code"];

/* ─── Component ──────────────────────────────────────────────── */
export function ContactFooter({ showToast }: { showToast: (m: string) => void }) {
  const { ref: headRef, isInView: headIn } = useInView<HTMLDivElement>(0.1);
  const { ref: cardRef, isInView: cardIn } = useInView<HTMLDivElement>(0.1);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("amit@devamit.co.in");
      showToast("Email copied!");
    } catch {
      showToast("amit@devamit.co.in");
    }
  };

  return (
    <section
      id="contact"
      style={{
        background: "#0A0B0D",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient top glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -160,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse 55% 55% at 50% 0%, rgba(124,58,237,0.16) 0%, transparent 75%)",
          pointerEvents: "none",
        }}
      />
      {/* Right-side subtle glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "20%",
          right: -120,
          width: 400,
          height: 400,
          background: "radial-gradient(ellipse 60% 60% at 100% 50%, rgba(124,58,237,0.07) 0%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      {/* ── CONTACT BODY ───────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "88px 24px 80px",
        }}
      >
        {/* Section label */}
        <div
          ref={headRef}
          style={{
            opacity: headIn ? 1 : 0,
            transform: headIn ? "none" : "translateY(12px)",
            transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(124,58,237,0.12)",
              borderRadius: 999,
              padding: "4px 12px 4px 8px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22C55E",
                animation: "pm-pulse 2.4s ease-in-out infinite",
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "rgba(167,139,250,0.9)",
                letterSpacing: "0.04em",
              }}
            >
              mem0.add("amit is available now")
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
              margin: "0 0 16px",
            }}
          >
            Let&rsquo;s build something<br />
            <span
              style={{
                background: "linear-gradient(110deg, #A78BFA 0%, #7C3AED 55%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              that remembers.
            </span>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.42)",
              lineHeight: 1.65,
              maxWidth: 440,
              margin: "0 0 56px",
            }}
          >
            I'm actively looking for a Staff / Principal Frontend role at a company doing
            serious work with AI. mem0 is at the top of that list.
          </p>
        </div>

        {/* Two-column layout */}
        <div
          className="cf-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 6vw, 80px)",
            alignItems: "start",
          }}
        >
          {/* ── LEFT: Direct channels ── */}
          <div
            style={{
              opacity: headIn ? 1 : 0,
              transform: headIn ? "none" : "translateY(16px)",
              transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}
          >
            {/* Email CTA — primary */}
            <button
              type="button"
              onClick={copyEmail}
              className="cf-email-cta"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(124,58,237,0.08))",
                border: "1px solid rgba(124,58,237,0.28)",
                borderRadius: 12,
                padding: "16px 20px",
                cursor: "pointer",
                width: "100%",
                marginBottom: 12,
                transition: "transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s, border-color 0.2s",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "rgba(124,58,237,0.18)",
                  color: "#A78BFA",
                  flexShrink: 0,
                }}
              >
                <IconMail />
              </span>
              <span style={{ flex: 1 }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12.5,
                    color: "rgba(255,255,255,0.88)",
                    letterSpacing: "0.01em",
                    marginBottom: 2,
                  }}
                >
                  amit@devamit.co.in
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.28)",
                    letterSpacing: "0.03em",
                  }}
                >
                  click to copy
                </span>
              </span>
              <span style={{ color: "rgba(167,139,250,0.55)", flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M5 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-2M8 1h7v7M15 1L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {/* Social links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 32 }}>
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "rgba(255,255,255,0.38)",
                    transition: "color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.82)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.38)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12.5,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </span>
                  <span style={{ marginLeft: "auto" }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>

            {/* Resume */}
            <div>
              <ResumeButton />
            </div>
          </div>

          {/* ── RIGHT: Availability card ── */}
          <div
            ref={cardRef}
            style={{
              opacity: cardIn ? 1 : 0,
              transform: cardIn ? "none" : "translateY(16px)",
              transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.18s",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: "20px 24px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.055)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22C55E",
                    animation: "pm-pulse 2.4s ease-in-out infinite",
                    flexShrink: 0,
                  }}
                  aria-hidden
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "#22C55E",
                    letterSpacing: "0.04em",
                  }}
                >
                  Available immediately
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.20)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  status: open
                </span>
              </div>

              {/* Meta rows */}
              <div style={{ padding: "8px 0" }}>
                {META_ROWS.map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 24px",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10.5,
                        color: "rgba(255,255,255,0.28)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {k}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.80)",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card footer */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.055)",
                  padding: "18px 24px",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <a
                  href="mailto:amit@devamit.co.in"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    background: "var(--signal)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "10px 18px",
                    borderRadius: 999,
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                    flex: 1,
                    justifyContent: "center",
                    transition: "opacity 0.18s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.82")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Send a message
                  <IconArrow />
                </a>
                <a
                  href="https://linkedin.com/in/devamitch"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.40)",
                    textDecoration: "none",
                    flexShrink: 0,
                    transition: "color 0.15s, border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.80)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.40)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                  }}
                >
                  <IconLinkedIn />
                </a>
              </div>
            </div>

            {/* Quick fact below card */}
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: "rgba(255,255,255,0.20)",
                lineHeight: 1.6,
                margin: "16px 4px 0",
                letterSpacing: "0.01em",
              }}
            >
              This portfolio was built end-to-end with Claude Code,
              using the real mem0 API to manage visitor memory.
            </p>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ─────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />
      </div>

      {/* ── FOOTER IDENTITY ROW ─────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "28px 24px 24px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 24,
        }}
        className="cf-footer-row"
      >
        {/* Name + identity */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "-0.015em",
              marginBottom: 3,
            }}
          >
            Amit Chakraborty
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.03em",
            }}
          >
            Principal Architect · Kolkata → Remote
          </div>
        </div>

        {/* Tech stack — center */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "nowrap",
          }}
        >
          {TECH.map((t, i) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  color: "rgba(255,255,255,0.20)",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
              {i < TECH.length - 1 && (
                <span style={{ color: "rgba(255,255,255,0.10)", fontSize: 9 }}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Copyright — right */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(255,255,255,0.18)",
              letterSpacing: "0.02em",
            }}
          >
            © {new Date().getFullYear()} · All rights reserved
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 680px) {
          .cf-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cf-footer-row { grid-template-columns: 1fr !important; gap: 12px !important; }
          .cf-footer-row > div:last-child { text-align: left !important; }
        }
        @media (max-width: 900px) {
          .cf-footer-row > div:nth-child(2) { display: none !important; }
          .cf-footer-row { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
