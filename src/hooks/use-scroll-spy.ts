import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[], offset = 80): string {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;

    const calculate = () => {
      raf = 0;
      // Use getBoundingClientRect for accurate absolute positions
      const scrollY = window.scrollY;
      const threshold = offset;
      let current = "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        // absoluteTop = distance from document top
        const absoluteTop = el.getBoundingClientRect().top + scrollY;
        if (absoluteTop - threshold <= scrollY) {
          current = id;
        }
      }

      setActive(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(calculate);
    };

    // Delay initial calc so layout is settled
    const timer = setTimeout(calculate, 120);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(","), offset]);

  return active;
}
