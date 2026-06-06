import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { memo, useCallback, useEffect, useRef, useState } from "react";

/* ══════════════════════════════════════════════════════════
   ICONS — tiny inline SVGs (zero deps, zero re-renders)
   ══════════════════════════════════════════════════════════ */
const GithubIcon = memo(() => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
));
GithubIcon.displayName = "GithubIcon";

const LinkedinIcon = memo(() => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
));
LinkedinIcon.displayName = "LinkedinIcon";

const XIcon = memo(() => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
));
XIcon.displayName = "XIcon";

const SOCIALS = [
  { label: "GitHub",   href: "https://github.com/devamitch",     Icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com/in/devamitch", Icon: LinkedinIcon },
  { label: "X",        href: "https://x.com/devamitch",          Icon: XIcon },
] as const;

/* ══════════════════════════════════════════════════════════
   STATIC DATA — hoisted, stable, zero GC pressure
   ══════════════════════════════════════════════════════════ */

/* Career journey milestones — replaces generic stat numbers with a story arc */
const JOURNEY = [
  { year: "2017", title: "BCA · Heritage Academy", note: "Where it all started. Kolkata.",                   dot: "milestone" },
  { year: "2021", title: "NonceBlox · Web3 Lead",  note: "13+ apps shipped. FinTech, gaming, DeFi.",        dot: "skill" },
  { year: "2025", title: "Synapsis · Founding Eng", note: "0→21 engineers. HIPAA AI. 5 apps in 13 months.", dot: "achievement" },
  { year: "Now",  title: "Targeting mem0",          note: "AI-native. Memory infra. Senior Frontend.",      dot: "signal" },
] as const;

type DotVariant = "milestone" | "skill" | "achievement" | "signal";
const DOT_COLOR: Record<DotVariant, string> = {
  milestone:   "#9CA3AF",
  skill:       "#7C3AED",
  achievement: "#6D28D9",
  signal:      "#22C55E",
};

/* Memory constellation nodes — each node is a real skill or life milestone */
type NodeCategory = "skill" | "milestone" | "achievement";
interface MemoryNode {
  id: string;
  label: string;
  category: NodeCategory;
  x: number;
  y: number;
  r: number;
  desc: string;
}

const MEMORY_NODES: MemoryNode[] = [
  { id: "rn",       label: "React Native",  category: "skill",       x: 48, y: 34, r: 22, desc: "98/100 · Bridgeless, JSI, TurboModules, 60fps on $150 Android" },
  { id: "ts",       label: "TypeScript",    category: "skill",       x: 22, y: 56, r: 14, desc: "96/100 · Strict mode, generics, discriminated unions" },
  { id: "ai",       label: "AI Systems",    category: "skill",       x: 76, y: 50, r: 18, desc: "88/100 · HIPAA RAG, MediaPipe CV, LLM orchestration" },
  { id: "web3",     label: "Web3 / DeFi",   category: "skill",       x: 28, y: 20, r: 12, desc: "85/100 · Solidity, Ethereum, Wagmi v2, on-chain systems" },
  { id: "lead",     label: "Leadership",    category: "skill",       x: 72, y: 22, r: 15, desc: "0→21 engineers · 3 promoted to senior at Synapsis" },
  { id: "dau",      label: "50K DAU",       category: "achievement", x: 16, y: 38, r: 10, desc: "Peak daily active users · Vulcan Eleven fantasy sports" },
  { id: "synapsis", label: "Synapsis '25",  category: "milestone",   x: 58, y: 68, r: 12, desc: "Founding Engineer · 5 apps in 13 months · HIPAA AI" },
  { id: "nonce",    label: "NonceBlox",     category: "milestone",   x: 16, y: 74, r: 11, desc: "2021–2025 · 13+ apps · Web3 Lead · FinTech / Gaming" },
  { id: "bca",      label: "BCA 2017",      category: "milestone",   x: 82, y: 72, r: 9,  desc: "The Heritage Academy Kolkata · Where it all began" },
  { id: "kolkata",  label: "Kolkata",       category: "milestone",   x: 40, y: 84, r: 9,  desc: "Kolkata, India · Remote exclusively · IST (UTC+5:30)" },
  { id: "mem0",     label: "mem0",          category: "skill",       x: 54, y: 16, r: 11, desc: "RAG pipelines · Memory infra · Production agent context" },
];

const EDGES: [string, string][] = [
  ["rn", "ts"],  ["rn", "ai"],  ["rn", "lead"], ["rn", "dau"],
  ["ai", "synapsis"], ["lead", "synapsis"], ["ts", "nonce"],
  ["web3", "nonce"], ["synapsis", "kolkata"], ["bca", "web3"],
  ["dau", "nonce"], ["ai", "lead"], ["mem0", "ai"], ["mem0", "lead"],
  ["rn", "mem0"],
];

const NODE_COLORS: Record<NodeCategory, string> = {
  skill:       "#7C3AED",
  milestone:   "#6D28D9",
  achievement: "#5B21B6",
};

// Pre-compute node lookup map once (stable reference, never recreated)
const NODE_MAP = new Map(MEMORY_NODES.map((n) => [n.id, n]));

/* Agent context memories — what mem0 would retrieve about Amit */
const AGENT_MEMORIES = [
  "Ships AI-native products using Claude Code as daily driver",
  "Built 18+ production apps to App Store & Play Store",
  "Scaled 0→21 engineers as Founding Engineer at Synapsis",
  "HIPAA-compliant RAG pipelines · 99.9% uptime production",
  "50K+ peak DAU · React Native · C++ native modules 60fps",
  "Applying: Senior Frontend Engineer · mem0 · India remote",
];

const STACK_POSITIONS = [
  { rotate: 8,  scale: 0.90, y: 26 },
  { rotate: -5, scale: 0.96, y: 14 },
  { rotate: 2,  scale: 1,    y: 0  },
];

/* ══════════════════════════════════════════════════════════
   CARD 0 — PORTRAIT  (cinematic gradient treatment)
   ══════════════════════════════════════════════════════════ */
const PortraitCard = memo(function PortraitCard() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Photo — eager loaded, no layout shift */}
      <img
        src="https://devamit.co.in/amit-portrait.jpg"
        alt="Amit Chakraborty"
        loading="eager"
        decoding="async"
        style={{
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "top center",
          display: "block",
        }}
      />

      {/* Purple light leak — top-left, screen blend for cinematic feel */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(155deg, rgba(124,58,237,0.25) 0%, transparent 50%)",
        mixBlendMode: "screen", pointerEvents: "none",
      }} />

      {/* Cinematic gradient — transparent top → deep bottom */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to bottom,
          rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 25%,
          rgba(6,2,20,0.15) 42%, rgba(6,2,20,0.55) 60%,
          rgba(6,2,20,0.88) 78%, rgba(6,2,20,0.97) 100%)`,
        pointerEvents: "none",
      }} />

      {/* Top-left: index badge */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px) saturate(1.8)",
        WebkitBackdropFilter: "blur(14px) saturate(1.8)",
        border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 999,
        padding: "4px 11px",
        fontFamily: "var(--font-mono)", fontSize: 9,
        color: "rgba(255,255,255,0.50)",
        letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        01 / portfolio
      </div>

      {/* Top-right: live indicator */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        background: "rgba(0,0,0,0.40)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "0.5px solid rgba(255,255,255,0.10)", borderRadius: 999,
        padding: "4px 11px",
        fontFamily: "var(--font-mono)", fontSize: 9,
        color: "rgba(255,255,255,0.48)", letterSpacing: "0.06em",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%", background: "#22C55E",
          boxShadow: "0 0 8px rgba(34,197,94,0.85)",
          animation: "pm-pulse 2.4s ease-in-out infinite", flexShrink: 0,
        }} />
        Live
      </div>

      {/* Bottom content overlay */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 22px" }}>
        {/* Available pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(34,197,94,0.10)", border: "0.5px solid rgba(34,197,94,0.25)",
          borderRadius: 999, padding: "4px 11px", marginBottom: 10,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%", background: "#22C55E",
            boxShadow: "0 0 6px rgba(34,197,94,0.9)",
            animation: "pm-pulse 2.4s ease-in-out infinite",
          }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9.5,
            color: "#22C55E", letterSpacing: "0.04em",
          }}>
            Available · Remote
          </span>
        </div>

        {/* Name */}
        <div style={{
          fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21,
          color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15,
        }}>
          Amit Chakraborty
        </div>

        {/* Role */}
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          color: "rgba(155,120,255,0.85)", marginTop: 4, letterSpacing: "0.03em",
        }}>
          Principal Architect · Kolkata, India
        </div>

        {/* Social icons on portrait */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", color: "rgba(255,255,255,0.55)",
                transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ══════════════════════════════════════════════════════════
   CARD 1 — MEMORY CONSTELLATION
   Interactive life-graph. Each node = skill / milestone / achievement.
   Hover → highlight connected edges + tooltip.
   Click → pin tooltip open.
   ══════════════════════════════════════════════════════════ */
const MemoryCard = memo(function MemoryCard() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeId = selectedId ?? hoveredId;
  const activeNode = activeId ? NODE_MAP.get(activeId) ?? null : null;

  const handleClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleEnter = useCallback((id: string) => { setHoveredId(id); }, []);
  const handleLeave = useCallback(() => { setHoveredId(null); }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#F0EEFF" }}>

      {/* Ambient gradient */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        background: `
          radial-gradient(ellipse 80% 70% at 60% 30%, rgba(124,58,237,0.10) 0%, transparent 70%),
          radial-gradient(ellipse 60% 50% at 20% 80%, rgba(99,44,230,0.07) 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      {/* SVG edges */}
      <svg
        aria-hidden
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {EDGES.map(([aId, bId]) => {
          const a = NODE_MAP.get(aId);
          const b = NODE_MAP.get(bId);
          if (!a || !b) return null;
          const isActive = activeId === aId || activeId === bId;
          return (
            <line
              key={`${aId}-${bId}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={isActive ? "rgba(124,58,237,0.50)" : "rgba(124,58,237,0.12)"}
              strokeWidth={isActive ? "0.40" : "0.18"}
              strokeDasharray={isActive ? "none" : "1.5 2"}
              style={{ transition: "stroke 0.25s, stroke-width 0.25s" }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {MEMORY_NODES.map((node) => (
        <MemoryNodeButton
          key={node.id}
          node={node}
          isHovered={hoveredId === node.id}
          isSelected={selectedId === node.id}
          onClick={handleClick}
          onEnter={handleEnter}
          onLeave={handleLeave}
        />
      ))}

      {/* Tooltip — pinned on click or follows hover */}
      {activeNode && (
        <div
          aria-live="polite"
          style={{
            position: "absolute",
            bottom: 52, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(16px) saturate(2)",
            WebkitBackdropFilter: "blur(16px) saturate(2)",
            border: `0.5px solid ${NODE_COLORS[activeNode.category]}30`,
            borderRadius: 10, padding: "9px 14px",
            maxWidth: 230, width: "max-content",
            boxShadow: "0 8px 24px rgba(124,58,237,0.12)",
            zIndex: 6, pointerEvents: "none",
            animation: "pm-tooltip-in 0.18s ease-out both",
          }}
        >
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8.5,
            color: NODE_COLORS[activeNode.category],
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3,
          }}>
            {activeNode.category}
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 12,
            color: "#1a1a2e", lineHeight: 1.3, marginBottom: 3,
          }}>
            {activeNode.label}
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "rgba(0,0,0,0.50)", lineHeight: 1.5,
          }}>
            {activeNode.desc}
          </div>
        </div>
      )}

      {/* Bottom pill */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px) saturate(2)",
        WebkitBackdropFilter: "blur(16px) saturate(2)",
        border: "0.5px solid rgba(124,58,237,0.18)", borderRadius: 999,
        padding: "6px 14px",
        fontFamily: "var(--font-mono)", fontSize: 9.5,
        color: "var(--signal)", whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(124,58,237,0.10)",
        pointerEvents: "none", zIndex: 5,
      }}>
        mem0.graph("amit") → {MEMORY_NODES.length} nodes
      </div>
    </div>
  );
});

/* Individual node button — memo'd to avoid re-rendering all nodes on hover */
const MemoryNodeButton = memo(function MemoryNodeButton({
  node, isHovered, isSelected, onClick, onEnter, onLeave,
}: {
  node: MemoryNode;
  isHovered: boolean;
  isSelected: boolean;
  onClick: (id: string) => void;
  onEnter: (id: string) => void;
  onLeave: () => void;
}) {
  const isActive = isHovered || isSelected;
  const color = NODE_COLORS[node.category];
  const showLabel = isActive || node.r >= 14;

  return (
    <button
      type="button"
      aria-label={`${node.label}: ${node.desc}`}
      onClick={() => onClick(node.id)}
      onMouseEnter={() => onEnter(node.id)}
      onMouseLeave={onLeave}
      style={{
        position: "absolute",
        left: `${node.x}%`, top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
        width: node.r * 2, height: node.r * 2,
        borderRadius: "50%",
        background: isActive
          ? `radial-gradient(circle, ${color}26 0%, ${color}0f 100%)`
          : `${color}0d`,
        border: `1px solid ${isActive ? color + "55" : color + "22"}`,
        boxShadow: isActive
          ? `0 0 0 ${node.r * 0.6}px ${color}12, 0 0 ${node.r * 1.2}px ${color}28`
          : "none",
        cursor: "pointer",
        padding: 0,
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        zIndex: isActive ? 4 : 2,
        animation: isActive ? "none" : `pm-nodepulse ${2.6 + (node.x % 5) * 0.4}s ease-in-out infinite`,
      }}
    >
      {/* Central dot */}
      <span style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          width: Math.max(3, node.r * 0.32),
          height: Math.max(3, node.r * 0.32),
          borderRadius: "50%", background: color,
          opacity: isActive ? 1 : 0.55,
          transition: "opacity 0.2s", flexShrink: 0,
        }} />
      </span>

      {/* Label */}
      {showLabel && (
        <span style={{
          position: "absolute", top: "112%", left: "50%",
          transform: "translateX(-50%)", whiteSpace: "nowrap",
          fontFamily: "var(--font-mono)", fontSize: 7.5,
          color: isActive ? color : "rgba(0,0,0,0.40)",
          fontWeight: isActive ? 600 : 400,
          letterSpacing: "0.02em", pointerEvents: "none",
          marginTop: 2, transition: "color 0.2s",
        }}>
          {node.label}
        </span>
      )}
    </button>
  );
});

/* ══════════════════════════════════════════════════════════
   CARD 2 — AGENT CONTEXT  (mem0-styled search result)
   Replaces generic stats with a living mem0 API response.
   ══════════════════════════════════════════════════════════ */
const AgentContextCard = memo(function AgentContextCard() {
  const [visibleCount, setVisibleCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      countRef.current++;
      setVisibleCount(countRef.current);
      if (countRef.current >= AGENT_MEMORIES.length) clearInterval(t);
    }, 320);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#0C0C14", overflow: "hidden" }}>

      {/* Ambient purple glow — top right */}
      <div aria-hidden style={{
        position: "absolute", top: -30, right: -30, width: 140, height: 140,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Bottom left glow */}
      <div aria-hidden style={{
        position: "absolute", bottom: -20, left: -20, width: 100, height: 100,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "absolute", inset: 0, padding: "18px 18px 16px", display: "flex", flexDirection: "column" }}>

        {/* API query header */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8.5,
            color: "rgba(124,58,237,0.50)", letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 8,
          }}>
            // mem0.search()
          </div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "rgba(255,255,255,0.55)", lineHeight: 1.5,
            background: "rgba(124,58,237,0.08)", borderRadius: 7,
            padding: "8px 10px",
            border: "0.5px solid rgba(124,58,237,0.18)",
          }}>
            <span style={{ color: "rgba(124,58,237,0.75)" }}>query</span>
            <span style={{ color: "rgba(255,255,255,0.30)" }}>{" → "}</span>
            <span style={{ color: "rgba(255,255,255,0.85)" }}>"senior_frontend_engineer"</span>
          </div>
        </div>

        {/* Confidence score bar */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 2.5, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: "97%", borderRadius: 999,
              background: "linear-gradient(90deg, rgba(124,58,237,0.6) 0%, #7C3AED 100%)",
            }} />
          </div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10,
            color: "var(--signal)", letterSpacing: "0.02em", flexShrink: 0,
          }}>
            0.97
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 8.5,
            color: "rgba(255,255,255,0.25)", flexShrink: 0,
          }}>
            confidence
          </span>
        </div>

        {/* Memories list — staggered reveal */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, overflow: "hidden" }}>
          {AGENT_MEMORIES.map((mem, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "flex-start", gap: 7,
                opacity: i < visibleCount ? 1 : 0,
                transform: i < visibleCount ? "none" : "translateY(4px)",
                transition: "opacity 0.28s ease-out, transform 0.28s ease-out",
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 8.5,
                color: "rgba(124,58,237,0.55)", flexShrink: 0, marginTop: 1,
                letterSpacing: "0.02em",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 9.5,
                color: "rgba(255,255,255,0.55)", lineHeight: 1.5,
              }}>
                {mem}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: 10, marginTop: 8,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 8.5,
            color: "rgba(124,58,237,0.45)", letterSpacing: "0.04em",
          }}>
            user_id: amit_chakraborty
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 8.5,
            color: "rgba(34,197,94,0.70)",
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%", background: "#22C55E",
              boxShadow: "0 0 6px rgba(34,197,94,0.7)",
              animation: "pm-pulse 2.4s ease-in-out infinite", flexShrink: 0,
            }} />
            api_mode: real
          </span>
        </div>
      </div>
    </div>
  );
});

/* ══════════════════════════════════════════════════════════
   SWIPEABLE CARD STACK
   ══════════════════════════════════════════════════════════ */
const CARD_COMPS = [PortraitCard, MemoryCard, AgentContextCard];

function SwipeableStack() {
  const [order, setOrder] = useState<[number, number, number]>([2, 1, 0]);
  const [exiting, setExiting] = useState(false);
  const [exitDir, setExitDir] = useState(0);
  const [dragging, setDragging] = useState(false);

  const x      = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const busyRef  = useRef(false);

  const advance = useCallback((dir: number) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setExitDir(dir);
    setExiting(true);
    setTimeout(() => {
      x.set(0);
      setExiting(false);
      setOrder(([b, m, f]) => [f, b, m]);
      busyRef.current = false;
    }, 340);
  }, [x]);

  const scheduleTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => advance(1), 5200);
  }, [advance]);

  useEffect(() => {
    scheduleTimer();
    return () => clearTimeout(timerRef.current);
  }, [scheduleTimer]);

  const onDragEnd = useCallback((_: unknown, info: PanInfo) => {
    setDragging(false);
    const decisive = Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 380;
    if (decisive) {
      advance(info.offset.x > 0 ? 1 : -1);
      scheduleTimer();
    }
  }, [advance, scheduleTimer]);

  const handleDotClick = useCallback(() => {
    if (!busyRef.current) { advance(1); scheduleTimer(); }
  }, [advance, scheduleTimer]);

  return (
    <div style={{ position: "relative", height: "clamp(400px, 46vw, 490px)", margin: "0 8px" }}>
      {order.map((cardIdx, si) => {
        const Comp    = CARD_COMPS[cardIdx];
        const isFront = si === 2;
        const pos     = STACK_POSITIONS[si];
        const isActive = isFront && !exiting;

        const animTarget = isFront && exiting
          ? { x: exitDir * 720, rotate: exitDir * 26, opacity: 0, scale: 0.92 }
          : { rotate: pos.rotate, scale: pos.scale, y: pos.y, opacity: 1 };

        const transitionOpts = isFront && exiting
          ? { duration: 0.26, ease: [0.4, 0, 1, 1] as [number, number, number, number] }
          : { type: "spring" as const, stiffness: 280, damping: 26 };

        const frontShadow = cardIdx === 0
          ? "0 32px 80px rgba(0,0,0,0.70), 0 0 0 0.5px rgba(255,255,255,0.08), inset 0 0.5px 0 rgba(255,255,255,0.12)"
          : cardIdx === 1
          ? "0 24px 70px rgba(0,0,0,0.50), 0 0 0 0.5px rgba(255,255,255,0.06), 0 0 40px rgba(124,58,237,0.08)"
          : "0 24px 70px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(124,58,237,0.15)";

        return (
          <motion.div
            key={cardIdx}
            drag={isActive ? "x" : false}
            dragElastic={0.12}
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => setDragging(true)}
            onDragEnd={isFront ? onDragEnd : undefined}
            animate={animTarget}
            transition={transitionOpts}
            style={{
              position: "absolute", inset: 0,
              borderRadius: 24, overflow: "hidden",
              zIndex: si + 1,
              cursor: isActive ? (dragging ? "grabbing" : "grab") : "default",
              touchAction: isActive ? "none" : "auto",
              boxShadow: isFront ? frontShadow : "none",
              ...(isActive ? { x, rotate } : {}),
            }}
          >
            <Comp />
          </motion.div>
        );
      })}

      {/* Dot indicators */}
      <div
        aria-label="Card navigation"
        style={{
          position: "absolute", bottom: -32, left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        {[0, 1, 2].map((cardIdx) => {
          const isCurrentFront = order[2] === cardIdx;
          return (
            <button
              key={cardIdx}
              type="button"
              onClick={handleDotClick}
              aria-label={`Card ${cardIdx + 1}`}
              style={{
                width: isCurrentFront ? 20 : 6, height: 6,
                borderRadius: 999,
                background: isCurrentFront ? "var(--signal)" : "rgba(124,58,237,0.22)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.25s",
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>

      {/* Swipe hint */}
      {!dragging && !exiting && (
        <div aria-hidden style={{
          position: "absolute", bottom: -52, left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--ink-quaternary)",
          whiteSpace: "nowrap", letterSpacing: "0.06em", pointerEvents: "none", userSelect: "none",
        }}>
          swipe to explore
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CAREER JOURNEY — replaces generic stat numbers with a story
   Shows a horizontal timeline: BCA → NonceBlox → Synapsis → mem0
   ══════════════════════════════════════════════════════════ */
const CareerJourney = memo(function CareerJourney() {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 0,
      position: "relative", paddingLeft: 2,
    }}>
      {/* Connecting line */}
      <div aria-hidden style={{
        position: "absolute", top: 5, left: 7, right: 7, height: 1,
        background: "var(--edge-default)",
      }} />

      {JOURNEY.map((j, i) => {
        const dotColor = DOT_COLOR[j.dot];
        const isLast = i === JOURNEY.length - 1;
        return (
          <div
            key={j.year}
            style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: i === 0 ? "flex-start" : i === JOURNEY.length - 1 ? "flex-end" : "center",
              position: "relative",
            }}
          >
            {/* Dot */}
            <div style={{
              width: isLast ? 10 : 8, height: isLast ? 10 : 8,
              borderRadius: "50%", background: dotColor,
              border: isLast ? `2px solid ${dotColor}40` : "2px solid var(--bg-page)",
              boxShadow: isLast ? `0 0 0 3px ${dotColor}20, 0 0 8px ${dotColor}50` : "none",
              animation: isLast ? "pm-pulse 2.4s ease-in-out infinite" : "none",
              flexShrink: 0, zIndex: 1,
            }} />

            {/* Year label */}
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              color: isLast ? dotColor : "var(--ink-tertiary)",
              fontWeight: isLast ? 600 : 400,
              letterSpacing: "0.04em", marginTop: 8,
            }}>
              {j.year}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 11,
              color: "var(--ink-primary)", fontWeight: 600,
              marginTop: 2, lineHeight: 1.3,
              textAlign: i === 0 ? "left" : i === JOURNEY.length - 1 ? "right" : "center",
            }}>
              {j.title}
            </div>

            {/* Note */}
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 8.5,
              color: "var(--ink-tertiary)", lineHeight: 1.4,
              marginTop: 2, maxWidth: 120,
              textAlign: i === 0 ? "left" : i === JOURNEY.length - 1 ? "right" : "center",
            }}>
              {j.note}
            </div>
          </div>
        );
      })}
    </div>
  );
});

/* ══════════════════════════════════════════════════════════
   HERO — the main exported section
   ══════════════════════════════════════════════════════════ */
export function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    import("gsap")
      .then(({ gsap }) => {
        const items = textRef.current?.querySelectorAll(".h-item");
        if (!items?.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" },
        );
      })
      .catch(() => {
        textRef.current?.querySelectorAll(".h-item").forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
        });
      });
  }, []);

  return (
    <section
      id="hero"
      style={{
        background: "#FFFFFF",
        paddingTop: "calc(54px + 64px)",
        paddingBottom: 88,
        paddingLeft: 24,
        paddingRight: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Very subtle purple ambient tint — zero orbs */}
      <div aria-hidden style={{
        position: "absolute", top: 0, right: 0, width: "50%", height: "70%",
        background: "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(124,58,237,0.04) 0%, transparent 75%)",
        pointerEvents: "none",
      }} />

      <div
        style={{
          maxWidth: 1080, margin: "0 auto", width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px, 5vw, 80px)", alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* ── LEFT: content ── */}
        <div ref={textRef}>

          {/* Avatar + availability badge */}
          <div className="h-item" style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 26, opacity: 0,
          }}>
            <img
              src="https://github.com/devamitch.png"
              alt="Amit Chakraborty"
              width={44} height={44}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                objectFit: "cover", flexShrink: 0,
              }}
            />
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "var(--signal-light)", borderRadius: 999, padding: "5px 12px",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: "#22C55E",
                animation: "pm-pulse 2.4s ease-in-out infinite", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--signal)", letterSpacing: "0.02em",
              }}>
                Available · Remote
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1
            className="h-item"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.1rem, 4.8vw, 3.4rem)",
              color: "var(--ink-primary)",
              lineHeight: 1.06, fontWeight: 700,
              marginBottom: 16, letterSpacing: "-0.03em", opacity: 0,
            }}
          >
            Engineer who builds systems{" "}
            <span style={{ color: "var(--signal)" }}>that remember.</span>
          </h1>

          {/* Subtext */}
          <p
            className="h-item"
            style={{
              fontSize: 15, color: "var(--ink-secondary)",
              lineHeight: 1.68, marginBottom: 28, maxWidth: 400, opacity: 0,
            }}
          >
            React Native · AI/ML pipelines · Web3. 8+ years shipping production
            systems. Applying for Senior Frontend Engineer at{" "}
            <span style={{ color: "var(--signal)", fontWeight: 500 }}>mem0</span>.
          </p>

       
          {/* CTAs */}
          <div className="h-item" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22, opacity: 0 }}>
            <a
              href="#projects"
              style={{
                background: "var(--signal)", color: "#fff",
                fontSize: 13.5, fontWeight: 500,
                padding: "11px 22px", borderRadius: 999,
                textDecoration: "none", display: "inline-block",
                letterSpacing: "-0.01em", transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              View Projects
            </a>
            <a
              href="/Amit Chakraborty.pdf"
              download
              style={{
                background: "var(--signal-light)", color: "var(--signal)",
                fontSize: 13.5, fontWeight: 500,
                padding: "11px 22px", borderRadius: 999,
                textDecoration: "none", display: "inline-block",
                letterSpacing: "-0.01em", transition: "opacity 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.78"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Resume
            </a>
          </div>

          {/* Social icons + email */}
          <div className="h-item" style={{ display: "flex", alignItems: "center", gap: 2, opacity: 0 }}>
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 34, height: 34, borderRadius: 9,
                  color: "var(--ink-tertiary)", textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--signal)"; e.currentTarget.style.background = "var(--signal-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ink-tertiary)"; e.currentTarget.style.background = "transparent"; }}
              >
                <Icon />
              </a>
            ))}
            <span style={{
              marginLeft: 8, fontFamily: "var(--font-mono)",
              fontSize: 11, color: "var(--ink-quaternary)", letterSpacing: "0.01em",
            }}>
              amit@devamit.co.in
            </span>
          </div>
        </div>

        {/* ── RIGHT: swipeable card stack ── */}
        <div className="hide-on-mobile" style={{ paddingBottom: 56 }}>
          <SwipeableStack />
        </div>
      </div>

      {/* Scoped keyframes + responsive */}
      <style>{`
        @keyframes pm-pulse      { 0%,100%{opacity:1;transform:scale(1);}    50%{opacity:0.55;transform:scale(0.8);}  }
        @keyframes pm-nodepulse  { 0%,100%{transform:scale(1);opacity:0.7;}  50%{transform:scale(1.10);opacity:1.0;}  }
        @keyframes pm-tooltip-in { from{opacity:0;transform:translateX(-50%) translateY(4px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }
        @media (max-width: 720px) { .hero-grid { grid-template-columns: 1fr !important; } }
        .h-item { opacity: 0; }
      `}</style>
    </section>
  );
}
