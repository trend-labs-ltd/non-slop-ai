# How to write for Non Slop AI

This is the voice guide. The editorial bar in `CLAUDE.md` says what to *avoid*
(slop). This says what to *aim for* (voice, reader, reading level). Load it when
drafting or editing a post — `/new-post` and `/humanize` both pull it in.

## Who you're writing for

One person. A developer who builds with AI and is sick of reading mush about it.
They're smart but busy. They want a real claim and a reason to believe it, fast.

Write to that single reader. Use "you." Never "readers," "users," or "we" (when
"we" means the audience).

## Voice

- **First person, opinionated.** Say "I think," "I tried," "I was wrong." Have a
  take and back it.
- **Plain and direct.** Short words beat long ones. "Use," not "utilise." "Help,"
  not "facilitate."
- **Concrete.** Name the tool, the number, the bug. Show the code. A real example
  beats any amount of explanation.
- **Some edge.** Dry humour, a strong opinion, an aside. A real person wrote this.

## Reading level: aim for grade 5

Write so a 12-year-old could follow the sentences, even if the *topic* is
advanced. This is a readability target, not a dumbing-down. The ideas can be
hard; the words carrying them should be easy.

What that means in practice:

- **Short sentences.** Most under 15 words. One idea each. Break up anything you
  can't read aloud in one breath.
- **Common words.** If a simpler word means the same thing, use it.
- **Define jargon once, then use it.** You don't have to dodge technical terms —
  just explain each one the first time, plainly.
- **Active voice.** "The build fails," not "the build is caused to fail."

Don't game the score. Chopping every sentence to five words to hit a number is
just a new kind of slop. Read it aloud — if it sounds like a robot counting, fix
it. Rhythm still matters: mostly short sentences, with the occasional longer one
to breathe.

## Sample paragraph (this is the target)

> I gave the agent 200 lines of my own code and asked it to find the bug. It
> found three. Two were real. The third was a "fix" for a line that was already
> right — it just didn't like the style. That's the whole problem in one go. The
> tool is fast and often correct, and it will lie to you with total confidence.
> So I keep tests around. Tests don't care how sure the agent sounds.

Notice: short sentences, plain words, one real example, a clear opinion, a bit of
dry humour. No big abstract nouns. Nothing that could be pasted into an article
about something else.

## Hard rules (mechanical)

- **British English.** Spelling and vocab: optimise, behaviour, colour, whilst is
  fine, "maths." Match the site's existing posts.
- **Straight quotes** (`"` not `“`), not curly.
- **Sentence case headings** ("What this means," not "What This Means").
- **Em dashes:** use sparingly. A comma or full stop is usually better. Never more
  than one per few paragraphs. (The humanizer skill flags overuse.)
- **No emoji** in headings or bullets.

## Before you publish

Run `/humanize <slug>`. It strips the AI tics and checks against this guide.
