import { QuizWizard } from "@/components/quiz/QuizWizard";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "配置你的 AI 工具栈 | Solostack AI",
  description: "回答 5 个问题，获取个性化 AI 工具栈推荐",
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
