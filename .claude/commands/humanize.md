---
description: De-slop a draft post using the humanizer skill
argument-hint: <post slug>
allowed-tools: Read, Edit, Skill, Bash(ls:*)
---

De-slop the post at `content/posts/$ARGUMENTS.mdx`.

1. Read `STYLE.md` (repo root) and the post body (the MDX below the frontmatter —
   leave frontmatter alone except for keeping `title`/`description` honest).
2. Invoke the **humanizer** skill on the prose and apply its guidance: strip
   inflated symbolism, promotional language, rule-of-three filler, negative
   parallelism ("not X, but Y"), vague attributions, em-dash overuse, and AI
   vocabulary tics.
3. Beyond the skill, enforce the Non Slop AI editorial bar and `STYLE.md`:
   - Every paragraph must carry a claim or a concrete example. Delete the rest.
   - Replace any sentence that could appear unchanged in an unrelated article.
   - Prefer specific numbers, names, and code over abstractions.
   - Match the STYLE.md voice and grade-5 reading level: short sentences, plain
     words, "you" not "readers," British spelling, straight quotes.
4. Edit the file in place. Preserve the author's voice and intent — tighten and
   sharpen, don't rewrite into something generic.
5. Summarise what you changed and flag anything that still needs a real example
   or citation.
