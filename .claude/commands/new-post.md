---
description: Scaffold a new MDX blog post with valid frontmatter
argument-hint: <topic or working title>
allowed-tools: Bash(date:*), Write, Read
---

Create a new blog post for Non Slop AI about: **$ARGUMENTS**

Steps:

0. Read `STYLE.md` (repo root) first. Everything you draft — the opening, the
   outline prose, the title — must match its voice, reader, and grade-5 reading
   level.
1. Get today's date by running `date +%F` (frontmatter requires `YYYY-MM-DD`).
2. Derive a short, lowercase, hyphenated `slug` from the topic (no stop-word
   padding — keep it tight, e.g. "Why RAG is overrated" → `rag-is-overrated`).
3. Write the file to `content/posts/<slug>.mdx` with this exact frontmatter
   shape (validated by the Zod schema in `src/lib/posts.ts` — the build fails if
   it drifts):

   ```yaml
   ---
   title: "<a real, specific title — not a topic label>"
   description: "<one sentence with an actual claim, ~120-160 chars, for SEO + RSS>"
   date: "<today's date>"
   tags: ["<2-4 lowercase tags>"]
   draft: true
   ---
   ```

4. Below the frontmatter, write a short, honest outline as MDX — an opening that
   states the post's claim in the first two sentences, then `##` section headings
   for the argument. Leave `TODO:` notes where evidence/examples are needed. Do
   NOT pad it out into a finished slop draft.
5. Keep `draft: true` so it stays hidden in production until ready.

Then tell me the path and the slug, and remind me to run `/humanize <slug>`
before publishing.
