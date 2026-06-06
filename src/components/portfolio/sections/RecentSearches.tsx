import { useEffect, useState } from "react";
import { getRecentSearches, type RecentSearch } from "@/lib/api/search-history.functions";

/**
 * Pulls the last N search-history rows for this visitor and renders them as
 * subtle chips. Click a chip to fire the supplied callback (e.g. re-run search).
 */
export function RecentSearches({
  visitorId,
  source,
  limit = 5,
  onSelect,
  refreshKey,
}: {
  visitorId: string;
  source?: "mem0_demo" | "voice_chat" | "project_filter";
  limit?: number;
  onSelect?: (q: string) => void;
  /** Bump this to force a refetch (e.g. after a new search is logged). */
  refreshKey?: number;
}) {
  const [items, setItems] = useState<RecentSearch[]>([]);

  useEffect(() => {
    let mounted = true;
    getRecentSearches({ data: { visitorId, source, limit } })
      .then((rows) => {
        if (mounted) setItems(rows);
      })
      .catch(() => {
        if (mounted) setItems([]);
      });
    return () => {
      mounted = false;
    };
  }, [visitorId, source, limit, refreshKey]);

  if (items.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: "var(--ink-tertiary)",
          letterSpacing: "0.04em",
          marginRight: 4,
        }}
      >
        recent ·
      </span>
      {items.map((r) => (
        <button
          key={r.id}
          type="button"
          onClick={() => onSelect?.(r.query)}
          title={`${r.source} · ${new Date(r.createdAt).toLocaleString()}`}
          style={{
            background: "var(--bg-raised)",
            border: "1px solid var(--edge-subtle)",
            color: "var(--ink-secondary)",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            padding: "3px 9px",
            borderRadius: 999,
            cursor: "pointer",
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {r.query}
        </button>
      ))}
    </div>
  );
}