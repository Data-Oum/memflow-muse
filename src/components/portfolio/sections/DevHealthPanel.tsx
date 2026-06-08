/**
 * DevHealthPanel
 *
 * Keyboard-toggled diagnostic overlay (Ctrl/Cmd + Shift + H).
 * Shows:
 *   • Server-side env var status (present / warning)
 *   • Vite optimized-dep cache location + bust hint
 *   • Intercepted 504 / ChunkLoadError history
 *
 * This component is rendered in the app shell but is visually inert
 * (zero paint cost) until the shortcut is triggered.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useEnvHealth } from "@/hooks/use-env-health";

/* ── 504 / ChunkLoad error log (module-scope so it persists across re-mounts) ── */
export interface ChunkError {
  ts: number;
  message: string;
  url?: string;
}
const chunkErrors: ChunkError[] = [];

/** Call from the global error interceptor in __root.tsx */
export function recordChunkError(err: unknown, url?: string) {
  const msg =
    err instanceof Error ? err.message : String(err);
  chunkErrors.unshift({ ts: Date.now(), message: msg, url });
  if (chunkErrors.length > 20) chunkErrors.pop();
}

/* ── Vite dep-cache info (client-side inference) ── */
function getViteInfo() {
  if (typeof window === "undefined") return null;
  const isDev = import.meta.env.DEV;
  if (!isDev) return null;
  return {
    cacheDir: "node_modules/.vite/deps",
    hint: "Run `bun run dev:fresh` or delete node_modules/.vite to force re-optimisation.",
    mode: import.meta.env.MODE,
  };
}

/* ── Helpers ── */
function ts(epoch: number) {
  return new Date(epoch).toLocaleTimeString();
}

/* ── Styles ── */
const mono = "JetBrains Mono, Fira Code, monospace";

const panelStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  width: "min(460px, 100vw)",
  zIndex: 99999,
  background: "rgba(8, 8, 16, 0.97)",
  borderLeft: "1px solid rgba(124,58,237,0.30)",
  backdropFilter: "blur(24px) saturate(1.4)",
  WebkitBackdropFilter: "blur(24px) saturate(1.4)",
  overflowY: "auto",
  padding: "20px 20px 32px",
  fontFamily: mono,
  fontSize: 11,
  color: "rgba(255,255,255,0.75)",
  boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
  display: "flex",
  flexDirection: "column",
  gap: 20,
};

const sectionHeader: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 9,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "rgba(124,58,237,0.65)",
  marginBottom: 8,
  paddingBottom: 5,
  borderBottom: "0.5px solid rgba(124,58,237,0.15)",
};

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  padding: "5px 0",
  borderBottom: "0.5px solid rgba(255,255,255,0.04)",
};

const pillOk: React.CSSProperties = {
  background: "rgba(34,197,94,0.12)",
  color: "#4ade80",
  border: "0.5px solid rgba(34,197,94,0.30)",
  borderRadius: 999,
  padding: "1px 7px",
  fontSize: 9,
  letterSpacing: "0.06em",
  flexShrink: 0,
};

const pillWarn: React.CSSProperties = {
  background: "rgba(250,204,21,0.10)",
  color: "#fbbf24",
  border: "0.5px solid rgba(251,191,36,0.30)",
  borderRadius: 999,
  padding: "1px 7px",
  fontSize: 9,
  letterSpacing: "0.06em",
  flexShrink: 0,
};

const pillErr: React.CSSProperties = {
  background: "rgba(239,68,68,0.12)",
  color: "#f87171",
  border: "0.5px solid rgba(239,68,68,0.30)",
  borderRadius: 999,
  padding: "1px 7px",
  fontSize: 9,
  letterSpacing: "0.06em",
  flexShrink: 0,
};

const closeBtn: React.CSSProperties = {
  position: "sticky",
  top: 0,
  alignSelf: "flex-end",
  background: "rgba(255,255,255,0.05)",
  border: "0.5px solid rgba(255,255,255,0.10)",
  borderRadius: 6,
  color: "rgba(255,255,255,0.50)",
  cursor: "pointer",
  padding: "4px 10px",
  fontFamily: mono,
  fontSize: 10,
  letterSpacing: "0.04em",
  backdropFilter: "blur(8px)",
  zIndex: 1,
};

const copyBtn: React.CSSProperties = {
  background: "rgba(124,58,237,0.12)",
  border: "0.5px solid rgba(124,58,237,0.25)",
  borderRadius: 6,
  color: "rgba(124,58,237,0.85)",
  cursor: "pointer",
  padding: "4px 10px",
  fontFamily: mono,
  fontSize: 10,
  letterSpacing: "0.04em",
  marginLeft: "auto",
  flexShrink: 0,
};

