import { createServerFn } from "@tanstack/react-start";

/**
 * Reports which required server-side env vars are missing.
 * Runs on the server so we can safely inspect process.env.
 * Returns names only — never values.
 */
export const checkRequiredEnv = createServerFn({ method: "GET" }).handler(async () => {
  const required = ["LOVABLE_API_KEY", "MEM0_API_KEY"] as const;
  const missing = required.filter((name) => {
    const v = process.env[name];
    return !v || v.trim().length === 0;
  });
  return {
    ok: missing.length === 0,
    missing,
    mem0Mode: process.env.MEM0_API_KEY ? ("real" as const) : ("mock" as const),
  };
});