import { useEffect, useMemo, useState } from "react";
import { Download, X, RefreshCw } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "pwa_install_dismissed_v1";

export function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as { standalone?: boolean }).standalone);
  }, []);

  useEffect(() => {
    if (isStandalone || localStorage.getItem(DISMISS_KEY) === "1") return;
    const showTimer = window.setTimeout(() => setVisible(true), 20000);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      window.clearTimeout(showTimer);
      setVisible(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      localStorage.setItem(DISM_KEY_SAFE(), "1");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [isStandalone]);

  if (isStandalone || installed || !visible) return null;

  const canPrompt = Boolean(promptEvent);
  const install = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "dismissed") localStorage.setItem(DISMISS_KEY, "1");
    setPromptEvent(null);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Install portfolio app"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 250,
        width: "min(360px, calc(100vw - 36px))",
        background: "var(--bg-surface)",
        color: "var(--ink-primary)",
        borderRadius: "var(--r-lg)",
        padding: 14,
        display: "grid",
        gap: 12,
      }}
    >
      <button
        type="button"
        aria-label="Dismiss install prompt"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setVisible(false);
        }}
        style={{ position: "absolute", top: 10, right: 10, border: "none", background: "transparent", color: "var(--ink-tertiary)", cursor: "pointer" }}
      >
        <X size={14} />
      </button>
      <div style={{ paddingRight: 24 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--signal)", marginBottom: 6 }}>// installable-pwa</div>
        <strong style={{ display: "block", fontSize: 15, marginBottom: 4 }}>Keep this portfolio offline.</strong>
        <p style={{ margin: 0, color: "var(--ink-secondary)", fontSize: 13, lineHeight: 1.5 }}>
          {canPrompt ? "Install it as a lightweight app with offline access." : "Use your browser menu to Add to Home Screen; offline fallback is already enabled."}
        </p>
      </div>
      <button
        type="button"
        onClick={canPrompt ? install : () => window.location.reload()}
        style={{ border: "none", background: "var(--ink-primary)", color: "var(--bg-surface)", borderRadius: "var(--r-full)", minHeight: 38, padding: "0 14px", fontFamily: "var(--font-mono)", fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        {canPrompt ? <Download size={14} /> : <RefreshCw size={14} />}
        {canPrompt ? "Install" : "Check again"}
      </button>
    </div>
  );
}

function DISM_KEY_SAFE() {
  return DISMISS_KEY;
}