import { useCallback, useEffect, useState } from "react";
import { checkRequiredEnv } from "@/lib/api/env-check.functions";

export type EnvHealth = {
  ok: boolean;
  missing: string[];
  mem0Mode: "real" | "mock";
};

/** Cached at module scope so all consumers share one fetch per session. */
let cache: EnvHealth | null = null;
let inflight: Promise<EnvHealth> | null = null;

async function fetchHealth(): Promise<EnvHealth> {
  if (inflight) return inflight;
  inflight = checkRequiredEnv()
    .then((r) => {
      cache = r as EnvHealth;
      return cache;
    })
    .catch(() => {
      cache = { ok: false, missing: ["unknown"], mem0Mode: "mock" };
      return cache;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useEnvHealth() {
  const [data, setData] = useState<EnvHealth | null>(cache);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let mounted = true;
    if (cache) {
      setData(cache);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchHealth().then((r) => {
      if (mounted) {
        setData(r);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    cache = null;
    setLoading(true);
    const r = await fetchHealth();
    setData(r);
    setLoading(false);
    return r;
  }, []);

  return { data, loading, refetch };
}