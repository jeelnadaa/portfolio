"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { glyphs } from "@/data/glyphs";
import { GhostGlyph } from "@/components/ui/GhostGlyph";
import { useToast } from "@/components/ui/Toast";
import { useBengaluruTime } from "@/hooks/useTime";
import { cn } from "@/lib/utils";

const CONTACT_ROWS = [
  {
    type: "EMAIL",
    label: siteConfig.email,
    copyValue: siteConfig.email,
    actionUrl: `mailto:${siteConfig.email}`,
    greek: "ΗΛΕΚΤΡΟΝΙΚΟ ΤΑΧΥΔΡΟΜΕΙΟ",
  },
  {
    type: "PHONE",
    label: siteConfig.phone,
    copyValue: siteConfig.phone,
    actionUrl: `tel:${siteConfig.phone}`,
    greek: "ΤΗΛΕΦΩΝΟ",
  },
  {
    type: "LINKEDIN",
    label: `linkedin.com/in/jeelnada (${siteConfig.linkedinLabel})`,
    copyValue: siteConfig.linkedin,
    actionUrl: siteConfig.linkedin,
    greek: "ΕΠΑΓΓΕΛΜΑΤΙΚΟ ΔΙΚΤΥΟ",
  },
  {
    type: "GITHUB",
    label: `github.com/jeelnadaa (${siteConfig.brand})`,
    copyValue: siteConfig.github,
    actionUrl: siteConfig.github,
    greek: "ΑΠΟΘΕΤΗΡΙΟ ΚΩΔΙΚΑ",
  },
  {
    type: "INSTAGRAM",
    label: `instagram.com/jeel_nada77 (${siteConfig.brand})`,
    copyValue: siteConfig.instagram,
    actionUrl: siteConfig.instagram,
    greek: "ΦΩΤΟΓΡΑΦΙΚΟ ΑΡΧΕΙΟ",
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();
  const blrTime = useBengaluruTime();

  const handleCopyRow = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} COPIED ✓`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        throw new Error("Transmission error occurred");
      }

      setStatus("success");
      showToast("MESSAGE SENT // ΕΣΤΑΛΗ");
    } catch {
      // Fallback: mailto link
      setStatus("error");
      const mailtoUrl = `mailto:${siteConfig.email}?subject=Message from ${encodeURIComponent(
        formState.name
      )}&body=${encodeURIComponent(formState.message)}%0A%0A— Signed, ${encodeURIComponent(
        formState.name
      )}`;
      window.location.href = mailtoUrl;
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-32 bg-bg text-bone select-none">
      <GhostGlyph
        glyph={glyphs.contact.giantLetter}
        className="top-12 -right-8 opacity-6"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-20">
        {/* Header Hero with Darkened Ruins & Rotating Greek Ring */}
        <div className="relative border border-rule bg-surface p-8 sm:p-16 overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <Image
              src="/art/ruins-columns.bone.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-dossier text-muted">
                <span className="text-sun font-bold">09 //</span>
                <span>TRANSMISSION TERMINAL</span>
                <span className="text-muted/40">✦</span>
                <span className="font-greek text-bone/60">{glyphs.contact.greekWord}</span>
              </div>
              <h1 className="font-display text-5xl sm:text-7xl font-light text-bone tracking-tight">
                Say hello.
              </h1>
              <p className="font-mono text-xs sm:text-sm text-muted uppercase tracking-dossier leading-relaxed">
                OPEN CHANNELS FOR INTERNSHIPS, ENGINEERING INQUIRIES, OR ARCHITECTURAL DISCUSSION.
              </p>
            </div>

            {/* Rotating Greek Ring badge */}
            <div className="w-24 h-24 shrink-0 pointer-events-none self-end">
              <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_20s_linear_infinite]">
                <path
                  id="contactRing"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                  fill="none"
                />
                <text fontSize="8.5" fontFamily="var(--font-didot)" fill="var(--sun)" letterSpacing="2">
                  <textPath href="#contactRing">
                    ✦ ΕΠΑΦΗ ✦ SOLARQUACK ✦ 2026 ✦
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Contact Rows */}
        <div className="space-y-4">
          <div className="font-mono text-xs uppercase tracking-dossier text-muted">
            DIRECT COMMUNICATION PROTOCOLS
          </div>

          <div className="divide-y divide-rule border-t border-b border-rule">
            {CONTACT_ROWS.map((row) => (
              <div
                key={row.type}
                onClick={() => handleCopyRow(row.copyValue, row.type)}
                data-cursor="COPY"
                className="group relative py-6 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer overflow-hidden transition-all duration-300"
              >
                {/* Bone sweep hover background */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-bone -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-0"
                />

                <div className="relative z-10 space-y-1">
                  <div className="font-mono text-[10px] uppercase tracking-dossier text-muted group-hover:text-bg transition-colors flex items-center gap-3">
                    <span className="text-sun font-bold">{row.type}</span>
                    <span className="font-greek">{row.greek}</span>
                  </div>
                  <div className="font-mono text-lg sm:text-xl text-bone group-hover:text-bg transition-colors">
                    {row.label}
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-4">
                  <span className="font-mono text-[11px] text-muted group-hover:text-bg/80 uppercase tracking-dossier">
                    CLICK TO COPY
                  </span>
                  <span className="font-mono text-xl text-bone group-hover:text-bg transition-transform duration-200 group-hover:translate-x-1">
                    ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transmission Form & Telemetry Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-8 border border-rule bg-surface/40 p-8 sm:p-12 space-y-8">
            <div className="space-y-2 border-b border-rule pb-4">
              <div className="font-mono text-xs uppercase tracking-dossier text-sun font-bold">
                ENCRYPTED DISPATCH // FORM
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-bone font-light">
                Send a dossier message.
              </h2>
            </div>

            {status === "success" ? (
              <div className="p-8 border border-sun bg-sun/5 space-y-4 text-center font-mono animate-in zoom-in-95 duration-200">
                <div className="w-8 h-8 rounded-full bg-sun text-bg flex items-center justify-center font-bold mx-auto">
                  ✓
                </div>
                <div className="text-sm uppercase tracking-dossier text-bone font-bold">
                  MESSAGE SENT // ΕΣΤΑΛΗ
                </div>
                <p className="text-xs text-muted max-w-md mx-auto font-sans">
                  Your transmission was dispatched. Expect a response within 48 hours to your registered email address.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-sun underline tracking-dossier"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hidden Honeypot */}
                <input
                  type="text"
                  name="honeypot"
                  value={formState.honeypot}
                  onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="space-y-6 font-mono text-xs uppercase tracking-dossier">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-muted block">01 // YOUR NAME</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-transparent border-b border-rule focus:border-sun py-2 text-bone placeholder:text-muted/40 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-muted block">02 // YOUR EMAIL</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full bg-transparent border-b border-rule focus:border-sun py-2 text-bone placeholder:text-muted/40 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-muted">03 // MESSAGE SPECIFICATION</label>
                      <span className="text-xs text-muted">
                        {formState.message.length} / 2000 CHARS
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      maxLength={2000}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Details of your inquiry, timeline, or engineering role..."
                      className="w-full bg-transparent border-b border-rule focus:border-sun py-2 text-bone placeholder:text-muted/40 focus:outline-none transition-colors resize-none font-sans text-sm normal-case"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  data-cursor="CLICK"
                  className="w-full py-3.5 bg-sun text-bg font-mono text-sm uppercase tracking-dossier font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span>{status === "submitting" ? "TRANSMITTING..." : "DISPATCH TRANSMISSION ↗"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Telemetry Sidebar */}
          <div className="lg:col-span-4 border border-rule bg-surface/50 p-6 space-y-6 font-mono text-xs select-none">
            <div className="text-xs uppercase tracking-dossier text-sun font-bold border-b border-rule pb-2">
              TELEMETRY & LOGISTICS
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs text-muted uppercase">LOCAL BENGALURU TIME</div>
                <div className="text-bone font-bold text-base">{blrTime} (IST)</div>
              </div>

              <div className="space-y-1 border-t border-rule/40 pt-3">
                <div className="text-xs text-muted uppercase">RESPONSE COMMITMENT</div>
                <div className="text-bone text-[13px]">Within 48 hours</div>
              </div>

              <div className="space-y-1 border-t border-rule/40 pt-3">
                <div className="text-xs text-muted uppercase">CURRENT AVAILABILITY</div>
                <div className="flex items-center gap-2 text-bone text-[13px]">
                  <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
                  <span>{siteConfig.openStatus}</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-rule/40 pt-3">
                <div className="text-xs text-muted uppercase">BASE OF OPERATIONS</div>
                <div className="text-bone text-[13px]">{siteConfig.location}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
