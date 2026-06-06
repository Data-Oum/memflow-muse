"use client";
import { cn } from "@/lib/utils";

interface DisplayCard {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName,
  titleClassName,
}: DisplayCard) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[26rem] select-none flex-col justify-between rounded-xl border p-4",
        "after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem]",
        "after:[background:linear-gradient(to_left,_#ffffff_60%,_transparent)] dark:after:[background:linear-gradient(to_left,_#0f0f0f_60%,_transparent)]",
        className,
      )}
      style={{
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-2xl",
            iconClassName,
          )}
          style={{
            background: "rgba(124,58,237,0.12)",
            borderColor: "rgba(124,58,237,0.25)",
          }}
        >
          {icon}
        </span>
        <p
          className={cn("text-lg font-semibold", titleClassName)}
          style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600 }}
        >
          {title}
        </p>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
        {description}
      </p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontVariantNumeric: "tabular-nums" }}>
        {date}
      </p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCard[];
}

export function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCard[] = [
    {
      icon: "🧠",
      title: "Memory Recall",
      description: "Retrieved 0.98 relevance match for react_native expertise",
      date: "2ms ago",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:grayscale-0 before:z-[-1] hover:before:opacity-0 before:opacity-100 transition-all duration-700 before:transition-all before:duration-700",
      iconClassName: "border-purple-300/20",
      titleClassName: "text-purple-200",
    },
    {
      icon: "⚡",
      title: "AI Pipelines",
      description: "HIPAA-compliant RAG pipeline · 99.9% uptime at Synapsis",
      date: "0.95 score",
      className: "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:grayscale-0 before:z-[-1] hover:before:opacity-0 before:opacity-100 transition-all duration-700 before:transition-all before:duration-700",
      iconClassName: "border-violet-300/20",
      titleClassName: "text-violet-200",
    },
    {
      icon: "📱",
      title: "React Native",
      description: "18+ production apps · 50K+ DAU · C++ native modules at 60fps",
      date: "0.98 score",
      className: "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
      iconClassName: "border-fuchsia-300/20",
      titleClassName: "text-fuchsia-200",
    },
  ];

  const displayCards = cards ?? defaultCards;

  return (
    <div
      className="grid"
      style={{
        gridTemplateAreas: "'stack'",
        gridTemplateColumns: "1fr",
        width: "fit-content",
      }}
    >
      {displayCards.map((card, i) => (
        <DisplayCard key={i} {...card} />
      ))}
    </div>
  );
}
