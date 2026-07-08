"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/use-in-view";

function RevealItem({ children, delayMs }: { children: ReactNode; delayMs: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function ProductGrid({ children }: { children: ReactNode[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {children.map((child, i) => (
        <RevealItem key={i} delayMs={Math.min(i * 50, 300)}>
          {child}
        </RevealItem>
      ))}
    </div>
  );
}
