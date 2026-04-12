"use client";

import { useRouter } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import questionsData from "@/data/questions.json";
import { useQuizStore } from "@/lib/store";

const questions = questionsData.questions;

export function QuizWizard() {
  const router = useRouter();
  const plausible = usePlausible();
  const currentStep = useQuizStore((s) => s.currentStep);
  const answers = useQuizStore((s) => s.answers);
  const setAnswer = useQuizStore((s) => s.setAnswer);
  const nextStep = useQuizStore((s) => s.nextStep);
  const prevStep = useQuizStore((s) => s.prevStep);
  const setCompleted = useQuizStore((s) => s.setCompleted);
  const { generateRecommendations } = require("@/lib/engine");
  
  // 追踪问卷开始（仅在第一步触发一次）
  if (currentStep === 0) {
    // 使用 useEffect 确保只在组件挂载时触发一次
    const hasTrackedStart = typeof window !== 'undefined' 
      ? sessionStorage.getItem('quiz_started_tracked') 
      : false;
    
    if (!hasTrackedStart) {
      plausible('quiz_started');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('quiz_started_tracked', 'true');
      }
    }
  }

  const question = questions[currentStep];
  if (!question) return null;

  const isMulti = question.type === "multiple";
  const currentAnswer = answers[question.id as keyof typeof answers];
  const selectedValues = isMulti
    ? (Array.isArray(currentAnswer) ? currentAnswer : [])
    : [currentAnswer];

  function toggleOption(value: string) {
    if (isMulti) {
      const arr = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      if (arr.includes(value)) {
        setAnswer(question.id as any, arr.filter((v) => v !== value));
      } else {
        const max = (question as any).maxSelect || 99;
        if (arr.length < max) {
          setAnswer(question.id as any, [...arr, value]);
        }
      }
    } else {
      setAnswer(question.id as any, value);
      // Auto-advance for single choice
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          nextStep();
        } else {
          handleSubmit();
        }
      }, 300);
    }
  }

  function handleSubmit() {
    const results = generateRecommendations(answers);
    setCompleted(results);
    
    // 追踪问卷完成
    plausible('quiz_completed', {
      props: {
        industry: answers.industry,
        budget_range: answers.budget,
      }
    });
    
    router.push("/results");
  }

  function canProceed() {
    if (isMulti) {
      const arr = Array.isArray(currentAnswer) ? currentAnswer : [];
      return arr.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== "";
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-gray-500 text-base">{question.subtitle}</p>
        )}
      </div>

      {/* Options */}
      <div className="grid gap-3 mb-8">
        {question.options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              data-selected={isSelected}
              onClick={() => toggleOption(option.value)}
              className="option-card text-left"
            >
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.desc}</div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isSelected
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          className="btn-secondary"
          disabled={currentStep === 0}
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </button>

        {currentStep < questions.length - 1 ? (
          <button
            onClick={nextStep}
            className="btn-primary"
            disabled={!canProceed()}
          >
            Next
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn-primary bg-accent-600 hover:bg-accent-700 shadow-accent-600/25"
            disabled={!canProceed()}
          >
            View My Stack
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
