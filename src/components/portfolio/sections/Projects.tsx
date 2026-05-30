import { ExternalLink, ArrowRight } from 'lucide-react';
import { Section } from '../ui/Section';
import { Label } from '../ui/Label';
import { PROJECTS, type Project } from '../data/projects';
import { useInView } from '@/hooks/use-in-view';

function ProjectCard({ p, onSelect }: { p: Project; onSelect: (p: Project) => void }) {
  const { ref, isInView } = useInView(0.18);

  return (
    <div
      ref={ref}
      onClick={() => onSelect(p)}
      className="group relative cursor-pointer bg-[var(--bg-surface)] border border-[var(--edge-subtle)] rounded-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[var(--edge-default)] flex flex-col h-full overflow-hidden"
    >
      {/* Top accent score bar */}
      <div
        className="absolute top-0 left-0 h-[2px] transition-all duration-1000 ease-out"
        style={{
          backgroundColor: p.signal,
          width: isInView ? `${p.score * 100}%` : '0%',
        }}
      />

      {/* Row: project id + score */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-mono text-[11px] text-[var(--ink-tertiary)]">{p.id}</span>
        <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: p.signal }}>
          <span>score:</span>
          <span>{p.score.toFixed(2)}</span>
        </div>
      </div>

      {/* Category pill */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] text-[var(--ink-secondary)] bg-[var(--bg-raised)]">
          {p.category}
        </span>
      </div>

      {/* Name + tagline */}
      <div className="mb-3">
        <h3 className="font-sans font-medium text-lg text-[var(--ink-primary)] leading-tight mb-1 group-hover:text-[var(--signal)] transition-colors flex items-center gap-2">
          {p.name}
          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="font-serif text-[var(--ink-secondary)] text-sm">
          {p.tagline}
        </p>
      </div>

      {/* Description */}
      <p className="font-sans text-[13px] text-[var(--ink-secondary)] leading-relaxed mb-6 flex-grow">
        {p.description}
      </p>

      {/* Stack tags */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {p.stack.slice(0, 3).map((tech, i) => (
          <span
            key={i}
            className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--edge-subtle)] rounded text-[var(--ink-tertiary)]"
          >
            {tech}
          </span>
        ))}
        {p.stack.length > 3 && (
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-[var(--edge-subtle)] rounded text-[var(--ink-tertiary)]">
            +{p.stack.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--edge-subtle)] mt-auto">
        <span className="font-mono text-[10px] text-[var(--ink-tertiary)]">{p.year}</span>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--ink-primary)] group-hover:text-[var(--signal)] transition-colors">
          View Details
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}

export function Projects(props: { onSelect: (p: Project) => void }) {
  return (
    <Section id="work">
      <div className="flex flex-col gap-3 mb-10">
        <Label>{'[ memory.search({ query: "shipped production systems" }) ]'}</Label>
        <h2 className="text-3xl md:text-4xl font-serif text-[var(--ink-primary)]">
          Shipped systems, not side projects.
        </h2>
      </div>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} p={p} onSelect={props.onSelect} />
        ))}
      </div>
    </Section>
  );
}
