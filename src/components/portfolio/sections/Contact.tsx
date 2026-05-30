import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { Section } from "../ui/Section";
import { Label } from "../ui/Label";
import { Terminal } from "../ui/Terminal";
import { ResumeButton } from "../ui/ResumeButton";

const SOCIAL_LINKS = [
  { icon: Mail, label: "amit@devamit.co.in", action: "copy" as const },
  {
    icon: Github,
    label: "github.com/devamitch",
    href: "https://github.com/devamitch",
  },
  {
    icon: Linkedin,
    label: "linkedin.com/in/devamitch",
    href: "https://linkedin.com/in/devamitch",
  },
  {
    icon: Twitter,
    label: "x.com/devamitch",
    href: "https://x.com/devamitch",
  },
];

const linkStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  padding: 0,
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  color: "var(--ink-secondary)",
  textDecoration: "none",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  transition: "color 0.2s",
};

export function Contact({ showToast }: { showToast: (m: string) => void }) {
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("amit@devamit.co.in");
      showToast("Copied!");
    } catch {
      showToast("Press Cmd/Ctrl+C");
    }
  };

  const finalCode = `// What Amit ships from day one
await mem0.add([
  { role: "engineer", content: "Polished production UIs, end-to-end" },
  { role: "engineer", content: "AI-native workflow — Claude Code, Cursor, Windsurf" },
  { role: "engineer", content: "mem0 SDK integrated before the first interview" },
  { role: "engineer", content: "8 years of shipped systems. No unfinished work." }
], { user_id: "mem0_team", metadata: { status: "open_to_hire" } });

// { id: "mem_amit_001", score: 0.99, category: "hire_now" }`;

  return (
    <div
      id="contact"
      style={{
        background: "var(--bg-raised)",
        borderTop: "1px solid var(--edge-default)",
      }}
    >
      <Section id="contact-inner">
        <Label>{"[ mem0.add({ user_id: 'mem0_team', content: 'Amit is available' }) ]"}</Label>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            margin: "8px 0 16px",
            fontWeight: 400,
          }}
        >
          <span style={{ fontStyle: "italic" }}>Let&apos;s build memory</span> together.
        </h2>
        <p
          style={{
            color: "var(--ink-secondary)",
            fontSize: 16,
            marginBottom: 32,
            maxWidth: 640,
          }}
        >
          I&apos;ve studied the SDK. I&apos;ve built the demo. I&apos;ve shipped the logs.
          Here&apos;s how to reach me.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            marginBottom: 28,
          }}
        >
          {SOCIAL_LINKS.map((link) => {
            const Icon = link.icon;
            if (link.action === "copy") {
              return (
                <button
                  key={link.label}
                  type="button"
                  onClick={copyEmail}
                  style={linkStyle}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-secondary)")}
                >
                  <Icon size={14} />
                  {link.label}
                </button>
              );
            }
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--signal)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-secondary)")}
              >
                <Icon size={14} />
                {link.label}
              </a>
            );
          })}
        </div>

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <ResumeButton />
        </div>

        <Terminal
          log={{
            tool: "amit.contribution",
            date: "ready",
            filename: "amit.contribution.js",
            prompt: finalCode,
            output: "",
          }}
        />
      </Section>
    </div>
  );
}
