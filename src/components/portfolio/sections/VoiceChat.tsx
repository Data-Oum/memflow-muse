import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Mic, MicOff, Send, Square, Volume2, VolumeX, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Section } from "../ui/Section";
import { Label } from "../ui/Label";
import { logSearch } from "@/lib/api/search-history.functions";
import { useEnvHealth } from "@/hooks/use-env-health";

/* Web Speech API typing — minimal */
type SR = {
  start(): void;
  stop(): void;
  abort(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getSR(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const MIC_ERRORS: Record<string, string> = {
  "not-allowed": "Microphone permission denied. Enable it in your browser's site settings, then retry.",
  "service-not-allowed": "Voice input is blocked by your browser. Check site permissions.",
  "no-speech": "Didn't catch that. Try speaking a bit louder.",
  "audio-capture": "No microphone found. Plug one in and retry.",
  "not-found": "No microphone detected on this device.",
  "network": "Network error while transcribing. Check your connection and retry.",
  "aborted": "Voice input was stopped.",
  "not-supported": "Voice input isn't supported in this browser. Try Chrome, Edge or Safari.",
};

const STORAGE_KEY = "voicechat_history_v1";

export function VoiceChat({ visitorId }: { visitorId: string }) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { data: envHealth } = useEnvHealth();
  const gatewayOffline = envHealth ? envHealth.missing.includes("LOVABLE_API_KEY") : false;
  const [input, setInput] = useState("");
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const recRef = useRef<SR | null>(null);
  const spokenRef = useRef<Set<string>>(new Set());
  const lastPromptRef = useRef<string>("");

  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    transport,
    onError: (e) => console.error("[chat] error:", e),
  });

  const busy = status === "submitted" || status === "streaming";

  /* Restore last 10 turns on mount (display-only; AI SDK manages its own state) */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      // hydration of useChat messages isn't supported across reloads; we just
      // surface the last prompt so the user can re-send via "Retry last".
      const arr = JSON.parse(raw) as { role: string; text: string }[];
      const lastUser = [...arr].reverse().find((m) => m.role === "user");
      if (lastUser) lastPromptRef.current = lastUser.text;
    } catch { /* ignore */ }
  }, []);

  /* Persist messages (capped at 10) for state recovery */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const slim = messages.slice(-10).map((m) => ({
        role: m.role,
        text: m.parts.map((p) => (p.type === "text" ? p.text : "")).join(""),
      }));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
    } catch { /* ignore quota */ }
  }, [messages]);

  /* TTS — read newly finished assistant messages */
  useEffect(() => {
    if (!speakEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (spokenRef.current.has(last.id)) return;
    const text = last.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(" ")
      .trim();
    if (!text) return;
    spokenRef.current.add(last.id);
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  }, [messages, status, speakEnabled]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    if (gatewayOffline) return;
    lastPromptRef.current = t;
    setInput("");
    setInterim("");
    void sendMessage({ text: t }, { body: { userId: visitorId } });
    void logSearch({
      data: {
        visitorId,
        source: "voice_chat",
        query: t.slice(0, 500),
        metadata: { mode: "chat" },
      },
    }).catch(() => {});
  }

  function stopAll() {
    try { stop(); } catch { /* noop */ }
    try { recRef.current?.abort(); } catch { /* noop */ }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setListening(false);
  }

  function retryLast() {
    if (lastPromptRef.current && !busy) {
      send(lastPromptRef.current);
    } else {
      regenerate();
    }
  }

  async function toggleMic() {
    setMicError(null);
    const Ctor = getSR();
    if (!Ctor) {
      setMicError(MIC_ERRORS["not-supported"]);
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      }
    } catch (err) {
      const name = (err as { name?: string })?.name ?? "";
      if (name === "NotFoundError" || name === "OverconstrainedError") {
        setMicError(MIC_ERRORS["not-found"]);
      } else if (name === "NotAllowedError" || name === "SecurityError") {
        setMicError(MIC_ERRORS["not-allowed"]);
      } else {
        setMicError("Couldn't access microphone. Check permissions and retry.");
      }
      return;
    }
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    let finalText = "";
    rec.onresult = (e) => {
      let live = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else live += r[0].transcript;
      }
      setInput(finalText.trim());
      setInterim(live.trim());
    };
    rec.onerror = (e) => {
      setMicError(MIC_ERRORS[e.error] ?? `Voice error: ${e.error}`);
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
      setInterim("");
      if (finalText.trim()) send(finalText.trim());
    };
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
      setMicError("Couldn't start the microphone. Retry in a moment.");
    }
  }

  function toggleSpeak() {
    const next = !speakEnabled;
    setSpeakEnabled(next);
    if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  const suggestions = [
    "What makes Amit a fit for mem0?",
    "Summarize my recent memories",
    "Explain RAG with mem0 in one paragraph",
  ];

  return (
    <Section id="voice">
      <div style={{ marginBottom: 24 }}>
        <Label>// voice-chat-rag</Label>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 4vw, 44px)",
            fontStyle: "italic",
            margin: "8px 0 0",
            color: "var(--ink-primary)",
          }}
        >
          Voice chat, grounded in mem0
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: 16,
          background: "var(--bg-surface)",
          border: "1px solid var(--edge-subtle)",
          borderRadius: "var(--r-lg)",
          padding: 20,
        }}
      >
        {/* Controls */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <Label>Powered by Lovable AI · RAG over mem0</Label>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={toggleSpeak}
              aria-pressed={speakEnabled}
              aria-label={speakEnabled ? "Mute voice playback" : "Enable voice playback"}
              style={iconBtn(speakEnabled)}
            >
              {speakEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {speakEnabled ? "Voice on" : "Voice off"}
            </button>
          </div>
        </div>

        {/* Transcript */}
        <div
          style={{
            minHeight: 220,
            maxHeight: 380,
            overflowY: "auto",
            background: "var(--bg-raised)",
            borderRadius: "var(--r-md)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "var(--ink-tertiary)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
              // Ask anything. Memories saved in the demo above are used as RAG context.
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: isUser ? "var(--ink-primary)" : "var(--bg-surface)",
                  color: isUser ? "white" : "var(--ink-primary)",
                  border: isUser ? "none" : "1px solid var(--edge-subtle)",
                  padding: "10px 14px",
                  borderRadius: 14,
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                {isUser ? (
                  text
                ) : (
                  <div className="prose prose-sm" style={{ maxWidth: "100%" }}>
                    <ReactMarkdown>{text || "…"}</ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })}
          {busy && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-tertiary)", fontSize: 12 }}>
              <Loader2 size={14} className="animate-spin" /> thinking…
            </div>
          )}
          {listening && interim && (
            <div
              style={{
                alignSelf: "flex-end",
                maxWidth: "85%",
                background: "var(--signal-light)",
                color: "var(--signal)",
                border: "1px dashed var(--signal-border)",
                padding: "8px 12px",
                borderRadius: 14,
                fontSize: 13,
                fontStyle: "italic",
              }}
            >
              {interim}…
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              background: "#FEE2E2",
              color: "#991B1B",
              border: "1px solid #FCA5A5",
              padding: "8px 12px",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            <span>Something went wrong streaming the response.</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" onClick={retryLast} style={iconBtn(false)}>Retry</button>
              <button type="button" onClick={() => regenerate()} style={iconBtn(false)}>Regenerate</button>
            </div>
          </div>
        )}
        {micError && (
          <div
            role="alert"
            style={{
              background: "#FEF3C7",
              color: "#92400E",
              border: "1px solid #FCD34D",
              padding: "8px 12px",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            {micError}
          </div>
        )}

        {/* Suggestions */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} disabled={busy} style={chip()}>
              {s}
            </button>
          ))}
        </div>

        {/* Input row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <button
            type="button"
            onClick={toggleMic}
            aria-label={listening ? "Stop listening" : "Start voice input"}
            aria-pressed={listening}
            style={iconBtn(listening)}
          >
            {listening ? <MicOff size={14} /> : <Mic size={14} />}
            {listening ? "Listening" : "Voice"}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Amit's assistant…"
            disabled={busy}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "var(--r-md)",
              border: "1px solid var(--edge-subtle)",
              background: "var(--bg-page)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              color: "var(--ink-primary)",
              outline: "none",
            }}
          />
          {busy ? (
            <button type="button" onClick={stopAll} style={iconBtn(true)}>
              <Square size={14} /> Stop
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} style={iconBtn(false)}>
              <Send size={14} /> Send
            </button>
          )}
        </form>
      </div>
    </Section>
  );
}

function iconBtn(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 12px",
    borderRadius: "var(--r-full)",
    border: active ? "1px solid var(--signal-border)" : "1px solid var(--edge-subtle)",
    background: active ? "var(--signal-light)" : "var(--bg-surface)",
    color: active ? "var(--signal)" : "var(--ink-primary)",
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    cursor: "pointer",
    transition: "all .15s ease",
  };
}

function chip(): React.CSSProperties {
  return {
    padding: "6px 10px",
    borderRadius: "var(--r-full)",
    border: "1px solid var(--edge-subtle)",
    background: "var(--bg-surface)",
    color: "var(--ink-secondary)",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    cursor: "pointer",
  };
}