/**
 * Central site configuration. Anything that might appear in metadata, the RSS
 * feed, or the UI chrome lives here so there's a single source of truth.
 */
export const site = {
  name: "Non Slop AI",
  // Short tagline used in the header and as a metadata fallback.
  tagline: "Deep, practical interviews with builders shipping real AI work.",
  description:
    "In-depth interviews and writing about building with AI. Real workflows, agentic engineering, lessons from people that use AI to benefit daily.",
  // No trailing slash. Override per-environment with NEXT_PUBLIC_SITE_URL.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://nonslopai.com").replace(
    /\/$/,
    "",
  ),
  locale: "en_GB",
  author: {
    name: "Tom Mitchell",
    email: "tom@nonslopai.com",
  },
  nav: [
    { label: "Posts", href: "/blog" },
    { label: "About", href: "/about" },
  ],
} as const;

export type Site = typeof site;