import { useEffect, useRef } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

/** Returns the shared Lenis instance (created once on first call). */
export function getLenis() {
  return lenisInstance;
}

/**
 * Initialises Lenis smooth scroll and wires it into GSAP's ticker
 * for perfectly synchronised scroll-driven animations.
 * Call once at the root component level.
 */
export function useSmoothScroll() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenisInstance = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      infinite: false,
    });

    // Try to sync with GSAP ticker for smoother coordination
    import("gsap")
      .then(({ gsap }) => {
        gsap.ticker.add((time: number) => {
          lenisInstance?.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      })
      .catch(() => {
        // Fallback: manual RAF loop if GSAP isn't available
        function raf(time: number) {
          lenisInstance?.raf(time);
          rafRef.current = requestAnimationFrame(raf);
        }
        rafRef.current = requestAnimationFrame(raf);
      });

    // Intercept anchor clicks for smooth scroll to target
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const destination = document.querySelector(hash);
      if (!destination) return;
      event.preventDefault();
      lenisInstance?.scrollTo(destination, { offset: -72 });
      window.history.pushState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      // Remove from GSAP ticker
      import("gsap")
        .then(({ gsap }) => {
          gsap.ticker.remove(lenisInstance?.raf as Parameters<typeof gsap.ticker.remove>[0]);
        })
        .catch(() => {});

      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);
}
