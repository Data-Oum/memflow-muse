import { useEffect, useRef } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** Returns the shared Lenis instance (created once on first call). */
export function getLenis() {
  return lenisInstance;
}

/**
 * Initialises Lenis smooth scroll and wires it into GSAP's RAF loop.
 * Call once at the root component level.
 */
export function useSmoothScroll() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Try to hook into GSAP ticker if available, otherwise use rAF directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapTicker: any = null;
    try {
      // dynamic so it never breaks if gsap isn't imported yet
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const gsap = require("gsap");
      gsapTicker = gsap.ticker;
    } catch {
      // no-op
    }

    if (gsapTicker) {
      const onTick = (time: number) => lenisInstance?.raf(time * 1000);
      gsapTicker.add(onTick);
      if (typeof gsapTicker.lagSmoothing === "function") gsapTicker.lagSmoothing(0);
      return () => {
        gsapTicker?.remove(onTick);
        lenisInstance?.destroy();
        lenisInstance = null;
      };
    }

    // Fallback rAF loop
    function raf(time: number) {
      lenisInstance?.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);
}
