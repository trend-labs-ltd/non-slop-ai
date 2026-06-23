import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
});

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

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  // Don't 500 the user with a stack trace if the project isn't wired up yet.
  if (!apiKey || !audienceId) {
    console.error(
      "Newsletter not configured: set RESEND_API_KEY and RESEND_AUDIENCE_ID.",
    );
    return NextResponse.json(
      { message: "Newsletter isn't configured yet. Check back soon." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.contacts.create({
    email: parsed.data.email,
    audienceId,
    unsubscribed: false,
  });

  if (error) {
    console.error("Resend contacts.create failed:", error);
    return NextResponse.json(
      { message: "Couldn't subscribe you right now. Try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "You're subscribed. Thanks!" });
}
