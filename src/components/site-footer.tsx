import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "@/components/container";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.name}
        </p>
        <nav className="flex items-center gap-5">
          <Link href="/feed.xml" className="transition-colors hover:text-foreground">
            RSS
          </Link>
          <a
            href={`mailto:${site.author.email}`}
            className="transition-colors hover:text-foreground"
          >
            Email
          </a>
        </nav>
      </Container>
    </footer>
  );
}
