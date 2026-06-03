import { useCallback, useState } from "react";
import { CheckCircle2, XCircle, Loader2, PlayCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Section } from "../ui/Section";
import { Label } from "../ui/Label";
import {
  addMemoryFn,
  searchMemoryFn,
  scoreMemoryFn,
  deleteMemoryFn,
} from "@/lib/api/memory.functions";

type StepStatus = "idle" | "running" | "pass" | "fail";
type StepKey = "add" | "search" | "score" | "delete" | "verify";

interface StepState {
  status: StepStatus;
  latencyMs?: number;
  request?: unknown;
  response?: unknown;
  error?: string;
  attempts: number;
}

const INITIAL: Record<StepKey, StepState> = {
  add: { status: "idle", attempts: 0 },
  search: { status: "idle", attempts: 0 },
  score: { status: "idle", attempts: 0 },
  delete: { status: "idle", attempts: 0 },
  verify: { status: "idle", attempts: 0 },
};

const STEP_LABELS: Record<StepKey, string> = {
  add: "add() — store deterministic seed",
  search: "search() — find seed by query",
  score: "score() — verify relevance score",
  delete: "delete() — remove seed",
  verify: "search() — confirm removal",
};

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<{ value: T; attempts: number }> {
  let lastErr: unknown;
  for (let i = 1; i <= attempts; i++) {
    try {
      return { value: await fn(), attempts: i };
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 200 * Math.pow(2, i - 1)));
    }
  }
  throw lastErr;
}

