import { NewsletterForm } from "@/components/newsletter-form";

export function NewsletterCta() {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
        Get new posts by email
      </h2>
      <p className="mt-1 mb-4 text-sm text-muted">
        Occasional, written by a human, easy to unsubscribe. No slop.
      </p>
      <NewsletterForm />
    </section>
  );
}
