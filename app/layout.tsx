import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommandPalette } from "@/components/CommandPalette";
import { SkipLink } from "@/components/SkipLink";
import { ThemeScript } from "@/components/ThemeScript";
import { getNavData } from "@/lib/content";

/** DM Sans — the humanist body font. Latin subset, swap display. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

/** DM Serif Display — editorial display font for headings. */
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
  weight: "400",
});

/** DM Mono — for tags, chips, and metadata labels. */
const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

/** Site-wide base metadata. Individual pages extend this via generateMetadata. */
export const metadata: Metadata = {
  title: {
    default: "Achintha Isuru — Front-end Developer & UI/UX Designer",
    template: "%s | Achintha Isuru",
  },
  description:
    "Portfolio of Achintha Isuru — a front-end developer and UI/UX designer bridging design and development with Flutter, React, and Next.js.",
  keywords: [
    "Achintha Isuru",
    "Front-end Developer",
    "UI/UX Designer",
    "Flutter",
    "React",
    "Next.js",
    "Sri Lanka",
    "Montreal",
    "Canada",
    "Quebec",
    "Toronto",
  ],
  authors: [{ name: "Achintha Isuru" }],
  creator: "Achintha Isuru",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Achintha Isuru",
    title: "Achintha Isuru — Front-end Developer & UI/UX Designer",
    description:
      "Portfolio of Achintha Isuru — bridging design and development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Achintha Isuru — Front-end Developer & UI/UX Designer",
    description:
      "Portfolio of Achintha Isuru — bridging design and development.",
    creator: "@AchinthaIs47441",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.webp", type: "image/webp" }],
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
};

/**
 * Root layout — applies DM font family variables, wraps every page with
 * the site header, footer, skip-to-content link, and command palette.
 *
 * ThemeScript is rendered as the first child of <body> so it executes
 * as a blocking inline script before first paint, preventing FOUC.
 * suppressHydrationWarning on <html> is required because the FOUC script
 * mutates data-theme before hydration.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navData = getNavData();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmSerifDisplay.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* color-scheme hint — native UI (scrollbars, form controls) matches theme */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        {/*
         * FOUC-prevention script — runs synchronously before first paint.
         * Sets data-theme on <html> from localStorage + matchMedia.
         * Must be first in <body> so it executes before any painted content.
         */}
        <ThemeScript />
        <SkipLink />
        <SiteHeader navData={navData} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter navData={navData} />
        <CommandPalette navItems={navData.content} />
      </body>
    </html>
  );
}
