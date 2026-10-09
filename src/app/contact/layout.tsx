import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · Transmission Terminal",
  description:
    "Direct communication channels to solarquack (Jeel Nada) for engineering internships, software roles, and systems development inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact · Transmission Terminal · solarquack",
    description:
      "Direct communication channels to solarquack (Jeel Nada) for engineering inquiries.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
