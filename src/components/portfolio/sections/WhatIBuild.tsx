import {
    Brain,
    Building2,
    Eye,
    Link2,
    Smartphone,
    Zap
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SpotlightCard } from '@/components/ui/spotlight';

export function WhatIBuild() {
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

  const systemTypes = [
    {
      title: 'Complete Mobile Apps',
      desc: 'React Native iOS + Android, App Store + Play Store, C++ native modules for 60fps on $150 hardware.',
      Icon: Smartphone,
    },
    {
      title: 'AI-Powered Platforms',
      desc: 'Next.js + NestJS + RAG pipelines. HIPAA-compliant, 99.9% uptime, real-time LLM integration.',
      Icon: Brain,
    },
    {
      title: 'Decentralized Systems',
      desc: 'Solidity smart contracts, Ethereum/Solana, on-chain logic, NFT marketplaces, DeFi protocols.',
      Icon: Link2,
    },
    {
      title: 'Real-Time Multiplayer',
      desc: 'WebSocket, Supabase Realtime, presence tracking, leaderboards, competitive gameplay.',
      Icon: Zap,
    },
    {
      title: 'Computer Vision',
      desc: 'MediaPipe on-device, <16ms inference, BlazePose, Face Mesh, hybrid cloud pipelines.',
      Icon: Eye,
    },
    {
      title: 'Enterprise Systems',
      desc: 'Auth, RBAC, audit trails, compliance frameworks, multi-tenant architectures.',
      Icon: Building2,
    },
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
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">SYSTEMS AT SCALE</div>
          <h2 className="portfolio-heading" style={{ marginTop: 12, marginBottom: 20 }}>
            What I build end-to-end
          </h2>
          <p className="portfolio-intro">
            Not just features. Complete systems, from architecture through production hardening,
            monitoring, and team scaling.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {systemTypes.map((system, i) => {
            const Icon = system.Icon;
            return (
              <SpotlightCard
                key={i}
                spotlightSize={220}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--edge-default)',
                  borderRadius: 'var(--r-lg)',
                  padding: 24,
                  transition: 'border-color 0.24s',
                }}
              >
                <div style={{ color: 'var(--signal)' }}>
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--ink-primary)',
                      marginBottom: 8,
                    }}
                  >
                    {system.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                    {system.desc}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 40,
            padding: 24,
            borderRadius: 'var(--r-lg)',
            background: 'var(--signal-light)',
            border: '1px solid var(--signal-border)',
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--signal)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 20,
              fontFamily: 'var(--font-mono)',
            }}
          >
            The Principles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              ['Production First', 'Architected for real load, real users, real edge cases.'],
              ['Scalability Built In', 'Designed to 10x before the problem arrives.'],
              ['Zero Surprises', 'Observability, monitoring, alerting from day 1.'],
              ['Team Ownership', 'Systems your team can maintain confidently.'],
              ['Security Native', 'Auth, encryption, audit trails, not bolted on.'],
              ['Documentation Always', 'Decisions stored. Context persistent.'],
            ].map((principle, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--signal)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 6,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {principle[0]}
                </div>
                <p style={{ fontSize: 13, color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                  {principle[1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
