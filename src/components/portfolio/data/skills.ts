export interface Skill {
  name: string;
  score: number;
  note: string;
}

export interface Cluster {
  id: string;
  label: string;
  color: string;
  ghost: string;
  skills: Skill[];
}

export const CLUSTERS: Cluster[] = [
  {
    id: "mobile",
    label: "mobile",
    color: "#0EA5E9",
    ghost: "rgba(14,165,233,0.08)",
    skills: [
      { name: "React Native Bridgeless", score: 98, note: "JSI · Fabric · TurboModules" },
      { name: "TypeScript Strict", score: 96, note: "Generics · discriminated unions" },
      { name: "Reanimated 3", score: 92, note: "UI thread worklets · 60fps on $150 Android" },
      { name: "iOS + Android Deploy", score: 95, note: "App Store · Play Store · Fastlane" },
      { name: "C++ / Swift / Kotlin", score: 83, note: "Native modules · JSI bridge" },
    ],
  },
  {
    id: "ai",
    label: "ai_ml",
    color: "#8B5CF6",
    ghost: "rgba(139,92,246,0.08)",
    skills: [
      { name: "mem0 SDK", score: 90, note: "This portfolio is proof" },
      { name: "RAG Pipelines", score: 88, note: "HIPAA · 99.9% uptime · Pinecone" },
      {
        name: "Claude / Gemini / OpenAI",
        score: 87,
        note: "Streaming · tool use · function calling",
      },
      { name: "MediaPipe CV", score: 84, note: "BlazePose · <16ms on mobile" },
      { name: "Context Engineering", score: 91, note: "Prompt architecture · memory injection" },
    ],
  },
  {
    id: "frontend",
    label: "frontend",
    color: "#16A07C",
    ghost: "rgba(22,160,124,0.08)",
    skills: [
      { name: "React 18 / 19", score: 94, note: "Concurrent · Suspense · RSC" },
      { name: "Next.js 15", score: 92, note: "App Router · ISR · Edge Runtime" },
      { name: "Framer Motion", score: 87, note: "Spring physics · choreography" },
      { name: "Zustand + React Query", score: 90, note: "The only state stack I need" },
    ],
  },
  {
    id: "backend",
    label: "backend",
    color: "#F59E0B",
    ghost: "rgba(245,158,11,0.08)",
    skills: [
      { name: "NestJS", score: 90, note: "DI · guards · event-driven" },
      { name: "PostgreSQL + PostGIS", score: 90, note: "ACID · geospatial · window fns" },
      { name: "GraphQL", score: 88, note: "DataLoader · federation" },
    ],
  },
  {
    id: "web3",
    label: "web3",
    color: "#A78BFA",
    ghost: "rgba(167,139,250,0.08)",
    skills: [
      { name: "Solidity", score: 85, note: "ERC-20/721/1155 · UUPS proxy" },
      { name: "Wagmi v2 + Viem", score: 86, note: "Type-safe · multi-chain · SSR" },
      { name: "Ethereum Mainnet", score: 81, note: "Gas optimization · on-chain game logic" },
    ],
  },
  {
    id: "leadership",
    label: "leadership",
    color: "#F472B6",
    ghost: "rgba(244,114,182,0.08)",
    skills: [
      { name: "0→1 Architecture", score: 98, note: "5 complete systems from zero" },
      { name: "Team Scaling", score: 94, note: "0→21 engineers · 3 seniors promoted" },
      { name: "Technical Mentorship", score: 95, note: "Standards · reviews · culture" },
    ],
  },
];
