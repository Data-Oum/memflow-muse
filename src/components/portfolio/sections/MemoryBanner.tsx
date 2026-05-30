import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";

export function MemoryBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const visitsRaw = localStorage.getItem("portfolio_visit_count");
      const dismissed = sessionStorage.getItem("portfolio_banner_dismissed");
      const count = visitsRaw ? parseInt(visitsRaw, 10) : 0;
      localStorage.setItem("portfolio_visit_count", String(count + 1));
      if (count > 0 && !dismissed) setShow(true);
    } catch {
      // ignore storage errors
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="pm-slide-down"
      style={{
        position: "sticky",
        top: 56,
        zIndex: 90,
        background: "var(--signal-light)",
        borderBottom: "1px solid var(--signal-border)",
        height: 40,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--signal)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Bell size={12} />
        [ memory recalled ] · Welcome back. You&apos;ve been here before.
      </span>
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => {
          try {
            sessionStorage.setItem("portfolio_banner_dismissed", "1");
          } catch {
            // ignore
          }
          setShow(false);
        }}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--signal)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          padding: 4,
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
