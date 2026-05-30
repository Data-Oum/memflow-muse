export type MemoryCategory = "preference" | "identity" | "work" | "location" | "goal" | "general";

export interface MemoryEntry {
  id: string;
  memory: string;
  user_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
  category: MemoryCategory;
}

export interface MemorySearchResult extends MemoryEntry {
  score: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function extractMemory(content: string): string {
  const c = content.trim().replace(/\s+/g, " ");
  const lower = c.toLowerCase();
  // strip leading "I " patterns and rewrite as "User ..."
  const patterns: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
    [/^i\s+prefer\s+(.+)$/i, (m) => `User prefers ${m[1]}`],
    [/^i\s+love\s+(.+)$/i, (m) => `User loves ${m[1]}`],
    [/^i\s+like\s+(.+)$/i, (m) => `User likes ${m[1]}`],
    [/^i\s+hate\s+(.+)$/i, (m) => `User hates ${m[1]}`],
    [/^i\s+enjoy\s+(.+)$/i, (m) => `User enjoys ${m[1]}`],
    [
      /^i'?m\s+(?:a\s+|an\s+)?(.+)$/i,
      (m) =>
        `User is ${/^a |^an /i.test(m[1]) ? m[1] : `a ${m[1]}`.replace(/^a (a|e|i|o|u)/i, "an $1")}`,
    ],
    [/^i\s+am\s+(.+)$/i, (m) => `User is ${m[1]}`],
    [/^i\s+work\s+(.+)$/i, (m) => `User works ${m[1]}`],
    [/^i\s+built\s+(.+)$/i, (m) => `User built ${m[1]}`],
    [/^i\s+created\s+(.+)$/i, (m) => `User created ${m[1]}`],
    [/^i\s+made\s+(.+)$/i, (m) => `User made ${m[1]}`],
    [/^i\s+live\s+(.+)$/i, (m) => `User lives ${m[1]}`],
  ];
  for (const [re, fn] of patterns) {
    const m = c.match(re);
    if (m) return fn(m);
  }
  void lower;
  return c;
}

export function detectCategory(content: string): MemoryCategory {
  const c = content.toLowerCase();
  if (/\b(prefer|like|love|hate|enjoy)\b/.test(c)) return "preference";
  if (/\b(i am|i'm|i work|my job)\b/.test(c)) return "identity";
  if (/\b(i built|i created|i made|project)\b/.test(c)) return "work";
  if (/\b(i live|based in|location)\b/.test(c)) return "location";
  if (/\b(goal|want to|plan to|hoping)\b/.test(c)) return "goal";
  return "general";
}

export interface AddInput {
  user_id: string;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  role: string;
  content: string;
}

export class MockMem0Client {
  private store = new Map<string, MemoryEntry>();

  async add(messages: ChatMessage[], opts: AddInput): Promise<MemoryEntry> {
    await delay(300 + Math.random() * 400);
    const content = messages[messages.length - 1]?.content ?? "";
    const memory = extractMemory(content);
    const id = "mem_" + Math.random().toString(36).slice(2, 10);
    const entry: MemoryEntry = {
      id,
      memory,
      user_id: opts.user_id,
      metadata: opts.metadata ?? {},
      created_at: new Date().toISOString(),
      category: detectCategory(content),
    };
    this.store.set(id, entry);
    return entry;
  }

  async search(
    _query: string,
    { filters = {} }: { filters?: { user_id?: string } } = {},
  ): Promise<MemorySearchResult[]> {
    await delay(250 + Math.random() * 300);
    const userId = filters.user_id;
    const all = [...this.store.values()].filter((m) => !userId || m.user_id === userId);
    return all
      .map((m) => ({ ...m, score: (0.75 + Math.random() * 0.24).toFixed(2) }))
      .sort((a, b) => Number(b.score) - Number(a.score))
      .slice(0, 5);
  }

  async getAll({ user_id }: { user_id?: string } = {}): Promise<MemoryEntry[]> {
    await delay(200);
    return [...this.store.values()].filter((m) => !user_id || m.user_id === user_id);
  }

  async delete(memoryId: string): Promise<{ message: string }> {
    await delay(150);
    this.store.delete(memoryId);
    return { message: "Memory deleted successfully." };
  }
}

export const mem0 = new MockMem0Client();

export const CATEGORY_COLORS: Record<MemoryCategory, string> = {
  preference: "#16A07C",
  identity: "#0EA5E9",
  work: "#8B5CF6",
  location: "#F59E0B",
  goal: "#F472B6",
  general: "#6B7280",
};
