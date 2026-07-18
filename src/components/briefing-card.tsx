import Link from "next/link";
import type { Briefing } from "@/lib/briefings";
import { formatDate } from "@/lib/format";

export function BriefingCard({ briefing }: { briefing: Briefing }) {
  const { slug, frontmatter, readingTimeMinutes } = briefing;
  return (
    <article className="group">
      <Link href={`/news/${slug}`} className="block py-6">
        <div className="flex items-center gap-3 text-xs text-muted">
          <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
          <span aria-hidden>·</span>
          <span>{readingTimeMinutes} min read</span>
          {frontmatter.draft && (
            <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-medium text-muted">
              draft
            </span>
          )}
        </div>
        <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-brand">
          {frontmatter.title}
        </h2>
        <p className="mt-1.5 text-muted">{frontmatter.description}</p>
      </Link>
    </article>
  );
}
