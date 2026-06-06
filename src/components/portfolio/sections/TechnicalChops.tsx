import { useState, type ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { AuroraBackground } from "@/components/ui/aurora-background";

/* ─── Monokai Dark syntax theme ─────────────────────────── */
const MK = {
  bg:      "#272822",
  gutter:  "#3B3A32",
  text:    "#F8F8F2",
  comment: "#75715E",
  keyword: "#F92672",
  string:  "#E6DB74",
  fn:      "#A6E22E",
  type:    "#66D9EF",
  number:  "#AE81FF",
  op:      "#F8F8F2",
  dim:     "#90908A",
};

type TT = "kw" | "str" | "fn" | "type" | "num" | "comment" | "op" | "plain";
const colorOf: Record<TT, string> = {
  kw: MK.keyword, str: MK.string, fn: MK.fn, type: MK.type,
  num: MK.number, comment: MK.comment, op: MK.op, plain: MK.text,
};

const KW = new Set(["import","export","const","let","var","function","async","await","return",
  "type","interface","from","new","if","else","for","of","class","extends",
  "default","true","false","null","undefined","as","void","readonly"]);

function tokenize(code: string): Array<[TT, string]> {
  const out: Array<[TT, string]> = [];
  let i = 0;
  while (i < code.length) {
    // comment
    if (code[i] === "/" && code[i+1] === "/") {
      const end = code.indexOf("\n", i);
      const s = end === -1 ? code.slice(i) : code.slice(i, end);
      out.push(["comment", s]); i += s.length; continue;
    }
    // template / double / single string
    if (code[i] === "`" || code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i + 1;
      while (j < code.length && code[j] !== q) { if (code[j] === "\\") j++; j++; }
      out.push(["str", code.slice(i, j + 1)]); i = j + 1; continue;
    }
    // identifier / keyword / type / function-call
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const w = code.slice(i, j);
      let tt: TT = "plain";
      if (KW.has(w)) tt = "kw";
      else if (/^[A-Z]/.test(w)) tt = "type";
      else if (code[j] === "(") tt = "fn";
      out.push([tt, w]); i = j; continue;
    }
    // number
    if (/[0-9]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[0-9.Ee]/.test(code[j])) j++;
      out.push(["num", code.slice(i, j)]); i = j; continue;
    }
    out.push(["plain", code[i]]); i++;
  }
  return out;
}

function Code({ children }: { children: string }): ReactNode {
  return (
    <>
      {tokenize(children).map(([tt, text], i) => (
        <span key={i} style={{ color: colorOf[tt] }}>{text}</span>
      ))}
    </>
  );
}

const DOMAINS = [
  {
    name: "React Native",
    tag: "Mobile · Primary",
    level: 98,
    description: "Bridgeless, JSI, TurboModules. 60fps on $150 Android. 18+ apps to App Store and Play Store.",
    skills: ["Reanimated 3", "Expo Router", "C++ / Swift / Kotlin", "CodePush", "Fastlane"],
    accent: "#7C3AED",
  },
  {
    name: "AI / ML Systems",
    tag: "RAG · Agents",
    level: 88,
    description: "HIPAA-compliant RAG pipelines at Synapsis. MediaPipe CV on-device. LLM orchestration in production.",
    skills: ["Claude · Gemini", "RAG Architecture", "MediaPipe", "TensorFlow.js", "Pinecone"],
    accent: "#A855F7",
  },
  {
    name: "Frontend Web",
    tag: "React · Next.js",
    level: 94,
    description: "React 19 concurrent, Server Components, streaming. Physics-based motion. Apple-level UI craft.",
    skills: ["Next.js 16", "React 19", "Framer Motion", "Tailwind v4", "TypeScript"],
    accent: "#7C3AED",
  },
  {
    name: "Backend Systems",
    tag: "APIs · Scale",
    level: 90,
    description: "NestJS, GraphQL, event-driven architecture. PostgreSQL mastery. 50K+ DAU without incidents.",
    skills: ["NestJS", "GraphQL", "PostgreSQL", "Redis", "Docker · K8s"],
    accent: "#A855F7",
  },
  {
    name: "Web3",
    tag: "Blockchain",
    level: 85,
    description: "Solidity contracts, Ethereum, Solana, DeFi protocols. On-chain gaming and NFT marketplaces shipped.",
    skills: ["Solidity", "Wagmi · Viem", "Hardhat", "Smart Contracts", "IPFS"],
    accent: "#7C3AED",
  },
  {
    name: "Engineering Lead",
    tag: "0→1 Builder",
    level: 98,
    description: "5 complete systems from zero at Synapsis. 0→21 engineers scaled. 3 promoted to senior.",
    skills: ["Hiring · SDLC", "Mentorship", "Architecture", "CI / CD", "Team Culture"],
    accent: "#A855F7",
  },
];

