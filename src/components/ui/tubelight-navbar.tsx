import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  id: string;
}

interface TubelightNavbarProps {
  items: NavItem[];
  activeId: string;
  className?: string;
}

export function TubelightNavbar({ items, activeId }: TubelightNavbarProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!activeRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const el = activeRef.current;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
    });
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        position: "relative",
      }}
    >
      {/* Tube light indicator */}
      <AnimatePresence>
        {indicatorStyle && (
          <motion.div
            layoutId="tube-indicator"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              borderRadius: 999,
              background: "var(--signal-light)",
              zIndex: 0,
              pointerEvents: "none",
            }}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.8 }}
          />
        )}
      </AnimatePresence>

      {/* Tube glow strip */}
      <AnimatePresence>
        {indicatorStyle && (
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              top: -1,
              height: 2,
              borderRadius: 999,
              background: "var(--signal)",
              opacity: 0.7,
              zIndex: 1,
              pointerEvents: "none",
              boxShadow: "0 0 8px 1px rgba(124,58,237,0.45)",
            }}
            animate={{
              left: indicatorStyle.left + indicatorStyle.width * 0.2,
              width: indicatorStyle.width * 0.6,
            }}
            transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.8 }}
          />
        )}
      </AnimatePresence>

      {items.map(({ label, id }) => {
        const isActive = activeId === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            ref={(el) => {
              if (isActive) activeRef.current = el;
            }}
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: "var(--font-sans)",
              fontSize: 13.5,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? "var(--signal)" : "var(--ink-secondary)",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 999,
              transition: "color 0.18s",
              letterSpacing: "-0.005em",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
