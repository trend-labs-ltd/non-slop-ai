/**
 * Central site configuration. Anything that might appear in metadata, the RSS
 * feed, or the UI chrome lives here so there's a single source of truth.
 */
export const site = {
  name: "Non Slop AI",
  // Short tagline used in the header and as a metadata fallback.
  tagline: "The daily AI briefing for people who have to make the call at work.",
  description:
    "A daily newsletter on what's happening in AI, written for people who make decisions at work. What changed, why it matters, no padding.",
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
    { label: "News", href: "/news" },
    { label: "About", href: "/about" },
  ],
} as const;

export type Site = typeof site;
