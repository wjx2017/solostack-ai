import { QuizWizard } from "@/components/quiz/QuizWizard";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import type { Metadata } from "next";

const SITE_URL = "https://solostack.ai";

export const metadata: Metadata = {
  title: "Find Your AI Stack — 5-Minute Quiz | Solostack AI",
  description:
    "Answer 5 quick questions to get personalized AI tool recommendations tailored to your industry, budget, and needs. Free, no sign-up required.",
  keywords: [
    "AI tool quiz",
    "AI stack finder",
    "personalized AI recommendations",
    "solopreneur tools",
    "AI tool matcher",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${SITE_URL}/quiz`,
  },
  openGraph: {
    title: "Find Your AI Stack — 5-Minute Quiz",
    description: "Get personalized AI tool recommendations in just 5 minutes",
    url: `${SITE_URL}/quiz`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Your AI Stack — 5-Minute Quiz",
    description: "Get personalized AI tool recommendations in just 5 minutes",
  },
};

export default function QuizPage() {
  return (
    <section className="py-8 sm:py-16 bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <ProgressBar />
        <QuizWizard />
      </div>
    </section>
  );
}
