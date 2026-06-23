import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { Mdx } from "@/components/mdx";
import { NewsletterCta } from "@/components/newsletter-cta";
import { Container } from "@/components/container";
import { PostToc } from "@/components/post-toc";
import { extractHeadings } from "@/lib/toc";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// 404 on any slug that isn't a real post rather than rendering on demand.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { title, description, date, image, tags } = post.frontmatter;
  const url = `${site.url}/blog/${slug}`;
  const ogImage = image ?? `/blog/${slug}/opengraph-image`;

  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: date,
      authors: [post.frontmatter.author],
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, content, readingTimeMinutes } = post;
  const headings = extractHeadings(content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: { "@type": "Person", name: frontmatter.author },
    url: `${site.url}/blog/${slug}`,
  };

  return (
    <Container size="wide" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <PostToc headings={headings} />
            </div>
          </aside>
        )}

        <article className="min-w-0">
          <Link
            href="/blog"
            className="text-sm text-muted transition-colors hover:text-brand"
          >
            ← All posts
          </Link>

          <header className="mt-6 mb-10 rounded-2xl bg-brand p-6 text-brand-foreground sm:p-8">
            <div className="flex items-center gap-3 text-sm text-brand-foreground/70">
              <time dateTime={frontmatter.date}>
                {formatDate(frontmatter.date)}
              </time>
              <span aria-hidden>·</span>
              <span>{readingTimeMinutes} min read</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {frontmatter.title}
            </h1>
            <p className="mt-3 text-lg text-brand-foreground/80">
              {frontmatter.description}
            </p>
          </header>

          <div className="prose max-w-none prose-a:font-medium">
            <Mdx source={content} />
          </div>

          <div className="mt-16">
            <NewsletterCta />
          </div>
        </article>
      </div>
    </Container>
  );
}
