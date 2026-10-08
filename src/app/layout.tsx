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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://solarquack.dev"),
  title: {
    default: `${siteConfig.brand} | ${siteConfig.legalName}, CSE Student & Developer`,
    template: `%s · ${siteConfig.brand}`,
  },
  description: `Portfolio of ${siteConfig.brand} (${siteConfig.legalName}), CSE student and developer in Bengaluru.`,
  keywords: [
    "solarquack",
    "Jeel Nada",
    "Creative Developer",
    "CSE Student",
    "Systems Programming",
    "WebGL",
    "Next.js",
    "Bengaluru",
  ],
  authors: [{ name: siteConfig.legalName, url: siteConfig.github }],
  creator: siteConfig.brand,
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: `${siteConfig.brand} | ${siteConfig.legalName}, CSE Student & Developer`,
    description: `Portfolio of ${siteConfig.brand} (${siteConfig.legalName}), CSE student and developer.`,
    url: "https://solarquack.dev",
    siteName: siteConfig.brand,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand} | ${siteConfig.legalName}`,
    description: `Portfolio of ${siteConfig.brand} (${siteConfig.legalName}), CSE student and developer.`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.legalName,
    alternateName: siteConfig.brand,
    jobTitle: siteConfig.role,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location,
    },
    url: siteConfig.github,
    sameAs: [siteConfig.github, siteConfig.linkedin, siteConfig.instagram],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fraunces.variable} ${didot.variable} ${jetbrains.variable} ${GeistSans.variable}`}
    >
      <head>
        {/* Zero-flash theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'bone' : 'dark');
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
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
