export interface Project {
  id: string;
  name: string;
  signal: string;
  tagline: string;
  category: string;
  score: number;
  year: string;
  url: string;
  impact: string;
  stack: string[];
  description: string;
  roleHighlights: string[];
  /** mem0-specific insight shown in the detail modal */
  whyItMatters: string;
}

export const PROJECTS: Project[] = [
  {
    id: "mem_001",
    name: "Aura Studio",
    signal: "#8B5CF6",
    tagline: "Visual AI Orchestration Platform",
    category: "AI Infrastructure",
    score: 0.98,
    year: "2025–2026",
    url: "https://aurastudio.devamit.co.in",
    impact: "45+ node types · Live LLM pipelines",
    stack: ["React 19", "React Flow", "Next.js", "Gemini API", "NestJS", "Zustand"],
    description:
      "Nodal canvas where users drag, connect, and configure 45+ AI pipeline nodes in real time without glue code. Full streaming execution. Not a demo.",
    roleHighlights: [
      "Designed the entire node/edge type system — 45+ custom React Flow nodes with typed connections",
      "Built streaming LLM execution engine — real-time output injection across any pipeline topology",
      "Owned the complete stack: UI architecture, NestJS orchestrator, Gemini API integration",
    ],
    whyItMatters:
      "This is memory architecture made visual. Every node is a memory transformer — storing intermediate context, injecting it forward, and searching relevant state. The nodal metaphor is exactly how mem0's memory graph works: add → search → inject → respond.",
  },
  {
    id: "mem_002",
    name: "KSHEM / ProLandly",
    signal: "#16A07C",
    tagline: "Government Land Intelligence Platform",
    category: "GovTech · GIS",
    score: 0.96,
    year: "2025–2026",
    url: "https://kshem.devamit.co.in",
    impact: "20+ portals · Claude AI · PostGIS",
    stack: ["Next.js 16", "React 19", "Claude API", "PostGIS", "Tailwind v4"],
    description:
      "Core digital infrastructure for land governance. 20+ stakeholder portals. Embedded document AI via Claude. RERA compliance.",
    roleHighlights: [
      "Architected 20+ stakeholder portal routing via Next.js App Router with per-role access layers",
      "Integrated Claude AI for legal document analysis — extracting structured data from unstructured PDFs",
      "Built PostGIS + GeoJSON boundary engine for spatial land parcel intelligence",
    ],
    whyItMatters:
      "Every government interaction leaves a context trail across portals. I built the memory layer that keeps 20+ user types coherent — same persistence problem mem0 solves, but across a state-managed GovTech ecosystem.",
  },
  {
    id: "mem_003",
    name: "HarmonyBloom",
    signal: "#F472B6",
    tagline: "Encrypted AI Wellness — Telegram Mini App",
    category: "Consumer AI · TMA",
    score: 0.94,
    year: "2024–2026",
    url: "https://harmonybloom.devamit.co.in",
    impact: "AES-256-GCM · Dexie offline-first · Gemini AI",
    stack: ["React 18", "Vite", "Supabase", "Dexie", "Framer Motion", "Gemini API"],
    description:
      "Privacy-first wellness engine. Zero-knowledge architecture. Runs inside Telegram. AI coach with gamified habit tracking.",
    roleHighlights: [
      "Zero-knowledge memory: AES-256-GCM encryption on all user data — not even the server can read it",
      "Built offline-first persistence layer with Dexie (IndexedDB) + service worker sync",
      "Designed Gemini AI coach with long-term memory injection for continuity across sessions",
    ],
    whyItMatters:
      "This app is the mem0 thesis in consumer form: an AI that remembers you privately, persistently, and meaningfully. The Aura coach uses contextual memory injection — exactly the pattern mem0 enables at the SDK level.",
  },
  {
    id: "mem_004",
    name: "Aura Arena",
    signal: "#FB923C",
    tagline: "Real-time Computer Vision Gaming PWA",
    category: "Computer Vision · Gaming",
    score: 0.93,
    year: "2024–2025",
    url: "https://auraarena.devamit.co.in",
    impact: "<16ms inference · 60fps · Supabase Realtime",
    stack: ["MediaPipe", "TensorFlow.js", "WebGPU", "Supabase Realtime", "PWA"],
    description:
      "Live camera → competitive gameplay. BlazePose + Face Mesh at 60fps on consumer hardware. 1v1 battle mode. Global leaderboard.",
    roleHighlights: [
      "Achieved <16ms/frame inference using MediaPipe BlazePose + WebGPU acceleration in-browser",
      "Built hybrid on-device + cloud pipeline: edge inference locally, results ranked via Supabase Realtime",
      "Designed biometric scoring engine — movement quality as a persistent performance memory",
    ],
    whyItMatters:
      "Biometric movement data is the ultimate user memory — it persists across sessions, reveals patterns, and enables personalization. I built the scoring and retrieval layer for physical context the way mem0 does for conversational context.",
  },
  {
    id: "mem_005",
    name: "Vulcan Eleven",
    signal: "#38BDF8",
    tagline: "Fantasy Sports · 50K+ Daily Active Users",
    category: "React Native · Mobile",
    score: 0.95,
    year: "2023–2025",
    url: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
    impact: "50K+ DAU · C++ native · Razorpay + Binance Pay",
    stack: ["React Native", "Reanimated 3", "C++", "Razorpay", "Binance Pay"],
    description:
      "Fantasy sports at scale. C++ native modules for 60fps on $150 Android. Gesture mechanics, dual payment rails, zero critical failures in production.",
    roleHighlights: [
      "Built proprietary C++ native module for render pipeline — achieved 60fps on mid-range Android hardware",
      "Integrated Razorpay (fiat) + Binance Pay (crypto) — dual payment rail with no UX disruption",
      "Zero critical production failures across 50K+ daily active users",
    ],
    whyItMatters:
      "At 50K DAU, user context is everything — personalized contests, session continuity, payment preference memory. This is where I learned that stateful user memory is not a feature, it is the product.",
  },
  {
    id: "mem_006",
    name: "DeFi11",
    signal: "#A78BFA",
    tagline: "Fully On-Chain Decentralized Fantasy Sports",
    category: "Web3 · Solidity",
    score: 0.91,
    year: "2022–2024",
    url: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
    impact: "Ethereum Mainnet · UUPS proxy · NFT marketplace",
    stack: ["Solidity", "React Native", "Wagmi", "Ethers.js", "ERC-721"],
    description:
      "100% on-chain. Smart contract prize pools. NFT marketplace with ERC-2981 royalties. Zero-trust — no centralized game logic.",
    roleHighlights: [
      "Designed UUPS upgradeable proxy architecture — contracts live on Ethereum Mainnet",
      "Built NFT marketplace with on-chain royalty enforcement via ERC-2981",
      "Zero centralized game logic — all state lives on-chain, verifiable by anyone",
    ],
    whyItMatters:
      "Blockchain is the most extreme form of persistent, verifiable memory. Every transaction is immutable context. Building DeFi systems taught me that the most valuable memory is the one that cannot be falsified.",
  },
];
