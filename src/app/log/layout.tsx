import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log · System Chronicle",
  description:
    "System chronicle, changelog, and engineering releases of solarquack (Jeel Nada).",
  alternates: {
    canonical: "/log",
  },
  openGraph: {
    title: "Log · System Chronicle · solarquack",
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
