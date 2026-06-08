import { createServerFn } from "@tanstack/react-start";

/**
 * Reports env var health.
 * LOVABLE_API_KEY is optional (voice-chat only) — its absence is a warning,
 * not a hard error, and must NOT trigger the red banner.
 * MEM0_API_KEY is optional too — app falls back to mock mode gracefully.
 * `ok` is always true: the app runs without either key.
 */
export const checkRequiredEnv = createServerFn({ method: "GET" }).handler(async () => {
  const present = (name: string) => {
    const v = process.env[name];
    return Boolean(v && v.trim().length > 0);
  };

  const lovablePresent = present("LOVABLE_API_KEY");
  const mem0Present    = present("MEM0_API_KEY");

  const warnings: string[] = [
    ...(!lovablePresent ? ["LOVABLE_API_KEY (voice-chat degraded to mock)"] : []),
    ...(!mem0Present    ? ["MEM0_API_KEY (memory running in mock mode)"]    : []),
  ];

  return {
    ok: true,                // app is always functional — both keys are optional
    missing: [] as string[], // nothing is truly "missing" for core functionality
    warnings,
    lovablePresent,
    mem0Mode: mem0Present ? ("real" as const) : ("mock" as const),
  };
});
