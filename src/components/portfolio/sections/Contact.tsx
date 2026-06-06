import { AuroraBackground } from "@/components/ui/aurora-background";
import { ResumeButton } from "../ui/ResumeButton";

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5a6.5 6.5 0 00-2.055 12.668c.325.059.444-.141.444-.313 0-.155-.006-.566-.009-1.11-1.808.392-2.19-.872-2.19-.872-.296-.75-.722-.95-.722-.95-.59-.403.045-.395.045-.395.652.046 1.001.671 1.001.671.583 1 1.53.71 1.9.543.059-.422.228-.71.415-.873-1.443-.164-2.961-.722-2.961-3.21 0-.71.253-1.29.668-1.745-.067-.164-.29-.824.063-1.718 0 0 .545-.175 1.785.667A6.21 6.21 0 018 5.7c.553.003 1.108.075 1.628.22 1.239-.842 1.782-.667 1.782-.667.355.894.132 1.554.065 1.718.416.456.667 1.036.667 1.745 0 2.495-1.52 3.044-2.966 3.205.233.2.44.599.44 1.207 0 .87-.008 1.573-.008 1.787 0 .174.117.376.447.312A6.5 6.5 0 008 1.5z" fill="currentColor"/>
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 6.5V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="4" cy="4.5" r="0.8" fill="currentColor"/>
      <path d="M7.5 12V9c0-1 .5-2 2-2s2 1 2 2v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M7.5 6.5V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

const SOCIAL = [
  { Icon: IconMail, label: "amit@devamit.co.in", copy: true, href: null },
  { Icon: IconGitHub, label: "github.com/devamitch", copy: false, href: "https://github.com/devamitch" },
  { Icon: IconLinkedIn, label: "linkedin.com/in/devamitch", copy: false, href: "https://linkedin.com/in/devamitch" },
  { Icon: IconX, label: "x.com/devamitch", copy: false, href: "https://x.com/devamitch" },
];

export function Contact({ showToast }: { showToast: (m: string) => void }) {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("amit@devamit.co.in");
      showToast("Copied!");
    } catch {
      showToast("amit@devamit.co.in");
    }
  };

  return (
    <AuroraBackground style={{ background: "var(--dark-bg)" }}>
    <section
      id="contact"
      style={{ padding: "182px 24px 180px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Label */}
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--signal)",
            letterSpacing: "0.04em",
            marginBottom: 12,
          }}
        >
          mem0.add("amit is available now")
        </div>

        {/* 2-col layout */}
        <div
          className="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* Left: heading + social links */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
                fontWeight: 700,
                color: "rgba(255,255,255,0.95)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                margin: "0 0 32px",
              }}
            >
              Let's build memory together.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SOCIAL.map(({ Icon, label, copy, href }) =>
                copy ? (
                  <button
                    key={label}
                    type="button"
                    onClick={copyEmail}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      transition: "color 0.18s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal-bright)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    <Icon />
                    {label}
                  </button>
                ) : (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.5)",
                      textDecoration: "none",
                      transition: "color 0.18s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal-bright)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    <Icon />
                    {label}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Right: availability card */}
          <div>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22C55E",
                    flexShrink: 0,
                    animation: "pm-pulse 2.4s ease-in-out infinite",
                  }}
                  aria-hidden
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "#22C55E",
                    fontWeight: 500,
                  }}
                >
                  Available immediately
                </span>
              </div>

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Location", "Kolkata, India"],
                  ["Timezone", "IST (UTC+5:30)"],
                  ["Format", "Remote exclusively"],
                  ["Target", "Staff / Principal Engineer"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {k}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.82)",
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              {/* Resume */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
                <ResumeButton />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
        `}</style>
      </div>
    </section>
    </AuroraBackground>
  );
}
