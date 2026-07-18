/**
 * Central registry of tools referenced across briefings.
 *
 * Briefings reference tools by slug — `<Tools names={["claude-code", ...]} />` —
 * and pick up the canonical name, URL, description, and logo from here. This is
 * the single source of truth: update a tool once and every briefing follows.
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
    url: "https://github.com/tmux/tmux/wiki",
    logo: "/logos/tmux.svg",
  },
  skills: {
    name: "npx skills CLI",
    description: "Open CLI for installing and managing agent skills, run via npx.",
    url: "https://github.com/vercel-labs/skills",
  },
  neovim: {
    name: "Neovim",
    description: "Keyboard-driven modal text editor.",
    url: "https://neovim.io",
    logo: "/logos/neovim.svg",
  },

  // Kun Chen's agent tooling (github.com/kunchenguid). GitHub repos with no
  // brand logo, so they fall back to the GitHub mark.
  "no-mistakes": {
    name: "no-mistakes",
    description: "Validation pipeline: takes first-pass agent code to a clean, tested PR.",
    url: "https://github.com/kunchenguid/no-mistakes",
  },
  lavish: {
    name: "Lavish",
    description: "Visual, clickable planning artifacts instead of walls of text.",
    url: "https://github.com/kunchenguid/lavish-axi",
  },
  treehouse: {
    name: "treehouse",
    description: "Git worktree manager so parallel agents don't collide.",
    url: "https://github.com/kunchenguid/treehouse",
  },
  "goodnight-havefun": {
    name: "goodnight-havefun",
    description: "Runs an agent in a loop for hours against a goal (overnight work).",
    url: "https://github.com/kunchenguid/gnhf",
  },
  "first-mate": {
    name: "first-mate",
    description: "Orchestrates the whole crew of agents for you.",
    url: "https://github.com/kunchenguid/firstmate",
  },
  axi: {
    name: "AXI",
    description: "Tool-design standards that optimise for agent ergonomics.",
    url: "https://axi.md/",
  },
  "open-super-whisper": {
    name: "Open Super Whisper",
    description: "Free, local speech-to-text for voice prompting.",
    url: "https://github.com/Starmel/OpenSuperWhisper",
  },
};

/** Look up a tool by slug. */
export function getTool(slug: string): Tool | undefined {
  return tools[slug];
}
