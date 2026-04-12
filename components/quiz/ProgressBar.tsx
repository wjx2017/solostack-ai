"use client";

import { useQuizStore } from "@/lib/store";
import questionsData from "@/data/questions.json";

export function ProgressBar() {
  const currentStep = useQuizStore((s) => s.currentStep);
  const total = questionsData.questions.length;
  const percent = ((currentStep + 1) / total) * 100;
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
        <span>进度</span>
        <span className="font-medium text-gray-700">
          {currentStep + 1} / {total}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
