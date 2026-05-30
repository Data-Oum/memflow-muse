import type { TermLog } from "../data/logs";

export function Terminal({ log }: { log: TermLog }) {
  return (
    <div
      style={{
        background: "#1A1D23",
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div
        style={{
          background: "#14161C",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          aria-hidden
          style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }}
        />
        <span
          aria-hidden
          style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }}
        />
        <span
          aria-hidden
          style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }}
        />
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-tertiary)",
          }}
        >
          {log.filename}
        </span>
      </div>
      <div
        style={{
          padding: "20px 24px",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.9,
          color: "#9CA3AF",
          whiteSpace: "pre-wrap",
          overflowX: "auto",
        }}
      >
        <div style={{ color: "var(--signal)", fontSize: 11, marginBottom: 12 }}>
          {log.tool} · {log.date}
        </div>
        <div style={{ color: "#4B5563" }}>{log.prompt}</div>
        {log.output && <div style={{ marginTop: 12, color: "#F0F0FF" }}>{log.output}</div>}
      </div>
    </div>
  );
}
