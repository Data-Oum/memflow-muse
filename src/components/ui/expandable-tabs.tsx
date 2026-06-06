"use client";
import { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ExpandableTabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  className?: string;
}

export function ExpandableTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: ExpandableTabsProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<string>(activeTab ?? tabs[0]?.id ?? "");
  const current = activeTab ?? active;

  const handleSelect = (id: string) => {
    setActive(id);
    onTabChange?.(id);
  };

  return (
    <div
      className={cn("flex items-center gap-1 rounded-full border p-1", className)}
      style={{
        background: "rgba(255,255,255,0.06)",
        borderColor: "rgba(255,255,255,0.09)",
        backdropFilter: "blur(12px)",
        display: "inline-flex",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = current === tab.id;
        const isHovered = hovered === tab.id;
        const showLabel = isActive || isHovered;

        return (
          <button
            key={tab.id}
            onMouseEnter={() => setHovered(tab.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleSelect(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: showLabel ? 6 : 0,
              padding: "6px 12px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: isActive ? "rgba(124,58,237,0.18)" : "transparent",
              color: isActive
                ? "#A855F7"
                : "rgba(255,255,255,0.45)",
              transition: "color 0.18s, background 0.18s",
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Icon size={14} strokeWidth={1.8} />
            <AnimatePresence initial={false}>
              {showLabel && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ overflow: "hidden", display: "block" }}
                >
                  {tab.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
