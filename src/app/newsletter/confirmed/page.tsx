import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Subscribed",
  description: `You're subscribed to ${site.name}.`,
  robots: { index: false },
};

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const failed = ok === "0";

  return (
    <Container size="prose" className="py-16">
      <div className="prose max-w-none">
        {failed ? (
          <>
            <h1>Something went wrong</h1>
            <p>
              That confirmation link didn&apos;t work — it may have expired.
              Try subscribing again from the homepage, or email{" "}
              <a href={`mailto:${site.author.email}`}>{site.author.email}</a>{" "}
              and I&apos;ll sort it out.
            </p>
          </>
        ) : (
          <>
            <h1>You&apos;re in</h1>
            <p>
              Confirmed. The next briefing lands in your inbox on the next
              publishing day — no fluff, just what changed and why it
              matters.
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
