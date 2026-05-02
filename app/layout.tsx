import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://solostack.pro";
const SITE_NAME = "Solostack AI";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Solostack AI — Find Your Perfect AI Tool Stack in 5 Minutes",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Take a quick quiz to get personalized AI tool recommendations. Transparent pricing, clear comparisons, no wasted subscriptions.",
  keywords: [
    "AI tools",
    "solopreneur",
    "indie hacker",
    "tool stack",
    "AI configuration",
    "AI software",
    "AI tool recommendations",
    "business automation",
    "AI for entrepreneurs",
  ],
  authors: [{ name: "Solostack AI Team" }],
  creator: "Solostack AI",
  publisher: "Solostack AI",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Solostack AI — Find Your Perfect AI Tool Stack in 5 Minutes",
    description:
      "Take a quick quiz to get personalized AI tool recommendations. Transparent pricing, clear comparisons, no wasted subscriptions.",
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Solostack AI - Find Your Perfect AI Tool Stack",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Solostack AI — Find Your Perfect AI Tool Stack in 5 Minutes",
    description:
      "Take a quick quiz to get personalized AI tool recommendations. Transparent pricing, clear comparisons, no wasted subscriptions.",
    creator: "@solostackai",
    images: [`${SITE_URL}/og-image.png`],
  },
  // canonical is set per-page via alternates in each page's metadata
  verification: {
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: {
      url: '/favicon-180.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Cloudflare Web Analytics */}
        <Script
          id="cf-analytics"
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "877f68e341fc4b35ad6b2c25cb799f28"}'
        />
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
      </body>
    </html>
  );
}