const STATS = [
  { value: "18+", label: "Production apps" },
  { value: "50K+", label: "Peak daily users" },
  { value: "21", label: "Engineers scaled" },
  { value: "8+", label: "Years production" },
];

function DomainRow({
  domain,
  index,
  isLast,
}: {
  domain: (typeof DOMAINS)[0];
  index: number;
  isLast: boolean;
}) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.1);

  return (
    <div
      ref={ref}
      className="tc-row"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 80px",
        alignItems: "start",
        gap: 32,
        padding: "28px 0",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.05)",
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s`,
      }}
    >
      {/* Left: name, tag, description, skills */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
              margin: 0,
              letterSpacing: "-0.015em",
            }}
          >
            {domain.name}
          </h3>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: domain.accent,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            {domain.tag}
          </span>
        </div>

        <p
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.6,
            margin: "0 0 12px",
          }}
        >
          {domain.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {domain.skills.map((skill) => (
            <span
              key={skill}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.40)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Right: level number + bar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 30,
            fontWeight: 700,
            color: domain.accent,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            opacity: 0.9,
          }}
        >
          {domain.level}
        </span>
        <div
          style={{
            width: "100%",
            height: 2,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: isInView ? `${domain.level}%` : "0%",
              background: domain.accent,
              borderRadius: 999,
              opacity: 0.6,
              transition: `width 1s cubic-bezier(0.16,1,0.3,1) ${index * 0.07 + 0.25}s`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

const CODE_TABS = [
  {
    label: "memory.functions.ts",
    lang: "TS",
    langColor: "#3178C6",
    code:
`import { createServerFn } from "@tanstack/react-start";
import Mem0 from "mem0ai";

// Real mem0 API — falls back to MockMem0Client when key absent
const mem0 = new Mem0({ apiKey: process.env.MEM0_API_KEY });

export const searchMemories = createServerFn({ method: "POST" })
  .validator((d: { query: string; userId: string }) => d)
  .handler(async ({ data }) => {
    const results = await mem0.search(data.query, {
      user_id: data.userId,
      limit: 10,
    });
    return { success: true, data: results, apiMode: "real" as const };
  });`,
  },
  {
    label: "MemoryGraph.tsx",
    lang: "TSX",
    langColor: "#61DAFB",
    code:
`// Animated SVG constellation — pure SVG, no canvas, no deps
// Self-sizes to container, fully decorative (aria-hidden)

type N = { el: SVGCircleElement; x: number; y: number;
           vx: number; vy: number; r: number };

const tick = (state: N[], w: number, h: number) =>
  state.map((n) => ({
    ...n,
    vx: clamp(n.vx + (Math.random() - 0.5) * 0.04, -0.4, 0.4),
    vy: clamp(n.vy + (Math.random() - 0.5) * 0.04, -0.4, 0.4),
    x: wrap(n.x + n.vx, w),
    y: wrap(n.y + n.vy, h),
  }));

// 30fps interval — GPU-friendly, respects prefers-reduced-motion`,
  },
  {
    label: "Hero.tsx",
    lang: "TSX",
    langColor: "#61DAFB",
    code:
`// Stacked card entrance — Framer Motion spring physics
<motion.div
  initial={{ rotate: -4, scale: 0.94, y: 16 }}
  animate={{ rotate: -3, scale: 0.96, y: 8 }}
  transition={{ type: "spring", stiffness: 180, damping: 22 }}
  style={{ position: "absolute", inset: 0, zIndex: 1 }}
>
  <MemoryGraph density={18} mode="light" />
</motion.div>

<motion.div
  initial={{ rotate: 5, y: 24, x: -12 }}
  animate={{ rotate: 2.5, y: 12, x: -20 }}
  transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.08 }}
  style={{ position: "absolute", top: 20, left: 0, zIndex: 3 }}
>
  <img src="https://github.com/devamitch.png" alt="Amit" />
</motion.div>`,
  },
] as const;

