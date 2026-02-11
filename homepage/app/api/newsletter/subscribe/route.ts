import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_SEGMENT_ID;

  if (!apiKey || !segmentId) {
    console.error("Newsletter env vars missing: RESEND_API_KEY or RESEND_SEGMENT_ID");
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 503 }
    );
  }

  try {
    // Step 1: Create contact in Resend
    const createResponse = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        unsubscribed: false,
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      // Resend returns 409 if contact already exists
      if (createResponse.status === 409) {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }
      throw new Error(`Resend create contact: ${errorText}`);
    }

    const { id: contactId } = await createResponse.json();

    // Step 2: Add contact to newsletter segment
    const segmentResponse = await fetch(
      `https://api.resend.com/contacts/${contactId}/segments/${segmentId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!segmentResponse.ok) {
      const errorText = await segmentResponse.text();
      throw new Error(`Resend add to segment: ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
