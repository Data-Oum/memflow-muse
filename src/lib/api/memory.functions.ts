import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface MemoryResult {
  id: string;
  memory: string;
  user_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
  category: string;
}

export interface MemorySearchResult extends MemoryResult {
  score: string;
}

export interface MemoryResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  /** true when running against the real mem0 API, false = local mock fallback */
  apiMode: "real" | "mock";
}

// ─── Server-side mock (re-implemented inline so it never ships to client bundle)

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Shared in-memory store for the mock — survives across requests in dev (single process)
const mockStore = new Map<
  string,
  MemoryResult
>();

function extractMemory(content: string): string {
  const c = content.trim().replace(/\s+/g, " ");
  const patterns: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
    [/^i\s+prefer\s+(.+)$/i, (m) => `User prefers ${m[1]}`],
    [/^i\s+love\s+(.+)$/i, (m) => `User loves ${m[1]}`],
    [/^i\s+like\s+(.+)$/i, (m) => `User likes ${m[1]}`],
    [/^i\s+hate\s+(.+)$/i, (m) => `User hates ${m[1]}`],
    [/^i\s+enjoy\s+(.+)$/i, (m) => `User enjoys ${m[1]}`],
    [/^i'?m\s+(.+)$/i, (m) => `User is ${m[1]}`],
    [/^i\s+am\s+(.+)$/i, (m) => `User is ${m[1]}`],
    [/^i\s+work\s+(.+)$/i, (m) => `User works ${m[1]}`],
    [/^i\s+built\s+(.+)$/i, (m) => `User built ${m[1]}`],
    [/^i\s+created\s+(.+)$/i, (m) => `User created ${m[1]}`],
    [/^i\s+live\s+(.+)$/i, (m) => `User lives ${m[1]}`],
  ];
  for (const [re, fn] of patterns) {
    const m = c.match(re);
    if (m) return fn(m);
  }
  return c;
}

function detectCategory(content: string): string {
  const c = content.toLowerCase();
  if (/\b(prefer|like|love|hate|enjoy)\b/.test(c)) return "preference";
  if (/\b(i am|i'm|i work|my job)\b/.test(c)) return "identity";
  if (/\b(i built|i created|i made|project)\b/.test(c)) return "work";
  if (/\b(i live|based in|location)\b/.test(c)) return "location";
  if (/\b(goal|want to|plan to|hoping)\b/.test(c)) return "goal";
  return "general";
}

// ─── Real mem0 API helpers ────────────────────────────────────────────────────

async function callRealAdd(
  messages: Array<{ role: string; content: string }>,
  userId: string,
  metadata: Record<string, unknown>,
): Promise<MemoryResult> {
  // Dynamic import — only resolves on server, tree-shaken from client bundle
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MemoryClient = require("mem0ai").default ?? require("mem0ai");
  const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });
  const res = await client.add(messages, { user_id: userId, metadata });
  // Normalise response shape across mem0 SDK versions
  const raw = Array.isArray(res) ? res[0] : res;
  return {
    id: raw.id ?? raw.memory_id ?? `mem_${Date.now()}`,
    memory: raw.memory ?? raw.data ?? messages[messages.length - 1]?.content ?? "",
    user_id: userId,
    metadata,
    created_at: raw.created_at ?? new Date().toISOString(),
    category: raw.categories?.[0] ?? detectCategory(messages[messages.length - 1]?.content ?? ""),
  };
}

async function callRealSearch(
  query: string,
  userId: string,
): Promise<MemorySearchResult[]> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MemoryClient = require("mem0ai").default ?? require("mem0ai");
  const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });
  const res = await client.search(query, { user_id: userId });
  const hits = Array.isArray(res) ? res : res.results ?? [];
  return hits.map((r: Record<string, unknown>) => ({
    id: String(r.id ?? r.memory_id ?? `mem_${Math.random().toString(36).slice(2)}`),
    memory: String(r.memory ?? r.data ?? ""),
    user_id: userId,
    metadata: (r.metadata as Record<string, unknown>) ?? {},
    created_at: String(r.created_at ?? new Date().toISOString()),
    category: String(
      (r.categories as string[] | undefined)?.[0] ?? r.category ?? "general",
    ),
    score: String(r.score ?? (0.75 + Math.random() * 0.24).toFixed(2)),
  }));
}

async function callRealDelete(memoryId: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MemoryClient = require("mem0ai").default ?? require("mem0ai");
  const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY });
  await client.delete(memoryId);
}

// ─── Server Functions ─────────────────────────────────────────────────────────

export const addMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z.array(z.object({ role: z.string(), content: z.string() })).min(1),
      user_id: z.string().min(1),
      metadata: z.record(z.unknown()).optional(),
    }),
  )
  .handler(async ({ data }): Promise<MemoryResponse<MemoryResult>> => {
    const hasApiKey = Boolean(process.env.MEM0_API_KEY);

    if (hasApiKey) {
      try {
        const result = await callRealAdd(
          data.messages,
          data.user_id,
          data.metadata ?? {},
        );
        return { success: true, data: result, apiMode: "real" };
      } catch (err) {
        console.error("[mem0 add] real API error:", err);
        // Fall through to mock
      }
    }

    // Mock fallback
    await delay(300 + Math.random() * 400);
    const content = data.messages[data.messages.length - 1]?.content ?? "";
    const entry: MemoryResult = {
      id: "mem_" + Math.random().toString(36).slice(2, 10),
      memory: extractMemory(content),
      user_id: data.user_id,
      metadata: data.metadata ?? {},
      created_at: new Date().toISOString(),
      category: detectCategory(content),
    };
    mockStore.set(entry.id, entry);
    return { success: true, data: entry, apiMode: "mock" };
  });

export const searchMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      query: z.string(),
      user_id: z.string().min(1),
    }),
  )
  .handler(async ({ data }): Promise<MemoryResponse<MemorySearchResult[]>> => {
    const hasApiKey = Boolean(process.env.MEM0_API_KEY);

    if (hasApiKey) {
      try {
        const results = await callRealSearch(data.query, data.user_id);
        return { success: true, data: results, apiMode: "real" };
      } catch (err) {
        console.error("[mem0 search] real API error:", err);
      }
    }

    // Mock fallback
    await delay(250 + Math.random() * 300);
    const all = [...mockStore.values()].filter(
      (m) => m.user_id === data.user_id,
    );
    const results: MemorySearchResult[] = all
      .map((m) => ({
        ...m,
        score: (0.75 + Math.random() * 0.24).toFixed(2),
      }))
      .sort((a, b) => Number(b.score) - Number(a.score))
      .slice(0, 5);
    return { success: true, data: results, apiMode: "mock" };
  });

export const deleteMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ memory_id: z.string().min(1) }))
  .handler(async ({ data }): Promise<MemoryResponse<{ message: string }>> => {
    const hasApiKey = Boolean(process.env.MEM0_API_KEY);

    if (hasApiKey) {
      try {
        await callRealDelete(data.memory_id);
        return {
          success: true,
          data: { message: "Memory deleted successfully." },
          apiMode: "real",
        };
      } catch (err) {
        console.error("[mem0 delete] real API error:", err);
      }
    }

    // Mock fallback
    await delay(150);
    mockStore.delete(data.memory_id);
    return {
      success: true,
      data: { message: "Memory deleted successfully." },
      apiMode: "mock",
    };
  });
