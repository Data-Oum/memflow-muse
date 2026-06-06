import { useEffect, useState } from "react";
import { useEnvHealth } from "@/hooks/use-env-health";

/**
 * Fixed-position banner that surfaces missing required env vars
 * (server-side check). Dev-only: only shown when not ok, and the
 * user can dismiss for the session.
 */
export function EnvHealthBanner() {
  const { data: status, loading, refetch } = useEnvHealth();
  const [dismissed, setDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("env_banner_dismissed") === "1") setDismissed(true);
    } catch {}
  }, []);

  if (loading || !status || status.ok || dismissed) return null;

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
          Missing environment variables
        </strong>
        <span>{status.missing.join(", ")}</span>
        <div style={{ marginTop: 4, color: "rgba(252,165,165,0.7)", fontSize: 11 }}>
          mem0 running in <b>{status.mem0Mode}</b> mode. Add the keys in Lovable Secrets.
        </div>
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <button
            type="button"
            disabled={retrying}
            onClick={async () => {
              setRetrying(true);
              await refetch();
              setRetrying(false);
            }}
            style={{
              background: "rgba(239,68,68,0.18)",
              border: "1px solid rgba(239,68,68,0.45)",
              color: "#fecaca",
              padding: "4px 10px",
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              cursor: retrying ? "wait" : "pointer",
            }}
          >
            {retrying ? "Checking…" : "Retry"}
          </button>
        </div>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem("env_banner_dismissed", "1");
          } catch {}
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "#fca5a5",
          cursor: "pointer",
          fontSize: 16,
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}