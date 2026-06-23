/**
 * Central registry of tools referenced across posts.
 *
 * Posts reference tools by slug — `<Tools names={["claude-code", ...]} />` —
 * and pick up the canonical name, URL, description, and logo from here. This is
 * the single source of truth: update a tool once and every post follows.
 *
 * Logos live in `public/logos/`. When a tool has no `logo`, the <Tools>
 * component falls back to the site's favicon (or the GitHub mark for repos).
 * To add a tool: drop a square SVG/PNG in `public/logos/` and add an entry.
 */
export type Tool = {
  /** Display name. */
  name: string;
  /** One-line description of what it does. */
  description: string;
  /** Canonical link to the repo or site. */
  url: string;
  /** Logo path under `/logos/`. Omit to fall back to favicon / GitHub mark. */
  logo?: string;
};

export const tools: Record<string, Tool> = {
  "claude-code": {
    name: "Claude Code",
    description: "Anthropic's terminal coding agent.",
    url: "https://github.com/anthropics/claude-code",
    logo: "/logos/claude.svg",
  },
  "codex-cli": {
    name: "Codex CLI",
    description: "OpenAI's open-source coding agent, written in Rust.",
    url: "https://github.com/openai/codex",
    logo: "/logos/openai.svg",
  },
  opencode: {
    name: "opencode",
    description: "Model-agnostic terminal coding agent with a polished TUI.",
    url: "https://opencode.ai",
    logo: "/logos/opencode.svg",
  },
  wezterm: {
    name: "WezTerm",
    description: "Cross-platform terminal emulator, configured in Lua.",
    url: "https://wezterm.org",
    logo: "/logos/wezterm.svg",
  },
  ghostty: {
    name: "Ghostty",
    description: "GPU-accelerated terminal emulator with native UIs.",
    url: "https://ghostty.org",
    logo: "/logos/ghostty.svg",
  },
  tmux: {
    name: "tmux",
    description: "Terminal multiplexer for panes, tabs, and persistent sessions.",
    url: "https://github.com/tmux/tmux",
    logo: "/logos/tmux.svg",
  },
  neovim: {
    name: "Neovim",
    description: "Keyboard-driven modal text editor.",
    url: "https://neovim.io",
    logo: "/logos/neovim.svg",
  },
};

/** Look up a tool by slug. */
export function getTool(slug: string): Tool | undefined {
  return tools[slug];
}
