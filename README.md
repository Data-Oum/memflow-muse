# memflow-muse 

A production-grade, AI-native portfolio built as a live demonstration of architectural expertise and product sense. Designed specifically as the centerpiece of Amit Chakraborty's application for Staff / Principal Frontend Engineer at [mem0.ai](https://mem0.ai/).

## Overview

This is not a template. Every section is engineered for a specific hiring outcome, showcasing deep expertise in modern frontend architecture, AI/LLM integration, and premium UI/UX design. The application features a fully mem0-inspired aesthetic, real-time voice streaming, and a hardened RAG pipeline powered by mem0.

Live URL: [memflowmuse.devamit.co.in](https://memflowmuse.devamit.co.in)

## Technical Architecture

*   **Framework:** TanStack Start (Vite + SSR), React 19
*   **Language:** TypeScript (Strict)
*   **Styling:** CSS Custom Properties + Tailwind CSS v4 (mem0-inspired flat design, purple accents, pure white backgrounds, no shadows)
*   **UI Primitives:** Custom, lightweight functional components based on shadcn/ui principles
*   **State Management:** Localized `useState`/`useRef` (SPA architecture, no global store required)
*   **Routing:** TanStack Router (File-based)
*   **Server Functions:** `@tanstack/react-start` server functions for API layer
*   **Memory / RAG:** mem0 Node.js SDK
*   **Voice AI:** Web Audio API AnalyserNode, browser SpeechRecognition, streaming responses
*   **Scroll & Animation:** Lenis (smooth scrolling), GSAP (hero animations), IntersectionObserver

## Key Features

1.  **mem0 Aesthetic:** A meticulous recreation of mem0.ai's design language. Flat surfaces, ultra-thin borders, purple (`#7C3AED`) signal accents, Fustat/Mona Sans typography, and dark terminal code blocks.
2.  **Live Voice Assistant (RAG):** A floating, Intercom-style voice chat dialog. Uses the browser's MediaDevices and SpeechRecognition to capture audio, complete with a live Web Audio API waveform visualization. 
3.  **Hardened mem0 RAG Flow:** Server-side functions query a mem0 memory store based on user input, filtering results by a strict relevance score threshold (`0.4`) before injecting them into the Gemini 3 Flash system prompt.
4.  **Premium Interactions:** Custom scrollbars, an active scroll progress indicator, and highly-tuned Lenis smooth scrolling synchronized with GSAP's ticker.

## Local Development

```bash
# Install dependencies using Bun
bun install

# Run the development server
bun run dev
```

### Environment Variables

To enable the live mem0 RAG features and the Lovable AI Gateway, create a `.env.local` file:

```env
MEM0_API_KEY=your_mem0_api_key_here
LOVABLE_API_KEY=your_lovable_api_key_here
```

## Directory Structure

```text
src/
├── components/
│   └── portfolio/
│       ├── sections/         # Individual portfolio sections (Hero, Projects, VoiceChatDialog)
│       ├── ui/               # Reusable primitives (ScrollProgress, MemoryGraph)
│       ├── data/             # Static content (skills, projects list)
│       └── portfolio.tsx     # Main portfolio assembly
├── hooks/                    # useInView, useSmoothScroll, useScrollSpy
├── lib/
│   ├── ai-gateway.server.ts  # AI model streaming configuration
│   └── api/
│       └── memory.functions.ts # mem0 server functions
├── routes/
│   ├── api/
│   │   └── chat.ts           # RAG-enabled chat endpoint
│   ├── __root.tsx            # Root layout, fonts, PWA registration
│   └── index.tsx             # SEO metadata, canonical links
└── styles.css                # Global design system & mem0 tokens
```

## Deployment

Built for deployment on Vercel or similar Edge/Node environments.

```bash
bun run build
```

Ensure `MEM0_API_KEY` and `LOVABLE_API_KEY` are set in your production environment variables.
