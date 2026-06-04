import { useEffect } from "react";

function labelFor(target: Element): string {
  const el = target.closest<HTMLElement>("button, a, [role='button'], input, textarea, select");
  if (!el) return "unknown";
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("title") ||
    el.textContent?.replace(/\s+/g, " ").trim() ||
    el.getAttribute("href") ||
    el.tagName.toLowerCase()
  );
}

export function ClickInstrumentationLayer() {
  useEffect(() => {
    const onPointerUp = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest<HTMLElement>("button, a, [role='button'], input, textarea, select");
      if (!interactive) return;
      const detail = {
        component: interactive.closest("section")?.id || interactive.closest("nav")?.getAttribute("aria-label") || "portfolio",
        label: labelFor(interactive),
        pointerType: event.pointerType,
        timestamp: Date.now(),
      };
      window.dispatchEvent(new CustomEvent("portfolio:click", { detail }));
      if (localStorage.getItem("debug_clicks") === "1" || import.meta.env.VITE_DEBUG_CLICKS === "true") {
        console.info("[click]", detail);
      }
    };
    window.addEventListener("pointerup", onPointerUp, { capture: true });
    return () => window.removeEventListener("pointerup", onPointerUp, { capture: true });
  }, []);

  return null;
}