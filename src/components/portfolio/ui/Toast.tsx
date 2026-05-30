export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pm-slide-in"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: "var(--ink-primary)",
        color: "white",
        padding: "10px 16px",
        borderRadius: "var(--r-full)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        boxShadow: "var(--shadow-lg)",
        zIndex: 400,
      }}
    >
      {message}
    </div>
  );
}
