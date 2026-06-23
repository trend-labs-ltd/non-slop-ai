"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/toc";

/**
 * Sticky "On this page" timeline shown on the left of a post. Anchor links jump
 * (smoothly, via globals.css) to each section; an IntersectionObserver lights up
 * the dot for whichever section is currently near the top of the viewport.
 */
export function PostToc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length) setActive(visible[0].target.id);
      },
      // A heading counts as "current" once it reaches the top ~35% of the screen.
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.08em] text-muted">
        On this page
      </p>
      <ul className="relative space-y-0.5 border-l border-border">
        {headings.map((h) => {
          const isActive = h.id === active;
          return (
            <li key={h.id} className={h.level >= 3 ? "ml-3" : ""}>
              <a
                href={`#${h.id}`}
                onClick={() => setActive(h.id)}
                aria-current={isActive ? "true" : undefined}
                className={`group relative block py-1 pl-4 leading-snug transition-colors ${
                  isActive
                    ? "text-brand"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute -left-[5px] top-[0.6rem] h-2 w-2 -translate-y-1/2 rounded-full border transition-colors ${
                    isActive
                      ? "border-brand bg-brand"
                      : "border-border bg-background group-hover:border-foreground"
                  }`}
                />
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
