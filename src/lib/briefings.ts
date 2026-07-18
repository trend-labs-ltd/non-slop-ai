import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

/** Directory holding the MDX source files, one per briefing. */
const BRIEFINGS_DIR = path.join(process.cwd(), "content", "briefings");

/**
 * Frontmatter contract every briefing must satisfy. The `/new-post` command and
 * the `/seo` command both write frontmatter that conforms to this shape, and
 * the build will fail loudly if a briefing drifts from it.
 */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  // ISO date, e.g. "2026-06-22".
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  author: z.string().default("Tom Mitchell"),
  // Optional path/URL to a custom social share image for this briefing.
  image: z.string().optional(),
});

export type BriefingFrontmatter = z.infer<typeof frontmatterSchema>;

export type Briefing = {
  slug: string;
  frontmatter: BriefingFrontmatter;
  /** Raw MDX body with frontmatter stripped, ready for MDXRemote. */
  content: string;
  readingTimeMinutes: number;
};

function readBriefingFile(slug: string): Briefing {
  const fullPath = path.join(BRIEFINGS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/briefings/${slug}.mdx:\n${parsed.error.toString()}`,
    );
  }

  return {
    slug,
    frontmatter: parsed.data,
    content,
    readingTimeMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
}

/**
 * Every briefing on disk. Drafts are included here so they can be previewed
 * locally; use {@link getAllBriefings} for the published list.
 */
function getRawBriefings(): Briefing[] {
  if (!fs.existsSync(BRIEFINGS_DIR)) return [];
  return fs
    .readdirSync(BRIEFINGS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readBriefingFile(file.replace(/\.mdx$/, "")));
}

/**
 * Published briefings, newest first. Drafts are hidden in production but
 * visible in development so you can preview work in progress.
 */
export function getAllBriefings(): Briefing[] {
  const showDrafts = process.env.NODE_ENV !== "production";
  return getRawBriefings()
    .filter((briefing) => showDrafts || !briefing.frontmatter.draft)
    .sort((a, b) =>
      a.frontmatter.date < b.frontmatter.date ? 1 : -1,
    );
}

export function getBriefingSlugs(): string[] {
  return getAllBriefings().map((briefing) => briefing.slug);
}

/** Returns the briefing for a slug, or `null` if it doesn't exist / is a hidden draft. */
export function getBriefingBySlug(slug: string): Briefing | null {
  return getAllBriefings().find((briefing) => briefing.slug === slug) ?? null;
}

/** Distinct tags across all published briefings, alphabetised. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const briefing of getAllBriefings()) {
    for (const tag of briefing.frontmatter.tags) tags.add(tag);
  }
  return [...tags].sort();
}