function CodeSpotlight() {
  const [active, setActive] = useState(0);
  const tab = CODE_TABS[active];

  return (
    <div style={{ marginTop: 52 }}>
      {/* Section label */}
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 10,
        color: "rgba(255,255,255,0.20)", letterSpacing: "0.1em",
        textTransform: "uppercase", marginBottom: 12,
      }}>
        // source · from this portfolio
      </div>

      {/* Mac window chrome */}
      <div style={{ borderRadius: 12, overflow: "hidden", background: MK.bg }}>

        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "11px 16px",
          background: "#1E1E1E",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Traffic lights */}
          {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, flexShrink: 0 }} />
          ))}
          {/* Centered filename */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "rgba(255,255,255,0.40)", letterSpacing: "0.01em",
            }}>
              {tab.label}
            </span>
          </div>
          {/* Lang badge */}
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: tab.langColor, letterSpacing: "0.04em", opacity: 0.85,
          }}>
            {tab.lang}
          </span>
        </div>

        {/* Tab strip */}
        <div style={{
          display: "flex", alignItems: "stretch",
          background: "#252526",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflowX: "auto",
        }}>
          {CODE_TABS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                padding: "7px 16px",
                background: active === i ? MK.bg : "transparent",
                color: active === i ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.32)",
                border: "none", cursor: "pointer",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                borderTop: active === i ? `2px solid ${t.langColor}` : "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "color 0.13s, background 0.13s",
                display: "flex", alignItems: "center", gap: 7,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.langColor, opacity: 0.7, flexShrink: 0 }} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Code area */}
        <div style={{ display: "flex", background: MK.bg, overflowX: "auto" }}>
          {/* Gutter */}
          <div style={{
            padding: "18px 0",
            background: MK.bg,
            borderRight: `1px solid ${MK.gutter}`,
            minWidth: 40,
            userSelect: "none",
            flexShrink: 0,
          }}>
            {tab.code.split("\n").map((_, ln) => (
              <div key={ln} style={{
                fontFamily: "var(--font-mono)", fontSize: 12,
                lineHeight: "1.75",
                padding: "0 12px 0 8px",
                color: MK.dim,
                textAlign: "right",
              }}>
                {ln + 1}
              </div>
            ))}
          </div>

          {/* Highlighted code */}
          <pre style={{
            margin: 0, padding: "18px 24px",
            fontSize: 12.5, lineHeight: 1.75,
            fontFamily: "var(--font-mono)",
            color: MK.text,
            flex: 1,
            minWidth: 0,
            overflowX: "auto",
          }}>
            <code><Code>{tab.code}</Code></code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function TechnicalChops() {
  return (
    <AuroraBackground style={{ background: "var(--dark-bg)" }}>
      <section id="skills" style={{ padding: "64px 24px 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--signal-bright)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Technical Proficiency
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.95)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Depth across the full stack.
              </h2>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 260,
                textAlign: "right",
              }}
            >
              Every number earned in production. Not tutorials.
            </p>
          </div>

          {/* Domain rows */}
          <div>
            {DOMAINS.map((domain, i) => (
              <DomainRow
                key={domain.name}
                domain={domain}
                index={i}
                isLast={i === DOMAINS.length - 1}
              />
            ))}
          </div>

          {/* Stats — inline, no box */}
          <div
            className="tc-stats"
            style={{
              display: "flex",
              gap: 52,
              paddingTop: 36,
              marginTop: 36,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              flexWrap: "wrap",
            }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.88)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.28)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Code spotlight */}
          <CodeSpotlight />
        </div>

        <style>{`
          @media (max-width: 600px) {
            .tc-row { grid-template-columns: 1fr !important; }
            .tc-row > div:last-child { flex-direction: row !important; align-items: center !important; width: 100% !important; }
            .tc-stats { gap: 28px !important; }
          }
        `}</style>
      </section>
    </AuroraBackground>
  );
}
