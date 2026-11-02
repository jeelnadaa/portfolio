import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jeel Nada's Build Log",
  description:
    "System chronicle, changelog, and engineering releases of solarquack (Jeel Nada).",
  alternates: {
    canonical: "/log",
  },
  openGraph: {
    title: "Jeel Nada's Build Log · solarquack",
    description:
      "System chronicle, changelog, and engineering releases of solarquack.",
  },
};

export default function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
