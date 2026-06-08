import { useEnvHealth } from "@/hooks/use-env-health";

/**
 * Env health banner — now only fires on genuine network/server errors,
 * NOT on missing optional keys (LOVABLE_API_KEY / MEM0_API_KEY).
 * Those are surfaced as soft warnings in the DevHealthPanel only.
 */
export function EnvHealthBanner() {
  const { data: status } = useEnvHealth();

  // Only render when there is a real server-side blocking error (ok === false).
  // Optional-key warnings live in DevHealthPanel, not here.
  if (!status || status.ok) return null;

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 520,
        margin: "0 auto",
        zIndex: 9999,
        background: "rgba(20,8,8,0.96)",
        border: "1px solid rgba(239,68,68,0.45)",
        borderRadius: 12,
        padding: "12px 16px",
        color: "#fecaca",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        lineHeight: 1.5,
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span aria-hidden style={{ color: "#ef4444", fontSize: 14 }}>⚠</span>
      <div style={{ flex: 1 }}>
        <strong style={{ color: "#fca5a5", display: "block", marginBottom: 2 }}>
          App configuration error
        </strong>
        {status.missing.length > 0 && (
          <span>{status.missing.join(", ")}</span>
        )}
      </div>
    </div>
  );
}
