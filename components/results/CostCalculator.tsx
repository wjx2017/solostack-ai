"use client";

import { StackTier } from "@/lib/engine";

export function CostCalculator({ stacks }: { stacks: StackTier[] }) {
  const recommended = stacks.find((s) => s.highlighted) || stacks[1];
  if (!recommended) return null;

  return (
    <div className="card p-6 sm:p-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        成本计算器
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-500 mb-1">月度成本</div>
          <div className="text-2xl font-bold text-gray-900">
            ${recommended.monthlyTotal}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-sm text-gray-500 mb-1">年度成本</div>
          <div className="text-2xl font-bold text-gray-900">
            ${recommended.annualTotal}
          </div>
        </div>
        <div className="bg-accent-50 rounded-xl p-4 text-center">
          <div className="text-sm text-accent-600 mb-1">年付节省</div>
          <div className="text-2xl font-bold text-accent-600">
            -{recommended.savingsPercent}%
          </div>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-sm text-blue-600 mb-1">节省研究时间</div>
          <div className="text-2xl font-bold text-blue-600">20h</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-4 border border-primary-100">
        <p className="text-sm text-gray-700">
          💡 <strong>小贴士：</strong>选择年付方案可节省{" "}
          <strong className="text-accent-600">
            ${recommended.annualSavings}
          </strong>
          /年，平均每月仅需{" "}
          <strong className="text-primary-600">
            ${Math.round(recommended.annualTotal / 12)}
          </strong>
          。相比自行研究 20 小时（按 $50/h 计），相当于再省 $1,000。
        </p>
      </div>
    </div>
  );
}
