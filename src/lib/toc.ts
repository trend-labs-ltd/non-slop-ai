import GithubSlugger from "github-slugger";

export type Heading = { id: string; text: string; level: number };

/**
 * Pull the section headings out of a briefing's MDX body so we can build a
 * table of contents. Ids are generated with `github-slugger` — the same slugger
 * `rehype-slug` uses when rendering — so the `#anchor` links line up exactly.
 *
 * Fenced code blocks are skipped so a `# comment` inside a snippet isn't
 * mistaken for a heading. Levels are inclusive of `minLevel`..`maxLevel`.
 */
export function extractHeadings(
  markdown: string,
  { minLevel = 2, maxLevel = 3 }: { minLevel?: number; maxLevel?: number } = {},
): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let fence: string | null = null;

  for (const line of markdown.split("\n")) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) fence = marker;
      else if (marker === fence) fence = null;
      continue;
    }
    if (fence !== null) continue;

    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;

    const level = m[1].length;
    const text = m[2]
      .replace(/`([^`]+)`/g, "$1") // inline code
      .replace(/\*\*?([^*]+)\*\*?/g, "$1") // bold / italic
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links
      .trim();

    // Slug every heading in document order so dedup counters match rehype-slug,
    // even for levels we don't surface in the TOC.
    const id = slugger.slug(text);
    if (level >= minLevel && level <= maxLevel) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}
