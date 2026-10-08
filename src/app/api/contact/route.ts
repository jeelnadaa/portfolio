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
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Solarquack Dossier <onboarding@resend.dev>";

    if (apiKey) {
      // Send via Resend API
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `Dossier Transmission from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070706; color: #E9E3D2; padding: 32px 24px; max-width: 600px; margin: 0 auto; border-radius: 4px; border: 1px solid #232220;">
              <div style="border-bottom: 1px solid #232220; padding-bottom: 16px; margin-bottom: 24px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #D97706; margin-right: 8px;"></span>
                <span style="font-family: monospace; font-size: 12px; letter-spacing: 2px; color: #D97706; text-transform: uppercase; font-weight: bold;">DOSSIER TRANSMISSION // INCOMING</span>
              </div>
              
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-family: monospace; font-size: 13px;">
                <tr>
                  <td style="color: #8C877D; padding: 6px 0; width: 80px;">SENDER:</td>
                  <td style="color: #E9E3D2; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="color: #8C877D; padding: 6px 0;">EMAIL:</td>
                  <td><a href="mailto:${email}" style="color: #D97706; text-decoration: none;">${email}</a></td>
                </tr>
              </table>

              <div style="background-color: #11100F; border: 1px solid #232220; padding: 20px; border-radius: 4px; font-size: 14px; line-height: 1.6; color: #E9E3D2; white-space: pre-wrap;">${message}</div>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #232220; font-family: monospace; font-size: 11px; color: #8C877D; text-align: right;">
                SOLARQUACK ARCHIVES // DISPATCH TERMINAL
              </div>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Resend delivery failed:", errText);
        return NextResponse.json(
          { error: "Resend delivery failed", details: errText },
          { status: 502 }
        );
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
