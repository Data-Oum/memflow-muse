import { useEffect, useRef } from "react";

/**
 * Wires a GSAP ScrollTrigger reveal on the element's ref.
 * Falls back to instant visibility if GSAP isn't available.
 */
export function useGsapReveal<T extends HTMLElement = HTMLElement>(delay = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Mark element so CSS can hide it before GSAP takes over
        el.classList.add("gsap-ready");

        const tween = gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
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
          },
        );

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
