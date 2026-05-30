export interface TermLog {
  tool: string;
  date: string;
  filename: string;
  prompt: string;
  output: string;
}

export const LOGS: TermLog[] = [
  {
    tool: "Claude Code",
    date: "April 12, 2025 · 2:34 PM",
    filename: "useMemory.ts",
    prompt: `// Prompt: "Building a chat interface that persists conversation context using mem0.
// The user should feel the AI remembers them on return visits.
// Design: memory schema, React state architecture, and mem0 integration layer.
// Q: What to store vs retrieve? How to handle memory conflicts?
//    What's the retrieval strategy for context injection?"`,
    output: `> Files modified: /hooks/useMemory.ts · /lib/mem0Client.ts · /components/ChatContext.tsx
> Tokens: 4,847  |  Time saved: ~3.5 hours  |  Bugs caught before PR: 2`,
  },
  {
    tool: "Cursor",
    date: "March 28, 2025 · 11:15 AM",
    filename: "Dashboard.tsx → 4 hooks",
    prompt: `// "Dashboard component violates SRP — it fetches data, manages WebSocket,
// renders charts, AND handles user preferences.
// Extract: useMetrics(), useRealtimeUpdates(), useUserConfig().
// TypeScript strict — no \`any\` allowed. Justify every type decision."`,
    output: `> Generated: useMetrics.ts · useRealtimeUpdates.ts · useUserConfig.ts · useChartData.ts
> LOC: 847 generated, 312 written manually
> Duration: 23 min  |  Estimated manual: 6 hours`,
  },
  {
    tool: "Windsurf",
    date: "May 2, 2025 · 4:02 PM",
    filename: "MemoryClient.test.ts",
    prompt: `// "Generate Vitest unit tests for MockMemoryClient.
// Cover: add/search/delete happy paths, API errors (401, 429, 500),
// network timeouts, concurrent operations, edge cases:
// empty queries, duplicate memories, special chars in user_id.
// vi.mock the fetch layer."`,
    output: `> Test cases: 47 generated  |  Coverage: 94% → 98%
> Bugs caught before production: 3 edge cases in concurrent deletes`,
  },
];

export const CONTRIBUTION_CODE = `// What Amit ships from day one
await mem0.add([
  { role: "engineer", content: "Polished production UIs, end-to-end" },
  { role: "engineer", content: "AI-native workflow — Claude Code, Cursor, Windsurf" },
  { role: "engineer", content: "mem0 SDK integrated before the first interview" },
  { role: "engineer", content: "8 years of shipped systems. No unfinished work." }
], { user_id: "mem0_team", metadata: { status: "open_to_hire" } });

// { id: "mem_amit_001", score: 0.99, category: "hire_now" }`;