export function Mem0TestPanel({ visitorId }: { visitorId: string }) {
  const [running, setRunning] = useState(false);
  const [apiMode, setApiMode] = useState<"real" | "mock" | null>(null);
  const [steps, setSteps] = useState(INITIAL);
  const [expanded, setExpanded] = useState<Record<StepKey, boolean>>({
    add: false, search: false, score: false, delete: false, verify: false,
  });

  const update = (key: StepKey, patch: Partial<StepState>) =>
    setSteps((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const runSuite = useCallback(async () => {
    setRunning(true);
    setSteps(INITIAL);
    const seed = `Test memory ${Date.now()} — deterministic suite probe`;
    const query = "deterministic suite probe";
    let createdId: string | null = null;

    /* 1. add */
    update("add", { status: "running" });
    const t0 = performance.now();
    try {
      const req = { messages: [{ role: "user" as const, content: seed }], user_id: visitorId, metadata: { source: "test_panel" } };
      const { value: res, attempts } = await withRetry(() => addMemoryFn({ data: req }));
      setApiMode(res.apiMode);
      if (!res.success || !res.data?.id) throw new Error(res.error ?? "no id");
      createdId = res.data.id;
      update("add", { status: "pass", latencyMs: Math.round(performance.now() - t0), request: req, response: res, attempts });
    } catch (err) {
      update("add", { status: "fail", latencyMs: Math.round(performance.now() - t0), error: errMsg(err), attempts: 3 });
      setRunning(false); return;
    }

    /* 2. search */
    update("search", { status: "running" });
    const t1 = performance.now();
    try {
      const req = { query, user_id: visitorId, topK: 8 };
      const { value: res, attempts } = await withRetry(() => searchMemoryFn({ data: req }));
      const hit = res.data?.find((m) => m.id === createdId);
      if (!res.success || !hit) throw new Error("seed not in results");
      update("search", { status: "pass", latencyMs: Math.round(performance.now() - t1), request: req, response: res, attempts });
    } catch (err) {
      update("search", { status: "fail", latencyMs: Math.round(performance.now() - t1), error: errMsg(err), attempts: 3 });
    }

    /* 3. score */
    update("score", { status: "running" });
    const t2 = performance.now();
    try {
      const req = { memory_id: createdId!, query, user_id: visitorId };
      const { value: res, attempts } = await withRetry(() => scoreMemoryFn({ data: req }));
      const num = Number(res.data?.score);
      if (!res.success || Number.isNaN(num)) throw new Error("score not numeric");
      update("score", { status: "pass", latencyMs: Math.round(performance.now() - t2), request: req, response: res, attempts });
    } catch (err) {
      update("score", { status: "fail", latencyMs: Math.round(performance.now() - t2), error: errMsg(err), attempts: 3 });
    }

    /* 4. delete */
    update("delete", { status: "running" });
    const t3 = performance.now();
    try {
      const req = { memory_id: createdId! };
      const { value: res, attempts } = await withRetry(() => deleteMemoryFn({ data: req }));
      if (!res.success) throw new Error(res.error ?? "delete failed");
      update("delete", { status: "pass", latencyMs: Math.round(performance.now() - t3), request: req, response: res, attempts });
    } catch (err) {
      update("delete", { status: "fail", latencyMs: Math.round(performance.now() - t3), error: errMsg(err), attempts: 3 });
    }

    /* 5. verify removal */
    update("verify", { status: "running" });
    const t4 = performance.now();
    try {
      const req = { query, user_id: visitorId, topK: 8 };
      const { value: res, attempts } = await withRetry(() => searchMemoryFn({ data: req }));
      const stillThere = res.data?.some((m) => m.id === createdId);
      if (stillThere) throw new Error("seed still present after delete");
      update("verify", { status: "pass", latencyMs: Math.round(performance.now() - t4), request: req, response: res, attempts });
    } catch (err) {
      update("verify", { status: "fail", latencyMs: Math.round(performance.now() - t4), error: errMsg(err), attempts: 3 });
    }

    setRunning(false);
  }, [visitorId]);

  const passed = Object.values(steps).filter((s) => s.status === "pass").length;
  const failed = Object.values(steps).filter((s) => s.status === "fail").length;

  return (
    <Section id="mem0-tests">
      <Label>// mem0-test-panel</Label>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8, marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px, 3.5vw, 36px)", fontStyle: "italic", margin: 0, color: "var(--ink-primary)" }}>
          End-to-end API verification
        </h2>
        <button
          type="button"
          onClick={runSuite}
          disabled={running}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 16px", borderRadius: "var(--r-full)",
            background: running ? "var(--bg-raised)" : "var(--ink-primary)",
            color: running ? "var(--ink-tertiary)" : "white",
            border: "none", cursor: running ? "wait" : "pointer",
            fontFamily: "var(--font-mono)", fontSize: 12,
          }}
        >
          {running ? <Loader2 size={14} className="spin" /> : <PlayCircle size={14} />}
          {running ? "Running suite…" : "Run test suite"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11 }}>
        <span style={{ color: "var(--ink-tertiary)" }}>user_id: {visitorId}</span>
        {apiMode && (
          <span style={{ color: apiMode === "real" ? "var(--signal)" : "#B45309" }}>
            {apiMode === "real" ? "● real mem0 API" : "○ mock fallback"}
          </span>
        )}
        {(passed > 0 || failed > 0) && (
          <span style={{ color: "var(--ink-secondary)" }}>{passed} passed · {failed} failed</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(Object.keys(STEP_LABELS) as StepKey[]).map((k) => {
          const s = steps[k];
          const isOpen = expanded[k];
          return (
            <div key={k} style={{ background: "var(--bg-surface)", border: "1px solid var(--edge-subtle)", borderRadius: "var(--r-md)", overflow: "hidden" }}>
              <button
                type="button"
                onClick={() => setExpanded((p) => ({ ...p, [k]: !p[k] }))}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <StatusIcon status={s.status} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-primary)", flex: 1 }}>{STEP_LABELS[k]}</span>
                {s.latencyMs != null && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-tertiary)" }}>{s.latencyMs}ms</span>
                )}
                {s.attempts > 1 && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#B45309" }}>×{s.attempts}</span>
                )}
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {isOpen && (
                <div style={{ padding: "0 16px 14px", display: "grid", gap: 10 }}>
                  {s.error && (
                    <div style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid #FCA5A5", padding: "6px 10px", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-mono)" }}>
                      {s.error}
                    </div>
                  )}
                  {s.request !== undefined && (
                    <JsonBlock title="request" data={s.request} />
                  )}
                  {s.response !== undefined && (
                    <JsonBlock title="response" data={s.response} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function StatusIcon({ status }: { status: StepStatus }) {
  if (status === "running") return <Loader2 size={14} className="spin" color="var(--signal)" />;
  if (status === "pass") return <CheckCircle2 size={14} color="var(--signal)" />;
  if (status === "fail") return <XCircle size={14} color="#DC2626" />;
  return <span style={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid var(--edge-default)", display: "inline-block" }} />;
}

function JsonBlock({ title, data }: { title: string; data: unknown }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-tertiary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</div>
      <pre style={{ margin: 0, padding: 12, background: "#0A0A0A", color: "#E5E7EB", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 11, lineHeight: 1.5, overflowX: "auto", maxHeight: 200 }}>
        {safeJson(data)}
      </pre>
    </div>
  );
}

function safeJson(v: unknown): string {
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}
function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}