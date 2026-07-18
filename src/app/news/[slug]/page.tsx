import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBriefings, getBriefingBySlug } from "@/lib/briefings";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { Mdx } from "@/components/mdx";
import { NewsletterCta } from "@/components/newsletter-cta";
import { Container } from "@/components/container";
import { BriefingToc } from "@/components/briefing-toc";
import { extractHeadings } from "@/lib/toc";

export function generateStaticParams() {
  return getAllBriefings().map((briefing) => ({ slug: briefing.slug }));
}

// 404 on any slug that isn't a real briefing rather than rendering on demand.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const briefing = getBriefingBySlug(slug);
  if (!briefing) return {};

  const { title, description, date, image, tags } = briefing.frontmatter;
  const url = `${site.url}/news/${slug}`;
  const ogImage = image ?? `/news/${slug}/opengraph-image`;

  return {
    title,
    description,
    keywords: tags,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      publishedTime: date,
      authors: [briefing.frontmatter.author],
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

export default async function BriefingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const briefing = getBriefingBySlug(slug);
  if (!briefing) notFound();

  const { frontmatter, content, readingTimeMinutes } = briefing;
  const headings = extractHeadings(content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: { "@type": "Person", name: frontmatter.author },
    url: `${site.url}/news/${slug}`,
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
              <BriefingToc headings={headings} />
            </div>
          </aside>
        )}

        <article className="min-w-0">
          <Link
            href="/news"
            className="text-sm text-muted transition-colors hover:text-brand"
          >
            ← All news
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
