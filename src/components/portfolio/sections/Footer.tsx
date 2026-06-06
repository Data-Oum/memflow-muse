const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const SOCIALS = [
  { label: "GitHub",    href: "https://github.com/devamitch",          Icon: GithubIcon },
  { label: "LinkedIn",  href: "https://linkedin.com/in/devamitch",      Icon: LinkedinIcon },
  { label: "X",         href: "https://x.com/devamitch",               Icon: XIcon },
  { label: "Email",     href: "mailto:amit@devamit.co.in",             Icon: MailIcon },
];

const TECH_STACK = ["TanStack Start", "React 19", "TypeScript", "mem0 API", "Claude Code", "Framer Motion"];

export function Footer() {
  return (
    <footer
      aria-label="Site footer"
      style={{
        background: "#0A0B0D",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow top-center */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 300,
          background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      {/* CTA strip */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "72px 24px 56px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 32,
        }}
        className="footer-cta-grid"
      >
        {/* Left: headline */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            // ready to ship
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            Let&rsquo;s build something<br />
            that{" "}
            <span
              style={{
                background: "linear-gradient(120deg, #A78BFA 0%, #7C3AED 60%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              remembers.
            </span>
          </h2>
        </div>

        {/* Right: CTA button */}
        <a
          href="#contact"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "var(--signal)",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: 999,
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s, transform 0.18s",
            letterSpacing: "-0.01em",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span
            aria-hidden
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.8)",
              animation: "pm-pulse 2.4s ease-in-out infinite",
            }}
          />
          Start a conversation
        </a>
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Identity row */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "32px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          gap: 24,
        }}
        className="footer-identity-grid"
      >
        {/* Name + role */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "-0.015em",
              marginBottom: 5,
            }}
          >
            Amit Chakraborty
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.04em",
              lineHeight: 1.7,
            }}
          >
            Principal Architect · AI-Native · Web3<br />
            Kolkata, India → Remote exclusively
          </div>
        </div>

        {/* Social links — centered */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: 10,
                color: "rgba(255,255,255,0.38)",
                textDecoration: "none",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.88)";
                e.currentTarget.style.background = "rgba(124,58,237,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.38)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Contact + year — right */}
        <div style={{ textAlign: "right" }}>
          <a
            href="mailto:amit@devamit.co.in"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "rgba(255,255,255,0.42)",
              textDecoration: "none",
              display: "block",
              marginBottom: 5,
              letterSpacing: "0.01em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.42)")}
          >
            amit@devamit.co.in
          </a>
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

      {/* Bottom tech strip */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(255,255,255,0.14)",
            letterSpacing: "0.04em",
          }}
        >
          Built with
        </span>
        {TECH_STACK.map((t, i) => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "rgba(255,255,255,0.26)",
                letterSpacing: "0.03em",
              }}
            >
              {t}
            </span>
            {i < TECH_STACK.length - 1 && (
              <span style={{ color: "rgba(255,255,255,0.10)", fontSize: 10 }}>·</span>
            )}
          </span>
        ))}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .footer-cta-grid { grid-template-columns: 1fr !important; }
          .footer-identity-grid { grid-template-columns: 1fr !important; }
          .footer-identity-grid > div:nth-child(2) { justify-content: flex-start !important; }
          .footer-identity-grid > div:nth-child(3) { text-align: left !important; }
        }
      `}</style>
    </footer>
  );
}
