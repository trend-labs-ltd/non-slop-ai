import type { Metadata } from "next";
import { getAllBriefings } from "@/lib/briefings";
import { BriefingCard } from "@/components/briefing-card";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "News",
  description: "Everything published on Non Slop AI, newest first.",
  alternates: { canonical: "/news" },
};

export default function NewsIndex() {
  const briefings = getAllBriefings();

  return (
    <Container size="prose" className="py-16">
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
        News
      </h1>
      {briefings.length === 0 ? (
        <p className="mt-6 text-muted">Nothing here yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-border">
          {briefings.map((briefing) => (
            <li key={briefing.slug}>
              <BriefingCard briefing={briefing} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
