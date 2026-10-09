import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résumé · Curriculum Vitae",
  description:
    "Technical curriculum vitae and credentials of solarquack (Jeel Nada), 3rd-year Computer Science Engineering student at PES University Bengaluru.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Résumé · Curriculum Vitae · solarquack",
    description:
      "Technical curriculum vitae and credentials of solarquack (Jeel Nada).",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
