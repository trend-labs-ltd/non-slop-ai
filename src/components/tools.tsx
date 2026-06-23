import { getTool, type Tool } from "@/lib/tools";

/**
 * What a post can pass in the `names` array:
 *  - a string slug into the tool registry — `"claude-code"`
 *  - a slug with a per-post description override — `{ slug, description }`
 *  - a fully inline one-off not worth registering — `{ name, url, description }`
 */
type ToolRef =
  | string
  | { slug: string; description?: string }
  | Tool;

/** The GitHub Octocat mark, used as the default logo for repos without one. */
function GitHubMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5 text-foreground"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/** Resolve a ToolRef into a concrete Tool, pulling from the registry by slug. */
function resolveTool(ref: ToolRef): Tool {
  if (typeof ref === "string") {
    const tool = getTool(ref);
    if (!tool) {
      console.warn(`<Tools>: no registry entry for slug "${ref}"`);
      return { name: ref, description: "", url: "#" };
    }
    return tool;
  }
  if ("slug" in ref) {
    const tool = getTool(ref.slug);
    if (!tool) {
      console.warn(`<Tools>: no registry entry for slug "${ref.slug}"`);
      return { name: ref.slug, description: ref.description ?? "", url: "#" };
    }
    return { ...tool, description: ref.description ?? tool.description };
  }
  return ref;
}

/** Bare hostname (no leading www.), or null when the URL has no real host. */
function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Pick an icon: registry logo, then site favicon, then the GitHub mark. */
function iconFor(tool: Tool) {
  if (tool.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={tool.logo} alt="" className="h-5 w-5 object-contain" />;
  }
  const host = hostOf(tool.url);
  if (!host || host === "github.com") return <GitHubMark />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${host}&sz=64`}
      alt=""
      className="h-5 w-5 object-contain"
    />
  );
}

export function Tools({ names }: { names: ToolRef[] }) {
  const resolved = names.map(resolveTool);
  return (
    <ul className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      {resolved.map((tool) => (
        <li key={tool.name}>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-start gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-brand"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
              {iconFor(tool)}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">
                {tool.name}
              </span>
              <span className="block text-sm leading-snug text-muted">
                {tool.description}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
