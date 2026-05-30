import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Search, Plus, Trash2, Loader2 } from "lucide-react";
import { mem0 as mockMem0, CATEGORY_COLORS, type MemoryCategory } from "@/lib/mem0/mock-client";
import {
  addMemoryFn,
  searchMemoryFn,
  deleteMemoryFn,
  type MemoryResult,
} from "@/lib/api/memory.functions";
import { Section } from "../ui/Section";
import { Label } from "../ui/Label";

/* ── Helpers ────────────────────────────────────────────────── */

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.max(1, Math.floor(diff))}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function syntaxHighlight(code: string) {
  const out: ReactNode[] = [];
  const lines = code.split("\n");
  lines.forEach((line, li) => {
    const parts: ReactNode[] = [];
    let idx = 0;
    const re =
      /("[^"]*")|(\bawait\b)|(\.[a-zA-Z_]+)|(\bconst\b|\blet\b|\bnew\b)|(\bclient\b|\bmem0\b)|(\{|\}|\[|\])/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > idx) parts.push(line.slice(idx, m.index));
      const text = m[0];
      let color = "#F0F0FF";
      if (m[1]) color = "#FB923C";
      else if (m[2]) color = "#16A07C";
      else if (m[3]) color = "#8B5CF6";
      else if (m[4]) color = "#16A07C";
      else if (m[5]) color = "#F0F0FF";
      else if (m[6]) color = "#9CA3AF";
      parts.push(
        <span key={`${li}-${m.index}`} style={{ color }}>
          {text}
        </span>,
      );
      idx = m.index + text.length;
    }
    if (idx < line.length) parts.push(line.slice(idx));
    out.push(<div key={li}>{parts.length ? parts : " "}</div>);
  });
  return out;
}

/* ── Quick-fill suggestions ─────────────────────────────────── */

const QUICK_FILL = [
  "I prefer TypeScript over JavaScript",
  "I'm a startup founder in India",
  "I love minimal light mode UIs",
];

/* ── Component ──────────────────────────────────────────────── */

