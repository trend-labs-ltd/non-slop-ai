import type { Metadata } from "next";
import { site } from "@/lib/site";
import { NewsletterCta } from "@/components/newsletter-cta";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.name} and ${site.author.name}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container size="prose" className="py-16">
      <div className="prose max-w-none prose-a:font-medium">
        <h1>About</h1>
        <p>
          {site.name} is a daily AI briefing written by {site.author.name} for
          people who have to make the call at work — what to adopt, what to
          ignore, what to tell the board. It skips the padded, hedged writing
          that AI coverage is famous for.
        </p>
        <p>
          Expect a short read, a real claim, and a reason to believe it. New
          briefings go out by email, most weekdays; sign up below.
        </p>
        <p>
          Questions or corrections?{" "}
          <a href={`mailto:${site.author.email}`}>Email me</a>.
        </p>
      </div>
      <div className="mt-12">
        <NewsletterCta />
      </div>
    </Container>
  );
}
