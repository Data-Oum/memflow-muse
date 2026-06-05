import { useEffect, useRef } from "react";

/**
 * Mem0-inspired animated memory graph.
 * Renders a constellation of "memory" nodes connected by edges that gently
 * drift and pulse. Pure SVG — no canvas, no deps, no layout cost.
 *
 * Place absolutely-positioned inside a `position: relative` parent.
 * It self-sizes to its container and is fully decorative (`aria-hidden`).
 */
export function MemoryGraph({
  density = 14,
  className,
  style,
}: {
  density?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-node]"));
    const lines = Array.from(svg.querySelectorAll<SVGLineElement>("[data-edge]"));

    type N = { el: SVGCircleElement; x: number; y: number; vx: number; vy: number; r: number };
    const state: N[] = nodes.map((el) => ({
      el,
      x: parseFloat(el.getAttribute("cx") || "50"),
      y: parseFloat(el.getAttribute("cy") || "50"),
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      r: parseFloat(el.getAttribute("r") || "2"),
    }));

    const edges = lines.map((el) => ({
      el,
      a: parseInt(el.dataset.a || "0", 10),
      b: parseInt(el.dataset.b || "0", 10),
    }));

    let raf = 0;
    const tick = () => {
      for (const n of state) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 5 || n.x > 95) n.vx *= -1;
        if (n.y < 5 || n.y > 95) n.vy *= -1;
        n.el.setAttribute("cx", n.x.toFixed(3));
        n.el.setAttribute("cy", n.y.toFixed(3));
      }
      for (const e of edges) {
        const a = state[e.a];
        const b = state[e.b];
        if (!a || !b) continue;
        e.el.setAttribute("x1", a.x.toFixed(3));
        e.el.setAttribute("y1", a.y.toFixed(3));
        e.el.setAttribute("x2", b.x.toFixed(3));
        e.el.setAttribute("y2", b.y.toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Deterministic layout — SSR-safe (no Math.random at render time).
  const seed = (i: number) => {
    // simple hash-ish for reproducible jitter
    const s = Math.sin(i * 9301 + 49297) * 233280;
    return s - Math.floor(s);
  };

  const nodes = Array.from({ length: density }, (_, i) => {
    const cx = 8 + seed(i) * 84;
    const cy = 8 + seed(i + 100) * 84;
    const r = 0.7 + seed(i + 200) * 1.4;
    return { i, cx, cy, r };
  });

  // Connect each node to its 2 nearest neighbors to form a sparse graph.
  const edges: Array<{ a: number; b: number }> = [];
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({ j, d: (n.cx - nodes[i].cx) ** 2 + (n.cy - nodes[i].cy) ** 2 }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const { j } of dists) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edges.find((e) => `${e.a}-${e.b}` === key)) {
        edges.push({ a: Math.min(i, j), b: Math.max(i, j) });
      }
    }
  }

  return (
    <svg
      ref={ref}
      aria-hidden
      className={className}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    >
      <defs>
        <radialGradient id="mg-node-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(22,160,124,0.85)" />
          <stop offset="100%" stopColor="rgba(22,160,124,0)" />
        </radialGradient>
      </defs>
      {edges.map((e, idx) => (
        <line
          key={`e${idx}`}
          data-edge
          data-a={e.a}
          data-b={e.b}
          x1={nodes[e.a].cx}
          y1={nodes[e.a].cy}
          x2={nodes[e.b].cx}
          y2={nodes[e.b].cy}
          stroke="rgba(22,160,124,0.18)"
          strokeWidth={0.12}
        />
      ))}
      {nodes.map((n) => (
        <g key={`n${n.i}`}>
          <circle cx={n.cx} cy={n.cy} r={n.r * 2.4} fill="url(#mg-node-glow)" opacity={0.35} />
          <circle
            data-node
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="rgba(22,160,124,0.9)"
          />
        </g>
      ))}
    </svg>
  );
}