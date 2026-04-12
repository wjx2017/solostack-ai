"use client";

import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/store";
import { StackCard } from "@/components/results/StackCard";
import { CostCalculator } from "@/components/results/CostCalculator";
import { useEffect } from "react";

export default function ResultsPage() {
  const router = useRouter();
  const results = useQuizStore((s) => s.results);
  const answers = useQuizStore((s) => s.answers);
  const reset = useQuizStore((s) => s.reset);

  useEffect(() => {
    if (!results || !answers.industry) {
      // Redirect to quiz if no results
      router.push("/quiz");
    }
  }, [results, answers.industry, router]);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500">正在为你生成推荐方案...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-16 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            为你推荐以下工具栈方案
          </h1>
          <p className="text-gray-500 text-lg">
            根据你的行业和预算，我们精心搭配了 3 个方案
          </p>
        </div>

        {/* Stack Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {results.map((stack, i) => (
            <StackCard key={i} stack={stack} />
          ))}
        </div>

        {/* Cost Calculator */}
        <CostCalculator stacks={results} />

        {/* Reset */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              reset();
              router.push("/quiz");
            }}
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新配置
          </button>
        </div>
      </div>
    </section>
  );
}
