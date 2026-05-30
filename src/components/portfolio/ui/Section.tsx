import { type ReactNode } from "react";
import { useGsapReveal } from "@/hooks/use-gsap-reveal";

/** Section wrapper: GSAP scroll-reveal, consistent padding, centred max-width. */
export function Section({
  id,
  children,
  full,
}: {
  id: string;
  children: ReactNode;
  full?: boolean;
}) {
  const ref = useGsapReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className="reveal-section section-mobile-pad"
      style={{
        padding: "96px 24px",
        maxWidth: full ? "100%" : 1080,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

/** Mono-spaced section label — e.g. [ memory.search({ category: 'work' }) ] */
export function SectionLabel({ children }: { children: string }) {
  return <span className="section-label">{children}</span>;
}
