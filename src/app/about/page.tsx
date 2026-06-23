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
          {site.name} is written by {site.author.name}. It&apos;s about building
          with AI without producing the kind of writing that AI is famous for —
          padded, hedged, and saying nothing.
        </p>
        <p>
          Expect practical write-ups, opinions worth disagreeing with, and code
          you can actually run. New posts go out by email; sign up below.
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
