import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  path: z.string().optional(),
  variant: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

// Coarse, dependency-free device/browser/OS buckets from the User-Agent
// string — not meant to be exhaustive, just enough to segment campaigns by.
function parseUserAgent(ua: string | null) {
  if (!ua) return {};

  const deviceType = /ipad|tablet/i.test(ua)
    ? "tablet"
    : /mobile|iphone|android/i.test(ua)
      ? "mobile"
      : "desktop";

  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /chrome|crios/i.test(ua)
      ? "Chrome"
      : /firefox|fxios/i.test(ua)
        ? "Firefox"
        : /safari/i.test(ua)
          ? "Safari"
          : undefined;

  const os = /iphone|ipad/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
      ? "Android"
      : /windows/i.test(ua)
        ? "Windows"
        : /mac os x|macintosh/i.test(ua)
          ? "macOS"
          : /linux/i.test(ua)
            ? "Linux"
            : undefined;

  return { device_type: deviceType, browser, os };
}

function buildAttribs(request: Request, data: z.infer<typeof bodySchema>) {
  const attribs: Record<string, string> = {};

  const { device_type, browser, os } = parseUserAgent(
    request.headers.get("user-agent"),
  );
  if (device_type) attribs.device_type = device_type;
  if (browser) attribs.browser = browser;
  if (os) attribs.os = os;

  const referrer = request.headers.get("referer");
  if (referrer) attribs.referrer = referrer;

  const locale = request.headers.get("accept-language")?.split(",")[0]?.trim();
  if (locale) attribs.locale = locale;

  // Only present when the request is proxied through Cloudflare.
  const country = request.headers.get("cf-ipcountry");
  if (country) attribs.country = country;

  if (data.path) attribs.landing_path = data.path;
  if (data.variant) attribs.form_variant = data.variant;
  if (data.utm_source) attribs.utm_source = data.utm_source;
  if (data.utm_medium) attribs.utm_medium = data.utm_medium;
  if (data.utm_campaign) attribs.utm_campaign = data.utm_campaign;

  return attribs;
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const listmonkUrl = process.env.LISTMONK_URL;
  const listId = process.env.LISTMONK_LIST_ID;
  const apiUser = process.env.LISTMONK_API_USER;
  const apiKey = process.env.LISTMONK_API_KEY;

  // Don't 500 the user with a stack trace if the project isn't wired up yet.
  if (!listmonkUrl || !listId || !apiUser || !apiKey) {
    console.error(
      "Newsletter not configured: set LISTMONK_URL, LISTMONK_LIST_ID, LISTMONK_API_USER, LISTMONK_API_KEY.",
    );
    return NextResponse.json(
      { message: "Newsletter isn't configured yet. Check back soon." },
      { status: 503 },
    );
  }

  const auth = "Basic " + Buffer.from(`${apiUser}:${apiKey}`).toString("base64");
  const attribs = buildAttribs(request, parsed.data);

  let create: Response;
  try {
    create = await fetch(`${listmonkUrl}/api/subscribers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        email: parsed.data.email,
        status: "enabled",
        attribs,
        // The admin create-subscriber endpoint only reads numeric "lists" IDs
        // — unlike the public subscription endpoint, it silently ignores
        // "list_uuids" entirely (confirmed against listmonk v6.2.0 source).
        lists: [Number(listId)],
        preconfirm_subscriptions: false,
      }),
    });
  } catch (error) {
    // listmonk unreachable (DNS/connection failure) — same graceful shape as
    // a non-ok response below, not an unhandled 500.
    console.error("listmonk create subscriber unreachable:", error);
    return NextResponse.json(
      { message: "Couldn't subscribe you right now. Try again later." },
      { status: 502 },
    );
  }

  // 409 means they're already subscribed — that's success from the user's
  // point of view, just without a fresh attribs snapshot for this visit
  // (looking them up to patch it would need broader list-read permissions
  // than this service account should hold for what's a minor nicety).
  if (create.ok || create.status === 409) {
    return NextResponse.json({
      message: "Almost there — check your inbox to confirm.",
    });
  }

  console.error(
    "listmonk create subscriber failed:",
    create.status,
    await create.text(),
  );
  return NextResponse.json(
    { message: "Couldn't subscribe you right now. Try again later." },
    { status: 502 },
  );
}
