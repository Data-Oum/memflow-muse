export function DarkStrip() {
  return (
    <div
      style={{
        background: "var(--dark-bg)",
        padding: "52px 24px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle node decorations */}
      <svg
        aria-hidden
        style={{ position: "absolute", left: 32, opacity: 0.12, pointerEvents: "none" }}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
      >
        <circle cx="40" cy="40" r="3" fill="#7C3AED" />
        <circle cx="40" cy="40" r="14" stroke="#7C3AED" strokeWidth="0.8" />
        <circle cx="40" cy="40" r="28" stroke="#7C3AED" strokeWidth="0.5" strokeDasharray="3 5" />
        <line x1="40" y1="0" x2="40" y2="80" stroke="#7C3AED" strokeWidth="0.4" />
        <line x1="0" y1="40" x2="80" y2="40" stroke="#7C3AED" strokeWidth="0.4" />
      </svg>
      <svg
        aria-hidden
        style={{ position: "absolute", right: 32, opacity: 0.12, pointerEvents: "none" }}
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
      >
        <circle cx="40" cy="40" r="3" fill="#7C3AED" />
        <circle cx="40" cy="40" r="14" stroke="#7C3AED" strokeWidth="0.8" />
        <circle cx="40" cy="40" r="28" stroke="#7C3AED" strokeWidth="0.5" strokeDasharray="3 5" />
        <line x1="40" y1="0" x2="40" y2="80" stroke="#7C3AED" strokeWidth="0.4" />
        <line x1="0" y1="40" x2="80" y2="40" stroke="#7C3AED" strokeWidth="0.4" />
      </svg>

      {/* Top border */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.35) 50%, transparent 100%)",
        }}
      />

      {/* Quote */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(15px, 2.2vw, 19px)",
          fontWeight: 500,
          color: "rgba(255,255,255,0.82)",
          textAlign: "center",
          lineHeight: 1.55,
          maxWidth: 680,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        Memory is what makes AI useful.{" "}
        <span style={{ color: "var(--signal)" }}>Architecture</span>{" "}
        is what makes engineers reliable.
      </p>

      {/* Bottom border */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.35) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
