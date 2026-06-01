import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** JSON-serializable scalar — required by TanStack Start's serialization validator */
type JsonScalar = string | number | boolean | null;
export type JsonMetadata = Record<string, JsonScalar | JsonScalar[] | Record<string, JsonScalar>>;

export interface MemoryResult {
  id: string;
  memory: string;
  user_id: string;
  metadata: JsonMetadata;
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
  apiMode: "real" | "mock";
}

type Mem0Message = { role: "user" | "assistant"; content: string };
type Mem0ClientShape = {
  add: (messages: Mem0Message[], options?: Record<string, unknown>) => Promise<unknown>;
  search: (query: string, options?: Record<string, unknown>) => Promise<unknown>;
  delete: (memoryId: string, options?: Record<string, unknown>) => Promise<unknown>;
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const mockStore = new Map<string, MemoryResult>();

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

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "mem0 request failed";
}

function normalizeMemory(rawInput: unknown, fallback: Partial<MemoryResult>): MemoryResult {
  const raw = (rawInput ?? {}) as Record<string, unknown>;
  const data = (raw.data && typeof raw.data === "object" ? raw.data : {}) as Record<string, unknown>;
  const created = raw.createdAt ?? raw.created_at ?? fallback.created_at ?? new Date().toISOString();
  return {
    id: String(raw.id ?? raw.memoryId ?? raw.memory_id ?? fallback.id ?? `mem_${Date.now()}`),
    memory: String(raw.memory ?? data.memory ?? raw.text ?? fallback.memory ?? ""),
    user_id: String(raw.userId ?? raw.user_id ?? fallback.user_id ?? "visitor"),
    metadata: ((raw.metadata ?? fallback.metadata ?? {}) as JsonMetadata),
    created_at: created instanceof Date ? created.toISOString() : String(created),
    category: String(
      (Array.isArray(raw.categories) ? raw.categories[0] : undefined) ?? raw.category ?? fallback.category ?? "general",
    ),
  };
}

function normalizeSearchResult(raw: unknown, userId: string, fallbackQuery = ""): MemorySearchResult {
  const base = normalizeMemory(raw, {
    user_id: userId,
    memory: fallbackQuery,
    category: detectCategory(fallbackQuery),
    created_at: new Date().toISOString(),
  });
  const record = (raw ?? {}) as Record<string, unknown>;
  return { ...base, score: Number(record.score ?? 0.75).toFixed(2) };
}

async function getMemoryClient(): Promise<Mem0ClientShape> {
  const apiKey = process.env.MEM0_API_KEY;
  if (!apiKey) throw new Error("MEM0_API_KEY is not configured");
  const mod = await import("mem0ai");
  const MemoryClient = mod.MemoryClient ?? mod.default;
  return new MemoryClient({ apiKey }) as Mem0ClientShape;
}

function hasRealMem0() {
  return Boolean(process.env.MEM0_API_KEY);
}

async function callRealAdd(
  messages: Mem0Message[],
  userId: string,
  metadata: Record<string, unknown>,
): Promise<MemoryResult> {
  const client = await getMemoryClient();
  const res = await client.add(messages, { userId, metadata, infer: true });
  const raw = Array.isArray(res) ? res[0] : res;
  return normalizeMemory(raw, {
    user_id: userId,
    metadata: metadata as JsonMetadata,
    memory: messages[messages.length - 1]?.content ?? "",
    category: detectCategory(messages[messages.length - 1]?.content ?? ""),
    created_at: new Date().toISOString(),
  });
}

export async function callMem0Search(query: string, userId: string, topK = 8): Promise<MemorySearchResult[]> {
  const client = await getMemoryClient();
  const res = await client.search(query, {
    filters: { AND: [{ user_id: userId }] },
    topK,
    rerank: true,
  });
  const hits = Array.isArray(res) ? res : ((res as Record<string, unknown>).results ?? []);
  return (hits as unknown[]).map((r) => normalizeSearchResult(r, userId, query));
}

async function callRealDelete(memoryId: string): Promise<void> {
  const client = await getMemoryClient();
  await client.delete(memoryId);
}

export const addMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1) })).min(1),
      user_id: z.string().min(1),
      metadata: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
    }),
  )
  .handler(async ({ data }): Promise<MemoryResponse<MemoryResult>> => {
    if (hasRealMem0()) {
      try {
        const result = await callRealAdd(data.messages, data.user_id, data.metadata ?? {});
        return { success: true, data: result, apiMode: "real" };
      } catch (err) {
        console.error("[mem0:add]", err);
        return { success: false, error: errorMessage(err), apiMode: "real" };
      }
    }

    await delay(250);
    const content = data.messages[data.messages.length - 1]?.content ?? "";
    const entry: MemoryResult = {
      id: "mem_" + Math.random().toString(36).slice(2, 10),
      memory: extractMemory(content),
      user_id: data.user_id,
      metadata: (data.metadata ?? {}) as JsonMetadata,
      created_at: new Date().toISOString(),
      category: detectCategory(content),
    };
    mockStore.set(entry.id, entry);
    return { success: true, data: entry, apiMode: "mock" };
  });

export const searchMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ query: z.string(), user_id: z.string().min(1), topK: z.number().min(1).max(20).optional() }))
  .handler(async ({ data }): Promise<MemoryResponse<MemorySearchResult[]>> => {
    if (hasRealMem0()) {
      try {
        const results = await callMem0Search(data.query || "portfolio context", data.user_id, data.topK ?? 8);
        return { success: true, data: results, apiMode: "real" };
      } catch (err) {
        console.error("[mem0:search]", err);
        return { success: false, error: errorMessage(err), apiMode: "real" };
      }
    }

    await delay(220);
    const all = [...mockStore.values()].filter((m) => m.user_id === data.user_id);
    const results: MemorySearchResult[] = all
      .map((m) => ({ ...m, score: (0.75 + Math.random() * 0.24).toFixed(2) }))
      .sort((a, b) => Number(b.score) - Number(a.score))
      .slice(0, data.topK ?? 8);
    return { success: true, data: results, apiMode: "mock" };
  });

export const scoreMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ memory_id: z.string().min(1), query: z.string().min(1), user_id: z.string().min(1) }))
  .handler(async ({ data }): Promise<MemoryResponse<{ memory_id: string; score: string }>> => {
    if (hasRealMem0()) {
      try {
        const results = await callMem0Search(data.query, data.user_id, 10);
        const hit = results.find((m) => m.id === data.memory_id) ?? results[0];
        return { success: true, data: { memory_id: data.memory_id, score: hit?.score ?? "0.00" }, apiMode: "real" };
      } catch (err) {
        console.error("[mem0:score]", err);
        return { success: false, error: errorMessage(err), apiMode: "real" };
      }
    }
    return {
      success: true,
      data: { memory_id: data.memory_id, score: (0.75 + Math.random() * 0.24).toFixed(2) },
      apiMode: "mock",
    };
  });

export const deleteMemoryFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ memory_id: z.string().min(1) }))
  .handler(async ({ data }): Promise<MemoryResponse<{ message: string }>> => {
    if (hasRealMem0()) {
      try {
        await callRealDelete(data.memory_id);
        return { success: true, data: { message: "Memory deleted successfully." }, apiMode: "real" };
      } catch (err) {
        console.error("[mem0:delete]", err);
        return { success: false, error: errorMessage(err), apiMode: "real" };
      }
    }
    await delay(120);
    mockStore.delete(data.memory_id);
    return { success: true, data: { message: "Memory deleted successfully." }, apiMode: "mock" };
  });
