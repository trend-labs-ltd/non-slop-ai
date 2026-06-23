---
description: Generate or refine SEO metadata for a post
argument-hint: <post slug>
allowed-tools: Read, Edit, Bash(git mv:*), Bash(mv:*)
---

Improve the SEO metadata for `content/posts/$ARGUMENTS.mdx`.

Read the full post first, then propose and apply improvements to the frontmatter:

1. **title** — specific and compelling, ideally under ~60 characters so it
   doesn't truncate in search results. A claim or a promise, not a topic label.
2. **description** — one sentence, ~120-160 characters, that states what the
   reader gets. This feeds `<meta description>`, Open Graph, and the RSS feed.
3. **tags** — 2-4 lowercase tags consistent with existing posts (check the other
   files in `content/posts/`).
4. **slug** — if the current filename is weak or doesn't match the title,
   suggest a better one. Only rename the file (`mv`/`git mv`) if I confirm,
   since it changes the post's URL.

Show me a before/after of the frontmatter and the reasoning for each change.
Don't touch the post body. The OG image and JSON-LD are generated automatically
from this frontmatter, so no other files need editing.
