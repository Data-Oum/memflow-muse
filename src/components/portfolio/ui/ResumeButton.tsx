import { useEffect, useRef, useState } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { generateResumeText } from "../data/resume";

type DownloadState = "idle" | "downloading" | "done" | "error";

export function ResumeButton() {
  const [state, setState] = useState<DownloadState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDownload = async () => {
    setState("downloading");
    try {
      // Try to fetch the real PDF first
      const res = await fetch("/Amit Chakraborty.pdf");
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Amit-Chakraborty-Resume.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setState("done");
      } else {
        throw new Error("PDF not found");
      }
    } catch {
      // Fallback: generate inline text blob
      const resumeText = generateResumeText();
      const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Amit-Chakraborty-Resume.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setState("done");
    }
    timerRef.current = setTimeout(() => setState("idle"), 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const Icon =
    state === "downloading" ? Loader2 : state === "done" ? Check : Download;

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={state === "downloading"}
      aria-busy={state === "downloading"}
      aria-label={
        state === "downloading"
          ? "Preparing download"
          : state === "done"
            ? "Download complete"
            : "Download resume"
      }
      style={{
        background: "transparent",
        border: `1px solid ${state === "done" ? "var(--edge-signal)" : "var(--edge-strong)"}`,
        color:
          state === "done"
            ? "var(--signal)"
            : state === "error"
              ? "#DC2626"
              : "var(--ink-secondary)",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        padding: "10px 20px",
        borderRadius: "var(--r-md)",
        cursor: state === "downloading" ? "wait" : "pointer",
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Icon
        size={14}
        className={state === "downloading" ? "spin" : undefined}
      />
      {state === "downloading"
        ? "Preparing..."
        : state === "done"
          ? "Downloaded"
          : state === "error"
            ? "Try Again"
            : "Download Resume"}
    </button>
  );
}
