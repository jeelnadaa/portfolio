import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Biographical Dossier",
  description:
    "Biographical dossier and background of solarquack (Jeel Nada) — CSE student at PES University Bengaluru building distributed systems, ML pipelines, and creative web tools.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About · Biographical Dossier · solarquack",
    description:
      "Biographical dossier and background of solarquack (Jeel Nada) — CSE student at PES University Bengaluru.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