const reloadBtn: React.CSSProperties = {
  background: "rgba(34,197,94,0.10)",
  border: "0.5px solid rgba(34,197,94,0.25)",
  borderRadius: 6,
  color: "#4ade80",
  cursor: "pointer",
  padding: "6px 12px",
  fontFamily: mono,
  fontSize: 10,
  letterSpacing: "0.04em",
  width: "100%",
  textAlign: "left",
  marginTop: 4,
};

/* ── Panel content ── */
function PanelContent({ onClose }: { onClose: () => void }) {
  const { data: health, loading, refetch } = useEnvHealth();
  const [retrying, setRetrying] = useState(false);
  const [copied, setCopied] = useState(false);
  const vite = getViteInfo();

  const ENV_ROWS = [
    {
      key: "LOVABLE_API_KEY",
      present: health?.lovablePresent ?? false,
      note: "Voice-chat AI gateway",
      optional: true,
    },
    {
      key: "MEM0_API_KEY",
      present: health?.mem0Mode === "real",
      note: "Memory API — mock fallback if absent",
      optional: true,
    },
    {
      key: "SUPABASE_URL",
      present: true, // always set (checked at build)
      note: "Database connection",
      optional: false,
    },
    {
      key: "SUPABASE_PUBLISHABLE_KEY",
      present: true,
      note: "Supabase anon key",
      optional: false,
    },
  ];

  const handleRetry = async () => {
    setRetrying(true);
    await refetch();
    setRetrying(false);
  };

  const handleCopyLog = () => {
    const text = chunkErrors
      .map((e) => `[${ts(e.ts)}] ${e.message}${e.url ? ` @ ${e.url}` : ""}`)
      .join("\n") || "(no errors recorded)";
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={panelStyle} role="dialog" aria-label="Dev Health Panel">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: mono, fontSize: 12, color: "rgba(255,255,255,0.90)", fontWeight: 600 }}>
            Dev Health Panel
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: "rgba(124,58,237,0.55)", marginTop: 2 }}>
            Ctrl/Cmd + Shift + H to toggle
          </div>
        </div>
        <button type="button" style={closeBtn} onClick={onClose}>✕ Close</button>
      </div>

      {/* ── Env Vars ── */}
      <div>
        <div style={sectionHeader}>Environment Variables</div>

        {loading && (
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, padding: "6px 0" }}>
            Checking…
          </div>
        )}

        {!loading && ENV_ROWS.map((r) => (
          <div key={r.key} style={row}>
            <span style={r.present ? pillOk : r.optional ? pillWarn : pillErr}>
              {r.present ? "SET" : r.optional ? "WARN" : "MISSING"}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.80)", fontWeight: 500 }}>{r.key}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, marginTop: 1 }}>{r.note}</div>
            </div>
          </div>
        ))}

        {!loading && health?.warnings && health.warnings.length > 0 && (
          <div style={{
            marginTop: 8, padding: "8px 10px",
            background: "rgba(251,191,36,0.06)",
            border: "0.5px solid rgba(251,191,36,0.18)",
            borderRadius: 8,
          }}>
            <div style={{ fontSize: 9, color: "#fbbf24", marginBottom: 4, letterSpacing: "0.06em" }}>
              SOFT WARNINGS (app still functional)
            </div>
            {health.warnings.map((w, i) => (
              <div key={i} style={{ fontSize: 10, color: "rgba(251,191,36,0.75)", padding: "2px 0" }}>
                · {w}
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          disabled={retrying}
          onClick={handleRetry}
          style={{
            ...copyBtn,
            marginLeft: 0,
            marginTop: 8,
            width: "auto",
            opacity: retrying ? 0.6 : 1,
          }}
        >
          {retrying ? "Checking…" : "↻ Re-check"}
        </button>
      </div>

      {/* ── Vite Dep Cache ── */}
      {vite ? (
        <div>
          <div style={sectionHeader}>Vite Dep-Optimisation Cache</div>
          <div style={row}>
            <span style={pillOk}>DEV</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.80)" }}>Mode: {vite.mode}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, marginTop: 1 }}>
                Cache: <code style={{ color: "rgba(124,58,237,0.75)" }}>{vite.cacheDir}</code>
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 8, padding: "8px 10px",
            background: "rgba(124,58,237,0.06)",
            border: "0.5px solid rgba(124,58,237,0.15)",
            borderRadius: 8,
            fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.5,
          }}>
            {vite.hint}
          </div>
          <button
            type="button"
            style={reloadBtn}
            onClick={() => window.location.reload()}
          >
            ↻ Hard-reload (clears module cache)
          </button>
        </div>
      ) : (
        <div>
          <div style={sectionHeader}>Vite Dep-Optimisation Cache</div>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
            Not available in production builds.
          </div>
        </div>
      )}

      {/* ── Chunk / 504 Error Log ── */}
      <div>
        <div style={{ ...sectionHeader, display: "flex", alignItems: "center" }}>
          <span style={{ flex: 1 }}>504 / ChunkLoadError Log</span>
          <button type="button" style={{ ...copyBtn, margin: 0 }} onClick={handleCopyLog}>
            {copied ? "Copied!" : "Copy log"}
          </button>
        </div>

        {chunkErrors.length === 0 ? (
          <div style={{ color: "rgba(34,197,94,0.60)", fontSize: 10, padding: "6px 0" }}>
            ✓ No chunk-load or 504 errors detected this session.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {chunkErrors.map((e, i) => (
              <div key={i} style={{
                padding: "7px 10px",
                background: "rgba(239,68,68,0.07)",
                border: "0.5px solid rgba(239,68,68,0.18)",
                borderRadius: 8,
              }}>
                <div style={{ color: "#f87171", fontSize: 9, marginBottom: 2 }}>{ts(e.ts)}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", wordBreak: "break-all" }}>{e.message}</div>
                {e.url && (
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.30)", marginTop: 2, wordBreak: "break-all" }}>
                    {e.url}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {chunkErrors.length > 0 && (
          <div style={{
            marginTop: 10, padding: "10px 12px",
            background: "rgba(239,68,68,0.06)",
            border: "0.5px solid rgba(239,68,68,0.15)",
            borderRadius: 8,
            fontSize: 10, color: "rgba(255,255,255,0.50)", lineHeight: 1.6,
          }}>
            <strong style={{ color: "#f87171" }}>Fix 504 chunk errors:</strong>
            <ol style={{ margin: "4px 0 0 16px", padding: 0 }}>
              <li>Stop the dev server</li>
              <li>Run <code style={{ color: "rgba(124,58,237,0.75)" }}>rm -rf node_modules/.vite</code></li>
              <li>Run <code style={{ color: "rgba(124,58,237,0.75)" }}>bun run dev</code></li>
            </ol>
            <button
              type="button"
              style={{ ...reloadBtn, marginTop: 8, background: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.25)", color: "#f87171" }}
              onClick={() => window.location.reload()}
            >
              ↻ Reload now
            </button>
          </div>
        )}
      </div>

      {/* ── Session info ── */}
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "0.5px solid rgba(255,255,255,0.06)", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
        mem0Mode: <span style={{ color: health?.mem0Mode === "real" ? "#4ade80" : "#fbbf24" }}>{health?.mem0Mode ?? "…"}</span>
        &nbsp;·&nbsp;
        Session: {typeof window !== "undefined" ? window.location.host : "—"}
      </div>
    </div>
  );
}

/* ── Toggle-button hint ── */
function Trigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="Open Dev Health Panel (Ctrl+Shift+H)"
      title="Dev Health (Ctrl/Cmd+Shift+H)"
      onClick={onOpen}
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9998,
        background: "rgba(8,8,16,0.88)",
        border: "0.5px solid rgba(124,58,237,0.35)",
        borderRadius: 8,
        color: "rgba(124,58,237,0.75)",
        cursor: "pointer",
        padding: "6px 10px",
        fontFamily: mono,
        fontSize: 9,
        letterSpacing: "0.08em",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 5,
        transition: "opacity 0.2s",
        opacity: 0.6,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
    >
      <span style={{ fontSize: 11 }}>⚙</span>
      DEV
    </button>
  );
}

/* ── Main export ── */
export function DevHealthPanel() {
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

  const toggle = useCallback(() => setOpen((p) => !p), []);
  const close  = useCallback(() => setOpen(false), []);

  // Keyboard shortcut: Ctrl/Cmd + Shift + H
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "h") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && openRef.current) {
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle, close]);

  // Only render in dev or when explicitly enabled
  if (typeof window !== "undefined" && !import.meta.env.DEV) return null;

  return (
    <>
      {!open && <Trigger onOpen={toggle} />}
      {open && <PanelContent onClose={close} />}
    </>
  );
}
