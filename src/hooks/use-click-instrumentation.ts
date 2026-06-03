import { useCallback } from "react";

type ClickMeta = { component: string; label: string };

const DEBUG =
  typeof window !== "undefined" &&
  (import.meta.env.VITE_DEBUG_CLICKS === "true" ||
    (typeof localStorage !== "undefined" && localStorage.getItem("debug_clicks") === "1"));

/**
 * Wraps a click handler with lightweight instrumentation.
 * Logs to console (gated) and dispatches a `portfolio:click` CustomEvent
 * other components (e.g. Logs feed) can subscribe to.
 */
export function useInstrumentedClick<E extends React.SyntheticEvent>(
  meta: ClickMeta,
  handler?: (e: E) => void | Promise<void>,
) {
  return useCallback(
    (e: E) => {
      const t = performance.now();
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`[click] ${meta.component} · ${meta.label}`);
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("portfolio:click", { detail: { ...meta, t } }),
        );
      }
      return handler?.(e);
    },
    [meta.component, meta.label, handler],
  );
}