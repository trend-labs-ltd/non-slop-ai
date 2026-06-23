import type { ReactNode } from "react";

/**
 * Opt-in width constraint. Pages are full-bleed by default; wrap content in a
 * Container to constrain it.
 * - `prose`: ~768px, the comfortable reading column (blog, docs).
 * - `wide`:  ~1152px, for marketing/landing layouts and site chrome.
 * - `full`:  no max width (use when you only want the horizontal padding).
 */
const sizes = {
  prose: "max-w-3xl",
  wide: "max-w-6xl",
  full: "max-w-none",
} as const;

export function Container({
  size = "wide",
  as: Tag = "div",
  className = "",
  children,
}: {
  size?: keyof typeof sizes;
  as?: "div" | "article" | "section" | "main";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`mx-auto w-full px-6 ${sizes[size]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
