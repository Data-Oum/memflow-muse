import { useEffect, useRef } from 'react';
import { SpotlightCard } from '@/components/ui/spotlight';

const PROBLEMS = [
  { title: 'Context Loss', desc: 'Teams repeat decisions. Architecture intent fades into code with no explanation.' },
  { title: 'Slow Onboarding', desc: 'New engineers spend weeks rebuilding mental models that should take hours.' },
  { title: 'Fragile Scaling', desc: 'Systems that work at 1M users silently fail at 10M. No one predicted it.' },
  { title: 'Decision Paralysis', desc: 'Too many options, too little memory of what worked before and why.' },
];

const SOLUTIONS = [
  { title: 'Context Persistence', desc: 'Every decision stored and retrievable. The system remembers what engineers forget.' },
  { title: 'Architectural Memory', desc: 'Full context of past trade-offs, not just current state. History is searchable.' },
  { title: 'Production Confidence', desc: 'Scaling paths known before the problem arrives. Observability from day one.' },
  { title: 'Team Velocity', desc: 'New engineers ship confidently in days. Context is never lost at handoff.' },
];

export function ProblemSolution() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in-view')),
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '48px 24px 56px',
        background: 'var(--bg-page)',
        borderTop: '1px solid var(--edge-subtle)',
      }}
    >
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Problem block */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-label">THE PROBLEM</div>
          <h2 className="portfolio-heading" style={{ marginTop: 10, marginBottom: 16 }}>
            Engineering at scale breaks
          </h2>
          <p className="portfolio-intro">
            Most teams build features. Few build systems. As complexity grows—context gets lost,
            decisions repeat, onboarding takes months.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14,
              marginTop: 28,
            }}
          >
            {PROBLEMS.map((item, i) => (
              <SpotlightCard
                key={i}
                spotlightSize={200}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--edge-default)',
                  borderRadius: 'var(--r-lg)',
                  padding: '20px 22px',
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--ink-primary)',
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Solution block */}
        <div
          style={{
            borderTop: '2px solid var(--signal)',
            paddingTop: 40,
          }}
        >
          <div className="section-label">THE SOLUTION</div>
          <h2 className="portfolio-heading" style={{ marginTop: 10, marginBottom: 16 }}>
            Architect systems that remember
          </h2>
          <p className="portfolio-intro">
            Persistent context. Decisions become knowledge. Onboarding becomes days. Scaling becomes
            predictable.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 14,
              marginTop: 28,
            }}
          >
            {SOLUTIONS.map((item, i) => (
              <SpotlightCard
                key={i}
                spotlightSize={200}
                style={{
                  background: 'var(--signal-light)',
                  border: '1px solid var(--signal-border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '20px 22px',
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--signal)',
                    marginBottom: 8,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
