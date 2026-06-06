import { useEffect, useRef } from 'react';
import { SpotlightCard } from '@/components/ui/spotlight';

export function ImpactMetrics() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.2,
    });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const metrics = [
    { label: 'Production Apps', value: '18+', context: 'shipped at scale' },
    { label: 'Peak Daily Users', value: '50K+', context: 'concurrent' },
    { label: 'Engineers Led', value: '21', context: '0→21 at Synapsis' },
    { label: 'Years Shipping', value: '8+', context: 'production systems' },
    { label: 'Team Promotions', value: '3', context: 'to senior level' },
    { label: 'CI/CD Improvement', value: '~5x', context: '2 days → 4 hours' },
    { label: 'Code Quality', value: '99.9%', context: 'uptime' },
    { label: 'Security Incidents', value: '0', context: 'post-deployment' },
  ];

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
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>
            PRODUCTION IMPACT
          </div>
          <h2 className="portfolio-heading" style={{ marginTop: 12 }}>
            The numbers tell the story
          </h2>
          <p className="portfolio-intro" style={{ margin: '20px auto 0' }}>
            Not just features shipped. Systems built. Teams scaled. Infrastructure hardened.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {metrics.map((metric, i) => (
            <SpotlightCard
              key={i}
              spotlightSize={200}
              style={{
                padding: 24,
                borderRadius: 'var(--r-lg)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--edge-default)',
                textAlign: 'center',
                transition: 'transform 0.3s var(--ease), border-color 0.3s var(--ease)',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: 'var(--signal)',
                  lineHeight: 1,
                  marginBottom: 8,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {metric.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--ink-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 6,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {metric.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-tertiary)' }}>{metric.context}</div>
            </SpotlightCard>
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            padding: 28,
            borderRadius: 'var(--r-lg)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--signal-border)',
            borderLeft: '4px solid var(--signal)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--signal)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 16,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                What I Do
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {[
                  'Design systems from scratch to 50K+ DAU',
                  'Build AI/RAG pipelines (HIPAA-compliant)',
                  'Mobile at scale (React Native, C++, 60fps)',
                  'Architect distributed, event-driven systems',
                  'Lead teams and build engineering culture',
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.6,
                      fontSize: 14,
                      display: 'flex',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: 'var(--signal)', flex: '0 0 20px' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--signal)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 16,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                How I Work
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {[
                  'Production-first mindset (ship > perfect)',
                  'Architect for 10x scale before needed',
                  'Zero-tolerance for production surprises',
                  'Mentor and elevate engineers daily',
                  'Document decisions, build tribal knowledge',
                ].map((item, i) => (
                  <li
                    key={i}
                    style={{
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.6,
                      fontSize: 14,
                      display: 'flex',
                      gap: 10,
                    }}
                  >
                    <span style={{ color: 'var(--signal)', flex: '0 0 20px' }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
