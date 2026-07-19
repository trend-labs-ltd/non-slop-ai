import { NextResponse } from "next/server";

// The opt-in email links here instead of straight to listmonk, so the
// confirmation lands on our own domain instead of listmonk's. This calls
// listmonk's public (unauthenticated) one-shot confirm endpoint server-side,
// then redirects the browser to our own confirmed page.
async function sendWelcomeEmail(email: string) {
  const listmonkUrl = process.env.LISTMONK_URL;
  const apiUser = process.env.LISTMONK_API_USER;
  const apiKey = process.env.LISTMONK_API_KEY;
  const templateId = process.env.LISTMONK_WELCOME_TEMPLATE_ID;

  if (!listmonkUrl || !apiUser || !apiKey || !templateId) {
    console.error(
      "Welcome email not configured: set LISTMONK_WELCOME_TEMPLATE_ID.",
    );
    return;
  }

  const auth = "Basic " + Buffer.from(`${apiUser}:${apiKey}`).toString("base64");

  // Best-effort — a welcome email failing (whether listmonk is unreachable
  // or just returns an error) shouldn't block the confirm flow the
  // subscriber is actively waiting on.
  try {
    const res = await fetch(`${listmonkUrl}/api/tx`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        subscriber_emails: [email],
        template_id: Number(templateId),
      }),
    });
    if (!res.ok) {
      console.error("listmonk welcome tx send failed:", res.status, await res.text());
    }
  } catch (error) {
    console.error("listmonk welcome tx send unreachable:", error);
  }
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const uuid = params.get("u");
  const email = params.get("e");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const listmonkUrl = process.env.LISTMONK_URL;

  if (!uuid || !listmonkUrl) {
    return NextResponse.redirect(`${siteUrl}/newsletter/confirmed?ok=0`);
  }

  let ok = false;
  try {
    const res = await fetch(
      `${listmonkUrl}/subscription/optin/${encodeURIComponent(uuid)}?confirm=true`,
    );
    ok = res.ok;
    if (!res.ok) {
      console.error("listmonk optin confirm failed:", res.status, await res.text());
    } else if (email) {
      await sendWelcomeEmail(email);
    }
  } catch (error) {
    // listmonk unreachable — same "failed" redirect shape as a non-ok response.
    console.error("listmonk optin confirm unreachable:", error);
  }

  return NextResponse.redirect(`${siteUrl}/newsletter/confirmed?ok=${ok ? "1" : "0"}`);
}
