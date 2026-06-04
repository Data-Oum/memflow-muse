import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/portfolio";

const SITE_URL = "https://memflow-muse.lovable.app";
const IMAGE_URL = "https://devamit.co.in/amit-portrait.jpg";
const FULL_NAME = "Amit Chakraborty";
const JOB_TITLE = "Principal Architect · AI-Native Systems Engineer";
const DESCRIPTION =
  "Amit Chakraborty — Principal Architect & AI-Native Systems Engineer. 8+ years, 18+ production apps shipped, 21 engineers led. 50K+ peak DAU. Targeting Staff / Principal Frontend Engineer at mem0. Built with mem0 as the context memory layer.";
const KEYWORDS =
  "Amit Chakraborty, mem0, principal frontend engineer, AI-native, React, Next.js, TypeScript, React Native, Kolkata, remote, Staff Engineer, AI memory, RAG pipelines, WebGPU, Solidity, Web3";

const PROJECTS_LD = [
  {
    name: "Aura Studio",
    url: "https://aurastudio.devamit.co.in",
    description:
      "Visual AI orchestration platform with 45+ custom React Flow node types. Real-time LLM pipeline execution without glue code.",
    keywords: ["React 19", "React Flow", "Gemini API", "NestJS", "AI pipelines"],
    year: "2025",
  },
  {
    name: "KSHEM / ProLandly",
    url: "https://kshem.devamit.co.in",
    description:
      "Global land intelligence platform with 20+ stakeholder portals, Claude AI document analysis, PostGIS boundary engine, and RERA compliance.",
    keywords: ["Next.js 16", "Claude AI", "PostGIS", "GovTech", "GIS"],
    year: "2025",
  },
  {
    name: "HarmonyBloom",
    url: "https://harmonybloom.devamit.co.in",
    description:
      "Encrypted AI wellness Telegram Mini App with AES-256-GCM zero-knowledge architecture, offline-first Dexie, and Gemini AI coach.",
    keywords: ["React 18", "Supabase", "Gemini API", "Telegram Mini App", "Encryption"],
    year: "2024",
  },
  {
    name: "Aura Arena",
    url: "https://auraarena.devamit.co.in",
    description:
      "Real-time computer vision gaming PWA using MediaPipe BlazePose at <16ms inference, WebGPU, and Supabase Realtime for 1v1 battles.",
    keywords: ["MediaPipe", "TensorFlow.js", "WebGPU", "Computer Vision", "PWA"],
    year: "2024",
  },
  {
    name: "Vulcan Eleven",
    url: "https://apps.apple.com/app/vulcan-eleven/id6462420052",
    description:
      "Fantasy sports React Native app serving 50K+ daily active users. C++ native modules achieving 60fps on $150 Android hardware.",
    keywords: ["React Native", "Reanimated 3", "C++", "Mobile", "Razorpay"],
    year: "2023",
  },
  {
    name: "DeFi11",
    url: "https://apps.apple.com/app/defi11-fantasy-sports-app/id1608967244",
    description:
      "Fully on-chain fantasy sports with Solidity smart contracts, NFT marketplace, UUPS proxy, and zero centralized game logic.",
    keywords: ["Solidity", "Ethereum", "Web3", "NFT", "DeFi"],
    year: "2022",
  },
];

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: FULL_NAME,
  jobTitle: JOB_TITLE,
  url: SITE_URL,
  email: "mailto:amit@devamit.co.in",
  telephone: "+91-9874173663",
  image: IMAGE_URL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    addressCountry: "IN",
    postalCode: "700001",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.5726,
    longitude: 88.3639,
  },
  worksFor: { "@type": "Organization", name: "Independent · Remote" },
  sameAs: [
    "https://github.com/devamitch",
    "https://linkedin.com/in/devamitch",
    "https://x.com/devamitch",
    "https://devamitch.medium.com",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "mem0",
    "RAG",
    "AI Systems",
    "Solidity",
    "GraphQL",
    "PostgreSQL",
    "MediaPipe",
    "WebGPU",
    "LLM",
    "Bridgeless Architecture",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Techno Main Salt Lake",
      address: { "@type": "PostalAddress", addressLocality: "Kolkata", addressCountry: "IN" },
    },
  ],
  description: DESCRIPTION,
  hasOccupation: {
    "@type": "Occupation",
    name: "Principal Software Architect",
    occupationLocation: {
      "@type": "Country",
      name: "India",
    },
    skills: "React, TypeScript, React Native, AI/ML, mem0, Next.js, Node.js",
  },
};

const profilePageLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profilepage`,
  url: SITE_URL,
  name: `${FULL_NAME} — Portfolio`,
  description: DESCRIPTION,
  mainEntity: { "@id": `${SITE_URL}/#person` },
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#hero", "#about", "#contact"],
  },
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: `${FULL_NAME} — Principal Frontend Engineer · mem0`,
  description: DESCRIPTION,
  isPartOf: {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: `${FULL_NAME} — Portfolio`,
    url: SITE_URL,
  },
  about: { "@id": `${SITE_URL}/#person` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
    ],
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".section-label"],
  },
};

const projectsItemListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#projects`,
  name: "Amit Chakraborty's Production Projects",
  description: "6 of 18+ production systems shipped by Amit Chakraborty",
  numberOfItems: PROJECTS_LD.length,
  itemListElement: PROJECTS_LD.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: p.name,
      url: p.url,
      description: p.description,
      keywords: p.keywords.join(", "),
      dateCreated: p.year,
      author: { "@id": `${SITE_URL}/#person` },
      creator: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  })),
};

const portfolioCollectionLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/#portfolio`,
  url: SITE_URL,
  name: "Amit Chakraborty Portfolio",
  description: DESCRIPTION,
  mainEntity: { "@id": `${SITE_URL}/#projects` },
  creator: { "@id": `${SITE_URL}/#person` },
  hasPart: PROJECTS_LD.map((project) => ({
    "@type": "CreativeWork",
    name: project.name,
    url: project.url,
    description: project.description,
    creator: { "@id": `${SITE_URL}/#person` },
  })),
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Amit Chakraborty's specialization?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Amit Chakraborty is a Principal Architect specializing in React Native (Bridgeless), AI-native systems (RAG pipelines, mem0, Claude/Gemini APIs), and premium frontend engineering with Next.js and React 19. He has 8+ years of experience and has shipped 18+ production applications.",
      },
    },
    {
      "@type": "Question",
      name: "Is Amit Chakraborty available for remote work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Amit Chakraborty works exclusively remote from Kolkata, India. He is currently open to Staff Engineer, Principal Engineer, and Founding Engineer roles.",
      },
    },
    {
      "@type": "Question",
      name: "What is the mem0 portfolio project?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This portfolio itself uses the mem0 SDK as a live memory layer, demonstrating add, search, delete, and score operations in real time. It's Amit's application artifact for a Staff/Principal Frontend Engineer role at mem0.ai.",
      },
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      // ── Core
      { title: `${FULL_NAME} — Principal Frontend Engineer · mem0` },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: KEYWORDS },
      { name: "author", content: FULL_NAME },
      { name: "application-name", content: "Amit Chakraborty Portfolio" },
      {
        name: "robots",
        content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      },
      { name: "theme-color", content: "#16A07C" },
      { name: "color-scheme", content: "light" },

      // ── Open Graph
      { property: "og:type", content: "profile" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: `${FULL_NAME} — Principal Frontend · mem0` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:site_name", content: "Amit Chakraborty Portfolio" },
      { property: "og:image", content: IMAGE_URL },
      { property: "og:image:alt", content: `${FULL_NAME} — Principal Architect` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_IN" },
      { property: "profile:first_name", content: "Amit" },
      { property: "profile:last_name", content: "Chakraborty" },
      { property: "profile:username", content: "devamitch" },

      // ── Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@devamitch" },
      { name: "twitter:creator", content: "@devamitch" },
      { name: "twitter:title", content: `${FULL_NAME} — Principal Frontend · mem0` },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: IMAGE_URL },
      { name: "twitter:image:alt", content: `${FULL_NAME} — Principal Architect` },

      // ── GEO (Geographic SEO)
      { name: "geo.region", content: "IN-WB" },
      { name: "geo.placename", content: "Kolkata, West Bengal, India" },
      { name: "ICBM", content: "22.5726, 88.3639" },
      { name: "geo.position", content: "22.5726;88.3639" },

      // ── AEO — Answer Engine Optimization
      { name: "revisit-after", content: "7 days" },
      { name: "language", content: "English" },
      { name: "target", content: "all" },
      { name: "HandheldFriendly", content: "True" },
      { name: "MobileOptimized", content: "320" },

      // ── PWA
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Amit Chakraborty" },
      { name: "msapplication-TileColor", content: "#16A07C" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      // Preconnect for Google Fonts (already in CSS but helps browser hint)
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
    scripts: [
      // Person + sameAs
      {
        type: "application/ld+json",
        children: JSON.stringify(personLd),
      },
      // ProfilePage — AEO-critical
      {
        type: "application/ld+json",
        children: JSON.stringify(profilePageLd),
      },
      // WebPage with speakable
      {
        type: "application/ld+json",
        children: JSON.stringify(webPageLd),
      },
      // Projects ItemList of CreativeWork
      {
        type: "application/ld+json",
        children: JSON.stringify(projectsItemListLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(portfolioCollectionLd),
      },
      // FAQ — AEO answer cards
      {
        type: "application/ld+json",
        children: JSON.stringify(faqLd),
      },
    ],
  }),
  component: Portfolio,
});
