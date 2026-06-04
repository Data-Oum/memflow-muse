import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import { Section } from "../ui/Section";
import { Label } from "../ui/Label";

type Check = { label: string; pass: boolean; detail: string; href?: string };

const EXPECTED = [
  { label: "JSON-LD", test: () => document.querySelectorAll('script[type="application/ld+json"]').length >= 4, detail: "Person, ProfilePage, WebPage, projects, FAQ" },
  { label: "Open Graph", test: () => Boolean(document.querySelector('meta[property="og:title"]') && document.querySelector('meta[property="og:description"]') && document.querySelector('meta[property="og:url"]')), detail: "title, description, url" },
  { label: "Twitter cards", test: () => Boolean(document.querySelector('meta[name="twitter:card"]') && document.querySelector('meta[name="twitter:title"]') && document.querySelector('meta[name="twitter:description"]')), detail: "summary card metadata" },
  { label: "Canonical", test: () => Boolean(document.querySelector('link[rel="canonical"]')), detail: "single canonical URL" },
];

export function SeoValidationPanel() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const localChecks: Check[] = EXPECTED.map((c) => ({ label: c.label, pass: c.test(), detail: c.detail }));
    const [robots, sitemap] = await Promise.all([
      fetch("/robots.txt", { cache: "no-store" }).then((r) => ({ ok: r.ok, text: r.text() })).catch(() => ({ ok: false, text: Promise.resolve("") })),
      fetch("/sitemap.xml", { cache: "no-store" }).then((r) => ({ ok: r.ok, text: r.text() })).catch(() => ({ ok: false, text: Promise.resolve("") })),
    ]);
    const robotsText = await robots.text;
    const sitemapText = await sitemap.text;
    localChecks.push({ label: "robots.txt", pass: robots.ok && robotsText.includes("Allow: /") && robotsText.includes("Sitemap:"), detail: "/robots.txt allows crawling and references sitemap", href: "/robots.txt" });
    localChecks.push({ label: "sitemap.xml", pass: sitemap.ok && sitemapText.includes("<urlset") && sitemapText.includes("https://memflow-muse.lovable.app/"), detail: "/sitemap.xml advertises canonical public URL", href: "/sitemap.xml" });
    setChecks(localChecks);
    setRunning(false);
  };

  useEffect(() => {
    void run();
  }, []);

  const passed = checks.filter((c) => c.pass).length;

  return (
    <Section id="validate">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "end", flexWrap: "wrap", marginBottom: 24 }}>
        <div>
          <Label>// seo-aeo-geo-validation</Label>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 44px)", fontStyle: "italic", fontWeight: 400, margin: "8px 0 0", color: "var(--ink-primary)" }}>
            Search readiness, verified in-app.
          </h2>
        </div>
        <button type="button" onClick={run} disabled={running} style={{ border: "none", background: "var(--bg-raised)", color: "var(--ink-primary)", borderRadius: "var(--r-full)", minHeight: 38, padding: "0 14px", fontFamily: "var(--font-mono)", fontSize: 12, cursor: running ? "wait" : "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <RefreshCw size={14} className={running ? "spin" : undefined} />
          {running ? "Checking" : "Re-check"}
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
        {checks.map((check) => (
          <article key={check.label} style={{ background: "var(--bg-surface)", borderRadius: "var(--r-md)", padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
              <strong style={{ fontSize: 14 }}>{check.label}</strong>
              {check.pass ? <CheckCircle2 size={16} color="var(--signal)" /> : <XCircle size={16} color="var(--ink-tertiary)" />}
            </div>
            <p style={{ margin: 0, color: "var(--ink-secondary)", fontSize: 12, lineHeight: 1.55 }}>{check.detail}</p>
            {check.href && (
              <a href={check.href} target="_blank" rel="noreferrer" style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 5, color: "var(--signal)", fontFamily: "var(--font-mono)", fontSize: 11, textDecoration: "none" }}>
                open <ExternalLink size={11} />
              </a>
            )}
          </article>
        ))}
      </div>
      {checks.length > 0 && <p style={{ margin: "14px 0 0", color: "var(--ink-tertiary)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{passed}/{checks.length} checks passing</p>}
    </Section>
  );
}