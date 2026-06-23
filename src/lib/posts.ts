import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

/** Directory holding the MDX source files, one per post. */
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * Frontmatter contract every post must satisfy. The `/new-post` command and the
 * `/seo` command both write frontmatter that conforms to this shape, and the
 * build will fail loudly if a post drifts from it.
 */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  // ISO date, e.g. "2026-06-22".
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  author: z.string().default("Tom Mitchell"),
  // Optional path/URL to a custom social share image for this post.
  image: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  /** Raw MDX body with frontmatter stripped, ready for MDXRemote. */
  content: string;
  readingTimeMinutes: number;
};

function readPostFile(slug: string): Post {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/posts/${slug}.mdx:\n${parsed.error.toString()}`,
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
 * Every post on disk. Drafts are included here so they can be previewed
 * locally; use {@link getAllPosts} for the published list.
 */
function getRawPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readPostFile(file.replace(/\.mdx$/, "")));
}

/**
 * Published posts, newest first. Drafts are hidden in production but visible in
 * development so you can preview work in progress.
 */
export function getAllPosts(): Post[] {
  const showDrafts = process.env.NODE_ENV !== "production";
  return getRawPosts()
    .filter((post) => showDrafts || !post.frontmatter.draft)
    .sort((a, b) =>
      a.frontmatter.date < b.frontmatter.date ? 1 : -1,
    );
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/** Returns the post for a slug, or `null` if it doesn't exist / is a hidden draft. */
export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

/** Distinct tags across all published posts, alphabetised. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags) tags.add(tag);
  }
  return [...tags].sort();
}
