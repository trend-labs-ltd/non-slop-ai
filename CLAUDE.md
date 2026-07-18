@AGENTS.md

# Non Slop AI

A daily AI newsletter. Think MorningBrew / The Hustle for AI, not a hobbyist blog. Next.js 16 (App Router) +
TypeScript + Tailwind v4. Briefings are MDX files in `content/briefings/`.

## Editorial bar (this is the whole point)

The site is named for what it refuses to be. Every briefing must clear this bar:

- Make claims a machine wouldn't make without evidence; then back them up with urls.
- Write like you would talk as a 30-40's male talking to one person. Think Shaan Puri/Sam Parr.
- Cut any sentence that could appear unchanged in an article on another topic.
- STRICTLY no fluff. Remember, we need to maximise knowledge transfer is 3 minutes or less.
- No rule-of-three filler, no "it's not X, it's Y" tics, no vague attribution
  ("experts say"), no symbolic inflation, no hedged non-claims.
- Run drafts through the `humanizer` skill before publishing (`/humanize`).

## Architecture

- **Content**: `content/briefings/<slug>.mdx`, YAML frontmatter validated by a
  Zod schema in `src/lib/briefings.ts`. The build FAILS on invalid frontmatter —
  keep it conformant. Drafts (`draft: true`) show in dev, are hidden in
  production.
- **Rendering**: `src/components/mdx.tsx` compiles MDX at build time with
  `next-mdx-remote/rsc` (remark-gfm, rehype-slug, autolink headings,
  rehype-pretty-code). Plugins run here, NOT in `next.config.ts`.
- **Config**: `src/lib/site.ts` is the single source of truth for name, URL,
  author, nav. Read from it; don't hardcode.
- **SEO**: per-briefing `generateMetadata` + dynamic OG image in
  `src/app/news/[slug]/`. Sitemap/robots/RSS are `sitemap.ts`, `robots.ts`,
  `feed.xml/route.ts`.
- **Newsletter**: `src/app/api/subscribe/route.ts` adds a Resend contact. Needs
  `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` (see `.env.example`).

## Conventions

- `params` is a `Promise` in Next 16 — always `await` it.
- Server Components by default; only the newsletter form is `"use client"`.
- Frontmatter required fields: `title`, `description`, `date` (YYYY-MM-DD).
  Optional: `tags`, `draft`, `author`, `image`.

## Commands

- `/new-post <topic or title>` — scaffold a new MDX briefing with valid frontmatter.
- `/humanize <slug>` — de-slop a draft using the humanizer skill.
- `/seo <slug>` — generate/refine title, description, tags, and slug.