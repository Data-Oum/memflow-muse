import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { callMem0Search } from "@/lib/api/memory.functions";

type Body = { messages?: UIMessage[]; userId?: string };

/** Minimum relevance score to include a memory in RAG context */
const SCORE_THRESHOLD = 0.4;

function extractText(msg: UIMessage | undefined): string {
  if (!msg) return "";
  const parts = (msg as unknown as { parts?: Array<{ type: string; text?: string }> }).parts;
  if (Array.isArray(parts)) {
    return parts.filter((p) => p.type === "text").map((p) => p.text ?? "").join(" ");
  }
  const content = (msg as unknown as { content?: string }).content;
  return typeof content === "string" ? content : "";
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, userId } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        // RAG: pull mem0 memories for the latest user message with score threshold
        let memoryContext = "";
        const memoryHits: Array<{ memory: string; category: string; score: string }> = [];
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        const query = extractText(lastUser);
        const uid = (userId && userId.trim()) || "anon_voice_visitor";

        if (query && process.env.MEM0_API_KEY) {
          try {
            const hits = await callMem0Search(query, uid, 8);
            // Filter by score threshold
            const relevant = hits.filter((h) => parseFloat(h.score) >= SCORE_THRESHOLD);
            if (relevant.length) {
              memoryContext =
                "Relevant memories about the user (use only if helpful):\n" +
                relevant.map((h, i) => `${i + 1}. [${h.category}] ${h.memory} (score ${h.score})`).join("\n");

              // Track hits to return as metadata
              for (const h of relevant) {
                memoryHits.push({
                  memory: h.memory,
                  category: h.category,
                  score: h.score,
                });
              }
            }
          } catch (err) {
            console.warn("[chat] mem0 RAG failed:", err);
          }
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const system = [
          "You are Amit's portfolio assistant — a calm, concise AI guide grounded in mem0 context memory.",
          "Answer with crisp, plain language. Use markdown only when it clarifies (lists, code).",
          "If memories below are relevant, weave them in naturally; if not, ignore them.",
          "Keep responses under 200 words unless the user asks for detail.",
          memoryContext,
        ]
          .filter(Boolean)
          .join("\n\n");

        try {
          const result = streamText({
            model,
            system,
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err) {
          console.error("[chat] streamText failed:", err);
          return new Response("AI gateway error", { status: 502 });
        }
      },
    },
  },
});