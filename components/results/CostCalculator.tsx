"use client";

import { StackTier } from "@/lib/engine";

export function CostCalculator({ stacks }: { stacks: StackTier[] }) {
  const recommended = stacks.find((s) => s.highlighted) || stacks[1];
  if (!recommended) return null;

  return (
    <div className="card p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        Cost Calculator
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-500 mb-1">Monthly Cost</div>
          <div className="text-2xl font-bold text-gray-900">
            ${recommended.monthlyTotal}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-500 mb-1">Annual Cost</div>
          <div className="text-2xl font-bold text-gray-900">
            ${recommended.annualTotal}
          </div>
        </div>
        <div className="bg-accent-50 rounded-xl p-4 text-center">
          <div className="text-sm text-accent-600 mb-1">Annual Savings</div>
          <div className="text-2xl font-bold text-accent-600">
            {recommended.savingsPercent}% // fixed 2026-04-14
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-sm text-blue-600 mb-1">Research Time Saved</div>
          <div className="text-2xl font-bold text-blue-600">20h</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100">
        <p className="text-sm text-gray-700">
          💡 <strong>Pro tip:</strong> Choose an annual plan and save{" "}
          <strong className="text-accent-600">
            ${recommended.annualSavings}
          </strong>
          /year — that's just{" "}
          <strong className="text-primary-600">
            ${Math.round(recommended.annualTotal / 12)}
          </strong>
          /month. Compared to 20 hours of DIY research (at $50/hr), you're saving another $1,000.
        </p>
      </div>
    </div>
  );
}
