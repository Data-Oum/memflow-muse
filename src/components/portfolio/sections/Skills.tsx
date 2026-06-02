import { Section } from '../ui/Section';
import { Label } from '../ui/Label';
import { CLUSTERS, type Cluster } from '../data/skills';
import { useInView } from '@/hooks/use-in-view';

function SkillBar({ score, color, isVisible }: { score: number; color: string; isVisible: boolean }) {
  return (
    <div className="h-[3px] w-full rounded-full bg-[var(--bg-raised)] overflow-hidden mt-1.5">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{
          width: isVisible ? `${score}%` : '0%',
          backgroundColor: color,
        }}
      />
    </div>
  );
}

function ClusterCard({ cluster }: { cluster: Cluster }) {
  const { ref, isInView } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className="pm-card p-6 flex flex-col gap-5">
      <div>
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[11px]"
          style={{
            color: cluster.color,
            backgroundColor: cluster.ghost || `${cluster.color}1A`,
          }}
        >
          {cluster.label}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {cluster.skills.map((skill, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex justify-between items-baseline mb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-sans font-medium text-[var(--ink-primary)]">
                  {skill.name}
                </span>
                {skill.note && (
                  <span className="text-[10px] font-mono text-[var(--ink-tertiary)]">
                    {skill.note}
                  </span>
                )}
              </div>
              <span
                className="text-[11px] font-mono"
                style={{ color: cluster.color }}
              >
                {skill.score}
              </span>
            </div>
            <SkillBar score={skill.score} color={cluster.color} isVisible={isInView} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <div className="flex flex-col gap-3 mb-10">
        <Label>{'[ memory.getCategories({ entity: "amit_chakraborty" }) ]'}</Label>
        <h2 className="text-3xl md:text-4xl font-serif text-[var(--ink-primary)]">
          Technical memory index.
        </h2>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
      >
        {CLUSTERS.map((cluster) => (
          <ClusterCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </Section>
  );
}
