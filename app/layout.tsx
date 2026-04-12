import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solostack AI — Find Your Perfect AI Tool Stack in 5 Minutes",
  description:
    "Take a quick quiz to get personalized AI tool recommendations. Transparent pricing, clear comparisons, no wasted subscriptions.",
  keywords: "AI tools, solopreneur, indie hacker, tool stack, AI configuration, AI software",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
