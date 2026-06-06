import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

const SOURCES = ["mem0_demo", "voice_chat", "project_filter"] as const;
type Source = (typeof SOURCES)[number];

const logInput = z.object({
  visitorId: z.string().min(3).max(64),
  source: z.enum(SOURCES),
  query: z.string().min(1).max(500),
  resultCount: z.number().int().nonnegative().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const logSearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => logInput.parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("search_history").insert({
        visitor_id: data.visitorId,
        source: data.source,
        query: data.query,
        result_count: data.resultCount ?? null,
        metadata: (data.metadata ?? {}) as Json,
      });
      if (error) {
        console.warn("[search-history] insert failed:", error.message);
        return { ok: false as const, error: error.message };
      }
      return { ok: true as const };
    } catch (e) {
      console.warn("[search-history] insert threw:", e);
      return { ok: false as const, error: e instanceof Error ? e.message : "unknown" };
    }
  });

const listInput = z.object({
  visitorId: z.string().min(3).max(64),
  source: z.enum(SOURCES).optional(),
  limit: z.number().int().min(1).max(50).default(5),
});

export type RecentSearch = {
  id: string;
  query: string;
  source: Source;
  resultCount: number | null;
  createdAt: string;
};

export const getRecentSearches = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => listInput.parse(d))
  .handler(async ({ data }): Promise<RecentSearch[]> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let q = supabaseAdmin
        .from("search_history")
        .select("id, query, source, result_count, created_at")
        .eq("visitor_id", data.visitorId)
        .order("created_at", { ascending: false })
        .limit(data.limit);
      if (data.source) q = q.eq("source", data.source);
      const { data: rows, error } = await q;
      if (error || !rows) return [];
      return rows.map((r) => ({
        id: r.id as string,
        query: r.query as string,
        source: r.source as Source,
        resultCount: (r.result_count as number | null) ?? null,
        createdAt: r.created_at as string,
      }));
    } catch (e) {
      console.warn("[search-history] list threw:", e);
      return [];
    }
  });