export function Mem0Demo({
  visitorId,
  showToast,
}: {
  visitorId: string;
  showToast: (m: string) => void;
}) {
  const [input, setInput] = useState("");
  const [memories, setMemories] = useState<MemoryResult[]>([]);
  const [results, setResults] = useState<(MemoryResult & { score: string })[] | null>(null);
  const [loading, setLoading] = useState<"add" | "search" | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [apiMode, setApiMode] = useState<"real" | "mock" | null>(null);
  const [code, setCode] = useState<string>(
    `await mem0.add(\n  [{ role: "user", content: "..." }],\n  { user_id: "${visitorId}" }\n);`,
  );

  const onAdd = useCallback(async () => {
    if (!input.trim()) return;
    setLoading("add");
    setCode(
      `await mem0.add(\n  [{ role: "user", content: "${input.replace(/"/g, '\\"')}" }],\n  { user_id: "${visitorId}" }\n);`,
    );
    try {
      const res = (await addMemoryFn({
        data: {
          messages: [{ role: "user", content: input }],
          user_id: visitorId,
          metadata: { source: "portfolio_demo" },
        },
      })) as { success: boolean; data?: MemoryResult; apiMode: "real" | "mock" };
      if (res.success && res.data) {
        setMemories((prev) => [res.data!, ...prev]);
        setApiMode(res.apiMode);
        showToast(res.apiMode === "real" ? "Memory stored via mem0 API" : "Memory stored (local)");
      }
    } catch {
      const entry = await mockMem0.add([{ role: "user", content: input }], {
        user_id: visitorId,
        metadata: { source: "portfolio_demo" },
      });
      setMemories((prev) => [entry as unknown as MemoryResult, ...prev]);
      setApiMode("mock");
      showToast("Memory stored (local fallback)");
    }
    setResults(null);
    setInput("");
    setLoading(null);
  }, [input, visitorId, showToast]);

  const onSearch = useCallback(async () => {
    setLoading("search");
    setCode(
      `await mem0.search(\n  "${searchQ.replace(/"/g, '\\"')}",\n  { user_id: "${visitorId}" }\n);`,
    );
    try {
      const res = (await searchMemoryFn({
        data: { query: searchQ || "*", user_id: visitorId },
      })) as {
        success: boolean;
        data?: (MemoryResult & { score: string })[];
        apiMode: "real" | "mock";
      };
      if (res.success && res.data) {
        setResults(res.data);
        setApiMode(res.apiMode);
      }
    } catch {
      const res = await mockMem0.search(searchQ || "*", {
        filters: { user_id: visitorId },
      });
      setResults(res as (MemoryResult & { score: string })[]);
      setApiMode("mock");
    }
    setLoading(null);
  }, [searchQ, visitorId]);

  const onDelete = useCallback(async (id: string) => {
    try {
      await deleteMemoryFn({ data: { memory_id: id } });
    } catch {
      await mockMem0.delete(id);
    }
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setResults((prev) => (prev ? prev.filter((m) => m.id !== id) : null));
    setCode(`await mem0.delete("${id}");`);
  }, []);

  const matchedIds = useMemo(() => new Set((results ?? []).map((r) => r.id)), [results]);
  const scoreById = useMemo(() => {
    const map = new Map<string, string>();
    (results ?? []).forEach((r) => map.set(r.id, r.score));
    return map;
  }, [results]);

  return (
    <Section id="demo">
      <Label>{"[ mem0.playground({ live: true }) ]"}</Label>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          margin: "8px 0 12px",
          fontWeight: 400,
        }}
      >
        <span style={{ fontStyle: "italic" }}>Memory</span> in action.
      </h2>
      <p
        style={{
          color: "var(--ink-secondary)",
          fontSize: 18,
          marginBottom: 48,
          maxWidth: 640,
          lineHeight: 1.6,
        }}
      >
        This demo runs the real mem0 API surface. Add memories. Search them. Watch the retrieval
        scores. This is what I would build for your users.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {/* LEFT — Input panel */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--edge-subtle)",
            borderRadius: "var(--r-lg)",
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--signal)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>mem0 · add()</span>
            {apiMode && (
              <span
                style={{
                  background: apiMode === "real" ? "rgba(22,160,124,0.1)" : "rgba(245,158,11,0.1)",
                  color: apiMode === "real" ? "var(--signal)" : "#F59E0B",
                  border: `1px solid ${apiMode === "real" ? "rgba(22,160,124,0.25)" : "rgba(245,158,11,0.3)"}`,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: "var(--r-full)",
                }}
              >
                {apiMode === "real" ? "● API Connected" : "○ Local Demo Mode"}
              </span>
            )}
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me something about you..."
            aria-label="Memory content"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--edge-default)",
              borderRadius: "var(--r-md)",
              padding: 12,
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              minHeight: 80,
              resize: "vertical",
              color: "var(--ink-primary)",
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--signal)";
              e.currentTarget.style.boxShadow = "var(--signal-glow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--edge-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK_FILL.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setInput(q)}
                style={{
                  background: "var(--signal-light)",
                  border: "1px solid var(--signal-border)",
                  color: "var(--signal)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "5px 12px",
                  borderRadius: "var(--r-full)",
                  cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={onAdd}
              disabled={loading === "add" || !input.trim()}
              aria-busy={loading === "add"}
              style={{
                background: "var(--signal)",
                color: "white",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: "var(--r-md)",
                border: "none",
                cursor: loading === "add" ? "wait" : "pointer",
                opacity: loading === "add" || !input.trim() ? 0.7 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {loading === "add" ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
              {loading === "add" ? "Storing..." : "Store Memory"}
            </button>
            <button
              type="button"
              onClick={() => setShowSearch((s) => !s)}
              style={{
                background: "transparent",
                border: "1px solid var(--edge-strong)",
                color: "var(--ink-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                padding: "10px 16px",
                borderRadius: "var(--r-md)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Search size={14} />
              Search Memory
            </button>
          </div>

          {showSearch && (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
                placeholder="Search stored memories..."
                aria-label="Search query"
                style={{
                  flex: 1,
                  background: "var(--bg-raised)",
                  border: "1px solid var(--edge-default)",
                  borderRadius: "var(--r-md)",
                  padding: "10px 12px",
                  fontSize: 14,
                  outline: "none",
                  color: "var(--ink-primary)",
                }}
              />
              <button
                type="button"
                onClick={onSearch}
                aria-busy={loading === "search"}
                style={{
                  background: "var(--ink-primary)",
                  color: "white",
                  fontSize: 13,
                  padding: "10px 16px",
                  borderRadius: "var(--r-md)",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {loading === "search" ? (
                  <Loader2 size={14} className="spin" />
                ) : (
                  <Search size={14} />
                )}
                Run
              </button>
            </div>
          )}

          {/* Live code preview - Terminal Style */}
          <div
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--r-md)",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              lineHeight: 1.7,
              color: "#A1A1AA",
              overflow: "hidden",
              boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            }}
          >
            {/* Terminal Header */}
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
              <div style={{ marginLeft: 8, fontSize: 11, color: "#71717A" }}>bash</div>
            </div>
            {/* Terminal Body */}
            <div style={{ padding: 20, whiteSpace: "pre", overflowX: "auto" }}>
              {loading ? (
                <span
                  style={{
                    color: "var(--signal)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Loader2 size={12} className="spin" />
                  Processing with Mem0...
                </span>
              ) : (
                syntaxHighlight(code)
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Memory state panel */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--edge-subtle)",
            borderRadius: "var(--r-lg)",
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            minHeight: 360,
            boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Stored Memories</div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--ink-tertiary)",
                }}
              >
                user_id: {visitorId}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  background: "var(--signal-light)",
                  color: "var(--signal)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: "var(--r-full)",
                }}
              >
                {memories.length} {memories.length === 1 ? "Memory" : "Memories"}
              </span>
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--signal)",
                }}
              >
                <span
                  className="pm-pulse"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--signal)",
                  }}
                />
                Connected
              </span>
            </div>
          </div>

          {memories.length === 0 ? (
            <div
              style={{
                border: "2px dashed var(--edge-signal)",
                borderRadius: "var(--r-md)",
                padding: 40,
                textAlign: "center",
                color: "var(--ink-tertiary)",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 2a4 4 0 00-4 4v1a4 4 0 00-2 7.5V17a3 3 0 003 3h6a3 3 0 003-3v-2.5A4 4 0 0016 7V6a4 4 0 00-4-4z"
                  stroke="var(--signal)"
                  strokeWidth="1.5"
                />
              </svg>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>No memories yet.</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                Start typing to watch Mem0 extract and store context.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                overflowY: "auto",
                maxHeight: 480,
              }}
            >
              {results && (
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--signal)",
                  }}
                >
                  Relevance ↓
                </div>
              )}
              {memories.map((m) => {
                const isMatch = !results || matchedIds.has(m.id);
                const score = scoreById.get(m.id);
                const cat = m.category as MemoryCategory;
                const color = CATEGORY_COLORS[cat] ?? "#6B7280";
                return (
                  <div
                    key={m.id}
                    className="pm-slide-in"
                    style={{
                      background: "var(--bg-raised)",
                      border: "1px solid var(--edge-subtle)",
                      borderRadius: "var(--r-md)",
                      padding: "12px 14px",
                      opacity: isMatch ? 1 : 0.4,
                      transition: "opacity 0.3s",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--ink-tertiary)",
                        }}
                      >
                        {m.id.slice(0, 12)}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            background: `${color}1a`,
                            color,
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: "var(--r-full)",
                          }}
                        >
                          {m.category}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--ink-tertiary)",
                          }}
                        >
                          {timeAgo(m.created_at)}
                        </span>
                        <button
                          type="button"
                          aria-label="Delete memory"
                          onClick={() => onDelete(m.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--ink-tertiary)",
                            padding: 2,
                            display: "inline-flex",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "var(--ink-tertiary)")
                          }
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: "var(--ink-primary)",
                        lineHeight: 1.5,
                      }}
                    >
                      {m.memory}
                    </div>
                    {score && (
                      <div style={{ marginTop: 8 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--signal)",
                            marginBottom: 3,
                          }}
                        >
                          Score: {score}
                        </div>
                        <div
                          style={{
                            height: 3,
                            background: "var(--bg-overlay)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${Number(score) * 100}%`,
                              background: "var(--signal)",
                              transition: "width 0.4s ease-out",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
