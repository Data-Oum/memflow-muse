import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Mic, MicOff, Send, Square, X, Loader2, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

/* ── Types ── */
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
type MicState = "idle" | "requesting" | "listening" | "error";

function getSR(): (new () => SR) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const MIC_ERRORS: Record<string, string> = {
  "not-allowed": "Microphone permission denied. Enable it in your browser's site settings.",
  "service-not-allowed": "Voice input is blocked by your browser.",
  "no-speech": "Didn't catch that. Try speaking louder.",
  "audio-capture": "No microphone found.",
  "not-found": "No microphone detected.",
  "network": "Network error while transcribing.",
  "aborted": "Voice input stopped.",
  "not-supported": "Voice input isn't supported in this browser. Try Chrome or Safari.",
};

const STORAGE_KEY = "voicechat_history_v1";

export function VoiceChatDialog({ visitorId }: { visitorId: string }) {
  const [open, setOpen] = useState(false);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [input, setInput] = useState("");
  const [interim, setInterim] = useState("");
  const [micState, setMicState] = useState<MicState>("idle");
  const [micError, setMicError] = useState<string | null>(null);
  const recRef = useRef<SR | null>(null);
  const lastPromptRef = useRef<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    transport,
    onError: (e) => console.error("[chat] error:", e),
  });

  const busy = status === "submitted" || status === "streaming";

  /* Restore last prompt */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const arr = JSON.parse(raw) as { role: string; text: string }[];
      const lastUser = [...arr].reverse().find((m) => m.role === "user");
      if (lastUser) lastPromptRef.current = lastUser.text;
    } catch { /* ignore */ }
  }, []);

  /* Persist messages */
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

  /* Auto scroll to bottom */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy, interim]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    lastPromptRef.current = t;
    setInput("");
    setInterim("");
    void sendMessage({ text: t }, { body: { userId: visitorId } });
  }

  function stopAll() {
    try { stop(); } catch { /* noop */ }
    try { recRef.current?.abort(); } catch { /* noop */ }
    cleanupMic();
    setMicState("idle");
  }

  function retryLast() {
    if (lastPromptRef.current && !busy) {
      send(lastPromptRef.current);
    } else {
      regenerate();
    }
  }

  function cleanupMic() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
    }
    analyserRef.current = null;
  }

  /* Waveform rendering */
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyserRef.current) return;
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 24;
      const barWidth = canvas.width / barCount - 2;
      const maxHeight = canvas.height * 0.9;

      for (let i = 0; i < barCount; i++) {
        const idx = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[idx] / 255;
        const height = Math.max(2, value * maxHeight);

        const x = i * (barWidth + 2);
        const y = (canvas.height - height) / 2;

        ctx.fillStyle = `rgba(124, 58, 237, ${0.4 + value * 0.6})`;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 1);
        ctx.fill();
      }
    };

    draw();
  }, []);

  async function toggleMic() {
    setMicError(null);
    const Ctor = getSR();
    if (!Ctor) {
      setMicError(MIC_ERRORS["not-supported"]);
      setMicState("error");
      return;
    }
    if (micState === "listening") {
      recRef.current?.stop();
      cleanupMic();
      setMicState("idle");
      return;
    }

    setMicState("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up waveform analyser
      try {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        drawWaveform();
      } catch { /* waveform is optional */ }
    } catch (err) {
      const name = (err as { name?: string })?.name ?? "";
      if (name === "NotFoundError" || name === "OverconstrainedError") {
        setMicError(MIC_ERRORS["not-found"]);
      } else if (name === "NotAllowedError" || name === "SecurityError") {
        setMicError(MIC_ERRORS["not-allowed"]);
      } else {
        setMicError("Couldn't access microphone. Check permissions.");
      }
      setMicState("error");
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
      setMicState("error");
      cleanupMic();
    };
    rec.onend = () => {
      setMicState("idle");
      setInterim("");
      cleanupMic();
      if (finalText.trim()) send(finalText.trim());
    };
    recRef.current = rec;
    setMicState("listening");
    try {
      rec.start();
    } catch {
      setMicState("error");
      setMicError("Couldn't start the microphone. Retry in a moment.");
      cleanupMic();
    }
  }

  const suggestions = [
    "What makes Amit a fit for mem0?",
    "Explain RAG with mem0",
  ];

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        className="voice-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open AI chat"}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Dialog */}
      {open && (
        <div className="voice-dialog" data-lenis-prevent>
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--edge-default)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "var(--font-display)", color: "var(--ink-primary)" }}>
                Ask Amit's Assistant
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-tertiary)" }}>
                Powered by mem0 RAG
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-tertiary)",
                padding: 4,
                display: "flex",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Transcript */}
          <div
            data-lenis-prevent
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: "var(--ink-tertiary)", fontSize: 12, fontFamily: "var(--font-mono)", textAlign: "center", padding: "24px 0" }}>
                Ask anything. Memories are used as RAG context.
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
                    background: isUser ? "var(--ink-primary)" : "var(--bg-raised)",
                    color: isUser ? "white" : "var(--ink-primary)",
                    border: isUser ? "none" : "1px solid var(--edge-default)",
                    padding: "10px 14px",
                    borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                    fontSize: 13,
                    lineHeight: 1.55,
                  }}
                >
                  {isUser ? (
                    text
                  ) : (
                    <div style={{ maxWidth: "100%" }}>
                      <ReactMarkdown>{text || "…"}</ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}
            {busy && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-tertiary)", fontSize: 11, fontFamily: "var(--font-mono)" }}>
                <Loader2 size={12} className="spin" /> thinking…
              </div>
            )}
            {micState === "listening" && interim && (
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "85%",
                  background: "var(--signal-light)",
                  color: "var(--signal)",
                  border: "1px dashed var(--signal-border)",
                  padding: "8px 12px",
                  borderRadius: "14px 14px 4px 14px",
                  fontSize: 12,
                  fontStyle: "italic",
                }}
              >
                {interim}…
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Waveform */}
          {micState === "listening" && (
            <div style={{ padding: "0 14px 8px", display: "flex", justifyContent: "center" }}>
              <canvas
                ref={canvasRef}
                width={320}
                height={32}
                style={{ width: "100%", maxWidth: 320, height: 32 }}
              />
            </div>
          )}

          {/* Error states */}
          {(error || micError) && (
            <div style={{ padding: "0 14px 8px" }}>
              {error && (
                <div
                  role="alert"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    background: "#FEF2F2",
                    color: "#991B1B",
                    border: "1px solid #FECACA",
                    padding: "6px 10px",
                    borderRadius: "var(--r-md)",
                    fontSize: 11,
                    marginBottom: 6,
                  }}
                >
                  <span>Streaming failed.</span>
                  <button type="button" onClick={retryLast} style={smallBtn}>Retry</button>
                </div>
              )}
              {micError && (
                <div
                  role="alert"
                  style={{
                    background: "#FFFBEB",
                    color: "#92400E",
                    border: "1px solid #FDE68A",
                    padding: "6px 10px",
                    borderRadius: "var(--r-md)",
                    fontSize: 11,
                  }}
                >
                  {micError}
                </div>
              )}
            </div>
          )}

          {/* Suggestions */}
          {messages.length === 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "0 14px 8px" }}>
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={busy} style={chipStyle}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              padding: "10px 14px",
              borderTop: "1px solid var(--edge-default)",
            }}
          >
            <button
              type="button"
              onClick={toggleMic}
              aria-label={micState === "listening" ? "Stop listening" : "Start voice input"}
              style={{
                width: 34,
                height: 34,
                borderRadius: "var(--r-full)",
                border: micState === "listening" ? "1px solid var(--signal-border)" : "1px solid var(--edge-default)",
                background: micState === "listening" ? "var(--signal-light)" : "var(--bg-surface)",
                color: micState === "listening" ? "var(--signal)" : "var(--ink-tertiary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {micState === "listening" ? <MicOff size={14} /> : <Mic size={14} />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              disabled={busy}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "var(--r-full)",
                border: "1px solid var(--edge-default)",
                background: "var(--bg-raised)",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--ink-primary)",
                outline: "none",
              }}
            />
            {busy ? (
              <button type="button" onClick={stopAll} style={iconBtn}>
                <Square size={14} />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim()} style={iconBtn}>
                <Send size={14} />
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}

const iconBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "var(--r-full)",
  border: "1px solid var(--edge-default)",
  background: "var(--bg-surface)",
  color: "var(--ink-primary)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  transition: "all 0.15s",
};

const smallBtn: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #FECACA",
  color: "#991B1B",
  padding: "2px 8px",
  borderRadius: "var(--r-full)",
  fontSize: 10,
  fontFamily: "var(--font-mono)",
  cursor: "pointer",
};

const chipStyle: React.CSSProperties = {
  padding: "5px 10px",
  borderRadius: "var(--r-full)",
  border: "1px solid var(--edge-default)",
  background: "var(--bg-surface)",
  color: "var(--ink-secondary)",
  fontSize: 11,
  fontFamily: "var(--font-mono)",
  cursor: "pointer",
  transition: "border-color 0.15s",
};
