import { useEffect, useRef } from "react";

/**
 * Wires a GSAP ScrollTrigger reveal on the element's ref.
 * Falls back to instant visibility if GSAP isn't available.
 *
 * Key improvement: elements are visible by default. GSAP hides them only
 * after it loads, then animates them in. This prevents the "flash of
 * invisible content" race condition.
 */
export function useGsapReveal<T extends HTMLElement = HTMLElement>(delay = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Immediately set to hidden — GSAP now controls visibility
        gsap.set(el, { opacity: 0, y: 32 });

        const tween = gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });

        cleanup = () => {
          tween.kill();
          ScrollTrigger.getAll().forEach((t) => {
            if (t.trigger === el) t.kill();
          });
        };
      });
    });

    return () => cleanup?.();
  }, [delay]);

  return ref;
}
