"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  variant = "default",
}: {
  variant?: "default" | "hero";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const path = usePathname();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const params = new URLSearchParams(window.location.search);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          path,
          variant,
          utm_source: params.get("utm_source") ?? undefined,
          utm_medium: params.get("utm_medium") ?? undefined,
          utm_campaign: params.get("utm_campaign") ?? undefined,
        }),
      });
      const data = (await res.json()) as { message?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "You're in. Check your inbox.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  const isHero = variant === "hero";

  // The hero sits on the violet background, so it uses a white input + dark
  // button. The default form sits on warm white, so the button is violet.
  const inputClass = isHero
    ? "w-full flex-1 rounded-lg border border-transparent bg-background px-4 py-3 text-base text-foreground outline-none transition-shadow focus:ring-2 focus:ring-foreground/20 disabled:opacity-60"
    : "w-full flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60";

  const buttonClass = isHero
    ? "rounded-lg bg-foreground px-5 py-3 text-base font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:ring-2 focus-visible:ring-foreground/30 disabled:opacity-60"
    : "rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60";

  const errorClass = isHero
    ? "text-sm font-medium text-brand-foreground"
    : "text-sm text-danger";

  const successClass = isHero
    ? "inline-flex w-fit items-center gap-1.5 rounded-md bg-background/15 px-2.5 py-1 text-sm font-medium text-brand-foreground"
    : "inline-flex w-fit items-center gap-1.5 rounded-md bg-success/15 px-2.5 py-1 text-sm font-medium text-foreground";

  return (
    <form
      onSubmit={onSubmit}
      className={`not-prose flex flex-col gap-3 ${isHero ? "mx-auto max-w-md" : ""}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={status === "loading"}
          className={inputClass}
        />
        <button type="submit" disabled={status === "loading"} className={buttonClass}>
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {message && (
        <p role="status" className={status === "error" ? errorClass : successClass}>
          {status === "success" && (
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full bg-success"
            />
          )}
          {message}
        </p>
      )}
    </form>
  );
}
