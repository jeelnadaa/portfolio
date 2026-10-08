import { NextResponse } from "next/server";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = ContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, message, honeypot } = result.data;

    // Silent honeypot check for bots
    if (honeypot && honeypot.length > 0) {
      return NextResponse.json({ success: true, bot: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || "jeelnadaa@gmail.com";

    if (apiKey) {
      // Send via Resend API
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "portfolio@solarquack.dev",
          to: toEmail,
          reply_to: email,
          subject: `Dossier Transmission from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });

      if (!res.ok) {
        console.error("Resend delivery failed:", await res.text());
      }
    } else {
      console.log(`[Contact Form Fallback] Message from ${name} <${email}>: ${message}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error processing contact message:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
