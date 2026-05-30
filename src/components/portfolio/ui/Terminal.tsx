import { type ReactNode } from "react";

interface TerminalProps {
  filename: string;
  tool?: string;
  date?: string;
  children: ReactNode;
}

/** Dark terminal panel used in Logs and Contact sections. */
export function Terminal({ filename, tool, date, children }: TerminalProps) {
  return (
    <div
      style={{
        background: "#1A1D23",
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          background: "#14161C",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--ink-tertiary)",
          }}
        >
          {filename}
        </span>
      </div>

      {/* Body */}
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
        {(tool || date) && (
          <div style={{ color: "var(--signal)", fontSize: 11, marginBottom: 12 }}>
            {tool}
            {tool && date ? " · " : ""}
            {date}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
