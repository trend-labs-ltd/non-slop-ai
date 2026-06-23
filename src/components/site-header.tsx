"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { Container } from "@/components/container";

export function SiteHeader() {
  // On the landing page the header is merged into the violet hero: transparent,
  // overlaid, white text. Everywhere else it's a normal bordered light bar.
  const onHero = usePathname() === "/";

  return (
    <header
      className={
        onHero ? "absolute inset-x-0 top-0 z-20" : "border-b border-border"
      }
    >
      <Container className="flex items-center justify-between py-5">
        <Link
          href="/"
          className={`flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.08em] ${
            onHero ? "text-brand-foreground" : "text-foreground"
          }`}
        >
          {/* Full-colour disc logo (purple circle + white mark). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" aria-hidden className="h-6 w-6 shrink-0" />
          {site.name}
        </Link>
        <nav
          className={`flex items-center gap-6 text-sm ${
            onHero ? "text-brand-foreground/80" : "text-muted"
          }`}
        >
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                onHero ? "hover:text-brand-foreground" : "hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
