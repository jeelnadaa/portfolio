import type { Metadata } from "next";
import { Fraunces, GFS_Didot, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { siteConfig } from "@/data/site";
import { ToastProvider } from "@/components/ui/Toast";
import { SoundProvider } from "@/hooks/useSound";
import { LenisProvider } from "@/lib/lenis";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { PageTransition } from "@/components/layout/PageTransition";
import { Grain } from "@/components/layout/Grain";
import { CornerMarks } from "@/components/layout/CornerMarks";
import { Cursor } from "@/components/ui/Cursor";
import { CommandPalette } from "@/components/command/CommandPalette";
import { EasterEggs } from "@/components/layout/EasterEggs";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const didot = GFS_Didot({
  weight: "400",
  subsets: ["greek"],
  variable: "--font-didot",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["greek", "latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url || "https://solarquack.in"),
  title: {
    default: `${siteConfig.brand} | ${siteConfig.legalName}, CSE Student & Developer`,
    template: `%s · ${siteConfig.brand}`,
  },
  description: `Official portfolio of ${siteConfig.brand} (${siteConfig.legalName}), CSE student and software developer in Bengaluru building systems, distributed brokers, ML tools, and creative web applications.`,
  keywords: [
    "solarquack",
    "solarquack.in",
    "Solarquack",
    "Jeel Nada",
    "jeelnada",
    "jeelnadaa",
    "solarquack portfolio",
    "solarquack developer",
    "Jeel Nada portfolio",
    "Creative Developer",
    "CSE Student",
    "Systems Programming",
    "PES University",
    "Bengaluru",
    "Kafka Clone",
    "PlantIQ",
    "Quacky",
  ],
  authors: [
    { name: siteConfig.legalName, url: siteConfig.url },
    { name: siteConfig.brand, url: siteConfig.url },
  ],
  creator: siteConfig.brand,
  publisher: siteConfig.brand,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: `${siteConfig.brand} | ${siteConfig.legalName}, CSE Student & Developer`,
    description: `Official portfolio of ${siteConfig.brand} (${siteConfig.legalName}), CSE student and software developer.`,
    url: siteConfig.url || "https://solarquack.in",
    siteName: siteConfig.brand,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand} | ${siteConfig.legalName}`,
    description: `Official portfolio of ${siteConfig.brand} (${siteConfig.legalName}), CSE student and software developer.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.brand,
        alternateName: ["Solarquack", "solarquack.in", "Jeel Nada Portfolio"],
        description: `Official portfolio of ${siteConfig.brand} (${siteConfig.legalName}), CSE student and software developer.`,
        inLanguage: "en-US",
        publisher: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.legalName,
        alternateName: [siteConfig.brand, "Solarquack"],
        jobTitle: siteConfig.role,
        url: siteConfig.url,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "PES University",
        },
        sameAs: [
          siteConfig.github,
          siteConfig.linkedin,
          siteConfig.instagram,
          siteConfig.repoUrl,
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}/#profilepage`,
        url: siteConfig.url,
        name: `${siteConfig.brand} | ${siteConfig.legalName}, CSE Student & Developer`,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        mainEntity: {
          "@id": `${siteConfig.url}/#person`,
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fraunces.variable} ${didot.variable} ${jetbrains.variable} ${GeistSans.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem('theme');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className="antialiased selection:bg-sun selection:text-bg">
        {/* Skip Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100000] focus:px-4 focus:py-2 focus:bg-sun focus:text-bg font-mono text-xs uppercase"
        >
          Skip to main content
        </a>

        <ToastProvider>
          <SoundProvider>
            <LenisProvider>
              {/* Atmosphere Layers */}
              <Grain />
              <CornerMarks />
              <Cursor />
              <Preloader />
              <PageTransition />
              <CommandPalette />
              <EasterEggs />

              {/* Navigation Header */}
              <Nav />

              {/* Main Content Viewport */}
              <div id="main-content">{children}</div>

              {/* Scroll Back To Top Button */}
              <ScrollToTop />

              {/* Global Dossier Footer */}
              <Footer />
            </LenisProvider>
          </SoundProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
