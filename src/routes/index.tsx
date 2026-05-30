import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/portfolio/portfolio";

const DESCRIPTION =
  "Amit Chakraborty — Principal Architect & AI-Native Systems Engineer. 8+ years, 18+ production apps, 21 engineers led. Built with mem0 as the context memory layer.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amit Chakraborty — Principal Frontend Engineer · mem0" },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: "Amit Chakraborty, mem0, principal frontend engineer, AI-native, React, Next.js, TypeScript, Kolkata, remote" },
      { property: "og:title", content: "Amit Chakraborty — Principal Frontend · mem0" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { property: "profile:first_name", content: "Amit" },
      { property: "profile:last_name", content: "Chakraborty" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@devamitch" },
      { name: "twitter:title", content: "Amit Chakraborty — Principal Frontend · mem0" },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "theme-color", content: "#16A07C" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Amit Chakraborty",
          jobTitle: "Principal Architect · AI-Native Systems Engineer",
          url: "https://devamit.co.in",
          email: "mailto:amit@devamit.co.in",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Kolkata",
            addressCountry: "IN",
          },
          worksFor: { "@type": "Organization", name: "Independent · Remote" },
          sameAs: [
            "https://github.com/devamitch",
            "https://linkedin.com/in/devamitch",
            "https://x.com/devamitch",
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
          ],
          description: DESCRIPTION,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Amit Chakraborty — Portfolio",
          url: "https://devamit.co.in",
        }),
      },
    ],
  }),
  component: Portfolio,
});
