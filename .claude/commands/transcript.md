---
description: Extract a clean plaintext transcript from a YouTube URL
argument-hint: <youtube url>
allowed-tools: Bash(uvx:*), Bash(python3:*), Bash(ls:*), Read, Write
---

Extract the transcript for the YouTube video at: **$ARGUMENTS**

Use `yt-dlp` through `uvx` so nothing is installed globally. YouTube now needs a
JS runtime to extract captions, so the `--js-runtimes node` flag is required.
Without it the caption download fails silently (you get metadata but no `.vtt`).

Steps:

1. Pick a working dir: the session scratchpad if you have one, else `./.transcripts/`.
2. Grab metadata and auto-captions in one call:

   ```bash
   uvx yt-dlp --js-runtimes node --skip-download \
     --write-auto-subs --write-subs --sub-langs "en.*" --sub-format vtt \
     --print "%(title)s :: %(uploader)s :: %(duration_string)s :: %(view_count)s views" \
     -o "<dir>/vid.%(ext)s" "$ARGUMENTS"
   ```

   `--write-subs` pulls human captions when they exist (cleaner than auto). Among
   the files written, prefer `vid.en.vtt` / `vid.en-en.vtt` over the much larger
   `vid.en-orig.vtt` — the orig track is full of rolling duplicate lines.

3. Convert the VTT to plain text with this script (strips the header, timestamps,
   and `<...>` tags, then collapses the auto-caption roll-up duplicates):

   ```python
   import re, sys
   lines = open(sys.argv[1], encoding="utf-8").read().splitlines()
   out = []
   for ln in lines:
       if not ln.strip() or ln.startswith(("WEBVTT", "Kind:", "Language:")): continue
       if "-->" in ln: continue
       ln = re.sub(r"<[^>]+>", "", ln).strip()
       if not ln or (out and out[-1] == ln): continue
       out.append(ln)
   final = []
   for ln in out:                       # collapse lines that are a prefix of the next
       if final and (ln in final[-1] or final[-1] in ln):
           if len(ln) > len(final[-1]): final[-1] = ln
           continue
       final.append(ln)
   open(sys.argv[2], "w").write(" ".join(final))
   print("words:", len(" ".join(final).split()))
   ```

4. Save to `<dir>/transcript.txt`. Report the title, uploader, duration, view
   count, word count, and the path.

Auto-captions mangle names, numbers, and product versions (you will see things
like "claw for solid model" for "Claude 4 Sonnet"). Do not quote garbled text
verbatim as fact. Flag anything uncertain so a name or figure gets verified
before it lands in a briefing.
