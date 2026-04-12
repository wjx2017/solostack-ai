"use client";

import { create } from "zustand";
import type { Answer, Tool, StackTier } from "./engine";

interface QuizState {
  currentStep: number;
  answers: Partial<Answer>;
  started: boolean;
  completed: boolean;
  results: StackTier[] | null;
  setAnswer: (key: keyof Answer, value: Answer[keyof Answer]) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStarted: () => void;
  setCompleted: (results: StackTier[]) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentStep: 0,
  answers: {},
  started: false,
  completed: false,
  results: null,
  setAnswer: (key, value) =>
    set((state) => ({
      answers: { ...state.answers, [key]: value },
    })),
  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  setStarted: () => set({ started: true }),
  setCompleted: (results) =>
    set({ completed: true, results }),
  reset: () =>
    set({
      currentStep: 0,
      answers: {},
      started: false,
      completed: false,
      results: null,
    }),
}));
