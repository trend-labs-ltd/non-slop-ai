# Non Slop AI

A blog + newsletter about building with AI without the slop.

Next.js 16 (App Router) · TypeScript · Tailwind v4 · MDX · Resend

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

## Writing posts

Posts are MDX files in `content/posts/<slug>.mdx` with YAML frontmatter:

```yaml
---
title: "A specific, claim-making title"
description: "One sentence with an actual point, for SEO + RSS."
date: "2026-06-22"        # YYYY-MM-DD (required)
tags: ["writing", "ai"]   # optional
draft: false              # optional; drafts are hidden in production
author: "Tom Mitchell"    # optional
image: "/og/custom.png"   # optional; overrides the generated OG image
---
```

Frontmatter is validated by a Zod schema in `src/lib/posts.ts` — the build fails
if a post drifts from the shape. You can use GitHub-flavored markdown, fenced
code blocks (syntax-highlighted), and the `<Callout>` component in any post.

### Authoring with Claude

This repo ships slash commands for the writing workflow:

- `/new-post <topic>` — scaffold a new post with valid frontmatter
- `/humanize <slug>` — de-slop a draft using the humanizer skill
- `/seo <slug>` — refine title, description, tags, and slug

## Features

- MDX rendering via `next-mdx-remote/rsc` (GFM, heading anchors, code highlight)
- Per-post SEO metadata, JSON-LD, and a generated Open Graph image
- `sitemap.xml`, `robots.txt`, and an RSS feed at `/feed.xml`
- Newsletter signup wired to a Resend audience (`/api/subscribe`)

## Configuration

Edit `src/lib/site.ts` for name, URL, author, and nav. Set environment
variables in `.env.local` (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (no trailing slash) |
| `RESEND_API_KEY` | Resend API key for newsletter signups |
| `RESEND_AUDIENCE_ID` | Resend audience to add subscribers to |

## Scripts

```bash
npm run dev     # local dev
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Deployment

Host-agnostic. Deploys to Vercel with zero config; works on any Node host or
Cloudflare via OpenNext. Set the environment variables above in your host.
