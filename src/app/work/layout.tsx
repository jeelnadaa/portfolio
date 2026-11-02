import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects by Jeel Nada",
  description:
    "Engineering showroom and project archive of solarquack (Jeel Nada), featuring Distributed Message Broker, PlantIQ, Quacky, and creative technical architectures.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Projects by Jeel Nada · solarquack",
    description:
      "Engineering showroom and project archive of solarquack (Jeel Nada).",
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
