import { NextResponse } from "next/server";

// The opt-in email links here instead of straight to listmonk, so the
// confirmation lands on our own domain instead of listmonk's. This calls
// listmonk's public (unauthenticated) one-shot confirm endpoint server-side,
// then redirects the browser to our own confirmed page.
export async function GET(request: Request) {
  const uuid = new URL(request.url).searchParams.get("u");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const listmonkUrl = process.env.LISTMONK_URL;

  if (!uuid || !listmonkUrl) {
    return NextResponse.redirect(`${siteUrl}/newsletter/confirmed?ok=0`);
  }

  const res = await fetch(
    `${listmonkUrl}/subscription/optin/${encodeURIComponent(uuid)}?confirm=true`,
  );

  if (!res.ok) {
    console.error("listmonk optin confirm failed:", res.status, await res.text());
  }

  return NextResponse.redirect(
    `${siteUrl}/newsletter/confirmed?ok=${res.ok ? "1" : "0"}`,
  );
}
