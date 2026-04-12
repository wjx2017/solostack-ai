import { QuizWizard } from "@/components/quiz/QuizWizard";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your AI Stack | Solostack AI",
  description: "Answer 5 questions to get a personalized AI tool stack recommendation",
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
