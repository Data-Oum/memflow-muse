import { useEffect, useRef } from "react";

/**
 * Fixed 2px scroll progress bar at the top of the viewport.
 * Uses requestAnimationFrame for smooth updates without layout thrashing.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const update = () => {
      if (!ref.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      ref.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="scroll-progress"
      aria-hidden
      style={{ width: "100%", transform: "scaleX(0)" }}
    />
  );
}
