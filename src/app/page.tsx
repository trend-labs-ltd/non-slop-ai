import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { Container } from "@/components/container";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);
  const latest = posts[0];

  return (
    <>
      {/* Hero — full-bleed Workflow Violet. The site header overlays this. */}
      <section className="bg-brand text-brand-foreground">
        <Container className="flex flex-col items-center pt-32 pb-24 text-center sm:pt-40 sm:pb-32">
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Find the AI workflows that actually earn their hype.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-brand-foreground/80 sm:text-xl">
            Every week, one workflow from the people getting the most out of
            AI. Broken down so you can run it yourself.
          </p>

          <div className="mt-9 w-full">
            <NewsletterForm variant="hero" />
            <p className="mt-3 text-sm text-brand-foreground/70">
              Unsubscribe anytime.
            </p>
          </div>

          {latest && (
            <Link
              href={`/blog/${latest.slug}`}
              className="group mt-8 inline-flex max-w-full items-center gap-3 rounded-full border border-brand-foreground/20 bg-brand-foreground/10 py-1.5 pl-1.5 pr-4 text-sm transition-colors hover:bg-brand-foreground/15"
            >
              <span className="shrink-0 rounded-full bg-brand-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand">
                This week
              </span>
              <span className="min-w-0 truncate text-brand-foreground/90">
                {latest.frontmatter.title}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-brand-foreground transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </Link>
          )}
        </Container>
      </section>

      {/* Latest writing — back to the comfortable reading column. */}
      <Container size="prose" className="py-20">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Latest writing
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-brand transition-opacity hover:opacity-80"
          >
            All posts →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 text-muted">
            No posts yet. Run <code>/new-post</code> to write the first one.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {posts.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
