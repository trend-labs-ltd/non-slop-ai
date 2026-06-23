import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { Tools } from "./tools";

/**
 * Components made available to every MDX post. Authors can use `<Callout>` and
 * `<Aside>` directly in `.mdx` files; the HTML overrides below keep prose links
 * and rules on-brand.
 */
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="not-prose my-6 rounded-lg border border-border border-l-2 border-l-brand bg-surface p-4 text-sm leading-relaxed text-foreground">
      {children}
    </div>
  ),
  Tools,
  // Privacy-friendly YouTube embed: nocookie host, lazy-loaded so it doesn't
  // block first paint. Usage in MDX: <YouTube id="iQyg-KypKAA" title="..." />
  YouTube: ({ id, title }: { id: string; title?: string }) => (
    <div className="not-prose my-6 aspect-video overflow-hidden rounded-lg border border-border">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title ?? "YouTube video player"}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  ),
};

const prettyCodeOptions = {
  theme: "github-dark",
  keepBackground: true,
} as const;

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
  // Allow JSX expression attributes in MDX (e.g. arrays/objects passed to
  // <ProfileCard stats={[...]} />). next-mdx-remote defaults blockJS:true, which
  // strips every expression attribute. Our post content is first-party/trusted;
  // blockDangerousJS stays on by default as a backstop against eval/Function/etc.
  blockJS: false,
} as const;

export function Mdx({ source }: { source: string }) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <MDXRemote source={source} components={components} options={mdxOptions as any} />
  );
}
