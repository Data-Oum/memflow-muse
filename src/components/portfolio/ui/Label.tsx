import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return <span className="section-label">{children}</span>;
}
